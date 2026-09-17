import React, { useEffect } from 'react';

export function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`} id="mobileMenu" data-testid="mobile-menu">
      <div className="navrow">
        <a href="#home" className="logo" onClick={handleLinkClick}>
          <span className="logo-text">BLU CORE</span>
        </a>
        <button
          className="close-x"
          id="closeMenuBtn"
          data-testid="mobile-menu-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <ul>
        <li><a href="#home" onClick={handleLinkClick}>Home</a></li>
        <li><a href="#about" onClick={handleLinkClick}>About</a></li>
        <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
        <li><a href="#gallery" onClick={handleLinkClick}>Gallery</a></li>
        <li><a href="#materials" onClick={handleLinkClick}>Materials</a></li>
        <li><a href="#projects" onClick={handleLinkClick}>Projects</a></li>
        <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>
      </ul>
      <a href="#quote" className="btn btn-gold nav-cta" data-testid="mobile-menu-quote" onClick={handleLinkClick}>
        Get a Quote
      </a>
    </div>
  );
}

export default MobileMenu;
