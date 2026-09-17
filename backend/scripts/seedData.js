import dotenv from 'dotenv';
dotenv.config();

import '../config/firebase.js';
import { addDocument, queryDocuments } from '../services/firestoreService.js';

const INITIAL_SERVICES = [
  { num: "01", name: "Wood Carving", desc: "Customized and decorative wood carving using advanced CNC technology.", icon: "carve", order: 1 },
  { num: "02", name: "Door Design", desc: "Customized 2D and 3D designs and patterns for main doors and interior doors.", icon: "door", order: 2 },
  { num: "03", name: "Staircase", desc: "Decorative and customized staircase design elements that add character to your interior.", icon: "stair", order: 3 },
  { num: "04", name: "Wall Panels & Hanging", desc: "Decorative CNC-cut wall panels and hanging elements designed to enhance interior spaces.", icon: "panel", order: 4 },
  { num: "05", name: "Ceiling Design", desc: "Customized decorative ceiling patterns and designs for modern and traditional interiors.", icon: "ceiling", order: 5 },
  { num: "06", name: "Personalized Wooden Gifts", desc: "Customized wooden gifts and decorative products created for special occasions and personal spaces.", icon: "gift", order: 6 },
  { num: "07", name: "Sign Boards", desc: "Customized CNC-cut and decorative sign boards for homes, businesses and commercial spaces.", icon: "sign", order: 7 }
];

const INITIAL_MATERIALS = [
  { name: "Plywood", desc: "Versatile and practical for customized CNC cutting and decorative applications.", order: 1 },
  { name: "MDF", desc: "A smooth and consistent surface suitable for detailed CNC patterns and interior designs.", order: 2 },
  { name: "HDF", desc: "A dense and durable material suitable for precise decorative detailing.", order: 3 },
  { name: "Multiwood", desc: "A versatile material for customized CNC designs and decorative interior applications.", order: 4 },
  { name: "Wood", desc: "Natural wood transformed through detailed CNC carving and customized craftsmanship.", order: 5 },
  { name: "WPC", desc: "A durable and modern material suitable for decorative panels, wall applications and selected interior and exterior designs.", order: 6 }
];

const INITIAL_BRANCHES = [
  { name: "Kanhangad", addr: "Maruthi Tower, Devan Link Road, Kanhangad, Pin: 671315", phone: "+91 9400 544 477", tel: "+919400544477", order: 1 },
  { name: "Payyannur / Trikaripur", addr: "Near Irikaripur Farmers Bank, Olavad - Mundya, Trikaripur, Pin: 671310", phone: "+91 9656 544 477", tel: "+919656544477", order: 2 },
  { name: "Palakkunnu", addr: "Kottikkulam, Palakkunnu, Near Bakery, Pin: 671318", phone: "+91 9747 544 477", tel: "+919747544477", order: 3 },
  { name: "Cherupuzha", addr: "Kollada Road, Kakkayamchal, Opp. St. Mary's High School, Cherupuzha, Pin: 670511", phone: "+91 7510 544 477", tel: "+917510544477", order: 4 }
];

async function seed() {
  console.log('[Seed] Starting database seed...');

  // 1. Seed Services
  const existingServices = await queryDocuments('services', { limit: 100 });
  if (existingServices.items.length === 0) {
    for (const item of INITIAL_SERVICES) {
      await addDocument('services', { ...item, active: true });
    }
    console.log(`[Seed] Seeded ${INITIAL_SERVICES.length} services.`);
  } else {
    console.log(`[Seed] Services already populated (${existingServices.items.length} records).`);
  }

  // 2. Seed Materials
  const existingMaterials = await queryDocuments('materials', { limit: 100 });
  if (existingMaterials.items.length === 0) {
    for (const item of INITIAL_MATERIALS) {
      await addDocument('materials', { ...item, active: true });
    }
    console.log(`[Seed] Seeded ${INITIAL_MATERIALS.length} materials.`);
  } else {
    console.log(`[Seed] Materials already populated (${existingMaterials.items.length} records).`);
  }

  // 3. Seed Branches
  const existingBranches = await queryDocuments('branches', { limit: 100 });
  if (existingBranches.items.length === 0) {
    for (const item of INITIAL_BRANCHES) {
      await addDocument('branches', { ...item, active: true });
    }
    console.log(`[Seed] Seeded ${INITIAL_BRANCHES.length} branches.`);
  } else {
    console.log(`[Seed] Branches already populated (${existingBranches.items.length} records).`);
  }

  console.log('[Seed] Completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
