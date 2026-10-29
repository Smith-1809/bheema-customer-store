import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Search, X, Truck, PhoneCall, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

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
      {/* Top Festive Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-slate-950 font-black text-[11px] sm:text-xs py-1.5 px-3 text-center flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
        <span>
          🪔 <strong>DIWALI 2026 DIRECT DELIVERY:</strong> Flat <strong>10% OFF</strong> All Crackers! Cash on Delivery Available at Doorstep 🚚
        </span>
        <Sparkles className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-base sm:text-lg tracking-tight text-white leading-none">
                    BHEEMA
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-200/70 font-semibold truncate flex items-center gap-1">
                  <span>⚡ 1-2 Hr Express Delivery</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400">Cash on Delivery</span>
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
                placeholder="Search crackers, flower pots, sky shots, bombs..."
                className="w-full py-2 pl-9 pr-8 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-slate-400 hover:text-white absolute right-2 top-2"
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
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Track your placed order"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Track Order</span>
              </button>

              {/* Shopping Bag / Cart Drawer Button */}
              <button
                onClick={onOpenCart}
                className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span className="font-extrabold">{cartCount > 0 ? `${cartCount} items` : 'Bag'}</span>
                {cartTotal > 0 && (
                  <span className="hidden sm:inline bg-slate-950/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                )}
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-bounce">
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
              className="w-full py-2 pl-9 pr-8 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-amber-400 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-slate-400 hover:text-white absolute right-2 top-2"
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
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900/90 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'All' ? '🌟 All Crackers' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>
    </>
  );
};
