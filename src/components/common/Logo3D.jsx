import React, { useState, useRef, useEffect } from 'react';

/**
 * BLU CORE — Official 3D Animated Logo
 *
 * Implements the exact design from the official BLU CORE reference logo:
 * - The interlocking wooden "BC" monogram (rich dark walnut "B" + warm golden teak "C")
 * - "BLU CORE" and "PANELS AND INTERIOR" official brand typography
 * - Compact architectural 3D presentation tailored cleanly for the navbar
 * - Continuous gentle 3D floating/breathing animation
 * - Interactive mouse parallax tilt and specular light sheen
 * - Full prefers-reduced-motion support and zero layout disruption
 */
export function Logo3D({ showSub = true, className = '' }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalized from -1 to 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Controlled 3D physical tilt (max ~8 degrees)
    setRotation({
      x: -normY * 8,
      y: normX * 10,
    });

    // Specular light sheen coordinates
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <a
      href="#home"
      className={`logo logo-3d-wrap ${className}`}
      aria-label="BLU CORE home"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: prefersReducedMotion
          ? 'none'
          : `perspective(600px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      {/* 3D Architectural Plaque holding the exact BC Monogram */}
      <div className="logo-3d-plaque" aria-hidden="true">
        {/* Ambient base shadow layer */}
        <div className="logo-plaque-shadow" />

        {/* The Exact Official BLU CORE BC Monogram Logo */}
        <div className="logo-plaque-inner">
          <img
            src="/images/logo/bc-monogram-card.png"
            alt="BLU CORE"
            className="logo-plaque-img"
            loading="eager"
          />

          {/* Dynamic Specular Light Glare */}
          {!prefersReducedMotion && (
            <div
              className="logo-3d-glare"
              style={{
                background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255, 255, 255, ${sheen.opacity}) 0%, rgba(255, 240, 220, ${sheen.opacity * 0.5}) 35%, transparent 70%)`,
              }}
            />
          )}

          {/* Continuous subtle diagonal shimmer sheen */}
          {!prefersReducedMotion && <div className="logo-3d-shimmer-sweep" />}
        </div>
      </div>

      {/* Brand Typography matching official logo */}
      <span className="logo-text-group">
        <span className="logo-text">BLU CORE</span>
        {showSub && (
          <span className="logo-sub">PANELS AND INTERIOR</span>
        )}
      </span>
    </a>
  );
}

export default Logo3D;
