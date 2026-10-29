import React from 'react';
import { Sparkles, Truck, ShieldCheck, Banknote, Clock, Flame, ChevronRight, Gift } from 'lucide-react';
import { POPULAR_BUNDLES } from '../data/bundles';

interface FestiveHeroBannerProps {
  onSelectCategory: (category: string) => void;
  onOpenComboModal: (bundleId: string) => void;
}

export const FestiveHeroBanner: React.FC<FestiveHeroBannerProps> = ({
  onSelectCategory,
  onOpenComboModal,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Grand Diwali Hero Banner (Sunrise Saffron & Marigold Glow) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 border border-amber-300/60 p-5 sm:p-7 shadow-xl shadow-orange-500/20 text-white">
        {/* Festive Ambient Background Lighting & Diya Flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

        {/* Decorative Diya Flare Icon */}
        <div className="absolute -top-4 -right-4 text-7xl opacity-20 pointer-events-none select-none">
          🪔
        </div>

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 border border-white/30 text-[11px] sm:text-xs font-black tracking-wide uppercase mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>Diwali 2026 Celebration Direct Delivery</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-sm">
            Light Up Your Diwali with{' '}
            <span className="text-yellow-200 underline decoration-yellow-300/60 decoration-wavy decoration-2">
              Bheema Fireworks
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-amber-50 leading-relaxed mb-4 font-medium">
            Order fresh, authentic Sivakasi crackers delivered straight to your doorstep.
            Enjoy <strong>Up to 90% Festive Discounts</strong> against Sivakasi MRP with zero risk through <strong>Cash on Delivery (COD)</strong>.
          </p>

          {/* Quick Perks Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 text-white">
                <Banknote className="w-4 h-4 text-yellow-200" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-white">Cash on Delivery</span>
                <span className="text-[10px] text-amber-100">Pay when delivered</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 text-white">
                <Clock className="w-4 h-4 text-yellow-200" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-white">1 to 2 Hours</span>
                <span className="text-[10px] text-amber-100">Superfast dispatch</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 text-white">
                <Sparkles className="w-4 h-4 text-yellow-200" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-yellow-200">Up to 90% OFF</span>
                <span className="text-[10px] text-amber-100">Sivakasi Factory MRP</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSelectCategory('Comet / Shot')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-yellow-300 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-black/20 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Explore Sky Shots</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectCategory('FP')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Sparkling Flower Pots</span>
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
