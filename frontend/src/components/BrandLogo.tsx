import React from 'react';

interface BrandLogoProps {
  size?: number;
  variant?: 'full' | 'mark' | 'horizontal';
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 32,
  variant = 'mark',
  light = false
}) => {
  const inkColor = light ? '#F5F2EB' : '#252E37';
  const terracottaColor = '#C16B4C';
  const sageColor = '#84917B';
  const scientificColor = light ? '#95CAD4' : '#174F5B';
  const mutedTextColor = light ? '#A4B1BC' : '#5C6773';
  const titleColor = light ? '#FFFFFF' : '#252E37';

  // Precision Scientific Aperture / Seasonal Mark
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-label="RutuDrishti AI Emblem"
    >
      {/* Precision Astrolabe / Seasonal Cycle Outer Ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke={light ? '#3A4856' : '#DBD5CC'}
        strokeWidth="1.5"
      />
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke={sageColor}
        strokeWidth="1.25"
        strokeDasharray="4 4"
        opacity="0.8"
      />

      {/* Cardinal Climate Nodes */}
      <circle cx="32" cy="4" r="2.5" fill={terracottaColor} />
      <circle cx="60" cy="32" r="2.5" fill={scientificColor} />
      <circle cx="32" cy="60" r="2.5" fill={sageColor} />
      <circle cx="4" cy="32" r="2.5" fill={inkColor} />

      {/* Geospatial Isobar / Agro-Elevation Curves */}
      <path
        d="M12 40C20 32 26 28 32 30C38 32 44 26 52 22"
        stroke={scientificColor}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M14 47C21 40 27 38 34 40C41 42 47 37 50 32"
        stroke={light ? '#78938E' : '#252E37'}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Drishti / Spatial Sight Geometric Prism */}
      <polygon
        points="32,18 46,32 32,46 18,32"
        stroke={terracottaColor}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="32" cy="32" r="4.5" fill={terracottaColor} />
      <circle cx="32" cy="32" r="2" fill="#FFFFFF" />
    </svg>
  );

  if (variant === 'mark') {
    return mark;
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {mark}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: `${Math.round(size * 0.46)}px`,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: titleColor,
              lineHeight: 1.1,
            }}
          >
            RutuDrishti
          </span>
          <span
            style={{
              fontSize: `${Math.max(9, Math.round(size * 0.26))}px`,
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '3px',
              backgroundColor: terracottaColor,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              fontFamily: "'IBM Plex Mono', monospace",
              lineHeight: 1.2,
            }}
          >
            AI
          </span>
        </div>
        <span
          style={{
            fontSize: `${Math.max(9, Math.round(size * 0.22))}px`,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 500,
            color: mutedTextColor,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}
        >
          Climate Intelligence Studio
        </span>
      </div>
    </div>
  );
};
