import React from 'react';
import { CONTACT_INFO } from '../data/siteData';

export function FloatingActions() {
  return (
    <div className="fab-group">
      <a
        className="fab wa"
        id="fabWhatsapp"
        data-testid="fab-whatsapp"
        href={CONTACT_INFO.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.15l-.3-.18-3.1.95.95-3.02-.2-.31A8.2 8.2 0 1112 20.2zm4.6-6.1c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.98-.15.17-.29.19-.55.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.42 1.02 2.59c.13.17 1.75 2.68 4.25 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29z" />
        </svg>
      </a>
      <a
        className="fab call"
        id="fabCall"
        data-testid="fab-call"
        href={`tel:${CONTACT_INFO.primaryTel}`}
        aria-label="Call BLU CORE"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.12.9.33 1.8.62 2.7a2 2 0 01-.45 2.1L8.1 9.6a16 16 0 006.3 6.3l1.1-1.1a2 2 0 012.1-.45c.9.29 1.8.5 2.7.62A2 2 0 0122 16.9z" />
        </svg>
      </a>
    </div>
  );
}

export default FloatingActions;
