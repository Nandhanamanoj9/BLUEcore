import React from 'react';

export function BranchCard({ branch }) {
  const { name, addr, phone, tel } = branch;

  return (
    <div className="branch-card">
      <h4>{name}</h4>
      <p>{addr}</p>
      <a className="phone" href={`tel:${tel}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.12.9.33 1.8.62 2.7a2 2 0 01-.45 2.1L8.1 9.6a16 16 0 006.3 6.3l1.1-1.1a2 2 0 012.1-.45c.9.29 1.8.5 2.7.62A2 2 0 0122 16.9z" />
        </svg>
        {phone}
      </a>
    </div>
  );
}

export default BranchCard;
