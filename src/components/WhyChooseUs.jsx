import React from 'react';
import { WHY_ITEMS } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';

export function WhyChooseUs() {
  return (
    <section id="why" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">Why Choose Us</p>
          <AnimatedHeading as="h2">Craft, Backed by Technology</AnimatedHeading>
        </div>
        <div className="why-grid reveal" id="whyGrid">
          {WHY_ITEMS.map((item) => (
            <div key={item.num} className="why-cell">
              <div className="why-num">{item.num}</div>
              <h3>{item.num} — {item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
