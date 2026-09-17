import React from 'react';
import PlaceholderArt from './common/PlaceholderArt';

export function GalleryItem({ item, onClick }) {
  const label = item.label || item.title || 'Precision CNC Project';
  const image = item.image || item.src || '';
  const cat = item.cat || item.category || 'WORK';
  const tags = Array.isArray(item.legend)
    ? item.legend
    : (typeof item.legend === 'string' && item.legend ? item.legend.split(/[,·]/).map((s) => s.trim()).filter(Boolean) : []);

  return (
    <div className="gitem" data-testid="gallery-item" onClick={() => onClick(item)}>
      <div className="placeholder">
        <PlaceholderArt
          label={label}
          image={image}
          patternOpacity={0.55}
        />
      </div>
      <div className="gitem-overlay">
        <div className="gitem-meta">
          <span className="gitem-cat-pill">{cat}</span>
          <p>{label}</p>
          {tags.length > 0 && (
            <div className="gitem-tags" aria-hidden="true">
              {tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="gitem-tag-badge">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GalleryItem;
