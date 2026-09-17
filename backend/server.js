import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// 1. Load environment variables
dotenv.config();

// 2. Initialize Firebase (Singleton config)
import './config/firebase.js';

// 3. Import Routes
import healthRoutes from './routes/healthRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

// 4. Import Middlewares
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 5. Configure Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 6. Configure CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map((url) => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    // In development or if origin is null (curl/Postman) or matches localhost/127.0.0.1
    if (
      !origin ||
      NODE_ENV === 'development' ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 7. Configure Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 8. Serve local uploads in development mode
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Apply general API rate limiter to all API routes
app.use('/api', apiLimiter);

// 9. Configure Routes under /api
app.use('/api', healthRoutes);
app.use('/api', quoteRoutes);
app.use('/api', contactRoutes);
app.use('/api', galleryRoutes);
app.use('/api', projectRoutes);
app.use('/api', serviceRoutes);
app.use('/api', materialRoutes);
app.use('/api', branchRoutes);
app.use('/api', adminRoutes);
app.use('/api', imageRoutes);

// Root route redirect/info
app.get('/', (req, res) => {
  res.json({
    name: 'BLU CORE API',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/health'
  });
});

// 10. Configure Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 11. Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('====================================');
  console.log('BLU CORE API');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log('====================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Server Error] Port ${PORT} is already in use by another process.`);
    console.error(`Run 'npx kill-port ${PORT}' or set a different PORT in backend/.env\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

export default app;
