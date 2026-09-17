import dotenv from 'dotenv';
dotenv.config();

import '../config/firebase.js';
import { hashPassword, normalizeAdminData } from '../models/adminModel.js';
import { addDocument, queryDocuments } from '../services/firestoreService.js';

async function createAdmin() {
  const email = process.env.ADMIN_INIT_EMAIL || process.env.ADMIN_EMAIL || 'admin@blucoredesign.com';
  const password = process.env.ADMIN_INIT_PASSWORD || 'Admin@123456';
  const name = process.env.ADMIN_INIT_NAME || 'BLU CORE Admin';

  console.log(`[Admin Init] Checking if admin already exists for: ${email}`);

  const existing = await queryDocuments('admins', {
    filters: { email: email.toLowerCase().trim() },
    limit: 1
  });

  if (existing.items.length > 0) {
    console.log(`[Admin Init] Admin with email ${email} already exists! ID: ${existing.items[0].id}`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  const adminData = {
    ...normalizeAdminData({ email, name, role: 'superadmin' }),
    passwordHash
  };

  const created = await addDocument('admins', adminData);
  console.log('====================================');
  console.log('Admin account created successfully!');
  console.log(`ID: ${created.id}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('IMPORTANT: Change this password immediately in production.');
  console.log('====================================');
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('[Admin Init] Error:', err);
  process.exit(1);
});
