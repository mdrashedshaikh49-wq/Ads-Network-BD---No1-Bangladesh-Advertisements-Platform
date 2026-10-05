import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header';
  inverted?: boolean;
  onClick?: () => void;
}

export default function BrandLogo({
  className = '',
  variant = 'full',
  size = 'md',
  inverted = false,
  onClick
}: BrandLogoProps) {
  // Height configurations
  const heightMap: Record<string, string> = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    header: 'h-12 sm:h-14 lg:h-16',
    lg: 'h-16 sm:h-20',
    xl: 'h-22 sm:h-28'
  };

  const navyColor = inverted ? '#F8FAFC' : '#0B1A30';
  const taglineColor = inverted ? '#94A3B8' : '#1E293B';
  const lineStroke = inverted ? '#94A3B8' : '#0B1A30';

  if (variant === 'icon') {
    return (
      <svg
        viewBox="5 30 240 180"
        className={`${heightMap[size] || 'h-10'} w-auto object-contain ${className} ${onClick ? 'cursor-pointer' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
      >
        <defs>
          <linearGradient id="anRedGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="anSwooshIcon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Dynamic Curved Red Swoosh Under A */}
        <path
          d="M 12 172 C 3 148 12 118 36 96 C 18 122 25 152 58 178 C 88 202 142 206 200 174 C 152 208 85 210 36 190 C 20 184 14 178 12 172 Z"
          fill="url(#anSwooshIcon)"
        />

        {/* Deep Navy 'A' Wing */}
        <path
          d="M 45 168 L 102 46 C 107 35 120 35 125 46 L 148 94 C 138 98 128 108 122 120 L 108 85 L 75 158 C 84 152 96 150 108 152 L 95 180 C 72 182 55 178 45 168 Z"
          fill={navyColor}
        />

        {/* Red Play Button inside 'A' triangle aperture */}
        <path
          d="M 94 102 C 94 98 98 95 102 98 L 134 116 C 137 118 137 122 134 124 L 102 142 C 98 145 94 142 94 138 Z"
          fill="url(#anRedGradIcon)"
        />

        {/* Vibrant Red 'N' Structure with Rounded Caps */}
        <path
          d="M 140 52 C 140 42 152 38 160 46 L 210 105 L 210 52 C 210 42 222 42 228 48 C 234 54 234 62 234 72 L 234 165 C 234 178 220 184 212 174 L 164 112 L 164 162 C 164 175 148 178 142 168 C 138 162 140 75 140 52 Z"
          fill="url(#anRedGradIcon)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="5 30 805 185"
      className={`${heightMap[size] || 'h-12 sm:h-14 lg:h-16'} w-auto object-contain ${className} ${onClick ? 'cursor-pointer' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <defs>
        <linearGradient id="anRedGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="anSwooshFull" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* ================= ICON MARK (AN) ================= */}
      <g transform="translate(10, 15)">
        {/* Dynamic Curved Red Swoosh Under A */}
        <path
          d="M 12 172 C 3 148 12 118 36 96 C 18 122 25 152 58 178 C 88 202 142 206 200 174 C 152 208 85 210 36 190 C 20 184 14 178 12 172 Z"
          fill="url(#anSwooshFull)"
        />

        {/* Deep Navy 'A' Wing */}
        <path
          d="M 45 168 L 102 46 C 107 35 120 35 125 46 L 148 94 C 138 98 128 108 122 120 L 108 85 L 75 158 C 84 152 96 150 108 152 L 95 180 C 72 182 55 178 45 168 Z"
          fill={navyColor}
        />

        {/* Red Play Button inside 'A' triangle */}
        <path
          d="M 94 102 C 94 98 98 95 102 98 L 134 116 C 137 118 137 122 134 124 L 102 142 C 98 145 94 142 94 138 Z"
          fill="url(#anRedGradFull)"
        />

        {/* Vibrant Red 'N' Structure with Rounded Terminals */}
        <path
          d="M 140 52 C 140 42 152 38 160 46 L 210 105 L 210 52 C 210 42 222 42 228 48 C 234 54 234 62 234 72 L 234 165 C 234 178 220 184 212 174 L 164 112 L 164 162 C 164 175 148 178 142 168 C 138 162 140 75 140 52 Z"
          fill="url(#anRedGradFull)"
        />
      </g>

      {/* ================= TYPOGRAPHY & BRANDING ================= */}
      <g transform="translate(280, 10)">
        {/* ROW 1: ADS NETWORK */}
        <text
          x="0"
          y="105"
          fontFamily="Montserrat, system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="68"
          letterSpacing="-1"
          fill={navyColor}
        >
          ADS
        </text>

        {/* NETW */}
        <text
          x="162"
          y="105"
          fontFamily="Montserrat, system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="68"
          letterSpacing="-0.5"
          fill="#DC2626"
        >
          NETW
        </text>

        {/* 'O' with Play button in NETWORK */}
        <g transform="translate(402, 78)">
          <circle cx="21" cy="0" r="23" fill="url(#anRedGradFull)" />
          <polygon points="16,-11 31,0 16,11" fill="#FFFFFF" />
        </g>

        {/* RK */}
        <text
          x="456"
          y="105"
          fontFamily="Montserrat, system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="68"
          letterSpacing="-0.5"
          fill="#DC2626"
        >
          RK
        </text>

        {/* ROW 2: — BANGLADESH — */}
        <g transform="translate(0, 146)">
          <line x1="0" y1="-8" x2="88" y2="-8" stroke={lineStroke} strokeWidth="3.5" strokeLinecap="round" />
          <text
            x="102"
            y="0"
            fontFamily="Montserrat, system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="28"
            letterSpacing="8"
            fill={navyColor}
          >
            BANGLADESH
          </text>
          <line x1="442" y1="-8" x2="530" y2="-8" stroke={lineStroke} strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* ROW 3: TAGLINE */}
        {variant === 'full' && (
          <text
            x="4"
            y="196"
            fontFamily="Montserrat, system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="16.5"
            letterSpacing="4.8"
            fill={taglineColor}
          >
            YOUR ADS  •  OUR NETWORK  •  BIGGER REACH
          </text>
        )}
      </g>
    </svg>
  );
}
