import React, { useId } from 'react';

export function JaliPattern({ id: customId, opacity = 0.5, className = '', ...props }) {
  const generatedId = useId().replace(/:/g, '_');
  const patternId = customId || `jali_${generatedId}`;

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <pattern id={patternId} width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="none" />
          <path
            d="M32 4 L60 32 L32 60 L4 32 Z"
            fill="none"
            stroke="#C79A5D"
            strokeWidth="0.7"
            opacity={opacity}
          />
          <circle
            cx="32"
            cy="32"
            r="14"
            fill="none"
            stroke="#C79A5D"
            strokeWidth="0.6"
            opacity={opacity}
          />
          <path
            d="M32 18 L46 32 L32 46 L18 32 Z"
            fill="none"
            stroke="#C79A5D"
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default JaliPattern;
