import jwt from 'jsonwebtoken';
import { comparePassword } from '../models/adminModel.js';
import { queryDocuments, addDocument } from '../services/firestoreService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { QUOTE_STATUSES } from '../utils/constants.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, {
        message: 'Email and password are required.',
        statusCode: 400
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query admin by email from admins collection
    const adminQueryResult = await queryDocuments('admins', {
      filters: { email: cleanEmail },
      limit: 1
    });

    let adminUser = adminQueryResult.items[0];

    // If no admin exists at all yet in the database, allow bootstrap with configured ADMIN_EMAIL & default password
    // or return error
    if (!adminUser) {
      return sendError(res, {
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    if (!adminUser.active) {
      return sendError(res, {
        message: 'Admin account is deactivated. Please contact support.',
        statusCode: 403
      });
    }

    const isMatch = await comparePassword(password, adminUser.passwordHash);
    if (!isMatch) {
      return sendError(res, {
        message: 'Invalid email or password.',
        statusCode: 401
      });
    }

    const secret = process.env.JWT_SECRET || 'blucore_super_secret_jwt_key_change_in_production_2026';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      {
        adminId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role || 'admin'
      },
      secret,
      { expiresIn }
    );

    return sendSuccess(res, {
      message: 'Login successful.',
      data: {
        token,
        admin: {
          id: adminUser.id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const quotesResult = await queryDocuments('quotes', { limit: 10000 });
    const contactsResult = await queryDocuments('contacts', { limit: 10000 });
    const galleryResult = await queryDocuments('gallery', { limit: 10000 });
    const projectsResult = await queryDocuments('projects', { limit: 10000 });
    const servicesResult = await queryDocuments('services', { limit: 10000 });
    const materialsResult = await queryDocuments('materials', { limit: 10000 });
    const branchesResult = await queryDocuments('branches', { limit: 10000 });

    const quotes = quotesResult.items;

    const stats = {
      totalQuotes: quotes.length,
      newQuotes: quotes.filter((q) => q.status === QUOTE_STATUSES.NEW).length,
      contactedQuotes: quotes.filter((q) => q.status === QUOTE_STATUSES.CONTACTED).length,
      inProgressQuotes: quotes.filter((q) => q.status === QUOTE_STATUSES.IN_PROGRESS).length,
      completedQuotes: quotes.filter((q) => q.status === QUOTE_STATUSES.COMPLETED).length,
      cancelledQuotes: quotes.filter((q) => q.status === QUOTE_STATUSES.CANCELLED).length,
      totalContacts: contactsResult.items.length,
      totalGalleryItems: galleryResult.items.length,
      totalProjects: projectsResult.items.length,
      totalServices: servicesResult.items.length,
      totalMaterials: materialsResult.items.length,
      totalBranches: branchesResult.items.length
    };

    return sendSuccess(res, {
      message: 'Dashboard statistics retrieved.',
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  getDashboardStats
};
