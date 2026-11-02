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
  const [paymentTab, setPaymentTab] = useState<'mobile' | 'qr' | 'intent'>('mobile');

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

  const handleQuickAppLaunchWithCopy = (app: 'phonepe' | 'gpay' | 'paytm') => {
    // Copy mobile number to clipboard first
    navigator.clipboard.writeText(OFFICIAL_PHONE);
    setCopiedField('phone');

    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    let appUrl = '';
    if (app === 'phonepe') {
      appUrl = isIOS ? 'phonepe://' : 'intent:#Intent;package=com.phonepe.app;end';
    } else if (app === 'gpay') {
      appUrl = isIOS ? 'tez://' : 'intent:#Intent;package=com.google.android.apps.nbu.paisa.user;end';
    } else if (app === 'paytm') {
      appUrl = isIOS ? 'paytmmp://' : 'intent:#Intent;package=net.one97.paytm;end';
    }

    setErrorMessage(`Mobile number ${OFFICIAL_PHONE} copied! In ${app.toUpperCase()}, tap 'To Mobile Number', paste, and send ₹${advanceAmount}.`);
    window.location.href = appUrl;
  };

  

  const handleCopy = (text: string, field: 'upi' | 'phone' | 'amount') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  // Launch targeted UPI application directly on mobile without random app chooser
  const handleOpenSpecificUpiApp = (app: 'paytm' | 'gpay' | 'phonepe' | 'cred' | 'generic') => {
    setErrorMessage('');
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    const clientNote = `Bheema_${fullName.trim().replace(/\s+/g, '_') || 'Order'}`;
    const upiQuery = `pa=${encodeURIComponent(OFFICIAL_UPI_ID)}&pn=${encodeURIComponent(OFFICIAL_PAYEE_NAME)}&am=${advanceAmount}&cu=INR&tn=${encodeURIComponent(clientNote)}`;

    let targetUrl = '';

    if (app === 'generic') {
      targetUrl = `upi://pay?${upiQuery}`;
    } else if (isIOS) {
      // iOS URL Schemes (Official registered schemes in iOS Safari)
      switch (app) {
        case 'phonepe':
          targetUrl = `phonepe://pay?${upiQuery}`;
          break;
        case 'gpay':
          targetUrl = `tez://upi/pay?${upiQuery}`;
          break;
        case 'paytm':
          targetUrl = `paytmmp://pay?${upiQuery}`;
          break;
        case 'cred':
          targetUrl = `cred://upi/pay?${upiQuery}`;
          break;
      }
    } else if (isAndroid) {
      // Android package-targeted Intent URLs (Opens exact app directly, bypassing chooser)
      switch (app) {
        case 'phonepe':
          targetUrl = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.phonepe.app;end`;
          break;
        case 'gpay':
          targetUrl = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
          break;
        case 'paytm':
          targetUrl = `intent://pay?${upiQuery}#Intent;scheme=upi;package=net.one97.paytm;end`;
          break;
        case 'cred':
          targetUrl = `intent://pay?${upiQuery}#Intent;scheme=upi;package=com.dreamplug.androidapp;end`;
          break;
      }
    } else {
      // Desktop / Fallback
      switch (app) {
        case 'phonepe':
          targetUrl = `phonepe://pay?${upiQuery}`;
          break;
        case 'gpay':
          targetUrl = `tez://upi/pay?${upiQuery}`;
          break;
        case 'paytm':
          targetUrl = `paytmmp://pay?${upiQuery}`;
          break;
        case 'cred':
          targetUrl = `cred://upi/pay?${upiQuery}`;
          break;
      }
    }

    // Attempt direct navigation to the targeted app
    window.location.href = targetUrl;
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

              {/* Payment Mode Selector Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-black text-slate-900 tracking-wider block">
                    Choose How to Pay ₹{advanceAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-black px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                    100% Safe & Direct
                  </span>
                </div>

                {/* 3 Interactive Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-amber-100/70 rounded-2xl border border-amber-200">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('mobile')}
                    className={`py-2 px-1.5 rounded-xl text-center font-bold text-xs transition-all ${
                      paymentTab === 'mobile'
                        ? 'bg-white text-orange-900 shadow-sm border border-amber-300 scale-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="block text-[11px] sm:text-xs">📱 Phone No.</span>
                    <span className="text-[9px] text-emerald-700 font-extrabold block">Recommended</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('qr')}
                    className={`py-2 px-1.5 rounded-xl text-center font-bold text-xs transition-all ${
                      paymentTab === 'qr'
                        ? 'bg-white text-orange-900 shadow-sm border border-amber-300 scale-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="block text-[11px] sm:text-xs">📸 Scan QR</span>
                    <span className="text-[9px] text-orange-700 font-bold block">Gallery Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('intent')}
                    className={`py-2 px-1.5 rounded-xl text-center font-bold text-xs transition-all ${
                      paymentTab === 'intent'
                        ? 'bg-white text-orange-900 shadow-sm border border-amber-300 scale-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="block text-[11px] sm:text-xs">⚡ 1-Tap App</span>
                    <span className="text-[9px] text-slate-400 font-medium block">Deep Links</span>
                  </button>
                </div>

                {/* TAB 1: PAY VIA MOBILE NUMBER (MOST RELIABLE FOR STUDENTS) */}
                {paymentTab === 'mobile' && (
                  <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs space-y-3.5 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          Pay to Mobile Number (PhonePe / GPay)
                        </span>
                        <span className="font-mono font-black text-xl text-slate-900 tracking-wider">
                          {OFFICIAL_PHONE}
                        </span>
                        <span className="text-xs text-orange-700 font-bold block mt-0.5">
                          Name: {OFFICIAL_PAYEE_NAME}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Amount</span>
                        <span className="font-black text-lg text-emerald-700">₹{advanceAmount}</span>
                      </div>
                    </div>

                    {/* Copy Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(OFFICIAL_PHONE, 'phone')}
                        className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        {copiedField === 'phone' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700">Number Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-orange-600" />
                            <span>Copy 9390068197</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(advanceAmount.toString(), 'amount')}
                        className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        {copiedField === 'amount' ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700">Amount Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-emerald-600" />
                            <span>Copy ₹{advanceAmount}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick App Opener Shortcuts */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Open App Directly & Paste:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickAppLaunchWithCopy('phonepe')}
                          className="py-2 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <img src="/icons/phonepe-app.svg" alt="PhonePe" className="w-4 h-4 object-contain" />
                          <span>PhonePe</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickAppLaunchWithCopy('gpay')}
                          className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <img src="/icons/gpay-app.svg" alt="GPay" className="w-4 h-4 object-contain" />
                          <span>G Pay</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickAppLaunchWithCopy('paytm')}
                          className="py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <img src="/icons/paytm-app.svg" alt="Paytm" className="w-5 h-auto object-contain" />
                          <span>Paytm</span>
                        </button>
                      </div>
                    </div>

                    {/* 3 Step Instructions */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-slate-700 space-y-1">
                      <span className="font-bold text-orange-950 block">How to pay in 5 seconds:</span>
                      <p>1. Tap <strong>Copy 9390068197</strong> above</p>
                      <p>2. Open PhonePe/GPay ➡️ Tap <strong>"To Mobile Number"</strong></p>
                      <p>3. Paste <strong>9390068197</strong> ➡️ Verify name <strong>Smithesh C</strong> ➡️ Pay ₹{advanceAmount}!</p>
                      <span className="text-[10px] text-emerald-800 font-semibold block pt-0.5">
                        ✓ 100% Success — No bank limits or mode restrictions!
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 2: SCAN QR CODE / GALLERY SCAN */}
                {paymentTab === 'qr' && (
                  <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-2xs space-y-3 animate-fade-in text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">
                        Scan or Upload QR to Pay ₹{advanceAmount}
                      </span>
                      <strong className="text-xs text-orange-800">Payee: {OFFICIAL_PAYEE_NAME}</strong>
                    </div>

                    {/* QR Code Display */}
                    <div className="py-1">
                      <img
                        src={qrDataUrl || qrCodeUrl}
                        alt={`UPI QR Code for ₹${advanceAmount}`}
                        className="w-48 h-48 mx-auto rounded-2xl border-2 border-amber-300 shadow-md p-2 bg-white"
                      />
                    </div>

                    {/* Save QR to Photos Button */}
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save QR Code to Photos / Gallery</span>
                    </button>

                    {/* 3 Step Instructions for Gallery Scan */}
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-slate-700 space-y-1 text-left">
                      <span className="font-bold text-orange-950 block">How to pay using Gallery QR:</span>
                      <p>1. Tap <strong>Save QR Code</strong> above (or take a screenshot)</p>
                      <p>2. Open PhonePe or Google Pay ➡️ Tap the <strong>Scanner 📷 icon</strong></p>
                      <p>3. Tap the <strong>Gallery 🖼️ icon</strong> in the scanner ➡️ Select this QR code image to pay ₹{advanceAmount}!</p>
                      <span className="text-[10px] text-emerald-800 font-semibold block pt-0.5">
                        ✓ As seen in PhonePe: QR from gallery allows up to ₹2,000 without any bank error!
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 3: 1-TAP APP DEEP LINKS */}
                {paymentTab === 'intent' && (
                  <div className="space-y-3 animate-fade-in">
                    {/* Bank Notice */}
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Bank Advisory:</strong> Some banks (like SBI or Paytm) block automated browser links for personal accounts. If your payment fails with "mode not allowed" or "limit exceeded", please switch to <strong>Phone No.</strong> or <strong>Scan QR</strong> above!
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Paytm */}
                      <button
                        type="button"
                        onClick={() => handleOpenSpecificUpiApp('paytm')}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 active:scale-95 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#F4F8FD] p-1 flex items-center justify-center shrink-0 border border-sky-100">
                          <img src="/icons/paytm-app.svg" alt="Paytm" className="w-8 h-auto object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-xs sm:text-sm text-slate-900 block group-hover:text-sky-600 transition-colors">
                            Paytm
                          </span>
                          <span className="text-[9.5px] text-emerald-600 font-bold block truncate">
                            Fast & Direct UPI
                          </span>
                        </div>
                      </button>

                      {/* Google Pay */}
                      <button
                        type="button"
                        onClick={() => handleOpenSpecificUpiApp('gpay')}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 active:scale-95 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
                          <img src="/icons/gpay-app.svg" alt="G Pay" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-xs sm:text-sm text-slate-900 block group-hover:text-blue-600 transition-colors">
                            G Pay
                          </span>
                          <span className="text-[9.5px] text-slate-500 font-medium block truncate">
                            Google Pay Instant
                          </span>
                        </div>
                      </button>

                      {/* PhonePe */}
                      <button
                        type="button"
                        onClick={() => handleOpenSpecificUpiApp('phonepe')}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 active:scale-95 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-50 p-1 flex items-center justify-center shrink-0 border border-purple-100">
                          <img src="/icons/phonepe-app.svg" alt="PhonePe" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-xs sm:text-sm text-slate-900 block group-hover:text-purple-700 transition-colors">
                            PhonePe
                          </span>
                          <span className="text-[9.5px] text-purple-700 font-bold block truncate">
                            Popular in NIT
                          </span>
                        </div>
                      </button>

                      {/* CRED UPI */}
                      <button
                        type="button"
                        onClick={() => handleOpenSpecificUpiApp('cred')}
                        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-800 active:scale-95 transition-all text-left flex items-center gap-2.5 shadow-2xs group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-900 p-1 flex items-center justify-center shrink-0">
                          <img src="/icons/cred-app.svg" alt="CRED" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-xs sm:text-sm text-slate-900 block group-hover:text-black transition-colors">
                            CRED UPI
                          </span>
                          <span className="text-[9.5px] text-emerald-600 font-bold block truncate">
                            CRED Member Pay
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Other UPI Apps button */}
                    <button
                      type="button"
                      onClick={() => handleOpenSpecificUpiApp('generic')}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Other UPI Apps (BHIM, Navi, Amazon Pay, etc.)</span>
                    </button>
                  </div>
                )}
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
