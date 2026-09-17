import { CONTACT_STATUSES, ALLOWED_CONTACT_STATUSES } from '../utils/constants.js';

export function normalizeContactData(raw = {}) {
  const name = (raw.name || raw.fullName || '').trim();
  const email = (raw.email || '').trim().toLowerCase();
  const phone = (raw.phone || '').trim();
  const message = (raw.message || '').trim();

  let status = raw.status || CONTACT_STATUSES.UNREAD;
  if (!ALLOWED_CONTACT_STATUSES.includes(status)) {
    status = CONTACT_STATUSES.UNREAD;
  }

  return {
    name,
    email,
    phone,
    message,
    status
  };
}

export default {
  normalizeContactData
};
