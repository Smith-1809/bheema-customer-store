import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  calculateOnlineSavings, 
  FREE_DELIVERY_THRESHOLD, 
  STANDARD_DELIVERY_FEE 
} from '../types/delivery';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Truck, Banknote } from 'lucide-react';
import { CATEGORY_CARD_TAGS } from '../utils/crackerSearch';

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

  // Prevent background body scroll chaining on iOS Safari & mobile devices
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const scrollY = window.scrollY;

      // Lock body scroll firmly on mobile browsers
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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

  const totalRetailAmount = cartEntries.reduce((sum, { product, quantity }) => {
    const online = calculateOnlinePrice(product.sellingPrice);
    const mrp = calculateDisplayMrp(online, product.category);
    return sum + mrp * quantity;
  }, 0);

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in overscroll-none touch-none">
      <div 
        className="w-full max-w-md bg-white text-slate-900 h-full flex flex-col shadow-2xl animate-slide-left border-l border-orange-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header (Sunrise Saffron Theme) */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b border-orange-400 shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center border border-white/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Your Cracker Bag</h3>
              <span className="text-xs text-amber-100">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartEntries.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] font-bold text-amber-100 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Clear all items from bag"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Bar */}
        {cartEntries.length > 0 && (
          <div className="bg-amber-50/80 px-4 py-2.5 border-b border-orange-100 shrink-0">
            <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Truck className="w-3.5 h-3.5 text-orange-600" />
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE Express Delivery!</span>
                ) : (
                  <span>Add ₹{amountNeededForFreeDelivery.toLocaleString('en-IN')} more for FREE Delivery</span>
                )}
              </span>
              <span className="text-slate-500 font-mono text-[10px]">
                ₹{totalOnlineAmount.toLocaleString('en-IN')} / ₹{FREE_DELIVERY_THRESHOLD}
              </span>
            </div>
            <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isFreeDelivery ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div 
          className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-[#FFFDF7] touch-pan-y" 
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {cartEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-orange-500 mb-3 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Your bag is empty</h4>
              <p className="text-xs text-slate-600 max-w-xs mb-4">
                Explore our festive catalog of 107+ Sivakasi crackers with up to 90% direct festive discounts!
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                Browse Crackers
              </button>
            </div>
          ) : (
            cartEntries.map(({ product, quantity }) => {
              const onlinePrice = calculateOnlinePrice(product.sellingPrice);
              const displayMrp = calculateDisplayMrp(onlinePrice, product.category);
              const discountPercent = calculateDiscountPercent(onlinePrice, product.category);
              const imgUrl = productImages[product.id] || product.imageUrl;

              return (
                <div
                  key={product.id}
                  className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-xs flex items-center gap-3 hover:border-orange-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {imgUrl ? (
                      <img src={imgUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-orange-500" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-amber-700 block truncate">
                      {CATEGORY_CARD_TAGS[product.category] || product.category}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate leading-tight">
                      {product.name}
                    </h5>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-black text-xs text-orange-600">
                        ₹{onlinePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{displayMrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-bold text-red-700 bg-red-50 border border-red-200 px-1 rounded">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center gap-1 bg-amber-50 rounded-xl border border-amber-200 p-1 shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(product, quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white hover:bg-orange-100 text-slate-700 flex items-center justify-center active:scale-90 transition-all shadow-2xs"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-7 text-center font-bold text-xs text-slate-900">
                      {quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(product, quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center active:scale-90 transition-all font-bold shadow-2xs"
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
            <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                <span>Apply Festive Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-800">✓ {appliedCoupon} APPLIED</span>
                    <span className="text-emerald-700 text-[11px]">-₹{couponDiscount} Saved</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-slate-500 hover:text-slate-800 font-bold text-[10px] px-1.5 py-0.5 rounded hover:bg-emerald-100"
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
                      className="flex-1 py-1.5 px-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      className="py-1.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-600 font-semibold">{couponError}</p>}

                  {/* Quick Clickable Suggestions */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500">Try:</span>
                    <button
                      onClick={() => {
                        setCouponCode('DIWALI50');
                        handleApplyCoupon('DIWALI50');
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
                    >
                      DIWALI50 (₹50 OFF)
                    </button>
                    <button
                      onClick={() => {
                        setCouponCode('BHEEMA100');
                        handleApplyCoupon('BHEEMA100');
                      }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
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
          <div className="p-4 bg-white border-t border-amber-200 shrink-0 space-y-3 shadow-lg">
            {/* Savings celebration banner */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>You are saving ₹{totalSavings.toLocaleString('en-IN')} with direct online prices!</span>
              </span>
            </div>

            {/* Bill Line Items */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Retail MRP</span>
                <span className="line-through text-slate-400">₹{totalRetailAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-700 font-bold">
                <span>Sivakasi Festive Discount</span>
                <span>-₹{directOnlineSavings.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Festival Coupon ({appliedCoupon})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Delivery Charges</span>
                <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                  {isFreeDelivery ? 'FREE' : `₹${STANDARD_DELIVERY_FEE}`}
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200 flex items-baseline justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">Cash to Pay on Delivery</span>
                  <span className="text-[10px] text-orange-700 font-semibold flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-orange-600" />
                    <span>Pay at Doorstep (Cash or UPI)</span>
                  </span>
                </div>
                <span className="font-black text-xl text-orange-600">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Big Proceed Button */}
            <button
              onClick={() => onProceedToCheckout(appliedCoupon || undefined, couponDiscount)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all"
            >
              <span>Proceed to Cash on Delivery Checkout</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
