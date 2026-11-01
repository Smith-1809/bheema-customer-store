import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import bheemaLogoWebp from '../assets/bheema-logo-circle.webp';
import { Sparkles } from 'lucide-react';

interface BrandLogoIntroSplashProps {
  onComplete?: () => void;
}

export const BrandLogoIntroSplash: React.FC<BrandLogoIntroSplashProps> = ({ onComplete }) => {
  // Animation phases:
  // 1. 'waiting': Preloading & decoding the lightweight WebP logo
  // 2. 'center': Appears prominently in screen center with festive aura for 750ms
  // 3. 'flying': Smoothly glides and scales directly into the top-left navbar logo
  // 4. 'done': Unmounts and hands over seamlessly to the navbar logo
  const [phase, setPhase] = useState<'waiting' | 'center' | 'flying' | 'done'>('waiting');
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
    let flightTimeoutId: any = null;
    let finishTimeoutId: any = null;

    // Start the flight animation sequence ONLY AFTER the image is confirmed loaded/decoded in browser
    const startSequence = () => {
      if (isSkippedRef.current) return;
      setPhase('center');

      // Hold in center for 750ms with rich gold aura, then initiate flight
      flightTimeoutId = setTimeout(() => {
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

        // When flight completes (at ~1.85s total), trigger subtle celebration sparkle & conclude
        finishTimeoutId = setTimeout(() => {
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
        }, 1000);
      }, 750);
    };

    // Preload image in memory to guarantee immediate visual display without blank frames
    const preloader = new Image();
    preloader.src = bheemaLogoWebp;

    if (preloader.complete) {
      startSequence();
    } else {
      preloader.onload = () => startSequence();
      preloader.onerror = () => startSequence();
      // Safety fallback: if network stalls, start after 900ms anyway
      const safetyFallback = setTimeout(() => {
        startSequence();
      }, 900);

      return () => {
        clearTimeout(safetyFallback);
        clearTimeout(flightTimeoutId);
        clearTimeout(finishTimeoutId);
      };
    }

    return () => {
      clearTimeout(flightTimeoutId);
      clearTimeout(finishTimeoutId);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  const isFlying = phase === 'flying';
  const isVisible = phase === 'center' || phase === 'flying';
  const logoSize = Math.min(typeof window !== 'undefined' ? window.innerWidth * 0.52 : 210, 210);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 select-none ${
        isFlying 
          ? 'bg-black/0 pointer-events-none' 
          : isVisible
            ? 'bg-gradient-to-b from-[#180e03]/98 via-[#0f0902]/98 to-[#180e03]/98 backdrop-blur-md cursor-pointer'
            : 'bg-gradient-to-b from-[#180e03]/98 via-[#0f0902]/98 to-[#180e03]/98 opacity-90'
      }`}
      aria-hidden="true"
    >
      {/* Background radial gold glow effect in center */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
          isFlying ? 'opacity-0' : isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Center Intro Text (Fades out when flight starts) */}
      <div
        className={`absolute bottom-[18vh] sm:bottom-[22vh] inset-x-4 text-center transition-all duration-300 pointer-events-none ${
          isFlying ? 'opacity-0 scale-95 translate-y-3' : isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95'
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
            : isVisible
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.85)',
          opacity: isVisible ? 1 : 0,
          transition: isFlying
            ? 'transform 1000ms cubic-bezier(0.2, 0.85, 0.25, 1), box-shadow 900ms ease-out'
            : 'transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out',
        }}
        className={`fixed top-1/2 left-1/2 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 border border-amber-300/90 shrink-0 ${
          isFlying
            ? 'shadow-md shadow-amber-500/30'
            : 'shadow-[0_0_50px_rgba(245,158,11,0.6),0_0_100px_rgba(234,88,12,0.35)]'
        }`}
      >
        <img
          src={bheemaLogoWebp}
          alt="Bheema Fireworks"
          className="w-full h-full object-contain rounded-full shadow-inner select-none pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
};
