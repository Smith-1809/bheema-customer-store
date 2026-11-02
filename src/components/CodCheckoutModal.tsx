import QRCode from 'qrcode';
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../data/products';
import { 
  DeliveryOrderItem, 
  DeliveryCustomerInfo, 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  MINIMUM_ORDER_VALUE,
  FREE_DELIVERY_THRESHOLD, 
  STANDARD_DELIVERY_FEE 
} from '../types/delivery';
import { placeCodOrder } from '../lib/deliveryOrders';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Banknote, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  Sparkles, 
  Copy, 
  Check, 
  QrCode, 
  UploadCloud, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Download
} from 'lucide-react';
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
  // Step 1 (Address) or Step 2 (20% Advance Payment)
  const [step, setStep] = useState<'address' | 'payment'>('address');

  // Customer Contact & Address (Preserved exactly as requested)
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

  // 20% Advance Payment State
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'upi' | 'phone' | 'amount' | null>(null);
  const [showQr, setShowQr] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Official Receiver Credentials (Configured for Chanda Smithesh)
  const OFFICIAL_UPI_ID = '9390068197@ptyes';
  const OFFICIAL_PAYEE_NAME = 'Chanda Smithesh';
  const OFFICIAL_PHONE = '9390068197';

  // Explicit input refs for auto-focus/scrolling
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const utrInputRef = useRef<HTMLInputElement>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  // Safe background scroll lock on mobile
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

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
        itemTotal: onlinePrice * qty,
        discountPercent,
        imageUrl: productImages[product.id] || null,
      };
    })
    .filter((it): it is DeliveryOrderItem => Boolean(it));

  const totalRetailAmount = items.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
  const totalOnlineAmount = items.reduce((sum, item) => sum + item.onlinePrice * item.quantity, 0);
  const directOnlineSavings = totalRetailAmount - totalOnlineAmount;
  const isFreeDelivery = totalOnlineAmount >= FREE_DELIVERY_THRESHOLD || items.length === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const totalSavings = directOnlineSavings + couponDiscount;
  const finalPayable = Math.max(0, totalOnlineAmount - couponDiscount + deliveryFee);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // 20% Advance Calculation
  const advanceAmount = Math.max(1, Math.round(finalPayable * 0.20));
  const codBalance = Math.max(0, finalPayable - advanceAmount);

  // Universal UPI Intent URI for Mobile
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(OFFICIAL_UPI_ID)}&pn=${encodeURIComponent(OFFICIAL_PAYEE_NAME)}&am=${advanceAmount}&cu=INR&tn=${encodeURIComponent(`Bheema_Advance_${fullName.trim() || 'Order'}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiIntentUrl)}&margin=10`;

    // Generate offline base64 QR Code on mount and amount change
  useEffect(() => {
    if (advanceAmount > 0) {
      QRCode.toDataURL(upiIntentUrl, {
        width: 360,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.warn('QR Data URL generation failed:', err));
    }
  }, [upiIntentUrl, advanceAmount]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Bheema_Advance_Rs${advanceAmount}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setCopiedField('amount');
    setErrorMessage('QR Code saved to downloads! Open PhonePe/GPay -> tap Scanner 📷 -> tap Gallery icon to pay.');
  };

  

  const handleCopy = (text: string, field: 'upi' | 'phone' | 'amount') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  // Compress & preview uploaded payment screenshot (client-side canvas)
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = (h * maxDim) / w;
          w = maxDim;
        } else if (h > maxDim) {
          w = (w * maxDim) / h;
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.72);
        setScreenshotPreview(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Step 1: Validate address & continue to 20% advance payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = fullName.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanStreet = streetArea.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name');
      nameInputRef.current?.focus();
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for WhatsApp updates');
      phoneInputRef.current?.focus();
      return;
    }

    if (!cleanStreet) {
      setErrorMessage('Please provide your street or area name in delivery address');
      streetInputRef.current?.focus();
      return;
    }

    if (finalPayable < MINIMUM_ORDER_VALUE) {
      setErrorMessage(`Minimum order value for delivery is ₹${MINIMUM_ORDER_VALUE}. Please add more crackers to proceed.`);
      return;
    }

    // Verify current live stock
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

    try {
      localStorage.setItem('bheema_customer_name', cleanName);
      localStorage.setItem('bheema_customer_phone', cleanPhone);
    } catch {}

    setStep('payment');
    formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Final Order Submission with 20% Advance UTR
  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUtr = utrNumber.trim().replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setErrorMessage('Please enter the exact 12-digit UPI UTR / Transaction Reference Number from your payment receipt.');
      utrInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim().replace(/\D/g, '');
      const cleanStreet = streetArea.trim();
      const cleanHouse = houseNo.trim();
      const fullAddress = [cleanHouse, cleanStreet].filter(Boolean).join(', ');

      const customer: DeliveryCustomerInfo = {
        fullName: cleanName,
        phone: cleanPhone,
        address: fullAddress,
        landmark: landmark.trim(),
        city: 'Warangal',
        pincode: '506004',
        deliverySlot,
        notes: specialNotes.trim(),
      };

      const order = await placeCodOrder(
        customer,
        items,
        appliedCoupon,
        couponDiscount,
        deliveryFee,
        {
          advanceAmount,
          codBalance,
          utrNumber: cleanUtr,
          paymentScreenshotUrl: screenshotPreview || undefined,
        }
      );

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#10b981', '#ef4444'],
      });

      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not place order. Please try again or contact us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4 overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-lg bg-white border border-amber-200 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] text-slate-900 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b border-orange-400 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30">
              {step === 'address' ? <MapPin className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                {step === 'address' ? 'Delivery Details' : '20% Advance Confirmation'}
              </h3>
              <p className="text-[11px] text-amber-100 font-semibold">
                {step === 'address' 
                  ? 'Step 1 of 2: Gate Delivery Address' 
                  : `Step 2 of 2: Pay ₹${advanceAmount.toLocaleString('en-IN')} via UPI`}
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

        {/* Step Indicator */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-600">
          <button 
            type="button"
            onClick={() => setStep('address')}
            className={`flex items-center gap-1.5 ${step === 'address' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-orange-600'}`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'address' ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {step === 'payment' ? '✓' : '1'}
            </span>
            <span>1. Delivery Address</span>
          </button>

          <span className="text-slate-300">➔</span>

          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-orange-600 font-black' : 'text-slate-400'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            <span>2. 20% Advance (UPI)</span>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={formScrollRef}
          className="p-4 sm:p-5 space-y-4 overflow-y-auto bg-[#FFFDF7] flex-1 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: ADDRESS FORM */}
          {step === 'address' && (
            <form id="address-form" onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Customer Contact */}
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
                      Order confirmation & tracking will be sent here
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address (Preserved exactly as requested) */}
              <div className="space-y-2.5 pt-2 border-t border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  2. Gate / Doorstep Delivery Address
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="checkout-house-no" className="block text-[11px] font-bold text-slate-700 mb-1">
                      Flat / House / Entry Gate Details
                    </label>
                    <input
                      id="checkout-house-no"
                      type="text"
                      autoComplete="address-line1"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      placeholder="e.g. NITW Main Gate / Security Gate"
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
                        autoComplete="street-address"
                        value={streetArea}
                        onChange={(e) => setStreetArea(e.target.value)}
                        placeholder="e.g. Kazipet / Hanamkonda Road"
                        className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                      />
                      <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="checkout-landmark" className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nearby Landmark
                    </label>
                    <input
                      id="checkout-landmark"
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Security Cabin / SBI ATM"
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
                    placeholder="e.g. Call 5 mins before reaching gate..."
                    className="w-full py-2 px-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                </div>
              </div>

              {/* Advance policy notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-1">
                <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>20% Booking Token Required to Confirm Order</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To prevent duplicate/unclaimed orders, a <strong>20% advance token (₹{advanceAmount.toLocaleString('en-IN')})</strong> is collected via UPI. Pay the remaining <strong>80% (₹{codBalance.toLocaleString('en-IN')})</strong> when collecting crackers at the gate!
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: 20% ADVANCE PAYMENT SCREEN */}
          {step === 'payment' && (
            <form id="advance-form" onSubmit={handleFinalOrderSubmit} className="space-y-4 animate-fade-in">
              {/* Financial Split Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-200/80">
                  <span className="text-slate-600">Total Cracker Bill:</span>
                  <span className="font-bold text-slate-900">₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase text-orange-800 tracking-wider block">
                      20% Advance Token (Pay Now)
                    </span>
                    <span className="text-[10px] text-slate-500">Locks & confirms your cracker box</span>
                  </div>
                  <span className="font-black text-xl text-orange-600">
                    ₹{advanceAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/80">
                  <span className="text-slate-600">Remaining 80% to Pay on Delivery:</span>
                  <span className="font-extrabold text-emerald-700">₹{codBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proper UPI ID & Payment Card */}
              <div className="p-4 rounded-2xl bg-white border-2 border-orange-300 shadow-md space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <span className="text-[11px] font-black uppercase text-orange-950 tracking-wider flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-orange-600" />
                    <span>Pay 20% Advance via Any UPI App</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Verified UPI
                  </span>
                </div>

                {/* Hero Proper UPI ID Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Official Store UPI ID:
                    </span>
                    <span className="text-[10px] text-orange-700 font-bold">PhonePe / GPay / Paytm</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <span className="font-mono font-black text-base sm:text-lg text-slate-900 select-all tracking-wider truncate">
                      {OFFICIAL_UPI_ID}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_UPI_ID, 'upi')}
                      className="py-1.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      {copiedField === 'upi' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Payee Details & Exact Amount Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Payee Name & Phone */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Payee Name:</span>
                      <strong className="text-slate-900 text-xs block">{OFFICIAL_PAYEE_NAME}</strong>
                      <span className="text-[11px] text-slate-600 font-mono mt-0.5 block">{OFFICIAL_PHONE} (PhonePe/Paytm)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(OFFICIAL_PHONE, 'phone')}
                      className="p-2 rounded-lg bg-white border border-amber-200 hover:bg-orange-50 text-orange-700 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Copy Phone Number"
                    >
                      {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* 20% Token Amount */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-800 font-semibold block">20% Advance to Pay:</span>
                      <strong className="text-emerald-700 text-base font-black block leading-tight">₹{advanceAmount}</strong>
                      <span className="text-[9.5px] text-slate-500 block">Balance at Gate: ₹{codBalance}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(advanceAmount.toString(), 'amount')}
                      className="p-2 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Copy Amount"
                    >
                      {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'amount' ? 'Copied' : 'Copy ₹'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Card (Scan with PhonePe / GPay / Paytm) */}
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span>Or Scan QR to Pay ₹{advanceAmount}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    {showQr ? 'Hide QR' : 'Show QR'}
                  </button>
                </div>

                {showQr && (
                  <div className="text-center py-1 space-y-2.5">
                    <img
                      src={qrDataUrl || qrCodeUrl}
                      alt={`UPI QR Code for ₹${advanceAmount}`}
                      className="w-44 h-44 mx-auto rounded-2xl border-2 border-amber-300 shadow-sm p-2 bg-white"
                    />

                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="py-1.5 px-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 font-bold text-[11px] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-600" />
                        <span>Save QR to Photos / Gallery</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 block font-medium">
                      Scan using Google Pay, PhonePe, or Paytm scanner
                    </span>
                  </div>
                )}
              </div>

              {/* Simple 3-Step Guide */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 space-y-1.5">
                <span className="font-extrabold text-orange-950 block text-[11px]">
                  3 Easy Steps to Complete Your Order:
                </span>
                <div className="text-[11px] space-y-1 text-slate-600 leading-relaxed">
                  <p>1. Copy the UPI ID <strong className="text-slate-900 font-mono">9390068197@ptyes</strong> (or scan QR code above).</p>
                  <p>2. Open your <strong>PhonePe, Google Pay, or Paytm</strong> and transfer <strong className="text-slate-900">₹{advanceAmount}</strong> to <strong className="text-slate-900">Chanda Smithesh</strong>.</p>
                  <p>3. Enter the <strong>12-digit UTR / Transaction Reference Number</strong> below and tap Confirm Order!</p>
                </div>
              </div>

              {/* Payment Verification Proof Form */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                  Submit Payment Verification Proof
                </span>

                {/* 12-digit UTR Input */}
                <div>
                  <label htmlFor="checkout-utr" className="block text-[11px] font-bold text-slate-700 mb-1">
                    12-Digit UPI Transaction / UTR No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-utr"
                    ref={utrInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="e.g. 430987123456"
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-amber-300 text-[16px] sm:text-xs text-slate-900 font-mono tracking-wider placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Found under &quot;Transaction Details&quot; in PhonePe, GPay, or Paytm after paying ₹{advanceAmount}
                  </span>
                </div>

                {/* Payment Screenshot Upload (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Payment Screenshot (Optional)
                  </label>

                  {screenshotPreview ? (
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-emerald-300">
                      <img
                        src={screenshotPreview}
                        alt="Payment Screenshot Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Screenshot Attached</span>
                        </span>
                        <span className="text-[10px] text-slate-500 block">Ready for verification</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScreenshotPreview(null)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-amber-300 bg-white hover:bg-orange-50/50 cursor-pointer transition-colors">
                      <UploadCloud className="w-6 h-6 text-orange-500 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Upload Receipt Screenshot</span>
                      <span className="text-[9.5px] text-slate-400">JPG, PNG, WebP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-amber-200 shrink-0 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between text-xs px-1">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">
                {step === 'address' ? 'Total Bill' : '20% Advance Token to Pay'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl text-orange-600">
                  ₹{(step === 'address' ? finalPayable : advanceAmount).toLocaleString('en-IN')}
                </span>
                {step === 'payment' && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Gate COD: ₹{codBalance.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              {step === 'payment' ? (
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="text-xs text-orange-600 font-bold hover:underline flex items-center gap-1 ml-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              ) : (
                <span className="text-[10px] text-emerald-700 font-bold">20% Token + 80% Gate COD</span>
              )}
            </div>
          </div>

          {step === 'address' ? (
            <button
              type="submit"
              form="address-form"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Continue to 20% Advance (₹{advanceAmount.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              type="submit"
              form="advance-form"
              disabled={isSubmitting || utrNumber.trim().length !== 12}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Confirm Order with ₹{advanceAmount.toLocaleString('en-IN')} Advance 🚀</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
