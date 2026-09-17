import bcrypt from 'bcryptjs';

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function normalizeAdminData(raw = {}) {
  return {
    email: (raw.email || '').trim().toLowerCase(),
    name: (raw.name || 'Admin').trim(),
    role: raw.role || 'admin',
    active: raw.active !== undefined ? Boolean(raw.active) : true
  };
}

export default {
  hashPassword,
  comparePassword,
  normalizeAdminData
};
