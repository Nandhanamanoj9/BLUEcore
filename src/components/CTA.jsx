import React from 'react';
import JaliPattern from './common/JaliPattern';
import { CONTACT_INFO } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';

export function CTA() {
  return (
    <section className="cta-band">
      <div className="hero-pattern" id="ctaPattern">
        <JaliPattern id="jaliCta" opacity={0.3} />
      </div>
      <div className="wrap cta-inner reveal">
        <p className="label" style={{ justifyContent: 'center', color: 'var(--gold-light)' }}>
          <span style={{ borderColor: 'var(--gold-light)' }}></span>
          Have a Design in Mind?
        </p>
        <AnimatedHeading as="h2">Bring Your Idea, Sketch or Inspiration to Life</AnimatedHeading>
        <p style={{ marginBottom: '14px' }}>
          Share your reference, sketch, photograph or rough concept and we&apos;ll help shape it into a customized CNC cutting and decorative design solution.
        </p>
        <p style={{ marginBottom: '34px' }}>
          Whether you have a complete design or just an idea, BLU CORE can help turn it into a precise and beautifully crafted finished product.
        </p>
        <div className="hero-ctas">
          <a href="#quote" className="btn btn-gold">Request a Quote</a>
          <a
            id="ctaWhatsapp"
            data-testid="cta-whatsapp"
            href={CONTACT_INFO.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Talk to Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
