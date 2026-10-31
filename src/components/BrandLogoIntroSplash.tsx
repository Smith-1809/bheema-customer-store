import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import bheemaLogoCircle from '../assets/bheema-logo-circle.png';
import { Sparkles } from 'lucide-react';

interface BrandLogoIntroSplashProps {
  onComplete?: () => void;
}

export const BrandLogoIntroSplash: React.FC<BrandLogoIntroSplashProps> = ({ onComplete }) => {
  // Animation phases:
  // 1. 'center': Appears prominently in screen center with festive aura
  // 2. 'flying': Smoothly glides and scales directly into the top-left navbar logo
  // 3. 'done': Unmounts and hands over seamlessly to the navbar logo
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<'center' | 'flying' | 'done'>('center');
  const [flightTransform, setFlightTransform] = useState<{ dx: number; dy: number; scale: number }>({
    dx: 0,
    dy: 0,
    scale: 1,
  });

  const logoRef = useRef<HTMLDivElement>(null);
  const isSkippedRef = useRef<boolean>(false);

  // Complete helper
  const handleFinish = () => {
    if (isSkippedRef.current) return;
    isSkippedRef.current = true;
    setPhase('done');
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // Mount trigger for smooth entrance pop
    const mountRaf = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    // Stage 1: Hold in center for 750ms, then start flight to top-left
    const flightTimer = setTimeout(() => {
      if (isSkippedRef.current) return;

      const targetEl = document.getElementById('navbar-brand-logo');
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const startSize = Math.min(window.innerWidth * 0.52, 210);

      let targetX = 36;
      let targetY = 36;
      let targetSize = 44;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        targetSize = rect.width || 44;
      }

      const dx = targetX - startX;
      const dy = targetY - startY;
      const scale = targetSize / startSize;

      setFlightTransform({ dx, dy, scale });
      setPhase('flying');

      // Stage 2: When flight completes (at ~1.85s), trigger tiny celebratory sparkle & conclude
      setTimeout(() => {
        if (isSkippedRef.current) return;

        // Subtle festive sparkle burst right at the arrival point
        try {
          confetti({
            particleCount: 16,
            spread: 50,
            startVelocity: 14,
            origin: {
              x: Math.max(0.02, Math.min(0.25, targetX / window.innerWidth)),
              y: Math.max(0.02, Math.min(0.15, targetY / window.innerHeight)),
            },
            colors: ['#F59E0B', '#FBBF24', '#EA580C', '#FFFFFF'],
            ticks: 50,
            gravity: 1.2,
            shapes: ['circle'],
            scalar: 0.7,
            disableForReducedMotion: true,
          });
        } catch {}

        setTimeout(() => {
          handleFinish();
        }, 120);
      }, 1050);
    }, 750);

    return () => {
      clearTimeout(flightTimer);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  const isFlying = phase === 'flying';
  const logoSize = Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.52 : 210, 210);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 select-none ${
        isFlying ? 'bg-black/0 pointer-events-none' : 'bg-gradient-to-b from-[#180e03]/98 via-[#0f0902]/98 to-[#180e03]/98 backdrop-blur-md cursor-pointer'
      }`}
      aria-hidden="true"
    >
      {/* Background radial gold glow effect in center */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
          isFlying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Center Intro Text (Fades out when flight starts) */}
      <div
        className={`absolute bottom-[18vh] sm:bottom-[22vh] inset-x-4 text-center transition-all duration-300 pointer-events-none ${
          isFlying ? 'opacity-0 scale-95 translate-y-3' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black tracking-widest uppercase shadow-md mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Bheema Fireworks • Sivakasi</span>
        </div>
        <h2 className="text-white font-black text-2xl sm:text-3xl tracking-tight drop-shadow-lg">
          BRIGHTER MOMENTS TOGETHER
        </h2>
        <p className="text-amber-200/90 text-xs sm:text-sm font-semibold tracking-wide mt-1">
          Authentic Diwali Fireworks • Cash on Delivery
        </p>
      </div>

      {/* The Animated Circular Bheema Logo */}
      <div
        ref={logoRef}
        style={{
          width: `${logoSize}px`,
          height: `${logoSize}px`,
          transform: isFlying
            ? `translate(calc(-50% + ${flightTransform.dx}px), calc(-50% + ${flightTransform.dy}px)) scale(${flightTransform.scale})`
            : isMounted
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.85)',
          opacity: isMounted ? 1 : 0,
          transition: isFlying
            ? 'transform 1000ms cubic-bezier(0.2, 0.85, 0.25, 1), box-shadow 900ms ease-out'
            : 'transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease-out',
        }}
        className={`fixed top-1/2 left-1/2 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 border border-amber-300/90 shrink-0 ${
          isFlying
            ? 'shadow-md shadow-amber-500/30'
            : 'shadow-[0_0_50px_rgba(245,158,11,0.6),0_0_100px_rgba(234,88,12,0.35)]'
        }`}
      >
        <img
          src={bheemaLogoCircle}
          alt="Bheema Fireworks"
          className="w-full h-full object-contain rounded-full shadow-inner select-none pointer-events-none"
          loading="eager"
        />
      </div>
    </div>
  );
};
