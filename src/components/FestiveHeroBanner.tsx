import React from 'react';
import { Gift, ChevronRight, Truck, Clock, Sparkles } from 'lucide-react';
import crackerArt from '../assets/bheema-crackers-hero-4k.png';
import comboSmallImg from '../assets/combo-small-crackers.png';
import comboFamilyImg from '../assets/combo-family-crackers.png';
import varietyStripImg from '../assets/combo-variety-strip.png';

interface FestiveHeroBannerProps {
  onSelectCategory: (category: string) => void;
  onOpenComboModal: (bundleId: string) => void;
}

export const FestiveHeroBanner: React.FC<FestiveHeroBannerProps> = ({
  onSelectCategory,
  onOpenComboModal,
}) => {
  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setTimeout(() => {
      const el = document.getElementById('cracker-catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  return (
    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
      {/* ======================================================== */}
      {/* 1. DESKTOP VIEW (Kept exact as requested - Laptop/Desktop) */}
      {/* ======================================================== */}
      <div className="hidden sm:flex relative overflow-hidden rounded-3xl border border-amber-300/90 bg-gradient-to-r from-[#FFFDF7] via-[#FFF9ED] to-[#FFF1DA] shadow-xl shadow-amber-500/10 min-h-[330px] items-center">
        {/* Warm Ambient Festive Backlight Glows */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Right-Side 4K Cracker & Fireworks Artwork */}
        <div className="absolute right-0 top-0 bottom-0 w-[50%] lg:w-[47%] h-full pointer-events-none select-none flex items-center justify-end overflow-hidden">
          <img
            src={crackerArt}
            alt="Diwali Sivakasi Crackers"
            className="w-full h-full object-contain object-right opacity-100 filter drop-shadow-sm transition-all"
          />
        </div>

        {/* Left-Side Pure Vector & HTML/CSS Content (100% 4K Razor-Sharp) */}
        <div className="relative z-10 w-full sm:max-w-[70%] lg:max-w-[58%] p-7 md:p-8 space-y-4">
          {/* Headline */}
          <h2 className="text-3xl lg:text-[42px] font-black tracking-tight leading-[1.14] text-[#2B1204]">
            Light Up Your 2026 Diwali with{' '}
            <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 drop-shadow-[0_2px_10px_rgba(249,115,22,0.35)]">
              Bheema Fireworks
            </span>
          </h2>

          {/* Diya Flourish Divider */}
          <div className="flex items-center gap-2 max-w-xs opacity-75">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="text-xs text-amber-700 select-none">🪔</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>

          {/* Subtitle */}
          <p className="text-sm text-[#54361E] font-medium leading-relaxed max-w-lg">
            Order fresh, authentic Sivakasi crackers delivered straight to your doorstep. Enjoy{' '}
            <strong className="font-bold text-[#2B1204]">up to 90% festive discounts</strong> against Sivakasi MRP with{' '}
            <strong className="font-bold text-[#2B1204]">Cash on Delivery (COD)</strong>.
          </p>

          {/* 3 Native Pure HTML Trust Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {/* Cash on Delivery */}
            <div className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-200 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-black text-[#2B1204] truncate">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500 font-semibold block truncate">Pay when delivered</span>
              </div>
            </div>

            {/* 1 to 2 Hours */}
            <div className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-200 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-black text-[#2B1204] truncate">1 to 2 Hours</span>
                <span className="text-[10px] text-stone-500 font-semibold block truncate">Superfast dispatch</span>
              </div>
            </div>

            {/* Up to 90% OFF */}
            <div className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-200 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-rose-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-black text-[#2B1204] truncate">Up to 90% OFF</span>
                <span className="text-[10px] text-stone-500 font-semibold block truncate">Sivakasi Factory MRP</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => handleCategoryClick('All')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#2B1204] hover:bg-[#3D1A06] text-amber-300 font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-black/15 active:scale-95 transition-all cursor-pointer border border-amber-500/30"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore All Crackers</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => handleCategoryClick('Comet / Shot')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-base leading-none">🚀</span>
              <span>Explore Sky Shots</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleCategoryClick('FP')}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-amber-50/60 border-2 border-amber-300 text-[#2B1204] font-black text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-orange-600 text-base leading-none">✳️</span>
              <span>Sparkling Flower Pots</span>
              <ChevronRight className="w-4 h-4 text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE-FIRST VIEW (Compact, Clean, Professional)       */}
      {/* ======================================================== */}
      <div className="sm:hidden space-y-2">
        {/* Compact Festive Hero Card (Clean split: Copy on left, crisp visual on right) */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-300/90 bg-gradient-to-br from-[#FFFDF7] via-[#FFF8E7] to-[#FFEED2] p-3 shadow-md shadow-amber-500/10">
          <div className="flex items-center justify-between gap-2.5">
            {/* Left Content */}
            <div className="flex-1 min-w-0 space-y-1.5 py-0.5">
              <h2 className="text-base font-black tracking-tight leading-snug text-[#2B1204]">
                Light Up Your 2026 Diwali with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 drop-shadow-[0_2px_8px_rgba(249,115,22,0.35)] block font-black">
                  Bheema Fireworks
                </span>
              </h2>

              <p className="text-[10.5px] text-[#54361E] font-medium leading-tight">
                Authentic Sivakasi crackers delivered with <strong className="text-orange-800 font-bold">Cash on Delivery</strong>.
              </p>
            </div>

            {/* Right Crisp 4K Artwork (Vibrant in its own frame - never stretched or muddy) */}
            <div className="w-[36%] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/90 shadow-sm flex items-center justify-center">
              <img
                src={crackerArt}
                alt="Diwali Fireworks"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Single Row 3-Column Trust Perks Strip */}
          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-amber-200/80">
            <div className="p-1.5 rounded-xl bg-white/95 border border-amber-200/90 shadow-2xs flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                <Truck className="w-3 h-3 text-amber-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-black text-[#2B1204] leading-tight truncate">COD Ready</span>
                <span className="text-[8px] text-stone-500 font-semibold block leading-tight truncate">Doorstep</span>
              </div>
            </div>

            <div className="p-1.5 rounded-xl bg-white/95 border border-amber-200/90 shadow-2xs flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-orange-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-black text-[#2B1204] leading-tight truncate">1-2 Hours</span>
                <span className="text-[8px] text-stone-500 font-semibold block leading-tight truncate">Dispatch</span>
              </div>
            </div>

            <div className="p-1.5 rounded-xl bg-white/95 border border-amber-200/90 shadow-2xs flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-rose-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-[9.5px] font-black text-[#2B1204] leading-tight truncate">90% OFF</span>
                <span className="text-[8px] text-stone-500 font-semibold block leading-tight truncate">Factory MRP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons (Clean 3-Button Horizontal Grid) */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => handleCategoryClick('All')}
            className="py-2 px-1 rounded-xl bg-[#2B1204] active:scale-95 text-amber-300 font-black text-[10.5px] flex items-center justify-center gap-1 shadow-xs border border-amber-500/30 truncate"
          >
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">All Crackers</span>
          </button>

          <button
            onClick={() => handleCategoryClick('Comet / Shot')}
            className="py-2 px-1 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 active:scale-95 text-white font-black text-[10.5px] flex items-center justify-center gap-1 shadow-xs shadow-orange-500/20 truncate"
          >
            <span className="text-xs shrink-0">🚀</span>
            <span className="truncate">Sky Shots</span>
          </button>

          <button
            onClick={() => handleCategoryClick('FP')}
            className="py-2 px-1 rounded-xl bg-white active:scale-95 border border-amber-300 text-[#2B1204] font-black text-[10.5px] flex items-center justify-center gap-1 shadow-2xs truncate"
          >
            <span className="text-orange-600 text-xs shrink-0">✳️</span>
            <span className="truncate">Flower Pots</span>
          </button>
        </div>
      </div>

      {/* Featured Festive Combo Boxes Strip */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-2xs">
              COMBO OFFERS
            </h3>
            <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xs animate-pulse">
              🔥 MEGA SAVINGS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Small Combo */}
          <div
            onClick={() => onOpenComboModal('BUNDLE-SMALL-COMBO-10')}
            className="relative overflow-hidden rounded-2xl border border-amber-300/90 bg-gradient-to-br from-[#FFFDF7] via-[#FFF9ED] to-[#FFEECB] p-3.5 sm:p-4 shadow-sm hover:shadow-lg hover:shadow-orange-500/15 cursor-pointer transition-all duration-200 flex flex-col justify-between group active:scale-[0.99] min-h-[175px] sm:min-h-[185px]"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100/95 border border-amber-300 text-amber-950 font-black text-[9.5px] uppercase tracking-wide shadow-2xs">
                Budget Favorite
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-rose-600 bg-white/95 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-2xs">
                86% OFF
              </span>
            </div>

            {/* Right-Side Cracker Artwork (Small Combo) */}
            <div className="absolute right-0 top-0 bottom-0 w-[46%] sm:w-[48%] pointer-events-none select-none flex items-center justify-end overflow-hidden z-0">
              <img
                src={comboSmallImg}
                alt="Small Combo 10 Varieties"
                className="w-full h-full object-contain object-right drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 w-[60%] sm:w-[58%]">
              <h4 className="font-black text-sm sm:text-base text-[#1E1108] group-hover:text-orange-600 transition-colors leading-tight flex items-center gap-1">
                <span>SMALL COMBO</span>
                <span className="text-amber-800 text-xs sm:text-sm font-black">(10 Varieties)</span>
                <span className="text-orange-500 text-xs font-black select-none">⚡</span>
              </h4>

              {/* 6 Variety Icons Strip */}
              <div className="my-1.5 overflow-hidden">
                <img
                  src={varietyStripImg}
                  alt="Bijli, Color Pipes, Flower Pot, Ground Chakkar, Sparklers, Sky Shot"
                  className="w-full max-w-[270px] h-auto object-contain drop-shadow-2xs"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Bottom Pricing & Action */}
            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between gap-2 relative z-10">
              <div>
                <span className="text-[10px] text-stone-400 line-through font-semibold block leading-tight">MRP ₹8,120</span>
                <span className="font-black text-base sm:text-lg text-orange-600 leading-tight">
                  ₹1,160
                </span>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-white/95 group-hover:bg-orange-500 text-orange-700 group-hover:text-white font-black text-xs flex items-center gap-1 transition-all border border-orange-300 group-hover:border-orange-500 shadow-xs">
                <span>View & Add Combo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Family Pack */}
          <div
            onClick={() => onOpenComboModal('BUNDLE-DIWALI-FAMILY-18')}
            className="relative overflow-hidden rounded-2xl border border-rose-300/90 bg-gradient-to-br from-[#FFFDFD] via-[#FFF5F7] to-[#FFE7ED] p-3.5 sm:p-4 shadow-sm hover:shadow-lg hover:shadow-rose-500/15 cursor-pointer transition-all duration-200 flex flex-col justify-between group active:scale-[0.99] min-h-[175px] sm:min-h-[185px]"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100/95 border border-rose-300 text-rose-950 font-black text-[9.5px] uppercase tracking-wide shadow-2xs">
                Most Popular Pack
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-rose-600 bg-white/95 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-2xs">
                87% OFF
              </span>
            </div>

            {/* Right-Side Cracker Artwork (Family Pack) */}
            <div className="absolute right-0 top-0 bottom-0 w-[46%] sm:w-[48%] pointer-events-none select-none flex items-center justify-end overflow-hidden z-0">
              <img
                src={comboFamilyImg}
                alt="Diwali Family Pack 18 Varieties"
                className="w-full h-full object-contain object-right drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Left Content Area */}
            <div className="relative z-10 w-[60%] sm:w-[58%]">
              <h4 className="font-black text-sm sm:text-base text-[#1E1108] group-hover:text-rose-600 transition-colors leading-tight flex items-center gap-1">
                <span>Diwali Family Pack</span>
                <span className="text-rose-800 text-xs sm:text-sm font-black">(18 Varieties)</span>
                <span className="text-orange-500 text-xs font-black select-none">⚡</span>
              </h4>

              <p className="text-[10.5px] sm:text-[11px] text-[#54361E] font-medium leading-snug my-1.5 line-clamp-2">
                Complete family celebration with mega sound bombs, flower pots, GC & sky shots.
              </p>
            </div>

            {/* Bottom Pricing & Action */}
            <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between gap-2 relative z-10">
              <div>
                <span className="text-[10px] text-stone-400 line-through font-semibold block leading-tight">MRP ₹24,800</span>
                <span className="font-black text-base sm:text-lg text-rose-600 leading-tight">
                  ₹3,100
                </span>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-white/95 group-hover:bg-rose-500 text-rose-700 group-hover:text-white font-black text-xs flex items-center gap-1 transition-all border border-rose-300 group-hover:border-rose-500 shadow-xs">
                <span>View & Add Pack</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
