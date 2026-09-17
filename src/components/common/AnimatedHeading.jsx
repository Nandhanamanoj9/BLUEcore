import React, { useRef, useState, useEffect, useMemo } from 'react';

/**
 * AnimatedHeading splits a text string into words and individual characters.
 * Each word is wrapped in an inline-block container with `white-space: nowrap`
 * so line breaks ONLY occur between words (maintaining natural responsive line wrapping).
 *
 * Characters animate in sequentially using CSS transitions on opacity, transform, and filter.
 * The animation triggers once via IntersectionObserver when entering the viewport.
 * Screen readers receive the full, undisturbed text naturally.
 */
export function AnimatedHeading({
  as: Tag = 'h2',
  children,
  className = '',
  style = {},
  initialDelay = 0.12,
  stagger = 0.04,
  threshold = 0.15,
  ...props
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  // Extract raw text from children
  const rawText = useMemo(() => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children
        .map((c) => (typeof c === 'string' ? c : ''))
        .join('');
    }
    return String(children || '');
  }, [children]);

  // Check prefers-reduced-motion and observe intersection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Split into words, preserving spaces
  const wordsData = useMemo(() => {
    const words = rawText.split(' ');
    let globalCharIndex = 0;

    return words.map((word) => {
      const chars = Array.from(word).map((char) => {
        const index = globalCharIndex++;
        return { char, index };
      });
      return { word, chars };
    });
  }, [rawText]);

  return (
    <Tag
      ref={ref}
      className={`animated-heading ${revealed ? 'is-revealed' : ''} ${className}`}
      style={style}
      aria-label={rawText}
      {...props}
    >
      <span className="heading-words-wrap">
        {wordsData.map((item, wIdx) => (
          <React.Fragment key={wIdx}>
            <span className="heading-word">
              {item.chars.map(({ char, index }) => {
                const delay = initialDelay + index * stagger;
                return (
                  <span
                    key={index}
                    className="heading-char"
                    style={{
                      transitionDelay: `${delay}s`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wIdx < wordsData.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}

export default AnimatedHeading;
