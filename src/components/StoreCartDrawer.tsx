import React, { useState } from 'react';
import { Product } from '../data/products';
import { calculateOnlinePrice, calculateOnlineSavings, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from '../types/delivery';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Truck, Banknote } from 'lucide-react';

interface StoreCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  allProducts: Product[];
  productImages: Record<string, string>;
  onUpdateQuantity: (product: Product, newQty: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (appliedCoupon?: string, couponDiscount?: number) => void;
}

export const StoreCartDrawer: React.FC<StoreCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  allProducts,
  productImages,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');

  if (!isOpen) return null;

  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  // Calculate cart items & totals
  const cartEntries = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]) => {
      const product = productMap.get(productId);
      return { product, quantity: qty };
    })
    .filter((entry): entry is { product: Product; quantity: number } => Boolean(entry.product));

  const totalRetailAmount = cartEntries.reduce(
    (sum, { product, quantity }) => sum + product.sellingPrice * quantity,
    0
  );

  const totalOnlineAmount = cartEntries.reduce(
    (sum, { product, quantity }) => sum + calculateOnlinePrice(product.sellingPrice) * quantity,
    0
  );

  const directOnlineSavings = totalRetailAmount - totalOnlineAmount;
  const isFreeDelivery = totalOnlineAmount >= FREE_DELIVERY_THRESHOLD || cartEntries.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const totalSavings = directOnlineSavings + couponDiscount;
  const finalPayable = Math.max(0, totalOnlineAmount - couponDiscount + deliveryFee);
  const totalItemCount = cartEntries.reduce((sum, { quantity }) => sum + quantity, 0);

  // Free delivery progress
  const freeDeliveryProgress = Math.min(100, (totalOnlineAmount / FREE_DELIVERY_THRESHOLD) * 100);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalOnlineAmount);

  // Apply Coupon
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    if (code === 'DIWALI50') {
      if (totalOnlineAmount < 1000) {
        setCouponError('Minimum order of ₹1,000 required for DIWALI50');
        return;
      }
      setAppliedCoupon('DIWALI50');
      setCouponDiscount(50);
    } else if (code === 'BHEEMA100') {
      if (totalOnlineAmount < 2000) {
        setCouponError('Minimum order of ₹2,000 required for BHEEMA100');
        return;
      }
      setAppliedCoupon('BHEEMA100');
      setCouponDiscount(100);
    } else if (code === 'FESTIVE150') {
      if (totalOnlineAmount < 3500) {
        setCouponError('Minimum order of ₹3,500 required for FESTIVE150');
        return;
      }
      setAppliedCoupon('FESTIVE150');
      setCouponDiscount(150);
    } else {
      setCouponError('Invalid coupon code. Try DIWALI50 or BHEEMA100');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-[100dvh] flex flex-col shadow-2xl overflow-hidden animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Your Cracker Bag</h3>
              <span className="text-xs text-slate-400">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartEntries.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Clear all items from bag"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Bar */}
        {cartEntries.length > 0 && (
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-extrabold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>Add ₹{amountNeededForFreeDelivery.toLocaleString('en-IN')} more for FREE Delivery</span>
                )}
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                ₹{totalOnlineAmount.toLocaleString('en-IN')} / ₹{FREE_DELIVERY_THRESHOLD}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFreeDelivery ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-base text-white mb-1">Your bag is empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                Explore our festive catalog of 107+ Sivakasi crackers with 10% direct online discount!
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Browse Crackers
              </button>
            </div>
          ) : (
            cartEntries.map(({ product, quantity }) => {
              const retailPrice = product.sellingPrice;
              const onlinePrice = calculateOnlinePrice(retailPrice);
              const imgUrl = productImages[product.id] || product.imageUrl;

              return (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-slate-850 border border-slate-800 flex items-center gap-3 hover:border-slate-700 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {imgUrl ? (
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-amber-400/70" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block truncate">
                      {product.category}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-white truncate leading-tight">
                      {product.name}
                    </h5>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-black text-xs text-amber-400">
                        ₹{onlinePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{retailPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                        10% OFF
                      </span>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center gap-1 bg-slate-950 rounded-xl border border-slate-800 p-1 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(product, quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center active:scale-90 transition-all"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-7 text-center font-bold text-xs text-white">
                      {quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(product, quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center active:scale-90 transition-all font-bold"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Coupon Code Strip */}
          {cartEntries.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-850/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Tag className="w-3.5 h-3.5" />
                <span>Apply Festive Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-400">✓ {appliedCoupon} APPLIED</span>
                    <span className="text-slate-300 text-[11px]">-₹{couponDiscount} Saved</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-slate-400 hover:text-white font-bold text-[10px] px-1.5 py-0.5 rounded hover:bg-slate-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter DIWALI50 or BHEEMA100"
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-400 font-semibold">{couponError}</p>}

                  {/* Quick Clickable Suggestions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Try:</span>
                    <button
                      onClick={() => {
                        setCouponCode('DIWALI50');
                        handleApplyCoupon('DIWALI50');
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20"
                    >
                      DIWALI50 (₹50 OFF)
                    </button>
                    <button
                      onClick={() => {
                        setCouponCode('BHEEMA100');
                        handleApplyCoupon('BHEEMA100');
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20"
                    >
                      BHEEMA100 (₹100 OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer & Bill Breakdown */}
        {cartEntries.length > 0 && (
          <div className="p-4 bg-slate-850 border-t border-slate-800 shrink-0 space-y-3">
            {/* Savings celebration banner */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-500/30 text-center">
              <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You are saving ₹{totalSavings.toLocaleString('en-IN')} with direct online prices!</span>
              </span>
            </div>

            {/* Bill Line Items */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Retail MRP</span>
                <span className="line-through text-slate-400">₹{totalRetailAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>10% Direct Online Discount</span>
                <span>-₹{directOnlineSavings.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Festival Coupon ({appliedCoupon})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Delivery Charges</span>
                <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                  {isFreeDelivery ? 'FREE' : `₹${STANDARD_DELIVERY_FEE}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700/80 flex items-baseline justify-between">
                <div>
                  <span className="font-extrabold text-sm text-white block">Cash to Pay on Delivery</span>
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-amber-400" />
                    <span>Pay at Doorstep (Cash or UPI)</span>
                  </span>
                </div>
                <span className="font-black text-xl text-amber-400">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Big Proceed Button */}
            <button
              onClick={() => onProceedToCheckout(appliedCoupon || undefined, couponDiscount)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all"
            >
              <span>Proceed to Cash on Delivery Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
