import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Showcase from '../components/Showcase';
import Materials from '../components/Materials';
import Gallery from '../components/Gallery';
import WhyChooseUs from '../components/WhyChooseUs';
import Applications from '../components/Applications';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingActions from '../components/FloatingActions';
import useScrollReveal from '../hooks/useScrollReveal';

export function Home() {
  useScrollReveal();

  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Showcase />
      <Materials />
      <Gallery />
      <WhyChooseUs />
      <Applications />
      <CTA />
      <Contact />
      <Footer />
      <FloatingActions />
    </main>
  );
}

export default Home;
