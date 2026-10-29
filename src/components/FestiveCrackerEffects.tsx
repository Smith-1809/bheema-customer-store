import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

/**
 * Festive Diwali Cracker Effects:
 * 1. Side Margin Crackle Sparklers (Stationed on outer left & right gutters)
 * 2. Ambient Golden Embers drifting gently in the background
 * 3. Interactive Sparkler Burst on tap / click
 * 
 * Strict pointer-events-none: Never interferes with items, taps, or scrolling.
 */
export const FestiveCrackerEffects: React.FC = () => {
  const [clickSparks, setClickSparks] = useState<Particle[]>([]);

  // Interactive sparkler pop on touch / click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      // Find client coordinates
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      if (clientX === 0 && clientY === 0) return;

      const colors = ['#F59E0B', '#EA580C', '#DC2626', '#FBBF24', '#F43F5E', '#FEF08A'];
      const newSparks: Particle[] = [];
      const count = 10;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
        const speed = Math.random() * 45 + 25;
        newSparks.push({
          id: Date.now() + Math.random(),
          x: clientX,
          y: clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
        });
      }

      setClickSparks((prev) => [...prev.slice(-20), ...newSparks]);

      setTimeout(() => {
        setClickSparks((prev) => prev.filter((p) => !newSparks.includes(p)));
      }, 550);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* 1. LEFT SIDE MARGIN SPARKLE FOUNTAIN */}
      <div className="hidden lg:block absolute left-2 xl:left-6 top-1/4 -translate-y-1/2 w-28 h-80 pointer-events-none opacity-85">
        {/* Glowing Diya Base */}
        <div className="absolute bottom-2 left-6 text-amber-500 animate-pulse text-2xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
          🪔
        </div>
        {/* Crackle Spark Fountains */}
        <div className="relative w-full h-full">
          {[...Array(9)].map((_, i) => (
            <span
              key={`left-spark-${i}`}
              className="absolute rounded-full bg-gradient-to-t from-amber-400 via-orange-400 to-rose-400 animate-side-spark"
              style={{
                left: `${35 + (i % 3) * 12}px`,
                bottom: `${20 + i * 4}px`,
                width: `${i % 2 === 0 ? 4 : 3}px`,
                height: `${i % 2 === 0 ? 10 : 7}px`,
                animationDelay: `${i * 0.28}s`,
                animationDuration: `${1.4 + (i % 3) * 0.3}s`,
                filter: 'drop-shadow(0 0 4px #F59E0B)',
              }}
            />
          ))}
          {/* Subtle Star Burst */}
          <span className="absolute top-12 left-10 text-amber-500/80 text-xs animate-ping" style={{ animationDuration: '2.5s' }}>
            ✨
          </span>
          <span className="absolute top-28 left-4 text-orange-500/70 text-sm animate-pulse" style={{ animationDuration: '2s' }}>
            💥
          </span>
        </div>
      </div>

      {/* 2. RIGHT SIDE MARGIN SPARKLE FOUNTAIN */}
      <div className="hidden lg:block absolute right-2 xl:right-6 top-1/4 -translate-y-1/2 w-28 h-80 pointer-events-none opacity-85">
        {/* Glowing Diya Base */}
        <div className="absolute bottom-2 right-6 text-amber-500 animate-pulse text-2xl filter drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">
          🪔
        </div>
        {/* Crackle Spark Fountains */}
        <div className="relative w-full h-full">
          {[...Array(9)].map((_, i) => (
            <span
              key={`right-spark-${i}`}
              className="absolute rounded-full bg-gradient-to-t from-amber-400 via-orange-400 to-rose-400 animate-side-spark-right"
              style={{
                right: `${35 + (i % 3) * 12}px`,
                bottom: `${20 + i * 4}px`,
                width: `${i % 2 === 0 ? 4 : 3}px`,
                height: `${i % 2 === 0 ? 10 : 7}px`,
                animationDelay: `${i * 0.32}s`,
                animationDuration: `${1.5 + (i % 3) * 0.3}s`,
                filter: 'drop-shadow(0 0 4px #F59E0B)',
              }}
            />
          ))}
          <span className="absolute top-12 right-10 text-amber-500/80 text-xs animate-ping" style={{ animationDuration: '3s' }}>
            ✨
          </span>
          <span className="absolute top-32 right-4 text-rose-500/70 text-sm animate-pulse" style={{ animationDuration: '1.8s' }}>
            💥
          </span>
        </div>
      </div>

      {/* 3. AMBIENT FLOATING GOLDEN FESTIVE EMBERS (Entire page subtle drift) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
        {[...Array(14)].map((_, i) => (
          <span
            key={`ember-${i}`}
            className="absolute rounded-full animate-float-ember"
            style={{
              left: `${(i * 7.5 + 3) % 96}%`,
              top: `${(i * 13 + 8) % 92}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              backgroundColor: i % 2 === 0 ? '#F59E0B' : '#EA580C',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.8)',
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${4 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* 4. CLICK/TAP SPARK BURST POP */}
      {clickSparks.map((spark) => (
        <span
          key={spark.id}
          className="absolute rounded-full transition-transform duration-500 ease-out"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            backgroundColor: spark.color,
            boxShadow: `0 0 8px ${spark.color}`,
            transform: `translate(${spark.vx}px, ${spark.vy}px) scale(0)`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};
