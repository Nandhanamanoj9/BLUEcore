import express from 'express';
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
} from '../controllers/branchController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/branches', getBranches);
router.get('/branches/:id', getBranchById);

router.post('/branches', requireAdmin, createBranch);
router.patch('/branches/:id', requireAdmin, updateBranch);
router.delete('/branches/:id', requireAdmin, deleteBranch);

export default router;
