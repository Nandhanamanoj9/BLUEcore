import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);

router.post('/projects', requireAdmin, createProject);
router.patch('/projects/:id', requireAdmin, updateProject);
router.delete('/projects/:id', requireAdmin, deleteProject);

export default router;
