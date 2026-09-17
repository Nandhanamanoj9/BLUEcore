import { validateQuoteInput, validateContactInput } from '../utils/validators.js';
import { sendError } from '../utils/response.js';

export function validateQuoteMiddleware(req, res, next) {
  const { isValid, errors } = validateQuoteInput(req.body);
  if (!isValid) {
    return sendError(res, {
      message: 'Validation failed. Please check the required fields.',
      errors,
      statusCode: 400
    });
  }
  next();
}

export function validateContactMiddleware(req, res, next) {
  const { isValid, errors } = validateContactInput(req.body);
  if (!isValid) {
    return sendError(res, {
      message: 'Validation failed. Please check the contact form fields.',
      errors,
      statusCode: 400
    });
  }
  next();
}

export default {
  validateQuoteMiddleware,
  validateContactMiddleware
};
