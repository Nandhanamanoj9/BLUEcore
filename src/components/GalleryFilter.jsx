import React from 'react';
import { GALLERY_CATS } from '../data/siteData';

export function GalleryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="gallery-filters reveal" id="galleryFilters">
      {GALLERY_CATS.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`gfilter ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
          data-cat={cat}
          data-testid={`gallery-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default GalleryFilter;

