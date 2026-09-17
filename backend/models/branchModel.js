export function normalizeBranchData(raw = {}) {
  return {
    name: (raw.name || '').trim(),
    addr: (raw.addr || raw.address || '').trim(),
    phone: (raw.phone || '').trim(),
    tel: (raw.tel || raw.phone || '').replace(/\s+/g, ''),
    active: raw.active !== undefined ? Boolean(raw.active) : true,
    order: Number(raw.order) || 0
  };
}

export default {
  normalizeBranchData
};
