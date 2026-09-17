import React, { useEffect, useRef, useState } from 'react';

/**
 * Checks if WebGL is supported by the client browser.
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

export function CNCMachine3D({ className = '', customImage = '' }) {
  const containerRef = useRef(null);
  const sceneInstanceRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If a custom admin image is active, we don't need to spin up the WebGL engine
    if (customImage) return;

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

    // 3. Asynchronously load and initialize 3D scene
    import('./cncMachineScene')
      .then(({ initCNCMachineScene }) => {
        if (cancelled) return;
        sceneInstanceRef.current = initCNCMachineScene(container, { prefersReducedMotion });
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('3D WebGL CNC Machine initialization failed, rendering fallback:', err);
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

    // 5. IntersectionObserver: Pause RAF rendering when hero is scrolled out of view to save CPU/GPU
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

    // 6. Visibility change handling: only run when tab is active
    const handleVisibilityChange = () => {
      if (sceneInstanceRef.current) {
        if (document.hidden) {
          sceneInstanceRef.current.pause();
        } else {
          sceneInstanceRef.current.resume();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (sceneInstanceRef.current) {
        sceneInstanceRef.current.dispose();
        sceneInstanceRef.current = null;
      }
    };
  }, [customImage]);

  return (
    <div
      className={`cnc-3d-wrapper ${className}`}
      role="region"
      aria-label="Interactive 3D BLU CORE Industrial CNC Router Precision Machining Experience"
    >
      {customImage ? (
        <div className="cnc-custom-image-wrap" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
          <img
            src={customImage}
            alt="BLU CORE Industrial CNC Router"
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
          />
        </div>
      ) : (
        <>
          {/* 3D Canvas Mount Point */}
          <div
            ref={containerRef}
            className={`cnc-3d-canvas-container ${isLoaded ? 'loaded' : 'loading'}`}
            aria-hidden="true"
          />

          {/* WebGL Graceful Fallback if WebGL is unavailable */}
          {!hasWebGL && (
            <div className="cnc-3d-fallback" aria-hidden="true">
              <svg viewBox="0 0 480 360" className="cnc-fallback-svg">
                <rect x="20" y="80" width="440" height="200" rx="8" fill="#F3F5F8" stroke="#09529B" strokeWidth="4" />
                <rect x="50" y="140" width="380" height="110" rx="4" fill="#09529B" />
                <rect x="210" y="60" width="60" height="160" rx="4" fill="#E8ECF0" stroke="#24282D" strokeWidth="2" />
                <circle cx="240" cy="220" r="10" fill="#E86618" />
                <text x="240" y="275" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontFamily="sans-serif" fontWeight="bold">
                  BLU CORE • MTR 1325-H CNC ROUTER
                </text>
              </svg>
            </div>
          )}
        </>
      )}

      <div className="cnc-3d-tag" aria-hidden="true">
        <span className="cnc-tag-dot"></span>
        <span>{customImage ? 'High Precision CNC Router' : 'Interactive 3D Machine • Drag to Inspect'}</span>
      </div>
    </div>
  );
}

export default CNCMachine3D;

