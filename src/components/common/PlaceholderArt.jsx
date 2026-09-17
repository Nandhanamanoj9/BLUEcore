import React, { useState } from 'react';
import JaliPattern from './JaliPattern';

export function PlaceholderArt({
  label,
  image = null,
  patternOpacity = 0.55,
  className = '',
  style = {}
}) {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = Boolean(image && !imageError);

  return (
    <>
      {hasValidImage ? (
        <img
          src={image}
          alt={label || 'BLU CORE CNC Design'}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <JaliPattern opacity={patternOpacity} />
      )}

      {label && (
        <div className="tag">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <circle cx="12" cy="13.5" r="3.2" />
            <path d="M8 7l1.5-2.5h5L16 7" />
          </svg>
          <span>{label}</span>
        </div>
      )}
    </>
  );
}

export default PlaceholderArt;
