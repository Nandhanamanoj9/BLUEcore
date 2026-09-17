import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/contactController.js';
import { validateContactMiddleware } from '../middleware/validationMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { contactLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Public contact submission
router.post('/contact', contactLimiter, validateContactMiddleware, submitContact);
router.post('/contacts', contactLimiter, validateContactMiddleware, submitContact);

// Protected Admin contact routes
router.get('/admin/contacts', requireAdmin, getAllContacts);
router.get('/admin/contacts/:id', requireAdmin, getContactById);
router.patch('/admin/contacts/:id', requireAdmin, updateContactStatus);
router.delete('/admin/contacts/:id', requireAdmin, deleteContact);

// Direct aliases
router.get('/contacts', requireAdmin, getAllContacts);
router.get('/contacts/:id', requireAdmin, getContactById);
router.patch('/contacts/:id', requireAdmin, updateContactStatus);
router.delete('/contacts/:id', requireAdmin, deleteContact);

export default router;
