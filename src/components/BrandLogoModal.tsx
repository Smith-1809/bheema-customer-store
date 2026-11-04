import React, { useEffect, useState } from 'react';
import bheemaLogoCirclePng from '../assets/bheema-logo-circle.png';
import bheemaLogoCircleWebp from '../assets/bheema-logo-circle.webp';
import { X, Sparkles, Download, Check, ShieldCheck, MessageCircle, Phone, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrandLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandLogoModal: React.FC<BrandLogoModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  // Keyboard shortcut (Escape to close) & background scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Celebration burst when viewing the brand logo
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#FBBF24', '#EA580C', '#10B981'],
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    } catch {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = bheemaLogoCirclePng || bheemaLogoCircleWebp;
    a.download = 'Bheema_Fireworks_Brand_Logo.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const whatsappUrl = `https://wa.me/919390068197?text=${encodeURIComponent(
    'Hi Bheema Fireworks! I am viewing your official brand store and would like to inquire about Diwali cracker orders.'
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bheema Fireworks Official Brand Logo"
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white border-2 border-amber-300 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-slate-900 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white border-b border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-100 text-orange-700 border border-orange-200">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                  BHEEMA FIREWORKS
                </h3>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10.5px] text-amber-800 font-semibold mt-0.5">
                Official Brand Seal &amp; Quality Mark
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-amber-100/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Close brand logo viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Showcase Area */}
        <div className="p-5 sm:p-6 text-center bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30">
          {/* Logo Frame with Aura Effect */}
          <div className="relative inline-block my-2">
            {/* Glowing Golden Aura Ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 opacity-60 blur-md animate-pulse"></div>

            {/* Logo Image */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-orange-500 border-2 border-amber-400 shadow-xl shadow-orange-500/20 overflow-hidden flex items-center justify-center bg-white mx-auto">
              <picture>
                <source srcSet={bheemaLogoCircleWebp} type="image/webp" />
                <img
                  src={bheemaLogoCirclePng}
                  alt="Bheema Fireworks Brand Logo"
                  className="w-full h-full object-contain rounded-full select-none transform hover:scale-105 transition-transform duration-300"
                />
              </picture>
            </div>

            {/* Sparkle Badges */}
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md border border-amber-300 text-amber-500 animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Brand Taglines */}
          <div className="mt-4 space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              భీమా ఫైర్‌వర్క్స్ • Bheema Fireworks
            </h4>
            <p className="text-xs font-bold text-orange-700">
              Direct Sivakasi Factory Crackers • Up to 90% OFF
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed pt-1">
              Serving Warangal &amp; NIT Gate with 100% genuine factory crackers, 1-2 hour express dispatch, and Cash on Delivery.
            </p>
          </div>

          {/* Trust Highlights Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-left">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="text-[10px] text-amber-800 font-bold block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Quality Assurance
              </span>
              <strong className="text-slate-800 text-[11px] block mt-0.5">Sivakasi Standard MRP</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="text-[10px] text-emerald-800 font-bold block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Express Delivery
              </span>
              <strong className="text-slate-800 text-[11px] block mt-0.5">1-2 Hr at NIT Gate</strong>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 bg-amber-50/60 border-t border-amber-200 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Logo Saved to Downloads!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Save / Download Logo</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
