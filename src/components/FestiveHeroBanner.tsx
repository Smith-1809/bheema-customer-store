import React from 'react';
import { Gift, ChevronRight, Truck, Clock, Sparkles } from 'lucide-react';
import crackerArt from '../assets/bheema-crackers-hero-4k.png';

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
    <div className="space-y-4 mb-6">
      {/* Native 4K Ultra-Crisp Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/90 bg-gradient-to-r from-[#FFFDF7] via-[#FFF9ED] to-[#FFF1DA] shadow-xl shadow-amber-500/10 min-h-[330px] flex items-center">
        {/* Warm Ambient Festive Backlight Glows */}
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Right-Side 4K Cracker & Fireworks Artwork */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[50%] lg:w-[47%] h-full pointer-events-none select-none flex items-center justify-end overflow-hidden">
          <img
            src={crackerArt}
            alt="Diwali Sivakasi Crackers"
            className="w-full h-full object-cover sm:object-contain object-right opacity-30 sm:opacity-100 filter drop-shadow-sm transition-all"
          />
        </div>

        {/* Left-Side Pure Vector & HTML/CSS Content (100% 4K Razor-Sharp) */}
        <div className="relative z-10 w-full sm:max-w-[70%] lg:max-w-[58%] p-5 sm:p-7 md:p-8 space-y-3.5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300/90 text-amber-950 text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
            <span className="text-orange-600 font-black">✳</span>
            <span>Diwali 2026 Celebration Direct Delivery</span>
            <span className="text-amber-500 font-bold">⸺</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-[#2B1204]">
            Light Up Your Diwali with{' '}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 drop-shadow-xs">
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
          <p className="text-xs sm:text-sm text-[#54361E] font-medium leading-relaxed max-w-lg">
            Order fresh, authentic Sivakasi crackers delivered straight to your doorstep. Enjoy{' '}
            <strong className="font-bold text-[#2B1204]">up to 90% festive discounts</strong> against Sivakasi MRP with{' '}
            <strong className="font-bold text-[#2B1204]">Cash on Delivery (COD)</strong>.
          </p>

          {/* 3 Native Pure HTML Trust Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
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

      {/* Featured Festive Combo Boxes Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-orange-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Bestselling Festive Combos (Ready to Dispatch)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full border border-orange-200">
            1-Click All-in-One Packs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Small Combo */}
          <div
            onClick={() => onOpenComboModal('BUNDLE-SMALL-COMBO-10')}
            className="p-4 rounded-2xl bg-white border border-amber-200 hover:border-orange-400 shadow-sm hover:shadow-md hover:shadow-orange-500/10 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase tracking-wide">
                  Budget Favorite
                </span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  86% OFF
                </span>
              </div>

              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-orange-600 transition-colors mb-1">
                SMALL COMBO (10 Varieties)
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                Bijili, color pipes, flower pot, ground chakkar, sparklers & sky shot.
              </p>
            </div>

            <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 line-through block">MRP ₹8,120</span>
                <span className="font-black text-base sm:text-lg text-orange-600">
                  ₹1,160
                </span>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-orange-50 group-hover:bg-orange-500 text-orange-700 group-hover:text-white font-black text-xs flex items-center gap-1 transition-colors border border-orange-200 group-hover:border-orange-500">
                <span>View & Add Combo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Family Pack */}
          <div
            onClick={() => onOpenComboModal('BUNDLE-DIWALI-FAMILY-18')}
            className="p-4 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-sm hover:shadow-md hover:shadow-rose-500/10 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase tracking-wide">
                  Most Popular Pack
                </span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  87% OFF
                </span>
              </div>

              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition-colors mb-1">
                Diwali Family Pack (18 Varieties)
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                Complete family celebration with mega sound bombs, flower pots, GC & sky shots.
              </p>
            </div>

            <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 line-through block">MRP ₹24,800</span>
                <span className="font-black text-base sm:text-lg text-rose-600">
                  ₹3,100
                </span>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-rose-50 group-hover:bg-rose-500 text-rose-700 group-hover:text-white font-black text-xs flex items-center gap-1 transition-colors border border-rose-200 group-hover:border-rose-500">
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
