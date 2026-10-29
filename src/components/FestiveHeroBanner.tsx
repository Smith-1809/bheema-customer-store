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
      {/* Grand Diwali Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/70 via-slate-900 to-rose-950/60 border border-amber-500/30 p-5 sm:p-7 shadow-2xl">
        {/* Festive Ambient Background Lighting */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-black tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Diwali 2026 Celebration Direct Delivery</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            Light Up Your Diwali with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-amber-300">
              Bheema Fireworks
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Order fresh, authentic Sivakasi crackers delivered straight to your doorstep.
            Enjoy <strong>Flat 10% Lower Prices</strong> with zero risk through <strong>Cash on Delivery (COD)</strong>.
          </p>

          {/* Quick Perks Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Banknote className="w-4 h-4" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-white">Cash on Delivery</span>
                <span className="text-[10px] text-slate-400">Pay when delivered</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-white">1 to 2 Hours</span>
                <span className="text-[10px] text-slate-400">Superfast dispatch</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="block text-[11px] font-black text-amber-300">Flat 10% OFF</span>
                <span className="text-[10px] text-slate-400">Lower than shop MRP</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSelectCategory('Comet / Shot')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>Explore Sky Shots</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectCategory('FP')}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sparkling Flower Pots</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Festive Combo Boxes Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-rose-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Bestselling Festive Combos (Ready to Dispatch)
            </h3>
          </div>
          <span className="text-[11px] text-amber-400 font-bold">1-Click All-in-One Packs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Small Combo */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-amber-500/25 flex flex-col justify-between hover:border-amber-400/50 transition-all shadow-md group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-1">
                  Budget Favorite
                </span>
                <h4 className="font-black text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                  SMALL COMBO (10 Varieties)
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  Bijili, color pipes, flower pot, ground chakkar, sparklers & sky shot.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 line-through block">MRP ₹1,290</span>
                <span className="font-black text-base text-amber-400">₹1,160</span>
                <span className="text-[9px] font-bold text-emerald-400 block">Save 10%</span>
              </div>
            </div>

            <button
              onClick={() => onOpenComboModal('BUNDLE-SMALL-COMBO-10')}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>View & Add 10-Variety Combo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Family Pack */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-rose-500/25 flex flex-col justify-between hover:border-rose-400/50 transition-all shadow-md group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                  Most Popular
                </span>
                <h4 className="font-black text-sm sm:text-base text-white group-hover:text-rose-300 transition-colors">
                  Diwali Family Pack (18 Varieties)
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  Complete family celebration with mega sound bombs, flower pots, GC & sky shots.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 line-through block">MRP ₹3,450</span>
                <span className="font-black text-base text-rose-400">₹3,100</span>
                <span className="text-[9px] font-bold text-emerald-400 block">Save 10%</span>
              </div>
            </div>

            <button
              onClick={() => onOpenComboModal('BUNDLE-DIWALI-FAMILY-18')}
              className="mt-2 w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Gift className="w-3.5 h-3.5 text-rose-400" />
              <span>View & Add 18-Variety Family Pack</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
