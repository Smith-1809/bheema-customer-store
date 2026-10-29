import React, { useState, useEffect } from 'react';
import { DeliveryOrder, DeliveryOrderStatus } from '../types/delivery';
import { getLocalDeliveryOrders, fetchDeliveryOrders } from '../lib/deliveryOrders';
import { X, Search, Truck, Clock, CheckCircle2, Package, MapPin, Banknote, Phone, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorNotice('');
    const term = searchTerm.trim().toUpperCase();

    if (!term) {
      setErrorNotice('Please enter an order number or 10-digit phone number');
      return;
    }

    setIsRefreshing(true);
    const orders = await fetchDeliveryOrders();
    setIsRefreshing(false);

    const matches = orders.filter((o) => {
      const cleanPhone = o.customer.phone.replace(/\D/g, '');
      const cleanTerm = term.replace(/\D/g, '');
      return (
        o.orderNumber.toUpperCase().includes(term) ||
        o.id === term ||
        (cleanTerm.length >= 4 && cleanPhone.includes(cleanTerm))
      );
    });

    if (matches.length === 0) {
      setErrorNotice('No matching orders found. Please check your reference or phone number.');
      setSelectedOrder(null);
      setMatchingOrders([]);
    } else if (matches.length === 1) {
      setSelectedOrder(matches[0]);
      setMatchingOrders([]);
    } else {
      setMatchingOrders(matches);
      setSelectedOrder(null);
    }
  };

  const handleRefreshCurrent = async () => {
    if (!selectedOrder) return;
    setIsRefreshing(true);
    const orders = await fetchDeliveryOrders();
    const updated = orders.find((o) => o.id === selectedOrder.id);
    if (updated) {
      setSelectedOrder(updated);
    }
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">Track Your Delivery Order</h3>
              <p className="text-[11px] text-slate-400">Live Status & Doorstep ETA</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Order # (e.g. BHEEMA-COD-4819) or Phone"
                className="w-full py-2 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 uppercase font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              type="submit"
              disabled={isRefreshing}
              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 active:scale-95 transition-all"
            >
              {isRefreshing ? 'Finding...' : 'Track'}
            </button>
          </form>

          {errorNotice && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Multiple matches list */}
          {matchingOrders.length > 0 && !selectedOrder && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-bold block">
                Found {matchingOrders.length} orders for this number:
              </span>
              {matchingOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-xs text-amber-400">{ord.orderNumber}</span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(ord.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-white">₹{ord.finalPayable}</span>
                    <span className="text-[10px] font-bold block text-emerald-400 uppercase">
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
                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                    : selectedOrder.status === 'out_for_delivery'
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                    : selectedOrder.status === 'delivered'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : selectedOrder.status === 'cancelled'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-black text-xs text-white">
                    {selectedOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleRefreshCurrent}
                    disabled={isRefreshing}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Refresh live status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <h4 className="font-black text-lg text-white capitalize mb-1">
                  {selectedOrder.status === 'pending'
                    ? '🟡 Order Received — Awaiting Confirmation'
                    : selectedOrder.status === 'confirmed'
                    ? '🔵 Confirmed & Packing Fresh Crackers'
                    : selectedOrder.status === 'out_for_delivery'
                    ? '🟣 Out for Delivery (Rider Dispatched)'
                    : selectedOrder.status === 'delivered'
                    ? '🟢 Delivered & COD Received!'
                    : '🔴 Order Cancelled'}
                </h4>

                <p className="text-xs opacity-90 leading-relaxed">
                  {selectedOrder.status === 'pending' &&
                    'Your order is in the dispatch queue. Store team will confirm shortly!'}
                  {selectedOrder.status === 'confirmed' &&
                    'Our packing team is packing your fresh Sivakasi crackers right now. Estimated delivery within 1 to 2 hours!'}
                  {selectedOrder.status === 'out_for_delivery' &&
                    `Rider ${selectedOrder.riderName ? `(${selectedOrder.riderName}) ` : ''}is on the way to your address! Please keep ₹${selectedOrder.finalPayable} cash or UPI ready.`}
                  {selectedOrder.status === 'delivered' &&
                    'Order delivered successfully at your doorstep. Happy Diwali from Bheema Fireworks!'}
                  {selectedOrder.status === 'cancelled' &&
                    `Reason: ${selectedOrder.cancellationReason || 'Cancelled by store'}`}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
                  {/* Step 1: Placed */}
                  <div className="space-y-1">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mx-auto text-xs">
                      ✓
                    </div>
                    <span className="text-emerald-400 block">Received</span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full font-black flex items-center justify-center mx-auto text-xs ${
                        ['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status) ? '✓' : '2'}
                    </div>
                    <span
                      className={
                        ['confirmed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'text-emerald-400 block'
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
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {['out_for_delivery', 'delivered'].includes(selectedOrder.status) ? '✓' : '3'}
                    </div>
                    <span
                      className={
                        ['out_for_delivery', 'delivered'].includes(selectedOrder.status)
                          ? 'text-emerald-400 block'
                          : 'text-slate-400 block'
                      }
                    >
                      On the Way
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="space-y-1">
                    <div
                      className={`w-7 h-7 rounded-full font-black flex items-center justify-center mx-auto text-xs ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {selectedOrder.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <span
                      className={
                        selectedOrder.status === 'delivered' ? 'text-emerald-400 block' : 'text-slate-400 block'
                      }
                    >
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Items in this order ({selectedOrder.itemCount} items)
                </span>

                <div className="space-y-1.5 divide-y divide-slate-850">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ₹{item.onlinePrice} each
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-200">
                        ₹{item.itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-300">Total Cash on Delivery:</span>
                  <span className="font-black text-base text-amber-400">
                    ₹{selectedOrder.finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Delivery Address & Contact */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">{selectedOrder.customer.fullName}</strong>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedOrder.customer.address}
                      {selectedOrder.customer.landmark && ` (Near ${selectedOrder.customer.landmark})`}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 pl-5">
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
