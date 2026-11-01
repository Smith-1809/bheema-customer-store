import { DeliveryOrder, DeliveryOrderStatus, DeliveryOrderItem, DeliveryCustomerInfo, calculateOnlinePrice, calculateOnlineSavings } from '../types/delivery';
import { getSupabase } from './supabase';
import { playNewOrderAlert, playOrderConfirmedAlert, playOrderDeliveredAlert } from '../utils/deliveryAudio';
import { sendTelegramOrderAlert } from './telegramAlerts';

const STORAGE_KEY = 'bheema_online_delivery_orders';
const LAST_ORDER_KEY = 'bheema_customer_last_order_id';

/**
 * Get all delivery orders from local storage
 */
export const getLocalDeliveryOrders = (): DeliveryOrder[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading local delivery orders:', err);
    return [];
  }
};

/**
 * Save orders to local storage
 */
export const saveLocalDeliveryOrders = (orders: DeliveryOrder[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn('Error saving local delivery orders:', err);
  }
};

/**
 * Fetch all delivery orders from Supabase (falling back to localStorage)
 */
export const fetchDeliveryOrders = async (): Promise<DeliveryOrder[]> => {
  const localOrders = getLocalDeliveryOrders();
  const supabase = getSupabase();

  if (!supabase) {
    return localOrders;
  }

  try {
    const { data, error } = await supabase
      .from('delivery_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase delivery_orders fetch warning (using local):', error.message);
      return localOrders;
    }

    if (data && Array.isArray(data)) {
      const mapped: DeliveryOrder[] = data.map((row: any) => ({
        id: row.id,
        orderNumber: row.order_number,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        customer: row.customer,
        items: row.items,
        itemCount: row.item_count,
        totalRetailAmount: Number(row.total_retail_amount),
        totalOnlineAmount: Number(row.total_online_amount),
        discountSavings: Number(row.discount_savings),
        appliedCoupon: row.applied_coupon || undefined,
        couponDiscount: Number(row.coupon_discount || 0),
        deliveryFee: Number(row.delivery_fee || 0),
        finalPayable: Number(row.final_payable),
        paymentMethod: 'COD',
        status: row.status as DeliveryOrderStatus,
        statusHistory: row.status_history || [],
        riderName: row.rider_name || undefined,
        cancellationReason: row.cancellation_reason || undefined,
        adminNotes: row.admin_notes || undefined,
        source: 'online_store',
      }));

      // Merge with any local orders not yet synced
      const remoteIds = new Set(mapped.map((o) => o.id));
      const unsyncedLocal = localOrders.filter((o) => !remoteIds.has(o.id));
      const combined = [...unsyncedLocal, ...mapped].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      saveLocalDeliveryOrders(combined);
      return combined;
    }

    return localOrders;
  } catch (err) {
    console.warn('Could not fetch delivery orders from Supabase:', err);
    return localOrders;
  }
};

/**
 * Generate a friendly unique order reference like "BHEEMA-COD-4819"
 */
export const generateOrderNumber = (): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `BHEEMA-COD-${randomSuffix}`;
};

/**
 * Place a new Cash on Delivery Order from Storefront
 */
export const placeCodOrder = async (
  customer: DeliveryCustomerInfo,
  items: DeliveryOrderItem[],
  appliedCoupon?: string,
  couponDiscount: number = 0,
  deliveryFee: number = 0
): Promise<DeliveryOrder> => {
  const now = new Date().toISOString();
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = generateOrderNumber();

  const totalRetailAmount = items.reduce((sum, item) => sum + item.retailPrice * item.quantity, 0);
  const totalOnlineAmount = items.reduce((sum, item) => sum + item.onlinePrice * item.quantity, 0);
  const discountSavings = totalRetailAmount - totalOnlineAmount + couponDiscount;
  const finalPayable = Math.max(0, totalOnlineAmount - couponDiscount + deliveryFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const newOrder: DeliveryOrder = {
    id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
    customer,
    items,
    itemCount,
    totalRetailAmount,
    totalOnlineAmount,
    discountSavings,
    appliedCoupon: appliedCoupon || undefined,
    couponDiscount,
    deliveryFee,
    finalPayable,
    paymentMethod: 'COD',
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: now,
        note: 'Order placed by customer via online COD storefront. Awaiting store dispatch approval.',
      },
    ],
    source: 'online_store',
  };

  // 1. Save to local storage
  const currentOrders = getLocalDeliveryOrders();
  const updatedOrders = [newOrder, ...currentOrders];
  saveLocalDeliveryOrders(updatedOrders);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_ORDER_KEY, newOrder.id);
  }

  // 2. Sync to Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('delivery_orders').insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        customer: newOrder.customer,
        items: newOrder.items,
        item_count: newOrder.itemCount,
        total_retail_amount: newOrder.totalRetailAmount,
        total_online_amount: newOrder.totalOnlineAmount,
        discount_savings: newOrder.discountSavings,
        applied_coupon: newOrder.appliedCoupon || null,
        coupon_discount: newOrder.couponDiscount,
        delivery_fee: newOrder.deliveryFee,
        final_payable: newOrder.finalPayable,
        payment_method: 'COD',
        status: newOrder.status,
        status_history: newOrder.statusHistory,
        rider_name: null,
        cancellation_reason: null,
        admin_notes: null,
        source: 'online_store',
        created_at: newOrder.createdAt,
        updated_at: newOrder.updatedAt,
      });

      if (error) {
        console.warn('Supabase delivery order insert note:', error.message);
      } else {
        // Auto-decrement current_stock for ordered items in Supabase
        for (const item of newOrder.items) {
          try {
            const { data: pData } = await supabase
              .from('products')
              .select('current_stock')
              .eq('id', item.productId)
              .maybeSingle();

            if (pData && typeof pData.current_stock === 'number') {
              const updatedStock = Math.max(0, pData.current_stock - item.quantity);
              await supabase
                .from('products')
                .update({ current_stock: updatedStock })
                .eq('id', item.productId);
            }
          } catch (stockErr) {
            console.warn('Could not auto-decrement stock for item', item.productId, stockErr);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to insert delivery order into Supabase (queued locally):', err);
    }
  }

  // 3. Instant Telegram push alert to all partners group (rings lock-screen even with app closed)
  sendTelegramOrderAlert(newOrder).catch((err) => {
    console.warn('Telegram background alert notification error:', err);
  });

  return newOrder;
};

/**
 * Update delivery order status (Accept & Confirm, Dispatch, Deliver, Cancel)
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: DeliveryOrderStatus,
  opts?: {
    note?: string;
    updatedBy?: string;
    riderName?: string;
    cancellationReason?: string;
    adminNotes?: string;
  }
): Promise<DeliveryOrder | null> => {
  const orders = getLocalDeliveryOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const order = orders[index];
  const now = new Date().toISOString();

  const historyEntry: any = {
    status: newStatus,
    timestamp: now,
    note: opts?.note || `Status updated to ${newStatus}`,
    updatedBy: opts?.updatedBy || 'Bheema Admin',
  };

  const updatedOrder: DeliveryOrder = {
    ...order,
    status: newStatus,
    updatedAt: now,
    riderName: opts?.riderName !== undefined ? opts.riderName : order.riderName,
    cancellationReason: opts?.cancellationReason !== undefined ? opts.cancellationReason : order.cancellationReason,
    adminNotes: opts?.adminNotes !== undefined ? opts.adminNotes : order.adminNotes,
    statusHistory: [...order.statusHistory, historyEntry],
  };

  orders[index] = updatedOrder;
  saveLocalDeliveryOrders(orders);

  // Play appropriate sound
  if (newStatus === 'confirmed') {
    playOrderConfirmedAlert();
  } else if (newStatus === 'delivered') {
    playOrderDeliveredAlert();
  }

  // Update in Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('delivery_orders')
        .update({
          status: newStatus,
          updated_at: now,
          rider_name: updatedOrder.riderName || null,
          cancellation_reason: updatedOrder.cancellationReason || null,
          admin_notes: updatedOrder.adminNotes || null,
          status_history: updatedOrder.statusHistory,
        })
        .eq('id', orderId);

      // If cancelled and previously active, restore stock back to products table
      if (newStatus === 'cancelled' && order.status !== 'cancelled') {
        for (const item of order.items) {
          try {
            const { data: pData } = await supabase
              .from('products')
              .select('current_stock')
              .eq('id', item.productId)
              .maybeSingle();
            if (pData && typeof pData.current_stock === 'number') {
              await supabase
                .from('products')
                .update({ current_stock: pData.current_stock + item.quantity })
                .eq('id', item.productId);
            }
          } catch (rErr) {
            console.warn('Could not restore stock on cancellation:', rErr);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to update delivery order in Supabase:', err);
    }
  }

  return updatedOrder;
};

/**
 * Subscribe to realtime order updates
 */
export const subscribeToDeliveryOrders = (
  onOrderAdded: (order: DeliveryOrder) => void,
  onOrderUpdated: (order: DeliveryOrder) => void
) => {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channelId = `delivery_orders_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'delivery_orders' },
        (payload) => {
          try {
            const row = payload.new;
            if (!row) return;
            const mapped: DeliveryOrder = {
              id: row.id,
              orderNumber: row.order_number,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              customer: row.customer,
              items: row.items,
              itemCount: row.item_count,
              totalRetailAmount: Number(row.total_retail_amount),
              totalOnlineAmount: Number(row.total_online_amount),
              discountSavings: Number(row.discount_savings),
              appliedCoupon: row.applied_coupon || undefined,
              couponDiscount: Number(row.coupon_discount || 0),
              deliveryFee: Number(row.delivery_fee || 0),
              finalPayable: Number(row.final_payable),
              paymentMethod: 'COD',
              status: row.status as DeliveryOrderStatus,
              statusHistory: row.status_history || [],
              riderName: row.rider_name || undefined,
              cancellationReason: row.cancellation_reason || undefined,
              adminNotes: row.admin_notes || undefined,
              source: 'online_store',
            };
            onOrderAdded(mapped);
          } catch (err) {
            console.error('Error handling realtime insert:', err);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'delivery_orders' },
        (payload) => {
          try {
            const row = payload.new;
            if (!row) return;
            const mapped: DeliveryOrder = {
              id: row.id,
              orderNumber: row.order_number,
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              customer: row.customer,
              items: row.items,
              itemCount: row.item_count,
              totalRetailAmount: Number(row.total_retail_amount),
              totalOnlineAmount: Number(row.total_online_amount),
              discountSavings: Number(row.discount_savings),
              appliedCoupon: row.applied_coupon || undefined,
              couponDiscount: Number(row.coupon_discount || 0),
              deliveryFee: Number(row.delivery_fee || 0),
              finalPayable: Number(row.final_payable),
              paymentMethod: 'COD',
              status: row.status as DeliveryOrderStatus,
              statusHistory: row.status_history || [],
              riderName: row.rider_name || undefined,
              cancellationReason: row.cancellation_reason || undefined,
              adminNotes: row.admin_notes || undefined,
              source: 'online_store',
            };
            onOrderUpdated(mapped);
          } catch (err) {
            console.error('Error handling realtime update:', err);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.warn('Realtime delivery subscription status:', status, err);
        }
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        console.warn('Error removing channel:', err);
      }
    };
  } catch (err) {
    console.error('Failed to subscribe to delivery orders realtime:', err);
    return () => {};
  }
};

/**
 * Format WhatsApp confirmation link for Admin to send customer
 */
export const getWhatsAppCustomerUpdateUrl = (order: DeliveryOrder, type: 'confirm' | 'dispatch' | 'delivered'): string => {
  const cleanPhone = order.customer.phone.replace(/\D/g, '').slice(-10);
  let message = '';

  if (type === 'confirm') {
    message = 
`🎉 *Bheema Fireworks — Order CONFIRMED!* 🪔

Namaste *${order.customer.fullName}*!
We have confirmed your Diwali Crackers order *#${order.orderNumber}*!

📦 *Delivery Status:* CONFIRMED & PACKING
⏱️ *Estimated Delivery:* Within 1 to 2 Hours
💵 *Cash to Pay on Delivery:* ₹${order.finalPayable.toLocaleString('en-IN')}
📍 *Delivery Address:* ${order.customer.address}, Landmark: ${order.customer.landmark || 'N/A'}

Our packing team is preparing your fresh, premium crackers right now. 
Please keep cash or UPI ready for the delivery partner.

Happy Diwali from Bheema Fireworks! 🎆`;
  } else if (type === 'dispatch') {
    message = 
`🛵 *Bheema Fireworks — Order OUT FOR DELIVERY!* 🎆

Dear *${order.customer.fullName}*,
Your cracker box (*#${order.orderNumber}*) is on the way!

🛵 *Delivery Rider:* ${order.riderName || 'Bheema Express Rider'}
⏱️ *Arriving In:* 20 - 30 Minutes
💵 *COD Payable:* ₹${order.finalPayable.toLocaleString('en-IN')} (Cash / UPI)

Please be available at: ${order.customer.address}

Get ready to light up your Diwali! 🪔✨`;
  } else {
    message = 
`🪔 *Bheema Fireworks — Order DELIVERED!* ✨

Namaste *${order.customer.fullName}*,
Your Diwali Crackers order *#${order.orderNumber}* of ₹${order.finalPayable.toLocaleString('en-IN')} has been delivered successfully!

Thank you for choosing Bheema Fireworks for your family celebrations. 
May the divine lights of Diwali bring abundance, health, and endless joy! 🎆🪔`;
  }

  const encoded = encodeURIComponent(message);
  if (cleanPhone.length === 10) {
    return `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
};

export const BHEEMA_OFFICIAL_WHATSAPP = '919390068197';

/**
 * Format WhatsApp order placed message for customer to send to store
 */
export const getCustomerOrderWhatsAppUrl = (order: DeliveryOrder, storePhone = BHEEMA_OFFICIAL_WHATSAPP): string => {
  const itemsText = order.items
    .map((i) => `• ${i.quantity}x ${i.productName} (₹${i.itemTotal})`)
    .join('\n');

  const message = 
`🪔 *NEW BHEEMA FIREWORKS COD ORDER* 🎆

Order Reference: *#${order.orderNumber}*
Customer Name: *${order.customer.fullName}*
Phone: *${order.customer.phone}*
Address: *${order.customer.address}*
Landmark: *${order.customer.landmark || 'N/A'}*
Delivery Slot: *${order.customer.deliverySlot}*

*Items Ordered:*
${itemsText}

----------------------------
*Total Items:* ${order.itemCount}
*Online Direct Price:* ₹${order.totalOnlineAmount.toLocaleString('en-IN')}
${order.couponDiscount > 0 ? `*Coupon Discount:* -₹${order.couponDiscount}\n` : ''}*Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
*TOTAL COD PAYABLE:* *₹${order.finalPayable.toLocaleString('en-IN')}*
----------------------------

Please confirm and dispatch my order. Thank you!`;

  return `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodeURIComponent(message)}`;
};
