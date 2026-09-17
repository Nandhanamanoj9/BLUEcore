import express from 'express';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
} from '../controllers/materialController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/materials', getMaterials);
router.get('/materials/:id', getMaterialById);

router.post('/materials', requireAdmin, createMaterial);
router.patch('/materials/:id', requireAdmin, updateMaterial);
router.delete('/materials/:id', requireAdmin, deleteMaterial);

export default router;
