import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GALLERY_ITEMS, SHOWCASE } from '../data/siteData';

const SiteImagesContext = createContext(null);

const DEFAULT_SLOTS = {
  hero_cnc: {
    id: 'hero_cnc',
    section: 'Hero',
    title: 'Hero CNC Machine Visual',
    description: 'Custom CNC machine or workshop image shown in the Hero section (falls back to interactive 3D model if empty)',
    defaultUrl: '',
    currentUrl: ''
  },
  about_main: {
    id: 'about_main',
    section: 'About',
    title: 'About Section Craftsmanship Photo',
    description: 'Main workshop craftsmanship photo displayed in About BLU CORE',
    defaultUrl: '/images/about/cnc-craftsmanship.jpg',
    currentUrl: '/images/about/cnc-craftsmanship.jpg'
  },
  showcase_wall_panels: {
    id: 'showcase_wall_panels',
    section: 'Showcase',
    title: 'Showcase: Wall Panels & Hanging',
    description: 'Hero feature photograph for Wall Panels & Hanging section',
    defaultUrl: SHOWCASE[0]?.image || '/images/showcase/wall-panels.jpg',
    currentUrl: SHOWCASE[0]?.image || '/images/showcase/wall-panels.jpg'
  },
  showcase_door_design: {
    id: 'showcase_door_design',
    section: 'Showcase',
    title: 'Showcase: Door Design',
    description: 'Architectural entrance door carving showcase photograph',
    defaultUrl: SHOWCASE[1]?.image || '/images/showcase/door-design.jpg',
    currentUrl: SHOWCASE[1]?.image || '/images/showcase/door-design.jpg'
  },
  showcase_ceiling_design: {
    id: 'showcase_ceiling_design',
    section: 'Showcase',
    title: 'Showcase: Ceiling Design',
    description: 'Recessed ceiling lattice patterns photograph',
    defaultUrl: SHOWCASE[2]?.image || '/images/showcase/ceiling-design.jpg',
    currentUrl: SHOWCASE[2]?.image || '/images/showcase/ceiling-design.jpg'
  }
};

export function SiteImagesProvider({ children }) {
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [galleries, setGalleries] = useState({
    main_gallery: GALLERY_ITEMS,
    materials_gallery: [],
    projects_gallery: []
  });
  const [galleryItems, setGalleryItems] = useState(GALLERY_ITEMS);
  const [materialsGallery, setMaterialsGallery] = useState([]);
  const [projectsGallery, setProjectsGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('blucore_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('blucore_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const fetchSiteImages = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/images', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.slots) {
            setSlots((prev) => ({ ...prev, ...json.data.slots }));
          }
          if (json.data.galleries) {
            setGalleries(json.data.galleries);
            if (Array.isArray(json.data.galleries.main_gallery)) {
              setGalleryItems(json.data.galleries.main_gallery);
            }
            if (Array.isArray(json.data.galleries.materials_gallery)) {
              setMaterialsGallery(json.data.galleries.materials_gallery);
            }
            if (Array.isArray(json.data.galleries.projects_gallery)) {
              setProjectsGallery(json.data.galleries.projects_gallery);
            }
          } else if (Array.isArray(json.data.gallery) && json.data.gallery.length > 0) {
            setGalleryItems(json.data.gallery);
          }
        }
      }
    } catch (err) {
      console.warn('API image fetch notice: using built-in fallback images', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteImages();
  }, [fetchSiteImages]);

  // Login handler for Admin
  const loginAdmin = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        setAuthToken(data.data.token);
        setAdminUser(data.data.admin);
        localStorage.setItem('blucore_admin_token', data.data.token);
        localStorage.setItem('blucore_admin_user', JSON.stringify(data.data.admin));
        return { success: true };
      }
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: 'Server unreachable. Please ensure backend is running.' };
    }
  };

  const logoutAdmin = () => {
    setAuthToken(null);
    setAdminUser(null);
    localStorage.removeItem('blucore_admin_token');
    localStorage.removeItem('blucore_admin_user');
  };

  // Helper to get image for a slot with robust fallback
  const getSlotImage = (slotId, fallback = '') => {
    const slot = slots[slotId];
    if (slot && slot.currentUrl && slot.currentUrl.trim() !== '') {
      return slot.currentUrl;
    }
    return slot?.defaultUrl || fallback;
  };

  const value = {
    slots,
    galleries,
    galleryItems,
    materialsGallery,
    projectsGallery,
    isLoading,
    authToken,
    adminUser,
    isAuthenticated: Boolean(authToken),
    loginAdmin,
    logoutAdmin,
    getSlotImage,
    refreshImages: fetchSiteImages
  };

  return (
    <SiteImagesContext.Provider value={value}>
      {children}
    </SiteImagesContext.Provider>
  );
}

export function useSiteImages() {
  const ctx = useContext(SiteImagesContext);
  if (!ctx) {
    throw new Error('useSiteImages must be used within a SiteImagesProvider');
  }
  return ctx;
}

export default SiteImagesContext;
