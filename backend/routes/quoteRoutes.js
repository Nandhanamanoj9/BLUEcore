import express from 'express';
import {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote
} from '../controllers/quoteController.js';
import { handleFlexibleUpload } from '../middleware/uploadMiddleware.js';
import { validateQuoteMiddleware } from '../middleware/validationMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { quoteLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

const uploadQuoteFile = handleFlexibleUpload(['ffile', 'referenceFile', 'file']);

// Public quote submission routes (support both /quotes and /quote)
router.post('/quotes', quoteLimiter, uploadQuoteFile, validateQuoteMiddleware, createQuote);
router.post('/quote', quoteLimiter, uploadQuoteFile, validateQuoteMiddleware, createQuote);

// Protected Admin quote routes
router.get('/admin/quotes', requireAdmin, getAllQuotes);
router.get('/admin/quotes/:id', requireAdmin, getQuoteById);
router.patch('/admin/quotes/:id', requireAdmin, updateQuoteStatus);
router.delete('/admin/quotes/:id', requireAdmin, deleteQuote);

// Direct aliases
router.get('/quotes', requireAdmin, getAllQuotes);
router.get('/quotes/:id', requireAdmin, getQuoteById);
router.patch('/quotes/:id', requireAdmin, updateQuoteStatus);
router.delete('/quotes/:id', requireAdmin, deleteQuote);

export default router;
