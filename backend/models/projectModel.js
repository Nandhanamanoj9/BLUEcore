export function normalizeProjectData(raw = {}) {
  return {
    title: (raw.title || raw.name || '').trim(),
    category: (raw.category || 'Residential').trim(),
    description: (raw.description || '').trim(),
    images: Array.isArray(raw.images) ? raw.images : (raw.imageUrl ? [raw.imageUrl] : []),
    featured: Boolean(raw.featured),
    order: Number(raw.order) || 0,
    active: raw.active !== undefined ? Boolean(raw.active) : true
  };
}

export default {
  normalizeProjectData
};
