import React, { useState, useEffect } from 'react';
import Logo3D from './common/Logo3D';

export function Navbar({ onOpenMobileMenu, isMobileMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="siteHeader" data-testid="site-header" className={isScrolled ? 'scrolled' : ''}>
      <div className="wrap navrow">
        <Logo3D />

        <nav>
          <ul className="navlinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#materials">Materials</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <a href="#quote" className="nav-cta desktop" data-testid="navbar-get-quote">Get a Quote</a>

        <button
          className="burger"
          id="burgerBtn"
          data-testid="burger-btn"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          onClick={onOpenMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;

