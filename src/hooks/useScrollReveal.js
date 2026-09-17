import { useEffect } from 'react';

/**
 * Hook to apply intersection-observer-based reveal animations to any elements with the .reveal class.
 * Ensures each element animates in once (in class) and is unobserved.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.reveal:not(.in)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}

export default useScrollReveal;
