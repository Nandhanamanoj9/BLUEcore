import React, { useState } from 'react';
import GalleryFilter from './GalleryFilter';
import GalleryItem from './GalleryItem';
import Lightbox from './Lightbox';
import { GALLERY_ITEMS } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeItem, setActiveItem] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { galleryItems } = useSiteImages();

  const activeItemsList = Array.isArray(galleryItems) && galleryItems.length > 0
    ? galleryItems
    : GALLERY_ITEMS;

  const filteredItems = activeCategory === 'ALL'
    ? activeItemsList
    : activeItemsList.filter((item) => item.cat === activeCategory);

  const handleOpenLightbox = (item) => {
    setActiveItem(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };


  return (
    <section id="gallery" data-testid="gallery-section">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">Our Work / Gallery</p>
          <AnimatedHeading as="h2">2D &amp; 3D Design Showcase</AnimatedHeading>
        </div>

        <GalleryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <div className="masonry" id="galleryGrid" data-testid="gallery-grid">
          {filteredItems.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onClick={handleOpenLightbox}
            />
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={isLightboxOpen}
        item={activeItem}
        onClose={handleCloseLightbox}
      />
    </section>
  );
}

export default Gallery;
