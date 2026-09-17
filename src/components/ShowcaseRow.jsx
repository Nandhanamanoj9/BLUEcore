import React from 'react';
import PlaceholderArt from './common/PlaceholderArt';
import AnimatedHeading from './common/AnimatedHeading';

export function ShowcaseRow({ item, index, onOpenSpecs }) {
  const isReverse = index % 2 !== 0;

  return (
    <div className={`showcase-row reveal ${isReverse ? 'rev' : ''}`}>
      <div className="showcase-copy">
        <p className="label">{item.tag}</p>
        <AnimatedHeading as="h3" initialDelay={0.08} stagger={0.035}>
          {item.title}
        </AnimatedHeading>
        <p className="showcase-desc">{item.shortDesc || item.text}</p>
        <ul className="showcase-list">
          {item.points.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
        <div className="showcase-actions">
          <a href="#quote" className="btn btn-ink">Request a Quote</a>
          {item.specs && (
            <button
              type="button"
              className="btn-spec-trigger"
              onClick={() => onOpenSpecs && onOpenSpecs(item)}
              aria-label={`View technical specifications for ${item.title}`}
            >
              <span>Technical Specs</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="showcase-media-container">
        <div className="placeholder showcase-media">
          <PlaceholderArt
            label={item.title}
            image={item.image}
            patternOpacity={0.55}
          />
        </div>
        {item.legend && (
          <div className="showcase-card-legend" aria-label={`Design tags for ${item.title}`}>
            {item.legend.map((tag, idx) => (
              <span key={idx} className="legend-pill">
                <span className="legend-dot" aria-hidden="true"></span>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowcaseRow;
