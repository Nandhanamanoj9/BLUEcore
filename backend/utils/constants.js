export const QUOTE_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const ALLOWED_QUOTE_STATUSES = Object.values(QUOTE_STATUSES);

export const CONTACT_STATUSES = {
  UNREAD: 'unread',
  READ: 'read',
  HANDLED: 'handled'
};

export const ALLOWED_CONTACT_STATUSES = Object.values(CONTACT_STATUSES);

export const GALLERY_CATEGORIES = [
  'ALL',
  'WALL PANELS',
  'DOORS',
  'WOOD CARVING',
  'CEILING',
  '3D PANELS',
  'DECORATIVE',
  'CUSTOM DESIGNS'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];
