import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { SiteImagesProvider } from './context/SiteImagesContext';

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname === '/admin' || window.location.hash === '#admin');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigateToSite = () => {
    if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
  };

  return (
    <SiteImagesProvider>
      {isAdminRoute ? (
        <Admin onBackToSite={navigateToSite} />
      ) : (
        <div className="app-container">
          <Navbar
            onOpenMobileMenu={handleOpenMobileMenu}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={handleCloseMobileMenu}
          />
          <Home />
        </div>
      )}
    </SiteImagesProvider>
  );
}

export default App;

