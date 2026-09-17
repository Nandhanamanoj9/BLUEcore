import { normalizeQuoteData } from '../models/quoteModel.js';
import { addDocument, getDocument, updateDocument, deleteDocument, queryDocuments } from '../services/firestoreService.js';
import { uploadFileToStorage } from '../services/storageService.js';
import { sendQuoteNotification } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ALLOWED_QUOTE_STATUSES } from '../utils/constants.js';

/**
 * Public: Submit a quote request (supports multipart/form-data or JSON)
 */
export async function createQuote(req, res, next) {
  try {
    const quotePayload = normalizeQuoteData(req.body);

    // Save initial document to acquire generated ID
    const createdQuote = await addDocument('quotes', quotePayload);

    // Handle file upload if present
    if (req.file) {
      try {
        const fileMetadata = await uploadFileToStorage(req.file, 'quotes', createdQuote.id);
        if (fileMetadata) {
          await updateDocument('quotes', createdQuote.id, { referenceFile: fileMetadata });
          createdQuote.referenceFile = fileMetadata;
        }
      } catch (uploadError) {
        console.error('[Storage Error] Failed to upload reference file:', uploadError.message);
        // Do not fail the whole quote submission if file upload fails
      }
    }

    // Trigger async email notification (gracefully handles failure)
    sendQuoteNotification(createdQuote).catch((err) => {
      console.error('[Quote Notification Error]', err.message);
    });

    return sendSuccess(res, {
      message: 'Thank you — your request has been received. Our team will reach out shortly.',
      data: {
        id: createdQuote.id,
        fullName: createdQuote.fullName,
        serviceRequired: createdQuote.serviceRequired,
        createdAt: createdQuote.createdAt,
        referenceFile: createdQuote.referenceFile || null
      },
      statusCode: 201
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: List quotes with pagination, status filter, and search
 */
export async function getAllQuotes(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filters = {};
    if (status && ALLOWED_QUOTE_STATUSES.includes(status)) {
      filters.status = status;
    }

    const result = await queryDocuments('quotes', {
      filters,
      search,
      searchFields: ['fullName', 'email', 'phone', 'serviceRequired', 'location', 'material'],
      orderBy: 'createdAt',
      orderDirection: 'desc',
      page: Number(page),
      limit: Number(limit)
    });

    return sendSuccess(res, {
      message: 'Quotes retrieved successfully.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Get single quote details
 */
export async function getQuoteById(req, res, next) {
  try {
    const { id } = req.params;
    const quote = await getDocument('quotes', id);

    if (!quote) {
      return sendError(res, { message: 'Quote not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Quote retrieved successfully.',
      data: quote
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Update quote status
 */
export async function updateQuoteStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ALLOWED_QUOTE_STATUSES.includes(status)) {
      return sendError(res, {
        message: `Invalid status. Allowed values: ${ALLOWED_QUOTE_STATUSES.join(', ')}`,
        statusCode: 400
      });
    }

    const updated = await updateDocument('quotes', id, { status });
    if (!updated) {
      return sendError(res, { message: 'Quote not found.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Quote status updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin: Delete quote
 */
export async function deleteQuote(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await deleteDocument('quotes', id);

    if (!deleted) {
      return sendError(res, { message: 'Quote not found or already removed.', statusCode: 404 });
    }

    return sendSuccess(res, {
      message: 'Quote deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export default {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote
};
