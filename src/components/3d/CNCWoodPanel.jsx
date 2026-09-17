import React, { useEffect, useRef, useState } from 'react';

/**
 * Checks if WebGL is available in the current browser environment.
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function CNCWoodPanel({ className = '' }) {
  const containerRef = useRef(null);
  const sceneInstanceRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. WebGL capability check
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    // 2. Reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    // 3. Asynchronously load and initialize 3D scene (keeps main bundle lightweight)
    import('./threeScene')
      .then(({ initThreeScene }) => {
        if (cancelled) return;
        sceneInstanceRef.current = initThreeScene(container, { prefersReducedMotion });
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('3D WebGL initialization failed, rendering architectural fallback:', err);
        setHasWebGL(false);
      });

    // 4. ResizeObserver for responsive canvas updates
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && sceneInstanceRef.current) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            sceneInstanceRef.current.resize(width, height);
          }
        }
      }
    });
    resizeObserver.observe(container);

    // 5. IntersectionObserver: Pause RAF rendering when hero is scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (sceneInstanceRef.current) {
            if (entry.isIntersecting) {
              sceneInstanceRef.current.resume();
            } else {
              sceneInstanceRef.current.pause();
            }
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.dispose();
        sceneInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`cnc-3d-wrapper ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        className={`cnc-3d-canvas-container ${isLoaded ? 'loaded' : 'loading'}`}
        aria-hidden="true"
      />

      {/* WebGL Graceful Fallback if WebGL unavailable */}
      {!hasWebGL && (
        <div className="cnc-3d-fallback" aria-hidden="true">
          <svg viewBox="0 0 360 480" className="cnc-fallback-svg">
            <rect
              x="10"
              y="10"
              width="340"
              height="460"
              rx="12"
              fill="#5C341B"
              stroke="#C79A5D"
              strokeWidth="2"
            />
            <path
              d="M180 180 L230 240 L180 300 L130 240 Z"
              fill="none"
              stroke="#C79A5D"
              strokeWidth="3"
            />
            <circle cx="180" cy="240" r="28" fill="none" stroke="#C79A5D" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* Tactile indicator badge */}
      <div className="cnc-3d-tag">
        <span className="cnc-tag-dot"></span>
        <span>Interactive CNC Relief Panel</span>
      </div>
    </div>
  );
}

export default CNCWoodPanel;
