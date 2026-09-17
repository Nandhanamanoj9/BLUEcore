import React, { useState } from 'react';
import JaliPattern from './common/JaliPattern';
import { MATERIALS } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';
import Lightbox from './Lightbox';

export function Materials() {
  const { materialsGallery } = useSiteImages();
  const [activeItem, setActiveItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenLightbox = (item) => {
    setActiveItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <section id="materials" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">Materials &amp; Design</p>
          <AnimatedHeading as="h2">Built from the surface up</AnimatedHeading>
        </div>
        <div className="mat-strip reveal" id="matStrip">
          {MATERIALS.map((material) => (
            <div key={material.name} className="mat-cell">
              <JaliPattern id={`m${material.name}`} opacity={0.5} />
              <span>{material.name}</span>
              <p className="mat-desc">{material.desc}</p>
            </div>
          ))}
        </div>

        {Array.isArray(materialsGallery) && materialsGallery.length > 0 && (
          <div className="materials-gallery-wrap" style={{ marginTop: '44px' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--text-heading-primary)', marginBottom: '18px' }}>
              Materials in Action — Craftsmanship Portfolio
            </h3>
            <div className="materials-gallery-grid">
              {materialsGallery.map((item) => {
                const img = item.image || item.src;
                const label = item.label || item.title || 'Material Precision Work';
                return (
                  <div
                    key={item.id}
                    className="mat-gallery-card"
                    onClick={() => handleOpenLightbox(item)}
                    title="Click to zoom"
                  >
                    <div className="mat-gallery-img-wrap">
                      <img
                        src={img}
                        alt={label}
                        onError={(e) => {
                          e.target.src = '/images/showcase/wall-panels.jpg';
                        }}
                      />
                      <div className="mat-gallery-overlay">
                        <span>🔍 View Details</span>
                      </div>
                    </div>
                    <div className="mat-gallery-info">
                      <strong>{label}</strong>
                      {item.legend && (
                        <span>{Array.isArray(item.legend) ? item.legend.join(' · ') : item.legend}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="mat-note">
          Every surface can be transformed through customized CNC cutting and 2D or 3D pattern work — matched to the material, the light in your space, and the mood you&apos;re designing for.
        </p>
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        item={activeItem}
        onClose={handleCloseLightbox}
      />
    </section>
  );
}

export default Materials;

