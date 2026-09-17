import React from 'react';

const CRAFT_ICONS = {
  carve: (
    <>
      <path d="M6 30 Q6 8 24 8 M6 30 h4 M24 8 v4" />
      <path d="M12 30c0-9 5-16 12-18" />
    </>
  ),
  door: (
    <>
      <rect x="8" y="4" width="22" height="30" rx="1" />
      <circle cx="24" cy="19" r="1.4" fill="currentColor" stroke="none" />
      <path d="M13 4v30M19 4v30M25 4v30" strokeDasharray="2 3" />
    </>
  ),
  stair: <path d="M6 32h6v-6h6v-6h6v-6h6v-6" />,
  panel: (
    <>
      <rect x="5" y="5" width="28" height="28" rx="1" />
      <path d="M19 5v28M5 19h28M12 12l14 14M26 12L12 26" strokeWidth="0.9" />
    </>
  ),
  layer: (
    <>
      <path d="M19 5 L33 12 L19 19 L5 12 Z" />
      <path d="M5 19l14 7 14-7M5 26l14 7 14-7" />
    </>
  ),
  grid: <path d="M5 5h10v10H5zM23 5h10v10H23zM5 23h10v10H5zM23 23h10v10H23z" />,
  ceiling: (
    <>
      <path d="M4 10h30l-6 6H10z" />
      <path d="M10 16v14M28 16v14M19 10v6" strokeDasharray="2 3" />
    </>
  ),
  gift: (
    <>
      <rect x="6" y="14" width="26" height="18" rx="1" />
      <path d="M6 20h26M19 14v18" />
      <path d="M19 14c-3-6-12-4-8 0c4 4-8 2-8 0M19 14c3-6 12-4 8 0c-4 4 8 2 8 0" strokeWidth="0.9" />
    </>
  ),
  sign: (
    <>
      <rect x="4" y="10" width="30" height="14" rx="1" />
      <path d="M19 24v8M13 32h12" />
    </>
  ),
  card: (
    <>
      <rect x="6" y="8" width="26" height="22" rx="1" />
      <path d="M6 8l13 11 13-11" strokeWidth="0.9" />
    </>
  ),
  cube: (
    <>
      <path d="M19 4 32 11 32 27 19 34 6 27 6 11 Z" />
      <path d="M6 11l13 7 13-7M19 18v16" strokeWidth="0.9" />
    </>
  ),
  pattern: (
    <>
      <circle cx="19" cy="19" r="15" />
      <circle cx="19" cy="19" r="8" />
      <path d="M19 4v6M19 28v6M4 19h6M28 19h6" />
    </>
  ),
};

export function Icon({ name, className = '', ...props }) {
  if (CRAFT_ICONS[name]) {
    return (
      <svg
        viewBox="0 0 38 38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        {...props}
      >
        {CRAFT_ICONS[name] || CRAFT_ICONS.pattern}
      </svg>
    );
  }

  // Fallback pattern if unknown craft icon
  return (
    <svg
      viewBox="0 0 38 38"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {CRAFT_ICONS.pattern}
    </svg>
  );
}

export default Icon;
