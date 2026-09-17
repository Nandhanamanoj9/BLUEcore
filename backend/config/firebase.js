import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

let db = null;
let bucket = null;
let isMockMode = false;

// Mock in-memory database for local development when live Firebase credentials aren't set yet
const mockDatabase = {
  quotes: new Map(),
  contacts: new Map(),
  gallery: new Map(),
  projects: new Map(),
  services: new Map(),
  materials: new Map(),
  branches: new Map(),
  admins: new Map(),
};

// Prepopulate initial data into mockDatabase for development convenience
function initMockData() {
  const INITIAL_SERVICES = [
    { num: "01", name: "Wood Carving", desc: "Customized and decorative wood carving using advanced CNC technology.", icon: "carve", order: 1 },
    { num: "02", name: "Door Design", desc: "Customized 2D and 3D designs and patterns for main doors and interior doors.", icon: "door", order: 2 },
    { num: "03", name: "Staircase", desc: "Decorative and customized staircase design elements that add character to your interior.", icon: "stair", order: 3 },
    { num: "04", name: "Wall Panels & Hanging", desc: "Decorative CNC-cut wall panels and hanging elements designed to enhance interior spaces.", icon: "panel", order: 4 },
    { num: "05", name: "Ceiling Design", desc: "Customized decorative ceiling patterns and designs for modern and traditional interiors.", icon: "ceiling", order: 5 },
    { num: "06", name: "Personalized Wooden Gifts", desc: "Customized wooden gifts and decorative products created for special occasions and personal spaces.", icon: "gift", order: 6 },
    { num: "07", name: "Sign Boards", desc: "Customized CNC-cut and decorative sign boards for homes, businesses and commercial spaces.", icon: "sign", order: 7 }
  ];

  INITIAL_SERVICES.forEach((s, i) => {
    const id = `svc_${i + 1}`;
    mockDatabase.services.set(id, { ...s, id, active: true, createdAt: new Date().toISOString() });
  });

  const INITIAL_MATERIALS = [
    { name: "Plywood", desc: "Versatile and practical for customized CNC cutting and decorative applications.", order: 1 },
    { name: "MDF", desc: "A smooth and consistent surface suitable for detailed CNC patterns and interior designs.", order: 2 },
    { name: "HDF", desc: "A dense and durable material suitable for precise decorative detailing.", order: 3 },
    { name: "Multiwood", desc: "A versatile material for customized CNC designs and decorative interior applications.", order: 4 },
    { name: "Wood", desc: "Natural wood transformed through detailed CNC carving and customized craftsmanship.", order: 5 },
    { name: "WPC", desc: "A durable and modern material suitable for decorative panels, wall applications and selected interior and exterior designs.", order: 6 }
  ];

  INITIAL_MATERIALS.forEach((m, i) => {
    const id = `mat_${i + 1}`;
    mockDatabase.materials.set(id, { ...m, id, active: true, createdAt: new Date().toISOString() });
  });

  const INITIAL_BRANCHES = [
    { name: "Kanhangad", addr: "Maruthi Tower, Devan Link Road, Kanhangad, Pin: 671315", phone: "+91 9400 544 477", tel: "+919400544477", order: 1 },
    { name: "Payyannur / Trikaripur", addr: "Near Irikaripur Farmers Bank, Olavad - Mundya, Trikaripur, Pin: 671310", phone: "+91 9656 544 477", tel: "+919656544477", order: 2 },
    { name: "Palakkunnu", addr: "Kottikkulam, Palakkunnu, Near Bakery, Pin: 671318", phone: "+91 9747 544 477", tel: "+919747544477", order: 3 },
    { name: "Cherupuzha", addr: "Kollada Road, Kakkayamchal, Opp. St. Mary's High School, Cherupuzha, Pin: 670511", phone: "+91 7510 544 477", tel: "+917510544477", order: 4 }
  ];

  INITIAL_BRANCHES.forEach((b, i) => {
    const id = `branch_${i + 1}`;
    mockDatabase.branches.set(id, { ...b, id, active: true, createdAt: new Date().toISOString() });
  });

  // Prepopulate default admins (blucorenc@gmail.com and nandhananimi2003@gmail.com / Admin@123456)
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Admin@123456', salt);
  const adminId = 'admin_default_1';
  mockDatabase.admins.set(adminId, {
    id: adminId,
    email: 'blucorenc@gmail.com',
    name: 'BLU CORE Admin',
    role: 'superadmin',
    passwordHash,
    active: true,
    createdAt: new Date().toISOString()
  });

  const adminId2 = 'admin_default_2';
  mockDatabase.admins.set(adminId2, {
    id: adminId2,
    email: 'nandhananimi2003@gmail.com',
    name: 'Nandhana Manoj',
    role: 'superadmin',
    passwordHash,
    active: true,
    createdAt: new Date().toISOString()
  });
}

function initializeFirebase() {
  if (admin.apps.length > 0) {
    return {
      admin,
      db: admin.firestore(),
      bucket: admin.storage().bucket(),
      isMockMode: false
    };
  }

  const {
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_STORAGE_BUCKET
  } = process.env;

  try {
    let credential = null;

    if (FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(FIREBASE_SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = JSON.parse(fs.readFileSync(FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    }

    if (credential) {
      admin.initializeApp({
        credential,
        storageBucket: FIREBASE_STORAGE_BUCKET || `${FIREBASE_PROJECT_ID}.appspot.com`
      });

      db = admin.firestore();
      bucket = admin.storage().bucket();
      console.log(`[Firebase] Initialized Admin SDK with project: ${FIREBASE_PROJECT_ID || 'ServiceAccount'}`);
      return { admin, db, bucket, isMockMode: false };
    }

    // Fallback mode
    console.warn('[Firebase] No Firebase credentials detected in .env. Running in local fallback mode for development.');
    isMockMode = true;
    initMockData();
    return {
      admin: null,
      db: null,
      bucket: null,
      isMockMode: true,
      mockDatabase
    };
  } catch (error) {
    console.error('[Firebase] Error initializing Firebase Admin SDK:', error.message);
    isMockMode = true;
    initMockData();
    return {
      admin: null,
      db: null,
      bucket: null,
      isMockMode: true,
      mockDatabase
    };
  }
}

const firebaseInstance = initializeFirebase();

export const getFirestore = () => firebaseInstance.db;
export const getStorageBucket = () => firebaseInstance.bucket;
export const isFirebaseMockMode = () => firebaseInstance.isMockMode;
export const getMockDatabase = () => mockDatabase;
export default firebaseInstance;
