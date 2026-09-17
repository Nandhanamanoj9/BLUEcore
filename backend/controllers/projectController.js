import { normalizeProjectData } from '../models/projectModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getProjects(req, res, next) {
  try {
    const { category, featured } = req.query;

    const filters = {};
    if (!req.admin) {
      filters.active = true;
    }
    if (category) {
      filters.category = category;
    }
    if (featured !== undefined) {
      filters.featured = featured === 'true';
    }

    const result = await queryDocuments('projects', {
      filters,
      orderBy: 'order',
      orderDirection: 'asc'
    });

    return sendSuccess(res, {
      message: 'Projects retrieved successfully.',
      data: result.items
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    const project = await getDocument('projects', id);

    if (!project) {
      return sendError(res, { message: 'Project not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Project retrieved successfully.',
      data: project
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const payload = normalizeProjectData(req.body);
    if (!payload.title) {
      return sendError(res, { message: 'Project title is required.', statusCode: 400 });
    }

    const created = await addDocument('projects', payload);
    return sendSuccess(res, {
      message: 'Project created successfully.',
      data: created,
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const updates = normalizeProjectData(req.body);

    const updated = await updateDocument('projects', id, updates);
    if (!updated) {
      return sendError(res, { message: 'Project not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Project updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('projects', id);

    if (!deleted) {
      return sendError(res, { message: 'Project not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
