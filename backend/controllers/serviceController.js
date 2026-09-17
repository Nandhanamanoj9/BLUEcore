import { normalizeServiceData } from '../models/serviceModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getServices(req, res, next) {
  try {
    const filters = {};
    if (!req.admin) {
      filters.active = true;
    }

    const result = await queryDocuments('services', {
      filters,
      orderBy: 'order',
      orderDirection: 'asc'
    });

    return sendSuccess(res, {
      message: 'Services retrieved successfully.',
      data: result.items
    });
  } catch (error) {
    next(error);
  }
}

export async function getServiceById(req, res, next) {
  try {
    const { id } = req.params;
    const service = await getDocument('services', id);

    if (!service) {
      return sendError(res, { message: 'Service not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Service retrieved successfully.',
      data: service
    });
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    const payload = normalizeServiceData(req.body);
    if (!payload.name) {
      return sendError(res, { message: 'Service name is required.', statusCode: 400 });
    }

    const created = await addDocument('services', payload);
    return sendSuccess(res, {
      message: 'Service created successfully.',
      data: created,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const updates = normalizeServiceData(req.body);

    const updated = await updateDocument('services', id, updates);
    if (!updated) {
      return sendError(res, { message: 'Service not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Service updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('services', id);

    if (!deleted) {
      return sendError(res, { message: 'Service not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
