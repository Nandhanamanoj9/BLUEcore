import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, {
      message: 'Access denied. No authentication token provided.',
      statusCode: 401
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'blucore_super_secret_jwt_key_change_in_production_2026';

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, {
        message: 'Authentication token has expired. Please log in again.',
        statusCode: 401
      });
    }
    return sendError(res, {
      message: 'Invalid authentication token.',
      statusCode: 401
    });
  }
}

export default {
  requireAdmin
};
