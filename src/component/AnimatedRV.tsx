import React from 'react';

const AnimatedRV: React.FC = () => (
  <svg width="100%" height="300" viewBox="0 0 1000 300">
    <defs>
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f0f0f0" />
      </linearGradient>
    </defs>
    <g id="rv">
      {/* Hauptkörper */}
      <rect x="20" y="90" width="260" height="80" fill="url(#bodyGradient)" rx="10" />
      {/* Fahrerkabine */}
      <path d="M20 170 L20 110 Q20 90 40 90 L80 90 L80 110 L20 110" fill="#e6e6e6" />
      {/* Fenster */}
      <rect x="30" y="100" width="40" height="25" fill="#87CEEB" rx="5" />
      <rect x="100" y="100" width="40" height="25" fill="#87CEEB" rx="5" />
      <rect x="160" y="100" width="40" height="25" fill="#87CEEB" rx="5" />
      <rect x="220" y="100" width="40" height="25" fill="#87CEEB" rx="5" />
      {/* Räder */}
      <circle cx="60" cy="180" r="15" fill="#333" />
      <circle cx="240" cy="180" r="15" fill="#333" />
      {/* Details */}
      <rect x="265" y="110" width="15" height="10" fill="#ff0000" /> {/* Rücklicht */}
      <rect x="15" y="110" width="10" height="10" fill="#ffff00" /> {/* Frontlicht */}
      {/* Dekorative Linien */}
      <path d="M20 130 L280 130" stroke="#cccccc" strokeWidth="2" />
      <path d="M20 150 L280 150" stroke="#cccccc" strokeWidth="2" />
    </g>
    <style>{`
      @keyframes drive {
        0% { transform: translateX(-300px); }
        100% { transform: translateX(1000px); }
      }
      #rv {
        animation: drive 1s linear infinite;
      }
    `}</style>
  </svg>
);

export default AnimatedRV;