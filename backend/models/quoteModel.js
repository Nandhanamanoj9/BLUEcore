import { QUOTE_STATUSES, ALLOWED_QUOTE_STATUSES } from '../utils/constants.js';

export function normalizeQuoteData(raw = {}) {
  const fullName = (raw.fullName || raw.fname || '').trim();
  const phone = (raw.phone || raw.fphone || '').trim();
  const email = (raw.email || raw.femail || '').trim().toLowerCase();
  const serviceRequired = (raw.serviceRequired || raw.fservice || raw.service || '').trim();
  const location = (raw.location || raw.flocation || '').trim();
  const material = (raw.material || raw.fmaterial || '').trim();
  const projectType = (raw.projectType || raw.fptype || '').trim();
  const approximateRequirements = (raw.approximateRequirements || raw.freq || '').trim();
  const message = (raw.message || raw.fmsg || '').trim();

  let status = raw.status || QUOTE_STATUSES.NEW;
  if (!ALLOWED_QUOTE_STATUSES.includes(status)) {
    status = QUOTE_STATUSES.NEW;
  }

  return {
    fullName,
    phone,
    email,
    location,
    serviceRequired,
    material,
    projectType,
    approximateRequirements,
    message,
    status
  };
}

export default {
  normalizeQuoteData
};
