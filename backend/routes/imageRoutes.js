import express from 'express';
import {
  getAllSiteImages,
  uploadSiteImage,
  updateImageSlot,
  resetImageSlot,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  addBatchSectionGalleryPhotos,
  updateSectionGalleryItem,
  deleteSectionGalleryItem
} from '../controllers/imageController.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoint to retrieve all site images and dynamic gallery items
router.get('/images', getAllSiteImages);

// Protected Admin endpoints
router.post('/images/upload', requireAdmin, handleUpload('image'), uploadSiteImage);
router.put('/images/slots/:slotId', requireAdmin, updateImageSlot);
router.post('/images/slots/:slotId/reset', requireAdmin, resetImageSlot);
router.post('/images/gallery', requireAdmin, addGalleryItem);
router.put('/images/gallery/:itemId', requireAdmin, updateGalleryItem);
router.delete('/images/gallery/:itemId', requireAdmin, deleteGalleryItem);

// Section Galleries endpoints (materials_gallery, projects_gallery, main_gallery)
router.post('/images/galleries/:galleryKey/batch', requireAdmin, addBatchSectionGalleryPhotos);
router.put('/images/galleries/:galleryKey/:itemId', requireAdmin, updateSectionGalleryItem);
router.delete('/images/galleries/:galleryKey/:itemId', requireAdmin, deleteSectionGalleryItem);

export default router;

