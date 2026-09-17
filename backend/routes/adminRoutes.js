import express from 'express';
import { login, getDashboardStats } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/admin/login', loginLimiter, login);
router.get('/admin/dashboard', requireAdmin, getDashboardStats);

export default router;
