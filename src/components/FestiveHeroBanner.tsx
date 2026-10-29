import React from 'react';
import { Gift, ChevronRight } from 'lucide-react';
import heroBannerImg from '../assets/bheema-diwali-hero-banner-cropped.png';

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
      {/* Grand Diwali Hero Banner (Matches exact uploaded design) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-300/80 shadow-md shadow-amber-500/10 bg-[#FFFDF7]">
        <img
          src={heroBannerImg}
          alt="Light Up Your Diwali with Bheema Fireworks"
          className="w-full h-auto block select-none"
        />

        {/* Interactive Click Target: Explore Sky Shots */}
        <button
          onClick={() => onSelectCategory('Comet / Shot')}
          title="Explore Sky Shots"
          aria-label="Explore Sky Shots"
          className="absolute rounded-xl sm:rounded-2xl cursor-pointer transition-all hover:ring-2 hover:ring-amber-400 hover:bg-white/10 active:scale-95 focus:outline-none"
          style={{
            left: '2.5%',
            width: '20.8%',
            top: '80.5%',
            height: '12.8%',
          }}
        />

        {/* Interactive Click Target: Sparkling Flower Pots */}
        <button
          onClick={() => onSelectCategory('FP')}
          title="Sparkling Flower Pots"
          aria-label="Sparkling Flower Pots"
          className="absolute rounded-xl sm:rounded-2xl cursor-pointer transition-all hover:ring-2 hover:ring-orange-400 hover:bg-amber-500/10 active:scale-95 focus:outline-none"
          style={{
            left: '24.4%',
            width: '19.8%',
            top: '80.5%',
            height: '12.8%',
          }}
        />
      </div>

      {/* Mobile Touch Quick Actions (Directly below banner for easy thumb taps) */}
      <div className="grid grid-cols-2 gap-2 sm:hidden pt-0.5">
        <button
          onClick={() => onSelectCategory('Comet / Shot')}
          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-95"
        >
          <span>🚀 Explore Sky Shots</span>
        </button>

        <button
          onClick={() => onSelectCategory('FP')}
          className="py-2.5 px-3 rounded-xl bg-white border border-amber-300 text-orange-800 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
        >
          <span>✳️ Sparkling Flower Pots</span>
        </button>
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
