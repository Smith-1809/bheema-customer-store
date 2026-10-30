import React from 'react';
import { Product } from '../data/products';
import { CATEGORY_CARD_TAGS } from '../utils/crackerSearch';
import { 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  calculateOnlineSavings 
} from '../types/delivery';
import { Plus, Minus, ArrowRight, Sparkles, Flame, Search } from 'lucide-react';

interface SearchAutoSuggestDropdownProps {
  products: Product[];
  totalMatches: number;
  searchQuery: string;
  cart: Record<string, number>;
  productImages: Record<string, string>;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQty: number) => void;
  onSelectProduct: (product: Product) => void;
  onViewAllResults: () => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const SearchAutoSuggestDropdown: React.FC<SearchAutoSuggestDropdownProps> = ({
  products,
  totalMatches,
  searchQuery,
  cart,
  productImages,
  onAddToCart,
  onUpdateQuantity,
  onSelectProduct,
  onViewAllResults,
  onSuggestionClick,
}) => {
  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white/98 backdrop-blur-md rounded-2xl border border-amber-300 shadow-2xl shadow-orange-950/25 overflow-hidden ring-1 ring-orange-500/10 transition-all duration-150 animate-in fade-in slide-in-from-top-1"
      onMouseDown={(e) => {
        // Prevent input blur before click event registers
        e.preventDefault();
      }}
    >
      {/* Header bar */}
      <div className="px-3 py-2 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 border-b border-amber-200/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0 animate-pulse" />
          <span className="font-black text-amber-950 truncate">
            {totalMatches > 0 ? `Instant Results (${totalMatches})` : 'Search Results'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-full border border-orange-200 shrink-0">
          ⚡ 90% OFF Sivakasi MRP
        </span>
      </div>

      {/* Body List */}
      {products.length > 0 ? (
        <div className="max-h-[340px] sm:max-h-[380px] overflow-y-auto overscroll-contain divide-y divide-amber-100/80">
          {products.map((product) => {
            const qty = cart[product.id] || 0;
            const onlinePrice = calculateOnlinePrice(product.sellingPrice);
            const displayMrp = calculateDisplayMrp(onlinePrice, product.category);
            const discountPercent = calculateDiscountPercent(onlinePrice, product.category);
            const savings = calculateOnlineSavings(onlinePrice, product.category);
            const imgUrl = productImages[product.id] || product.imageUrl;

            return (
              <div
                key={product.id}
                className="p-2.5 sm:p-3 hover:bg-orange-50/60 transition-colors flex items-center gap-2.5 sm:gap-3 group"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden shrink-0 flex items-center justify-center border border-amber-200 cursor-pointer relative shadow-2xs"
                  title="Click to view details"
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  ) : (
                    <Flame className="w-5 h-5 text-orange-500" />
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white font-black text-[8px] text-center leading-tight py-0.5 shadow-xs">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* Details */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="flex-1 min-w-0 cursor-pointer"
                  title="Click to view details"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-200 truncate max-w-[130px]">
                      {CATEGORY_CARD_TAGS[product.category] || product.category}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-400">
                      #{product.serialNo}
                    </span>
                  </div>

                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                    {product.name}
                  </h5>

                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-black text-xs sm:text-sm text-orange-600 leading-none">
                      ₹{onlinePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through leading-none">
                      ₹{displayMrp.toLocaleString('en-IN')}
                    </span>
                    <span className="hidden sm:inline text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 leading-none">
                      Save ₹{savings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Direct Add / Stepper Button */}
                <div 
                  className="shrink-0" 
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs flex items-center gap-1 shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 bg-orange-50 border border-orange-300 rounded-xl p-0.5 shadow-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(product, qty - 1);
                        }}
                        className="w-6 h-6 rounded-lg bg-white text-orange-800 hover:bg-orange-100 font-bold flex items-center justify-center transition-colors shadow-xs active:scale-90"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="font-black text-xs text-orange-950 px-1 min-w-[18px] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(product, qty + 1);
                        }}
                        className="w-6 h-6 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-bold flex items-center justify-center transition-colors shadow-xs active:scale-90"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty / No Matches State */
        <div className="p-4 text-center bg-white space-y-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Search className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            No crackers found for "{searchQuery}"
          </p>
          <p className="text-[11px] text-slate-500">
            Try popular searches:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {['Flower Pot', 'Sky Shot', 'Chakkar', 'Sound Bomb', 'Bijili'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(term)}
                className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-orange-100 text-orange-900 border border-amber-200 text-[10px] font-bold transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer View All Results Link */}
      {totalMatches > 0 && (
        <div className="p-2 bg-gradient-to-r from-amber-50/90 to-orange-50/90 border-t border-amber-200/90 text-center">
          <button
            type="button"
            onClick={onViewAllResults}
            className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-orange-50 border border-amber-300 text-orange-900 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-98"
          >
            <span>View all {totalMatches} results in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
          </button>
        </div>
      )}
    </div>
  );
};
