import React from 'react';
import BranchCard from './BranchCard';
import QuoteForm from './QuoteForm';
import { BRANCHES, CONTACT_INFO } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';

export function Contact() {
  return (
    <section id="contact" data-testid="contact-section">
      <div className="wrap contact-grid">
        <div className="reveal">
          <p className="label">Contact</p>
          <AnimatedHeading
            as="h2"
            style={{ fontSize: '34px', fontWeight: 400, marginBottom: '10px' }}
          >
            Visit a Branch Near You
          </AnimatedHeading>
          <p style={{ color: 'var(--ink-soft)', fontSize: '15px', maxWidth: '46ch', marginTop: '14px' }}>
            Four branches across Kerala&apos;s Kasaragod belt — reach out directly, or send your requirements through the quote form.
          </p>

          <div className="branch-grid" id="branchGrid">
            {BRANCHES.map((branch) => (
              <BranchCard key={branch.name} branch={branch} />
            ))}
          </div>

          <div className="contact-direct">
            <a href={`mailto:${CONTACT_INFO.email}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 6h18v12H3z" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              {CONTACT_INFO.email}
            </a>
            <a href={CONTACT_INFO.website} target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z" />
              </svg>
              {CONTACT_INFO.websiteDisplay}
            </a>
          </div>
        </div>

        <QuoteForm />
      </div>
    </section>
  );
}

export default Contact;
