import React from 'react';

interface VenusSkyShotProps {
  className?: string;
  delay?: number; // delay in seconds
  scale?: number;
}

// 12 Radiant Multi-Color Venus Sky Shot Rays radiating in 360 degrees
const VENUS_RAYS = [
  { angle: 0, r: 68, color: '#DC2626' },    // Ruby Red
  { angle: 30, r: 56, color: '#F59E0B' },   // Sivakasi Gold
  { angle: 60, r: 74, color: '#10B981' },   // Emerald Green
  { angle: 90, r: 60, color: '#06B6D4' },   // Sky Cyan
  { angle: 120, r: 70, color: '#F97316' },  // Sunset Orange
  { angle: 150, r: 58, color: '#EC4899' },  // Hot Magenta
  { angle: 180, r: 72, color: '#8B5CF6' },  // Royal Violet
  { angle: 210, r: 60, color: '#EAB308' },  // Bright Yellow
  { angle: 240, r: 68, color: '#3B82F6' },  // Electric Blue
  { angle: 270, r: 62, color: '#14B8A6' },  // Mint Spark
  { angle: 300, r: 76, color: '#F43F5E' },  // Rose Red
  { angle: 330, r: 64, color: '#FFFFFF' },  // Diamond White
];

export const VenusSkyShotEffect: React.FC<VenusSkyShotProps> = ({
  className = '',
  delay = 0,
  scale = 1,
}) => {
  return (
    <div
      className={`absolute pointer-events-none select-none z-0 ${className}`}
      style={{
        transform: `scale(${scale})`,
      }}
    >
      {/* 1. ASCENDING ROCKET TRAIL (Rises up before cracking) */}
      <div
        className="absolute -bottom-10 left-0 -translate-x-1/2 flex flex-col items-center animate-skyshot-rocket"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF,0_0_16px_#F59E0B]" />
        <div className="w-0.5 h-10 bg-gradient-to-b from-amber-300 via-orange-500 to-transparent opacity-90" />
      </div>

      {/* 2. CORE STARBURST FLASH AT CRACK POINT */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white animate-skyshot-flash"
        style={{ animationDelay: `${delay}s` }}
      />

      {/* 3. EXPANDING SHOCKWAVE RING */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-amber-300/80 animate-skyshot-ring"
        style={{ animationDelay: `${delay}s` }}
      />

      {/* 4. MULTI-COLOR VENUS SKY SHOT SPREAD (Spreads all colors in 360°) */}
      <svg
        className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none overflow-visible animate-skyshot-burst"
        viewBox="-100 -100 200 200"
        style={{ animationDelay: `${delay}s` }}
      >
        {VENUS_RAYS.map((ray, idx) => {
          const rad = (ray.angle * Math.PI) / 180;
          const x2 = Math.round(Math.cos(rad) * ray.r);
          const y2 = Math.round(Math.sin(rad) * ray.r);
          const xMid = Math.round(x2 * 0.38);
          const yMid = Math.round(y2 * 0.38);

          return (
            <g key={idx}>
              {/* Luminous Spark Trail Ray */}
              <line
                x1={xMid}
                y1={yMid}
                x2={x2}
                y2={y2}
                stroke={ray.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.95"
                style={{ filter: `drop-shadow(0 0 4px ${ray.color})` }}
              />

              {/* Glowing Outer Star Particle */}
              <circle
                cx={x2}
                cy={y2}
                r="3.5"
                fill={ray.color}
                stroke="#FFFFFF"
                strokeWidth="1"
                style={{ filter: `drop-shadow(0 0 6px ${ray.color}) drop-shadow(0 0 10px ${ray.color})` }}
              />

              {/* Sparkle Glint at alternating rays */}
              {idx % 2 === 0 && (
                <text
                  x={x2 + 2}
                  y={y2 - 2}
                  fill="#FFFBEB"
                  fontSize="8"
                  fontWeight="bold"
                  className="select-none font-serif"
                >
                  ✦
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
