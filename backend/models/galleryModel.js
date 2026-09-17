import { GALLERY_CATEGORIES } from '../utils/constants.js';

export function normalizeGalleryData(raw = {}) {
  const title = (raw.title || raw.label || '').trim();
  let category = (raw.category || raw.cat || 'CUSTOM DESIGNS').trim().toUpperCase();

  if (!GALLERY_CATEGORIES.includes(category)) {
    category = 'CUSTOM DESIGNS';
  }

  return {
    title,
    category,
    description: (raw.description || '').trim(),
    imageUrl: raw.imageUrl || raw.image || '',
    storagePath: raw.storagePath || '',
    featured: Boolean(raw.featured),
    order: Number(raw.order) || 0,
    active: raw.active !== undefined ? Boolean(raw.active) : true
  };
}

export default {
  normalizeGalleryData
};
