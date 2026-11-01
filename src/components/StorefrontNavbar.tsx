import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, ShoppingBag, Search, X, Truck, Flame } from 'lucide-react';
import { Product } from '../data/products';
import { CATEGORY_DISPLAY_NAMES, matchProductSearch } from '../utils/crackerSearch';
import { SearchAutoSuggestDropdown } from './SearchAutoSuggestDropdown';
import bheemaLogoCircle from '../assets/bheema-logo-circle.webp';
import { trackSearch } from '../utils/analytics';

interface StorefrontNavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  categories?: string[];
  allProducts: Product[];
  cart: Record<string, number>;
  productImages: Record<string, string>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQty: number) => void;
  onOpenProductDetail?: (product: Product) => void;
  onScrollToCatalog?: () => void;
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
  allProducts = [],
  cart = {},
  productImages = {},
  onAddToCart,
  onUpdateQuantity,
  onOpenProductDetail,
  onScrollToCatalog,
}) => {
  // Dropdown visibility states
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  // Element Refs for click-outside detection and focus handling
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Compute Instant Matches from all master products
  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter((p) => matchProductSearch(p, searchQuery));
  }, [allProducts, searchQuery]);

  // Top 5 products displayed in floating dropdown
  const dropdownProducts = useMemo(() => {
    return matchingProducts.slice(0, 5);
  }, [matchingProducts]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (desktopContainerRef.current && !desktopContainerRef.current.contains(target)) {
        setShowDesktopDropdown(false);
      }
      if (mobileContainerRef.current && !mobileContainerRef.current.contains(target)) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle Escape key to dismiss search dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDesktopDropdown(false);
        setShowMobileDropdown(false);
        desktopInputRef.current?.blur();
        mobileInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Triggered when user selects "View all results in Catalog" or hits Enter
  const handleViewAllResults = () => {
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();
    if (searchQuery.trim()) {
      trackSearch(searchQuery);
    }

    if (onScrollToCatalog) {
      onScrollToCatalog();
    } else {
      const el = document.getElementById('cracker-catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Triggered when clicking a product item inside the dropdown
  const handleSelectProduct = (product: Product) => {
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
    desktopInputRef.current?.blur();
    mobileInputRef.current?.blur();

    if (onOpenProductDetail) {
      onOpenProductDetail(product);
    }
  };

  // Triggered when clicking a suggested term inside the empty dropdown
  const handleSuggestionClick = (term: string) => {
    onSearchChange(term);
    setShowDesktopDropdown(true);
    setShowMobileDropdown(true);
  };

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
              <div
                id="navbar-brand-logo"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 shadow-md shadow-amber-500/30 shrink-0 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 border border-amber-300/80 overflow-hidden flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Bheema Fireworks"
              >
                <img
                  src={bheemaLogoCircle}
                  alt="Bheema Fireworks"
                  className="w-full h-full object-contain rounded-full select-none"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                    BHEEMA
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300/80">
                    FIREWORKS
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-800 font-bold truncate flex items-center gap-1 mt-0.5">
                  <span className="text-orange-700 truncate">⚡ 1-2 Hr Dispatch</span>
                  <span className="text-amber-400 shrink-0">•</span>
                  <span className="text-emerald-700 truncate">COD Available</span>
                </p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div ref={desktopContainerRef} className="hidden md:flex flex-1 max-w-md relative">
              <input
                ref={desktopInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setShowDesktopDropdown(true);
                  } else {
                    setShowDesktopDropdown(false);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setShowDesktopDropdown(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleViewAllResults();
                  }
                }}
                placeholder="Search sparklers, flower pots, sky shots, 1000 wala..."
                className="w-full py-2 pl-9 pr-8 rounded-xl bg-amber-50/70 border border-amber-200/90 focus:border-orange-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setShowDesktopDropdown(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 absolute right-2 top-2"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Instant Floating Dropdown on Desktop */}
              {showDesktopDropdown && searchQuery.trim().length > 0 && (
                <SearchAutoSuggestDropdown
                  products={dropdownProducts}
                  totalMatches={matchingProducts.length}
                  searchQuery={searchQuery}
                  cart={cart}
                  productImages={productImages}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onSelectProduct={handleSelectProduct}
                  onViewAllResults={handleViewAllResults}
                  onSuggestionClick={handleSuggestionClick}
                />
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
          <div ref={mobileContainerRef} className="mt-2.5 md:hidden relative">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setShowMobileDropdown(true);
                } else {
                  setShowMobileDropdown(false);
                }
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowMobileDropdown(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleViewAllResults();
                }
              }}
              placeholder="Search 107+ crackers, sky shots, flower pots..."
              className="w-full py-2 pl-9 pr-8 rounded-xl bg-amber-50/70 border border-amber-200/90 focus:border-orange-500 focus:bg-white text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setShowMobileDropdown(false);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 absolute right-2 top-2"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Instant Floating Dropdown on Mobile */}
            {showMobileDropdown && searchQuery.trim().length > 0 && (
              <SearchAutoSuggestDropdown
                products={dropdownProducts}
                totalMatches={matchingProducts.length}
                searchQuery={searchQuery}
                cart={cart}
                productImages={productImages}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onSelectProduct={handleSelectProduct}
                onViewAllResults={handleViewAllResults}
                onSuggestionClick={handleSuggestionClick}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};
