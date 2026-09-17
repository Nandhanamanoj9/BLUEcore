import React from 'react';
import Icon from './common/Icon';

export function ServiceCard({ service }) {
  const { num, name, desc, icon } = service;

  return (
    <div className="svc-card">
      <div className="svc-icon">
        <Icon name={icon} />
      </div>
      <h3>{num} — {name}</h3>
      <p>{desc}</p>
      <a href="#gallery" className="svc-link">
        Explore Service{' '}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
    </div>
  );
}

export default ServiceCard;
