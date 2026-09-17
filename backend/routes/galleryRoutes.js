import express from 'express';
import {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public read endpoints
router.get('/gallery', getGalleryItems);
router.get('/gallery/:id', getGalleryItemById);

// Protected admin endpoints
router.post('/gallery', requireAdmin, handleUpload('image'), createGalleryItem);
router.patch('/gallery/:id', requireAdmin, handleUpload('image'), updateGalleryItem);
router.delete('/gallery/:id', requireAdmin, deleteGalleryItem);

export default router;
