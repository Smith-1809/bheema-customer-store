import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { 
  DeliveryOrderItem, 
  DeliveryCustomerInfo, 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  calculateOnlineSavings, 
  FREE_DELIVERY_THRESHOLD, 
  STANDARD_DELIVERY_FEE 
} from '../types/delivery';
import { placeCodOrder } from '../lib/deliveryOrders';
import { X, Sparkles, MapPin, Phone, User, Clock, ShieldCheck, Banknote, ArrowRight, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CodCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  allProducts: Product[];
  productImages: Record<string, string>;
  productStock?: Record<string, number>;
  appliedCoupon?: string;
  couponDiscount?: number;
  onOrderSuccess: (order: any) => void;
}

export const CodCheckoutModal: React.FC<CodCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  allProducts,
  productImages,
  productStock = {},
  appliedCoupon,
  couponDiscount = 0,
  onOrderSuccess,
}) => {
  const [fullName, setFullName] = useState(() => {
    try {
      return localStorage.getItem('bheema_customer_name') || '';
    } catch {
      return '';
    }
  });

  const [phone, setPhone] = useState(() => {
    try {
      return localStorage.getItem('bheema_customer_phone') || '';
    } catch {
      return '';
    }
  });

  const [houseNo, setHouseNo] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Express (1 to 2 Hours)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prevent background body scroll chaining on iOS Safari & mobile devices
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const scrollY = window.scrollY;

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

  // Build items array
  const items: DeliveryOrderItem[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]): DeliveryOrderItem | null => {
      const product = productMap.get(productId);
      if (!product) return null;

      const onlinePrice = calculateOnlinePrice(product.sellingPrice);
      const displayMrp = calculateDisplayMrp(onlinePrice, product.category);
      const discountPercent = calculateDiscountPercent(onlinePrice, product.category);
      const savingsPerUnit = displayMrp - onlinePrice;

      return {
        productId: product.id,
        serialNo: product.serialNo,
        productName: product.name,
        category: product.category,
        quantity: qty,
        retailPrice: displayMrp,
        onlinePrice,
        savingsPerUnit,
        discountPercent,
        itemTotal: onlinePrice * qty,
        imageUrl: product.imageUrl || null,
      };
    })
    .filter((item): item is DeliveryOrderItem => item !== null);

  const totalRetailAmount = items.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
  const totalOnlineAmount = items.reduce((sum, item) => sum + item.onlinePrice * item.quantity, 0);
  const directOnlineSavings = totalRetailAmount - totalOnlineAmount;
  const isFreeDelivery = totalOnlineAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const totalSavings = directOnlineSavings + couponDiscount;
  const finalPayable = Math.max(0, totalOnlineAmount - couponDiscount + deliveryFee);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanStreet = streetArea.trim();
    const cleanHouse = houseNo.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for WhatsApp updates');
      return;
    }

    if (!cleanStreet) {
      setErrorMessage('Please provide your street or area name');
      return;
    }

    const fullAddress = [cleanHouse, cleanStreet].filter(Boolean).join(', ');

    // Verify current live stock before confirming order
    const outOfStockItems = items.filter((item) => {
      const s = productStock[item.productId];
      return s !== undefined && s <= 0;
    });
    if (outOfStockItems.length > 0) {
      setErrorMessage(
        `Sorry! ${outOfStockItems.map((i) => i.productName).join(', ')} is currently out of stock. Please adjust your bag.`
      );
      return;
    }

    const overLimitItem = items.find((item) => {
      const s = productStock[item.productId];
      return s !== undefined && item.quantity > s;
    });
    if (overLimitItem) {
      const s = productStock[overLimitItem.productId];
      setErrorMessage(
        `Only ${s} units available for ${overLimitItem.productName}. Please decrease quantity in bag to proceed.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer contact info for future convenience
      try {
        localStorage.setItem('bheema_customer_name', cleanName);
        localStorage.setItem('bheema_customer_phone', cleanPhone.slice(-10));
      } catch {}

      const customerInfo: DeliveryCustomerInfo = {
        fullName: cleanName,
        phone: cleanPhone.slice(-10),
        address: fullAddress,
        landmark: landmark.trim(),
        city: 'Local Area',
        pincode: '500001',
        deliverySlot,
        notes: specialNotes.trim() || undefined,
      };

      const placedOrder = await placeCodOrder(
        customerInfo,
        items,
        appliedCoupon,
        couponDiscount,
        deliveryFee
      );

      // Trigger celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ef4444', '#10b981', '#fbbf24'],
        });
      } catch {}

      setIsSubmitting(false);
      onOrderSuccess(placedOrder);
    } catch (err: any) {
      console.error('Error placing COD order:', err);
      setErrorMessage(err?.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto overscroll-contain">
      <div 
        className="w-full max-w-lg bg-white border border-amber-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-slate-900 touch-pan-y"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b border-orange-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">Cash on Delivery Checkout</h3>
              <p className="text-[11px] text-amber-100 font-semibold">
                No Prepayment Needed • Pay at Doorstep
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto bg-[#FFFDF7]">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              1. Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full py-2 pl-8 pr-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <User className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full py-2 pl-8 pr-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <Phone className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Order updates & delivery alerts will be sent here
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-2.5 pt-2 border-t border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
              2. Delivery Address
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Flat / House / Building No
                </label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 302, Sai Residency"
                  className="w-full py-2 px-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Street / Colony / Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={streetArea}
                    onChange={(e) => setStreetArea(e.target.value)}
                    placeholder="e.g. Main Road, Ashok Nagar"
                    className="w-full py-2 pl-8 pr-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                  <MapPin className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nearby Landmark (Help Rider Reach Fast)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Hanuman Temple / Behind SBI"
                  className="w-full py-2 px-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Preferred Delivery Slot
                </label>
                <div className="relative">
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full py-2 pl-8 pr-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-semibold"
                  >
                    <option value="Express (1 to 2 Hours)">⚡ Express (Within 1 to 2 Hours)</option>
                    <option value="Today Evening (6 PM - 9 PM)">🌆 Today Evening (6 PM - 9 PM)</option>
                    <option value="Tomorrow Morning (9 AM - 12 PM)">🌅 Tomorrow Morning (9 AM - 12 PM)</option>
                  </select>
                  <Clock className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Ring bell twice, call before arriving..."
                className="w-full py-1.5 px-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Section 3: Payment Assurance */}
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
            <div className="flex items-center gap-2 text-orange-800 font-black text-xs">
              <Banknote className="w-4 h-4 text-orange-600" />
              <span>PAYMENT METHOD: 100% CASH ON DELIVERY (COD)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              No advance payment required. Our delivery partner will bring your crackers box right to your doorstep. You can inspect the package and pay via <strong>Cash or UPI (Google Pay, PhonePe, Paytm)</strong>.
            </p>
          </div>

          {/* Section 4: Final Summary & CTA */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Items Total ({totalItemsCount} items)</span>
              <span className="font-semibold">₹{totalOnlineAmount.toLocaleString('en-IN')}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon})</span>
                <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Delivery Fee</span>
              <span className={isFreeDelivery ? 'text-emerald-700 font-bold' : ''}>
                {isFreeDelivery ? 'FREE' : `₹${STANDARD_DELIVERY_FEE}`}
              </span>
            </div>

            <div className="pt-2 border-t border-amber-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Total Cash to Pay</span>
                <span className="text-[10px] text-emerald-700 font-bold">
                  You saved ₹{totalSavings.toLocaleString('en-IN')} on this order!
                </span>
              </div>
              <span className="font-black text-xl text-orange-600">
                ₹{finalPayable.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Cash on Delivery Order 🪔</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
