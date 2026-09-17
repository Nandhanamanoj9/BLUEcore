import { normalizeMaterialData } from '../models/materialModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getMaterials(req, res, next) {
  try {
    const filters = {};
    if (!req.admin) {
      filters.active = true;
    }

    const result = await queryDocuments('materials', {
      filters,
      orderBy: 'order',
      orderDirection: 'asc'
    });

    return sendSuccess(res, {
      message: 'Materials retrieved successfully.',
      data: result.items
    });
  } catch (error) {
    next(error);
  }
}

export async function getMaterialById(req, res, next) {
  try {
    const { id } = req.params;
    const material = await getDocument('materials', id);

    if (!material) {
      return sendError(res, { message: 'Material not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Material retrieved successfully.',
      data: material
    });
  } catch (error) {
    next(error);
  }
}

export async function createMaterial(req, res, next) {
  try {
    const payload = normalizeMaterialData(req.body);
    if (!payload.name) {
      return sendError(res, { message: 'Material name is required.', statusCode: 400 });
    }

    const created = await addDocument('materials', payload);
    return sendSuccess(res, {
      message: 'Material created successfully.',
      data: created,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMaterial(req, res, next) {
  try {
    const { id } = req.params;
    const updates = normalizeMaterialData(req.body);

    const updated = await updateDocument('materials', id, updates);
    if (!updated) {
      return sendError(res, { message: 'Material not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Material updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMaterial(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('materials', id);

    if (!deleted) {
      return sendError(res, { message: 'Material not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Material deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
};
