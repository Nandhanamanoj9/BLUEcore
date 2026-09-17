import fs from 'fs';
import path from 'path';
import { uploadFileToStorage } from '../services/storageService.js';
import { sendSuccess, sendError } from '../utils/response.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'siteImages.json');

// Default initial image slots matching the existing website structure
const DEFAULT_SLOTS = {
  hero_cnc: {
    id: 'hero_cnc',
    section: 'Hero',
    title: 'Hero CNC Machine Visual',
    description: 'Custom CNC machine or workshop image shown in the Hero section (falls back to interactive 3D model if empty)',
    defaultUrl: '',
    currentUrl: '',
    updatedAt: new Date().toISOString()
  },
  about_main: {
    id: 'about_main',
    section: 'About',
    title: 'About Section Craftsmanship Photo',
    description: 'Main workshop craftsmanship photo displayed in About BLU CORE',
    defaultUrl: '/images/about/cnc-craftsmanship.jpg',
    currentUrl: '/images/about/cnc-craftsmanship.jpg',
    updatedAt: new Date().toISOString()
  },
  showcase_wall_panels: {
    id: 'showcase_wall_panels',
    section: 'Showcase',
    title: 'Showcase: Wall Panels & Hanging',
    description: 'Hero feature photograph for Wall Panels & Hanging section',
    defaultUrl: '/images/showcase/wall-panels.jpg',
    currentUrl: '/images/showcase/wall-panels.jpg',
    updatedAt: new Date().toISOString()
  },
  showcase_door_design: {
    id: 'showcase_door_design',
    section: 'Showcase',
    title: 'Showcase: Door Design',
    description: 'Architectural entrance door carving showcase photograph',
    defaultUrl: '/images/showcase/door-design.jpg',
    currentUrl: '/images/showcase/door-design.jpg',
    updatedAt: new Date().toISOString()
  },
  showcase_ceiling_design: {
    id: 'showcase_ceiling_design',
    section: 'Showcase',
    title: 'Showcase: Ceiling Design',
    description: 'Recessed ceiling lattice patterns photograph',
    defaultUrl: '/images/showcase/ceiling-design.jpg',
    currentUrl: '/images/showcase/ceiling-design.jpg',
    updatedAt: new Date().toISOString()
  }
};

// Default initial gallery items matching siteData.js
const DEFAULT_GALLERY = [
  { id: '1', cat: 'WALL PANELS', label: 'Custom CNC Wall Panel', image: '/images/showcase/wall-panels.jpg', placeholder: false, legend: ['Architectural Jali', 'Geometric Motif', 'Feature Wall Panel'] },
  { id: '2', cat: 'DOORS', label: 'Custom Door Pattern', image: '/images/showcase/door-design.jpg', placeholder: false, legend: ['CNC Front Door Cutting', 'Solid Core Entrance', 'Modern Arch'] },
  { id: '3', cat: 'WOOD CARVING', label: 'Decorative Wood Carving', image: '/images/gallery/decorative-wood-carving.jpg', placeholder: false, legend: ['Artisan Wood Carving', 'Relief Detailing', 'Teak Timber'] },
  { id: '4', cat: 'CEILING', label: 'Custom Ceiling Pattern', image: '/images/showcase/ceiling-design.jpg', placeholder: false, legend: ['Ceiling Lattice', 'Ambient Backlit Grid', 'Geometric Motif'] },
  { id: '5', cat: '3D PANELS', label: '3D Interior Panel', image: '/images/about/cnc-craftsmanship.jpg', placeholder: false, legend: ['Wave 3D Panel', 'Living Room Wall', 'Multi-Axis Milling'] },
  { id: '6', cat: 'CUSTOM DESIGNS', label: 'Personalized Wooden Design', image: '/images/about/cnc-craftsmanship.jpg', placeholder: false, legend: ['Personalized Wooden Craft', 'Custom Engraving', 'Bespoke Gift'] },
  { id: '7', cat: 'WALL PANELS', label: 'CNC-Cut Decorative Screen', image: '/images/showcase/wall-panels.jpg', placeholder: false, legend: ['Decorative Screen', 'Jali Partition', 'Floral Pattern'] },
  { id: '8', cat: 'DOORS', label: '2D / 3D Door Panel', image: '/images/showcase/door-design.jpg', placeholder: false, legend: ['Double Door Relief', 'Brass Inlay Work', 'Grand Entry'] },
  { id: '9', cat: '3D PANELS', label: 'Textured 3D Panel', image: '/images/about/cnc-craftsmanship.jpg', placeholder: false, legend: ['Fluted Wood Panel', 'Acoustic Diffusion', 'Natural Oil'] },
  { id: '10', cat: 'WOOD CARVING', label: 'Traditional Carved Motif', image: '/images/gallery/traditional-carved-motif.jpg', placeholder: false, legend: ['Religious/God Panel', 'Intricate Temple Arch', 'Floral Motif'] },
  { id: '11', cat: 'CUSTOM DESIGNS', label: 'Decorative Wooden Clock', image: '/images/about/cnc-craftsmanship.jpg', placeholder: false, legend: ['Decorative Wooden Clock', 'Engraved Dial', 'Fine Craftsman Finish'] }
];

// Default initial Materials Gallery items
const DEFAULT_MATERIALS_GALLERY = [
  { id: 'mat-1', cat: 'MATERIALS', label: 'Solid Teak Wood Carving', image: '/images/gallery/decorative-wood-carving.jpg', legend: ['Natural Teak', 'Fine Relief'] },
  { id: 'mat-2', cat: 'MATERIALS', label: 'Precision Multiwood Jali', image: '/images/showcase/wall-panels.jpg', legend: ['Multiwood', 'Waterproof Core'] },
  { id: 'mat-3', cat: 'MATERIALS', label: 'Architectural Door in Hardwood', image: '/images/showcase/door-design.jpg', legend: ['Solid Hardwood', 'Brass Inlay'] }
];

// Default initial Projects / Applications Gallery items
const DEFAULT_PROJECTS_GALLERY = [
  { id: 'proj-1', cat: 'PROJECTS', label: 'Living Room Wall Feature Panel', image: '/images/showcase/wall-panels.jpg', legend: ['Residential', 'Accent Wall'] },
  { id: 'proj-2', cat: 'PROJECTS', label: 'Grand Entrance Doorway', image: '/images/showcase/door-design.jpg', legend: ['Entrance', 'CNC Carving'] },
  { id: 'proj-3', cat: 'PROJECTS', label: 'Mandala Ceiling Grid', image: '/images/showcase/ceiling-design.jpg', legend: ['Ceiling', 'Backlit Lattice'] }
];

const DEFAULT_GALLERIES = {
  main_gallery: DEFAULT_GALLERY,
  materials_gallery: DEFAULT_MATERIALS_GALLERY,
  projects_gallery: DEFAULT_PROJECTS_GALLERY
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      slots: DEFAULT_SLOTS,
      gallery: DEFAULT_GALLERY,
      galleries: DEFAULT_GALLERIES
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    let modified = false;

    if (!parsed.slots) {
      parsed.slots = DEFAULT_SLOTS;
      modified = true;
    }
    if (!parsed.galleries) {
      parsed.galleries = {
        main_gallery: parsed.gallery || DEFAULT_GALLERY,
        materials_gallery: DEFAULT_MATERIALS_GALLERY,
        projects_gallery: DEFAULT_PROJECTS_GALLERY
      };
      modified = true;
    }
    if (!parsed.galleries.materials_gallery) {
      parsed.galleries.materials_gallery = DEFAULT_MATERIALS_GALLERY;
      modified = true;
    }
    if (!parsed.galleries.projects_gallery) {
      parsed.galleries.projects_gallery = DEFAULT_PROJECTS_GALLERY;
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading siteImages.json, reinitializing:', err);
    const initialData = { slots: DEFAULT_SLOTS, gallery: DEFAULT_GALLERY, galleries: DEFAULT_GALLERIES };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
}

function saveDataFile(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * GET /api/images
 * Public endpoint to get all active image slots and dynamic gallery items
 */
export async function getAllSiteImages(req, res, next) {
  try {
    const data = ensureDataFile();
    return sendSuccess(res, {
      message: 'Site images retrieved successfully',
      data: {
        slots: data.slots || DEFAULT_SLOTS,
        gallery: data.galleries?.main_gallery || data.gallery || DEFAULT_GALLERY,
        galleries: data.galleries || DEFAULT_GALLERIES
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/images/upload
 * Protected endpoint: uploads image file to persistent storage and returns public URL
 */
export async function uploadSiteImage(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, { message: 'No image file provided for upload', statusCode: 400 });
    }

    const result = await uploadFileToStorage(req.file, 'site-images', req.body.slot || 'general');

    if (!result || !result.fileUrl) {
      return sendError(res, { message: 'Image storage processing failed', statusCode: 500 });
    }

    return sendSuccess(res, {
      message: 'Image uploaded successfully',
      data: {
        fileUrl: result.fileUrl,
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        contentType: result.contentType
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/images/slots/:slotId
 * Protected endpoint: updates the image for a specific section slot
 */
export async function updateImageSlot(req, res, next) {
  try {
    const { slotId } = req.params;
    const { imageUrl } = req.body;

    const data = ensureDataFile();
    if (!data.slots) data.slots = { ...DEFAULT_SLOTS };

    if (!data.slots[slotId]) {
      return sendError(res, { message: `Image slot "${slotId}" not found`, statusCode: 404 });
    }

    data.slots[slotId].currentUrl = imageUrl || '';
    data.slots[slotId].updatedAt = new Date().toISOString();

    saveDataFile(data);

    return sendSuccess(res, {
      message: `Image slot "${slotId}" updated successfully`,
      data: data.slots[slotId]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/images/slots/:slotId/reset
 * Protected endpoint: resets slot to default fallback image
 */
export async function resetImageSlot(req, res, next) {
  try {
    const { slotId } = req.params;
    const data = ensureDataFile();
    if (!data.slots || !data.slots[slotId]) {
      return sendError(res, { message: `Image slot "${slotId}" not found`, statusCode: 404 });
    }

    const defaultUrl = DEFAULT_SLOTS[slotId]?.defaultUrl || '';
    data.slots[slotId].currentUrl = defaultUrl;
    data.slots[slotId].updatedAt = new Date().toISOString();

    saveDataFile(data);

    return sendSuccess(res, {
      message: `Image slot "${slotId}" reset to default successfully`,
      data: data.slots[slotId]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/images/gallery
 * Protected endpoint: adds an image item to the dynamic gallery
 */
export async function addGalleryItem(req, res, next) {
  try {
    const { cat, label, image, legend = [] } = req.body;

    if (!image || !label || !cat) {
      return sendError(res, {
        message: 'Image URL, title/label, and category are required',
        statusCode: 400
      });
    }

    const data = ensureDataFile();
    if (!data.gallery) data.gallery = [...DEFAULT_GALLERY];
    if (!data.galleries) data.galleries = { ...DEFAULT_GALLERIES };
    if (!data.galleries.main_gallery) data.galleries.main_gallery = [...data.gallery];

    const newItem = {
      id: String(Date.now()),
      cat: cat.toUpperCase(),
      label: label.trim(),
      image: image.trim(),
      placeholder: false,
      legend: Array.isArray(legend) ? legend : [legend].filter(Boolean),
      createdAt: new Date().toISOString()
    };

    // Prepend new image so it appears at top of gallery
    data.gallery.unshift(newItem);
    data.galleries.main_gallery.unshift(newItem);
    saveDataFile(data);

    return sendSuccess(res, {
      message: 'Gallery item added successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/images/gallery/:itemId
 * Protected endpoint: updates/replaces an existing gallery item
 */
export async function updateGalleryItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { cat, label, image, legend } = req.body;

    const data = ensureDataFile();
    if (!data.gallery) data.gallery = [...DEFAULT_GALLERY];
    if (!data.galleries) data.galleries = { ...DEFAULT_GALLERIES };
    if (!data.galleries.main_gallery) data.galleries.main_gallery = [...data.gallery];

    const index = data.gallery.findIndex((item) => String(item.id) === String(itemId));
    if (index === -1) {
      return sendError(res, { message: 'Gallery item not found', statusCode: 404 });
    }

    if (cat) data.gallery[index].cat = cat.toUpperCase();
    if (label) data.gallery[index].label = label.trim();
    if (image) data.gallery[index].image = image.trim();
    if (legend !== undefined) {
      data.gallery[index].legend = Array.isArray(legend) ? legend : [legend].filter(Boolean);
    }
    data.gallery[index].updatedAt = new Date().toISOString();

    const mainIdx = data.galleries.main_gallery.findIndex((item) => String(item.id) === String(itemId));
    if (mainIdx !== -1) {
      data.galleries.main_gallery[mainIdx] = { ...data.gallery[index] };
    }

    saveDataFile(data);

    return sendSuccess(res, {
      message: 'Gallery item updated successfully',
      data: data.gallery[index]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/images/gallery/:itemId
 * Protected endpoint: deletes a gallery item
 */
export async function deleteGalleryItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const data = ensureDataFile();
    if (!data.gallery) data.gallery = [...DEFAULT_GALLERY];
    if (!data.galleries) data.galleries = { ...DEFAULT_GALLERIES };
    if (!data.galleries.main_gallery) data.galleries.main_gallery = [...data.gallery];

    const initialLength = data.gallery.length;
    data.gallery = data.gallery.filter((item) => String(item.id) !== String(itemId));
    data.galleries.main_gallery = data.galleries.main_gallery.filter((item) => String(item.id) !== String(itemId));

    if (data.gallery.length === initialLength) {
      return sendError(res, { message: 'Gallery item not found', statusCode: 404 });
    }

    saveDataFile(data);

    return sendSuccess(res, {
      message: 'Gallery item deleted successfully',
      data: { id: itemId }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/images/galleries/:galleryKey/batch
 * Protected endpoint: adds multiple photos to any section gallery (e.g. materials_gallery, projects_gallery, main_gallery)
 */
export async function addBatchSectionGalleryPhotos(req, res, next) {
  try {
    const { galleryKey } = req.params;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, { message: 'No photos provided for batch addition', statusCode: 400 });
    }

    const data = ensureDataFile();
    if (!data.galleries) data.galleries = { ...DEFAULT_GALLERIES };
    if (!data.galleries[galleryKey]) {
      data.galleries[galleryKey] = [];
    }

    const createdItems = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const newItem = {
        id: `${galleryKey}-${Date.now()}-${i}`,
        cat: (it.cat || it.category || galleryKey.replace('_gallery', '').toUpperCase()).toUpperCase(),
        label: (it.label || it.title || `Precision CNC Work ${i + 1}`).trim(),
        image: it.image || it.src,
        legend: Array.isArray(it.legend) ? it.legend : (it.legend ? [it.legend] : []),
        createdAt: new Date().toISOString()
      };
      createdItems.push(newItem);
      data.galleries[galleryKey].unshift(newItem);
    }

    if (galleryKey === 'main_gallery') {
      data.gallery = [...data.galleries.main_gallery];
    }

    saveDataFile(data);

    return sendSuccess(res, {
      message: `Successfully added ${createdItems.length} photos to ${galleryKey}`,
      data: createdItems
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/images/galleries/:galleryKey/:itemId
 * Protected endpoint: updates or replaces an item in any section gallery
 */
export async function updateSectionGalleryItem(req, res, next) {
  try {
    const { galleryKey, itemId } = req.params;
    const { cat, label, image, legend } = req.body;

    const data = ensureDataFile();
    if (!data.galleries || !data.galleries[galleryKey]) {
      return sendError(res, { message: `Gallery "${galleryKey}" not found`, statusCode: 404 });
    }

    const idx = data.galleries[galleryKey].findIndex((item) => String(item.id) === String(itemId));
    if (idx === -1) {
      return sendError(res, { message: 'Gallery item not found', statusCode: 404 });
    }

    if (cat) data.galleries[galleryKey][idx].cat = cat.toUpperCase();
    if (label) data.galleries[galleryKey][idx].label = label.trim();
    if (image) data.galleries[galleryKey][idx].image = image.trim();
    if (legend !== undefined) {
      data.galleries[galleryKey][idx].legend = Array.isArray(legend) ? legend : [legend].filter(Boolean);
    }
    data.galleries[galleryKey][idx].updatedAt = new Date().toISOString();

    if (galleryKey === 'main_gallery' && data.gallery) {
      const gIdx = data.gallery.findIndex((item) => String(item.id) === String(itemId));
      if (gIdx !== -1) {
        data.gallery[gIdx] = { ...data.galleries[galleryKey][idx] };
      }
    }

    saveDataFile(data);

    return sendSuccess(res, {
      message: 'Photo updated successfully',
      data: data.galleries[galleryKey][idx]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/images/galleries/:galleryKey/:itemId
 * Protected endpoint: removes an item from any section gallery
 */
export async function deleteSectionGalleryItem(req, res, next) {
  try {
    const { galleryKey, itemId } = req.params;
    const data = ensureDataFile();
    if (!data.galleries || !data.galleries[galleryKey]) {
      return sendError(res, { message: `Gallery "${galleryKey}" not found`, statusCode: 404 });
    }

    const initialLen = data.galleries[galleryKey].length;
    data.galleries[galleryKey] = data.galleries[galleryKey].filter((item) => String(item.id) !== String(itemId));

    if (data.galleries[galleryKey].length === initialLen) {
      return sendError(res, { message: 'Item not found in gallery', statusCode: 404 });
    }

    if (galleryKey === 'main_gallery' && data.gallery) {
      data.gallery = data.gallery.filter((item) => String(item.id) !== String(itemId));
    }

    saveDataFile(data);

    return sendSuccess(res, {
      message: 'Photo removed successfully from gallery',
      data: { id: itemId }
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getAllSiteImages,
  uploadSiteImage,
  updateImageSlot,
  resetImageSlot,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  addBatchSectionGalleryPhotos,
  updateSectionGalleryItem,
  deleteSectionGalleryItem
};

