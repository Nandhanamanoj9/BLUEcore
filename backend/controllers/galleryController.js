import { normalizeGalleryData } from '../models/galleryModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { uploadFileToStorage } from '../services/storageService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getGalleryItems(req, res, next) {
  try {
    const { category, featured, limit = 50, page = 1 } = req.query;

    const filters = {};
    // Public queries only show active items unless authenticated admin
    if (!req.admin) {
      filters.active = true;
    }

    if (category && category !== 'ALL') {
      filters.category = category.toUpperCase();
    }

    if (featured !== undefined) {
      filters.featured = featured === 'true';
    }

    const result = await queryDocuments('gallery', {
      filters,
      orderBy: 'order',
      orderDirection: 'asc',
      page: Number(page),
      limit: Number(limit)
    });

    return sendSuccess(res, {
      message: 'Gallery items retrieved.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getGalleryItemById(req, res, next) {
  try {
    const { id } = req.params;
    const item = await getDocument('gallery', id);

    if (!item) {
      return sendError(res, { message: 'Gallery item not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Gallery item retrieved.',
      data: item
    });
  } catch (error) {
    next(error);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const galleryPayload = normalizeGalleryData(req.body);

    if (req.file) {
      const fileMetadata = await uploadFileToStorage(req.file, 'gallery');
      if (fileMetadata) {
        galleryPayload.imageUrl = fileMetadata.fileUrl;
        galleryPayload.storagePath = fileMetadata.storagePath;
      }
    }

    if (!galleryPayload.title) {
      return sendError(res, { message: 'Title is required for gallery items.', statusCode: 400 });
    }

    const created = await addDocument('gallery', galleryPayload);

    return sendSuccess(res, {
      message: 'Gallery item created successfully.',
      data: created,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const updates = normalizeGalleryData(req.body);

    if (req.file) {
      const fileMetadata = await uploadFileToStorage(req.file, 'gallery');
      if (fileMetadata) {
        updates.imageUrl = fileMetadata.fileUrl;
        updates.storagePath = fileMetadata.storagePath;
      }
    }

    const updated = await updateDocument('gallery', id, updates);
    if (!updated) {
      return sendError(res, { message: 'Gallery item not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Gallery item updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('gallery', id);

    if (!deleted) {
      return sendError(res, { message: 'Gallery item not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Gallery item deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
