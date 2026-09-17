import React from 'react';
import JaliPattern from './common/JaliPattern';
import CNCWoodPanel from './3d/CNCWoodPanel';
import CNCMachine3D from './3d/CNCMachine3D';
import AnimatedHeading from './common/AnimatedHeading';
import { useSiteImages } from '../context/SiteImagesContext';

export function Hero() {
  const { getSlotImage } = useSiteImages();
  const heroCncImage = getSlotImage('hero_cnc', '');

  return (
    <section className="hero" id="home" data-testid="hero-section">
      <div className="hero-pattern" id="heroPattern">
        <JaliPattern id="jaliHero" opacity={0.35} />
      </div>
      <div className="hero-fade"></div>
      <div className="wrap hero-inner">
        <div className="hero-content">
          <p className="hero-eyebrow">CNC Cutting &amp; Wall Panels</p>
          <AnimatedHeading as="h1" initialDelay={0.25} stagger={0.045}>
            Discover your finest home interior
          </AnimatedHeading>
          <p className="hero-sub">
            Precision-crafted CNC designs, wall panels and customized interior solutions that transform spaces into something truly unique.
          </p>
          <div className="hero-ctas">
            <a href="#quote" className="btn btn-gold" data-testid="hero-get-quote">Get a Free Quote</a>
            <a href="#gallery" className="btn btn-outline" data-testid="hero-explore-gallery">Explore Our Work</a>
          </div>
        </div>
        <div className="hero-3d-showcase">
          <CNCMachine3D customImage={heroCncImage} />
        </div>
      </div>

      <div className="scroll-cue">
        <span>SCROLL</span>
        <div className="line"></div>
      </div>
    </section>
  );
}

export default Hero;
