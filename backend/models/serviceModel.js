export function normalizeServiceData(raw = {}) {
  return {
    num: (raw.num || '').trim(),
    name: (raw.name || '').trim(),
    desc: (raw.desc || raw.description || '').trim(),
    icon: (raw.icon || 'pattern').trim(),
    active: raw.active !== undefined ? Boolean(raw.active) : true,
    order: Number(raw.order) || 0
  };
}

export default {
  normalizeServiceData
};
