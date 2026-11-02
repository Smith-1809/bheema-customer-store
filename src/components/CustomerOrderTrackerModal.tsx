import React, { useState, useEffect } from 'react';
import { DeliveryOrder, DeliveryOrderStatus } from '../types/delivery';
import { getLocalDeliveryOrders, fetchDeliveryOrders, subscribeToDeliveryOrders } from '../lib/deliveryOrders';
import { X, Search, Truck, Clock, CheckCircle2, Package, MapPin, Banknote, Phone, MessageSquare, RefreshCw, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface CustomerOrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const CustomerOrderTrackerModal: React.FC<CustomerOrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [matchingOrders, setMatchingOrders] = useState<DeliveryOrder[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // Initial load
  useEffect(() => {
    if (!isOpen) return;

    const loadInitial = async () => {
      const orders = await fetchDeliveryOrders();
      if (initialOrderId) {
        const found = orders.find((o) => o.id === initialOrderId || o.orderNumber === initialOrderId);
        if (found) {
          setSelectedOrder(found);
          setSearchTerm(found.orderNumber);
          return;
        }
      }

      // Check last saved order ID
      try {
        const lastId = localStorage.getItem('bheema_customer_last_order_id');
        if (lastId) {
          const found = orders.find((o) => o.id === lastId);
          if (found) {
            setSelectedOrder(found);
            setSearchTerm(found.orderNumber);
            return;
          }
        }
      } catch {}
    };

    loadInitial();
  }, [isOpen, initialOrderId]);

  // Real-time subscription & periodic polling while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeToDeliveryOrders(
      () => {},
      (updatedOrder) => {
        setSelectedOrder((prev) => {
          if (!prev) return null;
          if (prev.id === updatedOrder.id || prev.orderNumber === updatedOrder.orderNumber) {
            return updatedOrder;
          }
          return prev;
        });
      }
    );

    const pollInterval = setInterval(async () => {
      if (!selectedOrder) return;
      try {
        const all = await fetchDeliveryOrders();
        const found = all.find((o) => o.id === selectedOrder.id || o.orderNumber === selectedOrder.orderNumber);
        if (found && (found.status !== selectedOrder.status || found.updatedAt !== selectedOrder.updatedAt)) {
          setSelectedOrder(found);
        }
      } catch {}
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [isOpen, selectedOrder?.id]);

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorNotice('');
    const term = searchTerm.trim().toUpperCase();

    if (!term) {
      setErrorNotice('Please enter an order number or phone number');
      return;
    }

    const all = await fetchDeliveryOrders();
    const cleanDigits = term.replace(/\D/g, '');

    const matches = all.filter((o) => {
      const matchOrderNum = o.orderNumber.toUpperCase().includes(term);
      const matchPhone = cleanDigits.length >= 4 && o.customer.phone.replace(/\D/g, '').includes(cleanDigits);
      return matchOrderNum || matchPhone;
    });

    if (matches.length === 0) {
      setErrorNotice(`No order found matching "${term}". Please check and try again.`);
      setSelectedOrder(null);
      setMatchingOrders([]);
    } else if (matches.length === 1) {
      setSelectedOrder(matches[0]);
      setMatchingOrders([]);
    } else {
      setSelectedOrder(null);
      setMatchingOrders(matches);
    }
  };

  const handleRefreshCurrent = async () => {
    if (!selectedOrder) return;
    setIsRefreshing(true);
    const all = await fetchDeliveryOrders();
    const refreshed = all.find((o) => o.id === selectedOrder.id);
    if (refreshed) {
      setSelectedOrder(refreshed);
    }
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white border border-amber-200 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between border-b border-orange-400">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">Track Your Order Live</h3>
              <p className="text-[11px] text-amber-100 font-semibold">
                Real-Time Delivery & Packing Progress
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Search Form */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto bg-[#FFFDF7]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Order # (e.g. BHEEMA-COD-4819) or Phone"
                className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-orange-600 absolute left-3 top-3 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all shrink-0"
            >
              Track
            </button>
          </form>

          {errorNotice && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Multiple matches list */}
          {matchingOrders.length > 0 && !selectedOrder && (
            <div className="space-y-2">
              <span className="text-xs text-slate-600 font-bold block">
                Found {matchingOrders.length} orders for this number:
              </span>
              {matchingOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="p-3 rounded-xl bg-white border border-amber-200 hover:border-orange-400 cursor-pointer flex items-center justify-between transition-colors shadow-2xs"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-orange-600">{ord.orderNumber}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(ord.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-slate-900">
                      ₹{(ord.codBalance ?? ord.finalPayable).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold block text-emerald-700 uppercase">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Order Details & Status Card */}
          {selectedOrder && (
            <div className="space-y-4 animate-fade-in">
              {/* Order Status Banner */}
              <div
                className={`p-4 rounded-2xl border text-center ${
                  selectedOrder.status === 'confirmed'
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : selectedOrder.status === 'out_for_delivery'
                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                    : selectedOrder.status === 'delivered'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : selectedOrder.status === 'cancelled'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-black text-xs text-slate-900">
                    {selectedOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleRefreshCurrent}
                    disabled={isRefreshing}
                    className="p-1 rounded-lg hover:bg-black/5 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Refresh live status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <h4 className="font-black text-lg text-slate-900 capitalize mb-1">
                  {selectedOrder.status === 'pending'
                    ? selectedOrder.advanceAmount
                      ? '🟡 20% Advance Received — Verifying with Bank'
                      : '🟡 Order Received — Awaiting Confirmation'
                    : selectedOrder.status === 'confirmed'
                    ? '🔵 Advance Verified & Packing Crackers'
                    : selectedOrder.status === 'out_for_delivery'
                    ? '🟣 Out for Delivery (Rider on the Way)'
                    : selectedOrder.status === 'delivered'
                    ? '🟢 Delivered & COD Received!'
                    : '🔴 Order Cancelled'}
                </h4>

                <p className="text-xs opacity-90 leading-relaxed text-slate-700">
                  {selectedOrder.status === 'pending' && (
                    selectedOrder.advanceAmount
                      ? `Matching ₹${selectedOrder.advanceAmount} advance credit for UTR ${selectedOrder.utrNumber}. Store will accept in ~1-2 mins!`
                      : 'Your order is in the dispatch queue. Store team will confirm shortly!'
                  )}
                  {selectedOrder.status === 'confirmed' &&
                    '20% Advance confirmed. Our packing team is preparing your fresh Sivakasi crackers right now for express delivery to NIT Gate!'}
                  {selectedOrder.status === 'out_for_delivery' &&
                    `Rider ${selectedOrder.riderName ? `(${selectedOrder.riderName}) ` : ''}is dispatched! Please keep ₹${(selectedOrder.codBalance ?? selectedOrder.finalPayable).toLocaleString('en-IN')} cash or UPI ready at entry gate.`}
                  {selectedOrder.status === 'delivered' &&
                    'Order delivered successfully at your gate. Happy Diwali from Bheema Fireworks!'}
                  {selectedOrder.status === 'cancelled' &&
                    `Reason: ${selectedOrder.cancellationReason || 'Cancelled by store'}`}
                </p>
              </div>

              {/* 20% Advance Token Summary Badge */}
              {selectedOrder.advanceAmount && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                      20% Advance Booking Token
                    </span>
                    <span className="font-black text-emerald-700 text-sm">
                      ₹{selectedOrder.advanceAmount.toLocaleString('en-IN')} Paid Online
                    </span>
                    {selectedOrder.utrNumber && (
                      <span className="text-[10px] text-slate-500 block font-mono">
                        UTR: {selectedOrder.utrNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block">Gate COD Due:</span>
                    <span className="font-black text-orange-600 text-sm">
                      ₹{(selectedOrder.codBalance ?? selectedOrder.finalPayable).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                  {/* Step 1: Placed / Advance */}
                  <div className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto text-xs shadow-xs">
                      ✓
                    </div>
                    <span className="text-emerald-700 block truncate">
                      {selectedOrder.advanceAmount ? 'Advance' : 'Received'}
                    </span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full font-black flex items-center justify-center mx-auto text-xs ${
                        ['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-amber-100 text-slate-500'
                      }`}
                    >
                      {['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status) ? '✓' : '2'}
                    </div>
                    <span
                      className={
                        ['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'text-emerald-700 block'
                          : 'text-slate-400 block'
                      }
                    >
                      Packing
                    </span>
                  </div>

                  {/* Step 3: Out for Delivery */}
                  <div className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full font-black flex items-center justify-center mx-auto text-xs ${
                        ['out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-amber-100 text-slate-500'
                      }`}
                    >
                      {['out_for_delivery', 'delivered'].includes(selectedOrder.status) ? '✓' : '3'}
                    </div>
                    <span
                      className={
                        ['out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'text-emerald-700 block'
                          : 'text-slate-400 block'
                      }
                    >
                      On Way
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full font-black flex items-center justify-center mx-auto text-xs ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-amber-100 text-slate-500'
                      }`}
                    >
                      {selectedOrder.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <span
                      className={
                        selectedOrder.status === 'delivered' ? 'text-emerald-700 block' : 'text-slate-400 block'
                      }
                    >
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  Items in this order ({selectedOrder.itemCount} items)
                </span>

                <div className="space-y-1.5 divide-y divide-amber-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          ₹{item.onlinePrice} each
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-700">
                        ₹{item.itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-amber-200 space-y-1 text-xs">
                  {selectedOrder.advanceAmount ? (
                    <>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Order Total:</span>
                        <span>₹{selectedOrder.totalOnlineAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-700 text-[11px] font-bold">
                        <span>20% Advance Online (Paid):</span>
                        <span>-₹{selectedOrder.advanceAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-1 border-t border-dashed border-amber-200 flex items-baseline justify-between">
                        <span className="font-bold text-slate-900">Balance at Gate (80% COD):</span>
                        <span className="font-black text-base text-orange-600">
                          ₹{(selectedOrder.codBalance ?? selectedOrder.finalPayable).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-700">Total Cash on Delivery:</span>
                      <span className="font-black text-base text-orange-600">
                        ₹{selectedOrder.finalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address & Contact */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">{selectedOrder.customer.fullName}</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {selectedOrder.customer.address}
                      {selectedOrder.customer.landmark && ` (Near ${selectedOrder.customer.landmark})`}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pl-5">
                  Slot: {selectedOrder.customer.deliverySlot} • WhatsApp: {selectedOrder.customer.phone}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
