export function normalizeMaterialData(raw = {}) {
  return {
    name: (raw.name || '').trim(),
    desc: (raw.desc || raw.description || '').trim(),
    active: raw.active !== undefined ? Boolean(raw.active) : true,
    order: Number(raw.order) || 0
  };
}

export default {
  normalizeMaterialData
};
