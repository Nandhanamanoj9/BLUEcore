import React from 'react';
import PlaceholderArt from './common/PlaceholderArt';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';

export function About() {
  const { getSlotImage } = useSiteImages();
  const aboutImage = getSlotImage('about_main', '/images/about/cnc-craftsmanship.jpg');

  return (
    <section id="about">
      <div className="wrap about-grid">
        <div className="about-copy reveal">
          <p className="label">About BLU CORE</p>
          <AnimatedHeading
            as="h2"
            style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 400, marginBottom: '22px' }}
          >
            Transforming Ideas Into Distinctive Spaces
          </AnimatedHeading>
          <p>
            At BLU CORE, we transform ideas into distinctive spaces through precision CNC cutting, creative craftsmanship and customized design solutions.
          </p>
          <p>
            From intricate wood carving and decorative wall panels to doors, ceilings, staircases and personalized products, we combine modern CNC technology with creative design to deliver solutions that make every space unique.
          </p>
          <div className="about-stats">
            <div>
              <h4>Precision Cutting</h4>
              <p>CNC-based accuracy on every piece.</p>
            </div>
            <div>
              <h4>Full Customization</h4>
              <p>Designed around your space and idea.</p>
            </div>
            <div>
              <h4>Multiple Materials</h4>
              <p>Wood, plywood, MDF, HDF, multiwood and WPC.</p>
            </div>
          </div>
        </div>
        <div className="placeholder reveal" id="aboutImg">
          <PlaceholderArt
            label="Add Photo — CNC craftsmanship"
            image={aboutImage}
            patternOpacity={0.55}
          />
        </div>
      </div>
    </section>
  );
}

export default About;
