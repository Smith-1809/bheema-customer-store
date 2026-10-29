import React from 'react';
import { Product } from '../data/products';
import { calculateOnlinePrice, calculateOnlineSavings } from '../types/delivery';
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
  const retailPrice = product.sellingPrice;
  const onlinePrice = calculateOnlinePrice(retailPrice);
  const savings = calculateOnlineSavings(retailPrice);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-amber-500/10 group">
      {/* Top Image / Visual Area */}
      <div 
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-slate-950 to-slate-900 group-hover:scale-105 transition-transform duration-300">
            <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-1 border border-amber-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </span>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300/80">
              {product.category}
            </span>
          </div>
        )}

        {/* 10% Discount Badge on Image */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-tight shadow-md flex items-center gap-1">
            <span>10% OFF</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-slate-400 font-mono text-[9px] font-bold border border-slate-800">
            #{product.serialNo}
          </span>
        </div>

        {/* In Stock Badge */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 truncate">
            {product.category}
          </span>

          {/* Product Title */}
          <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h4>
        </div>

        {/* Pricing & Savings */}
        <div className="mt-auto pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg text-amber-400 leading-none">
                  ₹{onlinePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through leading-none">
                  ₹{retailPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">
                Save ₹{savings.toLocaleString('en-IN')} (Direct Price)
              </span>
            </div>
          </div>

          {/* Add to Bag / Stepper Controls */}
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-950" />
              <span>Add to Bag</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-slate-950 rounded-xl border border-amber-500/40 p-1 shadow-inner">
              <button
                onClick={() => onUpdateQuantity(product, quantityInCart - 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm active:scale-90 transition-all"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-col items-center px-2">
                <span className="font-black text-xs sm:text-sm text-amber-300">
                  {quantityInCart} in bag
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  ₹{(quantityInCart * onlinePrice).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => onUpdateQuantity(product, quantityInCart + 1)}
                className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm active:scale-90 transition-all"
                title="Increase quantity"
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
