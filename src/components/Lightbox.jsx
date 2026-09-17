import React, { useEffect } from 'react';
import PlaceholderArt from './common/PlaceholderArt';

export function Lightbox({ isOpen, item, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const label = item.label || item.title || 'Precision CNC Project';
  const image = item.image || item.src || '';
  const cat = item.cat || item.category || 'WORK';

  return (
    <div
      className={`lightbox ${isOpen ? 'open' : ''}`}
      id="lightbox"
      data-testid="lightbox"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        className="lightbox-close"
        id="lightboxClose"
        data-testid="lightbox-close"
        aria-label="Close"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="lightbox-inner">
        <div className="placeholder" id="lightboxImg">
          <PlaceholderArt
            label={label}
            image={image}
            patternOpacity={0.55}
          />
        </div>
        <div className="lightbox-caption">
          <span id="lightboxCaption">{label}</span>
          <span id="lightboxCat" style={{ color: 'var(--gold-light)' }}>
            {cat}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
