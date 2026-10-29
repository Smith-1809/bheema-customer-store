import React, { useState } from 'react';
import { DeliveryOrder } from '../types/delivery';
import { getCustomerOrderWhatsAppUrl } from '../lib/deliveryOrders';
import { CheckCircle2, Copy, Check, MessageSquare, Truck, Clock, Sparkles, X, ChevronRight, MapPin, Banknote } from 'lucide-react';

interface OrderSuccessModalProps {
  order: DeliveryOrder;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const whatsAppUrl = getCustomerOrderWhatsAppUrl(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Glow */}
        <div className="p-6 bg-gradient-to-b from-orange-100 via-amber-50 to-white text-center relative border-b border-orange-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-orange-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-300 shadow-md">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 inline-block mb-1.5">
            Diwali 2026 Order Confirmed
          </span>

          <h3 className="font-black text-xl text-slate-900">Order Placed Successfully! 🪔</h3>
          <p className="text-xs text-slate-600 mt-1">
            Thank you, <strong className="text-orange-700">{order.customer.fullName}</strong>. Our packing team has received your order!
          </p>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto bg-[#FFFDF7]">
          {/* Order Reference Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                Order Reference No.
              </span>
              <span className="font-mono font-black text-base text-orange-600">
                {order.orderNumber}
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
              <span className="text-[9px] text-orange-700 font-bold">Express Local Dispatch</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                <Banknote className="w-3 h-3 text-emerald-600" />
                <span>Cash to Pay on Delivery</span>
              </span>
              <span className="font-black text-sm sm:text-base text-emerald-700 mt-1 block">
                ₹{order.finalPayable.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-slate-500">Cash or UPI at doorstep</span>
            </div>
          </div>

          {/* Live Order Journey Tracker */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
            <span className="text-[11px] font-black uppercase text-orange-800 block tracking-wider">
              Live Order Progress
            </span>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
              {/* Step 1: Placed */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0">
                  ✓
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Order Received</h5>
                  <p className="text-[10px] text-slate-500">
                    Awaiting quick dispatch approval from shop team
                  </p>
                </div>
              </div>

              {/* Step 2: Packing */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 border border-orange-300 flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0 animate-pulse">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-xs text-orange-800">Packing & Inspection</h5>
                  <p className="text-[10px] text-slate-500">
                    Sivakasi crackers being packed securely in delivery box
                  </p>
                </div>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-amber-50 text-slate-400 border border-amber-200 flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-500">Out for Delivery</h5>
                  <p className="text-[10px] text-slate-400">
                    Rider dispatched with your crackers box
                  </p>
                </div>
              </div>

              {/* Step 4: Doorstep Delivery */}
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-amber-50 text-slate-400 border border-amber-200 flex items-center justify-center font-bold text-xs ring-4 ring-white shrink-0">
                  4
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-500">Delivered & Paid (COD)</h5>
                  <p className="text-[10px] text-slate-400">
                    Crackers handed over at your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address Review */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className="text-slate-900">Delivering to:</strong> {order.customer.address}
              {order.customer.landmark && <span> (Landmark: {order.customer.landmark})</span>}
              <div className="text-slate-500 text-[10px] mt-0.5">
                Contact: {order.customer.phone} • Slot: {order.customer.deliverySlot}
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Notification CTA */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Details to Bheema WhatsApp</span>
          </a>

          {/* Track Order Live Button */}
          <button
            onClick={() => onTrackOrder(order.id)}
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
