import React from 'react';
import { CONTACT_INFO } from '../data/siteData';
import Logo3D from './common/Logo3D';

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo3D className="foot-logo-3d" />
            <p style={{ marginTop: '18px' }}>
              Customized CNC cutting, wall panels and decorative design solutions for homes and commercial spaces.
            </p>
          </div>

          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Wood Carving</a></li>
              <li><a href="#services">Door Design</a></li>
              <li><a href="#services">Wall Panels</a></li>
              <li><a href="#services">3D Panels</a></li>
              <li><a href="#services">Ceiling Design</a></li>
              <li><a href="#services">CNC Cutting</a></li>
            </ul>
          </div>

          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
              <li>
                <a href={CONTACT_INFO.website} target="_blank" rel="noopener noreferrer">
                  {CONTACT_INFO.websiteDisplay}
                </a>
              </li>
              <li><a href="tel:+919400544477">Kanhangad — +91 9400 544 477</a></li>
              <li><a href="tel:+919747544477">Palakkunnu — +91 9747 544 477</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>&copy; BLU CORE. All Rights Reserved.</span>
          <span>
            CNC Cutting &middot; Wall Panels &middot; Interior Design &middot;{' '}
            <a href="#admin" style={{ color: '#C49A5A', textDecoration: 'none', opacity: 0.85 }}>Portal Admin</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
