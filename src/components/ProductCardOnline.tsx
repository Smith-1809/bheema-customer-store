import React from 'react';
import { Product } from '../data/products';
import { 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  calculateOnlineSavings 
} from '../types/delivery';
import { Plus, Minus, ShoppingBag, Sparkles, Check, Flame } from 'lucide-react';

interface ProductCardOnlineProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (product: Product, newQty: number) => void;
  imageUrl?: string | null;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCardOnline: React.FC<ProductCardOnlineProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  imageUrl,
  onOpenDetail,
}) => {
  const onlinePrice = calculateOnlinePrice(product.sellingPrice);
  const displayMrp = calculateDisplayMrp(onlinePrice, product.category);
  const discountPercent = calculateDiscountPercent(onlinePrice, product.category);
  const savings = calculateOnlineSavings(onlinePrice, product.category);

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 hover:border-orange-400 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Image / Visual Area */}
      <div 
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="relative aspect-4/3 bg-gradient-to-br from-amber-50 to-orange-50/50 overflow-hidden cursor-pointer flex items-center justify-center border-b border-amber-100"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 group-hover:scale-105 transition-transform duration-300">
            <span className="p-3 rounded-2xl bg-orange-100 text-orange-600 mb-1 border border-orange-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800">
              {product.category}
            </span>
          </div>
        )}

        {/* Festive Sivakasi MRP Red Ribbon Discount Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] tracking-tight shadow-md flex items-center gap-1 border border-white/30">
            <span>{discountPercent}% OFF</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-700 font-mono text-[9px] font-bold border border-amber-200 shadow-xs">
            #{product.serialNo}
          </span>
        </div>

        {/* In Stock Badge */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-300 text-[9px] font-bold flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Express Dispatch</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div 
          onClick={() => onOpenDetail && onOpenDetail(product)}
          className="cursor-pointer mb-2"
        >
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-0.5 truncate">
            {product.category}
          </span>

          {/* Product Title */}
          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h4>
        </div>

        {/* Pricing & Savings */}
        <div className="mt-auto pt-2 border-t border-amber-100">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg text-orange-600 leading-none">
                  ₹{onlinePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through leading-none" title="Original Sivakasi Printed MRP">
                  ₹{displayMrp.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 block mt-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block">
                Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}% Festive OFF)
              </span>
            </div>
          </div>

          {/* Add to Bag / Stepper Controls */}
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Add to Bag</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 p-1 rounded-xl bg-orange-50 border border-orange-200">
              <button
                onClick={() => onUpdateQuantity(product, quantityInCart - 1)}
                className="w-7 h-7 rounded-lg bg-white text-orange-800 hover:bg-orange-100 font-bold flex items-center justify-center transition-colors shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="font-black text-xs text-slate-900">
                {quantityInCart} in Bag
              </span>

              <button
                onClick={() => onUpdateQuantity(product, quantityInCart + 1)}
                className="w-7 h-7 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-bold flex items-center justify-center transition-colors shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
