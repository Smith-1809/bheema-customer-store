import React, { useState, useEffect } from 'react';
import { DeliveryOrder } from '../types/delivery';
import { getCustomerOrderWhatsAppUrl, subscribeToDeliveryOrders, fetchDeliveryOrders } from '../lib/deliveryOrders';
import { CheckCircle2, Copy, Check, MessageSquare, Truck, Clock, Sparkles, X, MapPin, Banknote, ShieldCheck, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

interface OrderSuccessModalProps {
  order: DeliveryOrder;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

// Pleasant celebratory chime using Web Audio API (zero external assets needed)
const playCelebrationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Note 1 (E5 - 659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2 (A5 - 880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(880, now + 0.18);
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.65);
  } catch {}
};

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order: initialOrder,
  onClose,
  onTrackOrder,
}) => {
  const [currentOrder, setCurrentOrder] = useState<DeliveryOrder>(initialOrder);
  const [copied, setCopied] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  // Real-time listener for order status change (e.g. from POS confirmation)
  useEffect(() => {
    // 1. Supabase Realtime subscription
    const unsubscribe = subscribeToDeliveryOrders(
      () => {},
      (updatedOrder) => {
        if (updatedOrder.id === currentOrder.id || updatedOrder.orderNumber === currentOrder.orderNumber) {
          if (currentOrder.status === 'pending' && updatedOrder.status === 'confirmed') {
            setJustVerified(true);
            playCelebrationChime();
          }
          setCurrentOrder(updatedOrder);
        }
      }
    );

    // 2. Fallback polling interval every 4s in case websocket drops on mobile
    const pollInterval = setInterval(async () => {
      try {
        const all = await fetchDeliveryOrders();
        const found = all.find((o) => o.id === currentOrder.id || o.orderNumber === currentOrder.orderNumber);
        if (found && found.status !== currentOrder.status) {
          if (currentOrder.status === 'pending' && found.status === 'confirmed') {
            setJustVerified(true);
            playCelebrationChime();
          }
          setCurrentOrder(found);
        }
      } catch {}
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [currentOrder.id, currentOrder.orderNumber, currentOrder.status]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(currentOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const whatsAppUrl = getCustomerOrderWhatsAppUrl(currentOrder);

  // Safe background body scroll lock on mobile
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const isPendingVerification = currentOrder.advanceAmount && currentOrder.status === 'pending';
  const isConfirmed = currentOrder.status === 'confirmed' || currentOrder.status === 'out_for_delivery' || currentOrder.status === 'delivered';
  const isCancelled = currentOrder.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration / Verification Glow */}
        <div
          className={`p-6 text-center relative border-b transition-colors duration-500 ${
            isPendingVerification
              ? 'bg-gradient-to-b from-amber-100 via-orange-50 to-white border-amber-300'
              : isConfirmed
              ? 'bg-gradient-to-b from-emerald-100 via-teal-50 to-white border-emerald-300'
              : isCancelled
              ? 'bg-gradient-to-b from-red-100 via-rose-50 to-white border-red-200'
              : 'bg-gradient-to-b from-orange-100 via-amber-50 to-white border-orange-200'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Badge */}
          {isPendingVerification ? (
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border-2 border-amber-400 shadow-md">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              </div>
            </div>
          ) : isConfirmed ? (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border-2 border-emerald-400 shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
          ) : isCancelled ? (
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 border-2 border-red-300 shadow-md">
              <AlertCircle className="w-9 h-9" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-300 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}

          {/* Badge Label */}
          {isPendingVerification ? (
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5 mb-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              Verifying 20% Advance Payment
            </span>
          ) : isConfirmed ? (
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300 inline-flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              {justVerified ? 'Payment Just Verified!' : 'Order Confirmed & Packing'}
            </span>
          ) : isCancelled ? (
            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-red-200 text-red-900 border border-red-300 inline-block mb-1.5">
              Order Cancelled
            </span>
          ) : (
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 inline-block mb-1.5">
              Diwali 2026 Order Confirmed
            </span>
          )}

          {/* Title */}
          <h3 className="font-black text-xl text-slate-900">
            {isPendingVerification
              ? 'Verifying Advance Payment... ⏳'
              : isConfirmed
              ? '🎉 Advance Verified & Confirmed! 🪔'
              : isCancelled
              ? 'Order Cancelled'
              : 'Order Placed Successfully! 🪔'}
          </h3>

          <p className="text-xs text-slate-600 mt-1">
            {isPendingVerification ? (
              <span>
                Thank you, <strong className="text-amber-800">{currentOrder.customer.fullName}</strong>. We are matching your UTR with our shop bank account!
              </span>
            ) : isConfirmed ? (
              <span>
                Thank you, <strong className="text-emerald-700">{currentOrder.customer.fullName}</strong>! Packing started for express delivery to NIT Entry Gate.
              </span>
            ) : isCancelled ? (
              <span className="text-red-700">
                {currentOrder.cancellationReason || 'Verification failed. Please contact us on WhatsApp.'}
              </span>
            ) : (
              <span>
                Thank you, <strong className="text-orange-700">{currentOrder.customer.fullName}</strong>. Our packing team has received your order!
              </span>
            )}
          </p>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto bg-[#FFFDF7]">
          {/* Real-time Verification Pulse Callout (shown while pending verification) */}
          {isPendingVerification && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Bank Credit Check in Progress
                </span>
                <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  ~1-2 mins
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Please <strong>stay on this screen</strong> or keep your phone nearby. Once our store admin sees the credit of <strong>₹{currentOrder.advanceAmount}</strong> in PhonePe/Bank, this screen will instantly turn green and start packing!
              </p>
              <div className="text-[10px] font-mono text-slate-500 bg-white/80 p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                <span>Submitted UTR: <strong className="text-slate-800">{currentOrder.utrNumber}</strong></span>
                <span className="text-emerald-700 font-bold">₹{currentOrder.advanceAmount}</span>
              </div>
            </div>
          )}

          {/* Just Verified Celebration Alert */}
          {justVerified && (
            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-3 animate-scale-up">
              <Sparkles className="w-6 h-6 shrink-0 text-amber-200 animate-spin" />
              <div className="text-xs">
                <strong className="block text-sm">🎉 Payment Verified Successfully!</strong>
                <span>Store counter verified ₹{currentOrder.advanceAmount}. Box packing is underway right now!</span>
              </div>
            </div>
          )}

          {/* Order Reference Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                Order Reference No.
              </span>
              <span className="font-mono font-black text-base text-orange-600">
                {currentOrder.orderNumber}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white hover:bg-orange-50 text-slate-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* 20% Advance Token Receipt Box */}
          {currentOrder.advanceAmount && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                isConfirmed
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div>
                <span className="text-[10px] text-slate-600 font-bold uppercase block">
                  20% Advance Booking Token
                </span>
                <span className={`font-black text-sm ${isConfirmed ? 'text-emerald-700' : 'text-amber-800'}`}>
                  ₹{currentOrder.advanceAmount.toLocaleString('en-IN')} {isConfirmed ? 'Verified & Paid' : 'Submitted Online'}
                </span>
                {currentOrder.utrNumber && (
                  <span className="text-[10px] text-slate-500 block font-mono">
                    UTR: {currentOrder.utrNumber}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  isConfirmed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {isConfirmed ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>Verifying...</span>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Expected Delivery & Payment Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span>Estimated Delivery</span>
              </span>
              <span className="font-black text-xs sm:text-sm text-slate-900 mt-1 block">
                Within 1 to 2 Hours
              </span>
              <span className="text-[9px] text-orange-700 font-bold">Express Gate Delivery</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                <Banknote className="w-3 h-3 text-emerald-600" />
                <span>{currentOrder.advanceAmount ? 'Balance at Gate (80%)' : 'Cash on Delivery'}</span>
              </span>
              <span className="font-black text-sm sm:text-base text-emerald-700 mt-1 block">
                ₹{(currentOrder.codBalance ?? currentOrder.finalPayable).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-slate-500">
                {currentOrder.advanceAmount ? `Advance ₹${currentOrder.advanceAmount} paid` : 'Cash or UPI at gate'}
              </span>
            </div>
          </div>

          {/* Live Order Journey Tracker */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
            <span className="text-[11px] font-black uppercase text-orange-800 block tracking-wider">
              Live Order Progress
            </span>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
              {/* Step 1: Placed / Advance Verification */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 ${
                    isConfirmed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 text-white animate-pulse'
                  }`}
                >
                  {isConfirmed ? '✓' : '1'}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    {currentOrder.advanceAmount
                      ? isConfirmed
                        ? '20% Advance Verified & Order Accepted'
                        : 'Verifying 20% Advance Payment'
                      : 'Order Received'}
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    {currentOrder.advanceAmount
                      ? isConfirmed
                        ? `Bank credit confirmed for UTR ${currentOrder.utrNumber}`
                        : `Admin checking ₹${currentOrder.advanceAmount} credit in bank account`
                      : 'Awaiting quick dispatch approval from shop team'}
                  </p>
                </div>
              </div>

              {/* Step 2: Packing */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 ${
                    currentOrder.status === 'confirmed'
                      ? 'bg-orange-500 text-white animate-pulse'
                      : ['out_for_delivery', 'delivered'].includes(currentOrder.status)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-100 text-slate-400'
                  }`}
                >
                  {['out_for_delivery', 'delivered'].includes(currentOrder.status) ? '✓' : '2'}
                </div>
                <div>
                  <h5
                    className={`font-bold text-xs ${
                      currentOrder.status === 'confirmed' ? 'text-orange-800' : 'text-slate-600'
                    }`}
                  >
                    Packing & Quality Check
                  </h5>
                  <p className="text-[10px] text-slate-500">
                    Sivakasi crackers being packed securely in delivery box
                  </p>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 ${
                    currentOrder.status === 'out_for_delivery'
                      ? 'bg-purple-600 text-white animate-pulse'
                      : currentOrder.status === 'delivered'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-50 text-slate-400 border border-amber-200'
                  }`}
                >
                  {currentOrder.status === 'delivered' ? '✓' : '3'}
                </div>
                <div>
                  <h5
                    className={`font-bold text-xs ${
                      currentOrder.status === 'out_for_delivery' ? 'text-purple-800' : 'text-slate-500'
                    }`}
                  >
                    Out for Delivery
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    Rider dispatched with your crackers box to NIT Gate
                  </p>
                </div>
              </div>

              {/* Step 4: Gate Handover */}
              <div className="flex items-start gap-3 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 ${
                    currentOrder.status === 'delivered'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-50 text-slate-400 border border-amber-200'
                  }`}
                >
                  {currentOrder.status === 'delivered' ? '✓' : '4'}
                </div>
                <div>
                  <h5
                    className={`font-bold text-xs ${
                      currentOrder.status === 'delivered' ? 'text-emerald-800' : 'text-slate-500'
                    }`}
                  >
                    Delivered & 80% Gate COD Collected
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    Crackers handed over at college entry gate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Review */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-900">Delivering to:</strong> {currentOrder.customer.address}
              {currentOrder.customer.landmark && <span> (Landmark: {currentOrder.customer.landmark})</span>}
              <div className="text-slate-500 text-[10px] mt-0.5">
                Contact: {currentOrder.customer.phone} • Slot: {currentOrder.customer.deliverySlot}
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Notification CTA (Optional) */}
          <div className="space-y-1">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-center"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">Send Order Details to Bheema WhatsApp</span>
              <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-100 border border-emerald-400/40 shrink-0 shadow-xs">
                Optional
              </span>
            </a>
            <p className="text-[10px] text-center text-slate-400 font-medium">
              Optional — Your order is already being tracked live in real-time
            </p>
          </div>

          {/* Track Order Live Button */}
          <button
            onClick={() => onTrackOrder(currentOrder.id)}
            className="w-full py-2.5 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Truck className="w-4 h-4 text-orange-600" />
            <span>Track Order Status Live</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-amber-200 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-orange-600 font-semibold"
          >
            Back to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
