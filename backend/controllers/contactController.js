import { normalizeContactData } from '../models/contactModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ALLOWED_CONTACT_STATUSES } from '../utils/constants.js';

export async function submitContact(req, res, next) {
  try {
    const contactPayload = normalizeContactData(req.body);
    const created = await addDocument('contacts', contactPayload);

    return sendSuccess(res, {
      message: 'Thank you for reaching out. We will get in touch with you shortly.',
      data: { id: created.id, name: created.name, createdAt: created.createdAt },
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllContacts(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filters = {};
    if (status && ALLOWED_CONTACT_STATUSES.includes(status)) {
      filters.status = status;
    }

    const result = await queryDocuments('contacts', {
      filters,
      search,
      searchFields: ['name', 'email', 'phone', 'message'],
      orderBy: 'createdAt',
      orderDirection: 'desc',
      page: Number(page),
      limit: Number(limit)
    });

    return sendSuccess(res, {
      message: 'Contact submissions retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getContactById(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await getDocument('contacts', id);

    if (!contact) {
      return sendError(res, { message: 'Contact submission not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Contact submission retrieved successfully.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
}

export async function updateContactStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_CONTACT_STATUSES.includes(status)) {
      return sendError(res, {
        message: `Invalid status. Allowed values: ${ALLOWED_CONTACT_STATUSES.join(', ')}`,
        statusCode: 400
      });
    }

    const updated = await updateDocument('contacts', id, { status });
    if (!updated) {
      return sendError(res, { message: 'Contact submission not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Contact status updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('contacts', id);

    if (!deleted) {
      return sendError(res, { message: 'Contact submission not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Contact submission deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
};
