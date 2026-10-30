import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Search, X, Truck, PhoneCall, ShieldCheck, Clock, Flame } from 'lucide-react';
import { CATEGORY_DISPLAY_NAMES } from '../utils/crackerSearch';

interface StorefrontNavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracker,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <>
      {/* Top Festive Announcement Bar (Sunrise Saffron & Marigold) */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white font-black text-[10px] sm:text-xs py-1 sm:py-1.5 px-2.5 text-center flex items-center justify-center gap-1.5 shadow-xs overflow-hidden">
        <Sparkles className="w-3 h-3 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
        <span className="truncate">
          🪔 <strong>DIWALI DIRECT:</strong> Up to <strong>90% OFF</strong> Factory MRP • Cash on Delivery 🚚
        </span>
        <Sparkles className="w-3 h-3 shrink-0 hidden sm:inline" />
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/90 shadow-sm shadow-orange-500/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-md shadow-orange-500/25 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-600 rounded-[14px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                    BHEEMA
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300/80">
                    DIWALI STORE
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-800 font-bold truncate flex items-center gap-1 mt-0.5">
                  <span className="text-orange-700">⚡ 1-2 Hr Express Dispatch</span>
                  <span className="text-amber-400">•</span>
                  <span className="text-emerald-700">Cash on Delivery</span>
                </p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search sparklers, flower pots, sky shots, 1000 wala..."
                className="w-full py-2 pl-9 pr-8 rounded-xl bg-amber-50/70 border border-amber-200/90 focus:border-orange-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 absolute right-2 top-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Track Order Button */}
              <button
                onClick={onOpenTracker}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Track your placed order"
              >
                <Truck className="w-3.5 h-3.5 text-orange-600" />
                <span className="hidden xs:inline">Track Order</span>
              </button>

              {/* Shopping Bag / Cart Drawer Button */}
              <button
                onClick={onOpenCart}
                className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="font-extrabold">{cartCount > 0 ? `${cartCount} items` : 'Bag'}</span>
                {cartTotal > 0 && (
                  <span className="hidden sm:inline bg-black/15 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                )}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-white animate-bounce shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-2.5 md:hidden relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 107+ crackers, sky shots, flower pots..."
              className="w-full py-2 pl-9 pr-8 rounded-xl bg-amber-50/70 border border-amber-200/90 focus:border-orange-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 absolute right-2 top-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Navigation Pills (Horizontal Touch Carousel) */}
          <div className="mt-2.5 -mx-3 px-3 overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-900 border border-amber-200/90'
                  }`}
                >
                  {CATEGORY_DISPLAY_NAMES[cat] || (cat === 'All' ? '🌟 All Crackers' : cat)}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
};
