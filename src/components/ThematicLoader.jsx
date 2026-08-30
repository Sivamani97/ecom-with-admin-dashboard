import React from 'react';

export const ThematicLoader = ({ text = 'Loading Aruna Products...' }) => {
  return (
    <div className="thematic-loader-wrap" role="status" aria-live="polite">
      {/* Thematic Spinning 3-Blade Ceiling Fan with Center Motor */}
      <svg
        className="thematic-fan-spinner"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="14" fill="#1d4ed8" />
        <circle cx="50" cy="50" r="6" fill="#fbbf24" />
        
        {/* Blade 1 */}
        <path
          d="M50 36 C46 22 42 8 50 2 C58 8 54 22 50 36 Z"
          fill="#3b82f6"
          opacity="0.9"
        />
        {/* Blade 2 */}
        <path
          d="M62 57 C74 64 86 71 89 63 C85 54 73 50 62 57 Z"
          fill="#3b82f6"
          opacity="0.9"
        />
        {/* Blade 3 */}
        <path
          d="M38 57 C26 64 14 71 11 63 C15 54 27 50 38 57 Z"
          fill="#3b82f6"
          opacity="0.9"
        />
      </svg>
      <span className="loader-text">{text}</span>
    </div>
  );
};
