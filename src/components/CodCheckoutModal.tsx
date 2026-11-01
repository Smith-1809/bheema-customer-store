import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../data/products';
import { 
  DeliveryOrderItem, 
  DeliveryCustomerInfo, 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  FREE_DELIVERY_THRESHOLD, 
  STANDARD_DELIVERY_FEE 
} from '../types/delivery';
import { placeCodOrder } from '../lib/deliveryOrders';
import { X, MapPin, Phone, User, Clock, Banknote, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
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

  // Explicit input refs to reliably auto-focus and scroll on mobile
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const formScrollRef = useRef<HTMLFormElement>(null);

  // Safe background scroll lock on mobile without breaking coordinate hit-testing
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
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
      nameInputRef.current?.focus();
      nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for WhatsApp updates');
      phoneInputRef.current?.focus();
      phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!cleanStreet) {
      setErrorMessage('Please provide your street or area name in the delivery address');
      streetInputRef.current?.focus();
      streetInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4 overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-lg bg-white border border-amber-200 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] text-slate-900 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky at top) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b border-orange-400 shrink-0">
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
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cancel"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body (Single scroll container with momentum scrolling) */}
        <form 
          id="cod-checkout-form"
          ref={formScrollRef}
          noValidate
          onSubmit={handleSubmitOrder} 
          className="p-4 sm:p-5 space-y-4 overflow-y-auto bg-[#FFFDF7] flex-1 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
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
                <label htmlFor="checkout-full-name" className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="checkout-full-name"
                    ref={nameInputRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                  <User className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-[11px] font-bold text-slate-700 mb-1">
                  WhatsApp Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="checkout-phone"
                    ref={phoneInputRef}
                    type="tel"
                    name="tel"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                  <Phone className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
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
                <label htmlFor="checkout-house-no" className="block text-[11px] font-bold text-slate-700 mb-1">
                  Flat / House / Building No
                </label>
                <input
                  id="checkout-house-no"
                  type="text"
                  name="address-line1"
                  autoComplete="address-line1"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 302, Sai Residency"
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                />
              </div>

              <div>
                <label htmlFor="checkout-street-area" className="block text-[11px] font-bold text-slate-700 mb-1">
                  Street / Colony / Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="checkout-street-area"
                    ref={streetInputRef}
                    type="text"
                    name="address-level2"
                    autoComplete="street-address"
                    value={streetArea}
                    onChange={(e) => setStreetArea(e.target.value)}
                    placeholder="e.g. Main Road, Ashok Nagar"
                    className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                  <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="checkout-landmark" className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nearby Landmark (Help Rider Reach Fast)
                </label>
                <input
                  id="checkout-landmark"
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Hanuman Temple / Behind SBI"
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                />
              </div>

              <div>
                <label htmlFor="checkout-delivery-slot" className="block text-[11px] font-bold text-slate-700 mb-1">
                  Preferred Delivery Slot
                </label>
                <div className="relative">
                  <select
                    id="checkout-delivery-slot"
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-semibold shadow-xs"
                  >
                    <option value="Express (1 to 2 Hours)">⚡ Express (Within 1 to 2 Hours)</option>
                    <option value="Today Evening (6 PM - 9 PM)">🌆 Today Evening (6 PM - 9 PM)</option>
                    <option value="Tomorrow Morning (9 AM - 12 PM)">🌅 Tomorrow Morning (9 AM - 12 PM)</option>
                  </select>
                  <Clock className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="checkout-special-notes" className="block text-[11px] font-bold text-slate-700 mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                id="checkout-special-notes"
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Ring bell twice, call before arriving..."
                className="w-full py-2 px-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
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
        </form>

        {/* Sticky Action Footer (Always Visible at bottom on ALL screen sizes) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-amber-200 shrink-0 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">
                Total Cash to Pay ({totalItemsCount} items)
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl text-orange-600">
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
                {totalSavings > 0 && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Save ₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">
                Delivery: {isFreeDelivery ? 'FREE' : `₹${STANDARD_DELIVERY_FEE}`}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Doorstep Pay Ready</span>
            </div>
          </div>

          <button
            type="submit"
            form="cod-checkout-form"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
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
      </div>
    </div>
  );
};
