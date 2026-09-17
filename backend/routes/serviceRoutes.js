import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/services', getServices);
router.get('/services/:id', getServiceById);

router.post('/services', requireAdmin, createService);
router.patch('/services/:id', requireAdmin, updateService);
router.delete('/services/:id', requireAdmin, deleteService);

export default router;
