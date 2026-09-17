import React, { useEffect } from 'react';

export function TechnicalSpecsModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { title, tag, specs, legend } = item;

  return (
    <div
      className="spec-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Technical Specifications for ${title}`}
    >
      <div className="spec-modal-card">
        <button
          type="button"
          className="spec-modal-close"
          onClick={onClose}
          aria-label="Close specifications"
        >
          &times;
        </button>

        <div className="spec-modal-header">
          <span className="spec-modal-tag">{tag}</span>
          <h3>{title}</h3>
          <p className="spec-modal-subtitle">Industrial Machining &amp; Craftsman Specifications</p>
        </div>

        {legend && (
          <div className="spec-modal-legend">
            {legend.map((tagItem, idx) => (
              <span key={idx} className="legend-badge">
                <span className="legend-dot"></span>
                {tagItem}
              </span>
            ))}
          </div>
        )}

        <div className="spec-grid">
          <div className="spec-item">
            <span className="spec-label">Cutter Precision</span>
            <span className="spec-val">{specs?.cutterTolerance || '±0.02 mm CNC Tolerance'}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Bed Capacity</span>
            <span className="spec-val">{specs?.bedCapacity || '1300 × 2500 mm (MTR 1325-H)'}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Compatible Substrates</span>
            <span className="spec-val">{specs?.materials || 'Teak, Plywood, MDF, HDF, Multiwood, WPC'}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Surface Finishes</span>
            <span className="spec-val">{specs?.finishOptions || 'PU Clear Matte, Satin Polish, Brass Inlay'}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Standard Lead Time</span>
            <span className="spec-val">{specs?.leadTime || '3–5 Business Days'}</span>
          </div>
        </div>

        <div className="spec-modal-footer">
          <a href="#quote" className="btn btn-gold" onClick={onClose}>
            Request Quote for this Application
          </a>
          <button type="button" className="btn btn-outline" style={{ color: 'var(--ink)' }} onClick={onClose}>
            Back to Showcase
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnicalSpecsModal;
