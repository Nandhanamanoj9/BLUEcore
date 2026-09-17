import express from 'express';
import { isFirebaseMockMode } from '../config/firebase.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BLU CORE API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    storageMode: isFirebaseMockMode() ? 'local-fallback' : 'firebase-cloud'
  });
});

export default router;
