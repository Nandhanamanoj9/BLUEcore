import { normalizeBranchData } from '../models/branchModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getBranches(req, res, next) {
  try {
    const filters = {};
    if (!req.admin) {
      filters.active = true;
    }

    const result = await queryDocuments('branches', {
      filters,
      orderBy: 'order',
      orderDirection: 'asc'
    });

    return sendSuccess(res, {
      message: 'Branches retrieved successfully.',
      data: result.items
    });
  } catch (error) {
    next(error);
  }
}

export async function getBranchById(req, res, next) {
  try {
    const { id } = req.params;
    const branch = await getDocument('branches', id);

    if (!branch) {
      return sendError(res, { message: 'Branch not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Branch retrieved successfully.',
      data: branch
    });
  } catch (error) {
    next(error);
  }
}

export async function createBranch(req, res, next) {
  try {
    const payload = normalizeBranchData(req.body);
    if (!payload.name) {
      return sendError(res, { message: 'Branch name is required.', statusCode: 400 });
    }

    const created = await addDocument('branches', payload);
    return sendSuccess(res, {
      message: 'Branch created successfully.',
      data: created,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBranch(req, res, next) {
  try {
    const { id } = req.params;
    const updates = normalizeBranchData(req.body);

    const updated = await updateDocument('branches', id, updates);
    if (!updated) {
      return sendError(res, { message: 'Branch not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Branch updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBranch(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('branches', id);

    if (!deleted) {
      return sendError(res, { message: 'Branch not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Branch deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch
};
