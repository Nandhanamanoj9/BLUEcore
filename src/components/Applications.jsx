import React, { useState } from 'react';
import JaliPattern from './common/JaliPattern';
import { APPLICATION_GROUPS } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';
import Lightbox from './Lightbox';

export function Applications() {
  const { projectsGallery } = useSiteImages();
  const [activeItem, setActiveItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenLightbox = (item) => {
    setActiveItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Helper to extract photos uploaded by admin for a specific category
  const getCategoryPhotos = (categoryName) => {
    if (!Array.isArray(projectsGallery) || projectsGallery.length === 0) return [];
    return projectsGallery.filter((item) => {
      const cat = (item.cat || item.category || '').toUpperCase();
      const target = categoryName.toUpperCase();
      if (cat === target) return true;
      if (Array.isArray(item.legend) && item.legend.some((l) => String(l).toUpperCase() === target)) {
        return true;
      }
      return false;
    });
  };

  return (
    <section id="projects">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">Projects / Applications</p>
          <AnimatedHeading as="h2">Wherever a Space Needs Character</AnimatedHeading>
        </div>

        {APPLICATION_GROUPS.map((group) => {
          const customPhotos = getCategoryPhotos(group.category);

          return (
            <div key={group.category} className="app-category-group reveal">
              <h3 className="app-category-title">{group.category}</h3>
              <div className="app-scroll">
                {/* 1. Admin-managed project photographs if uploaded */}
                {customPhotos.map((photo) => {
                  const img = photo.image || photo.src;
                  const label = photo.label || photo.title || `${group.category} Project`;

                  return (
                    <div
                      key={photo.id}
                      className="app-card has-image"
                      onClick={() => handleOpenLightbox({
                        image: img,
                        label,
                        cat: group.category
                      })}
                      title="Click to zoom project photo"
                    >
                      <img
                        src={img}
                        alt={label}
                        className="app-card-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <JaliPattern
                        id={`a_${group.category}_${photo.id.replace(/[^a-zA-Z0-9]/g, '')}`}
                        opacity={0.35}
                      />
                      <span>{label}</span>
                      <div className="app-card-zoom-badge">→</div>
                    </div>
                  );
                })}

                {/* 2. Default architectural items preserved */}
                {group.items.map((item) => (
                  <div key={item} className="app-card">
                    <JaliPattern
                      id={`a_${group.category}_${item.replace(/\s+/g, '')}`}
                      opacity={0.55}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        item={activeItem}
        onClose={handleCloseLightbox}
      />
    </section>
  );
}

export default Applications;

