/**
 * Test data constants for BLU CORE E2E tests.
 *
 * Uses safe, non-real test data. No real customer data.
 * No real email addresses. No real production accounts.
 */

/**
 * Generate a timestamp-based test reference ID for unique test submissions.
 */
export function getTestRunId() {
  return Date.now().toString(36).toUpperCase();
}

/**
 * Valid quote form data for happy path testing.
 * Uses a generic test name/phone that does not correspond to a real person.
 */
export const VALID_QUOTE_DATA = {
  fname: 'Test User BLU',
  fphone: '+91 9000000001',
  femail: 'test@example.com',
  flocation: 'Kanhangad',
  fservice: 'Wall Panels & Hanging',
  fmaterial: 'MDF',
  fptype: 'Home / Residential',
  freq: '10 sq ft wall panel, 1 unit',
  fmsg: 'This is an automated E2E test submission. Please disregard.',
};

/**
 * Invalid data for validation failure tests.
 */
export const INVALID_QUOTE_DATA = {
  shortName: 'A',
  invalidPhone: 'not-a-phone',
  invalidEmail: 'not-an-email',
};

/**
 * Gallery filter categories (must match GALLERY_CATS in siteData.js).
 */
export const GALLERY_CATEGORIES = [
  'ALL',
  'WALL PANELS',
  'DOORS',
  'WOOD CARVING',
  'CEILING',
  '3D PANELS',
  'CUSTOM DESIGNS',
];

/**
 * Backend API base URL for direct API tests.
 */
export const API_BASE_URL = process.env.E2E_API_URL || 'http://127.0.0.1:5000';

/**
 * Admin credentials for API-level admin login tests.
 * These must match the mock admin seeded in backend/config/firebase.js (mock mode).
 * In a real Firebase environment, use environment variables.
 */
export const ADMIN_CREDENTIALS = {
  email: process.env.E2E_ADMIN_EMAIL || 'blucorenc@gmail.com',
  password: process.env.E2E_ADMIN_PASSWORD || 'Admin@123456',
  wrongPassword: 'WrongPassword999!',
  unknownEmail: 'nonexistent@example.com',
};

/**
 * Expected text content for key page elements.
 */
export const EXPECTED_CONTENT = {
  pageTitle: 'BLU CORE',
  heroH1: 'Discover your finest home interior',
  heroEyebrow: 'CNC Cutting & Wall Panels',
  navLinks: ['Home', 'About', 'Services', 'Gallery', 'Materials', 'Projects', 'Contact'],
  footerCopyright: 'BLU CORE',
};
