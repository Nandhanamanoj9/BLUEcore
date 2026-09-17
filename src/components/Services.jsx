import React from 'react';
import ServiceCard from './ServiceCard';
import { SERVICES } from '../data/siteData';
import AnimatedHeading from './common/AnimatedHeading';

export function Services() {
  return (
    <section id="services" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <div className="section-head reveal">
          <p className="label">What We Do</p>
          <AnimatedHeading as="h2">Seven crafts, one workshop</AnimatedHeading>
        </div>
      </div>
      <div className="wrap">
        <div className="svc-grid" id="svcGrid">
          {SERVICES.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
