import { DeliveryOrder } from '../types/delivery';

const TELEGRAM_BOT_TOKEN = '9058239275:AAFWqcusiBrpHVn8V8PHhWUR7cp2od9YcDg';
const TELEGRAM_CHAT_ID = -5596638147; // Group: Fireworks Online Orders Alerts

const escapeHtml = (text: string): string => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Send an immediate Telegram notification to all 3 partners in the group
 * whenever a new online COD order is placed.
 */
export const sendTelegramOrderAlert = async (order: DeliveryOrder): Promise<boolean> => {
  try {
    const customer = order.customer;
    const phone = customer.phone || (customer as any).phoneNumber || '';
    const address =
      customer.address ||
      [(customer as any).addressLine1, (customer as any).addressLine2].filter(Boolean).join(', ') ||
      '';

    const itemsPreview = order.items
      .map(
        (it) =>
          `• <b>${escapeHtml(it.productName)}</b> × ${it.quantity} (₹${(it.onlinePrice * it.quantity).toLocaleString('en-IN')})`
      )
      .join('\n');

    const message = [
      `🚨 <b>NEW DIWALI ONLINE ORDER!</b> 🚨`,
      ``,
      `📦 <b>Order ID:</b> <code>${escapeHtml(order.orderNumber)}</code>`,
      `💰 <b>Total COD Payable:</b> <b>₹${order.finalPayable.toLocaleString('en-IN')}</b>`,
      `🛍️ <b>Total Quantity:</b> ${order.itemCount} items`,
      ``,
      `👤 <b>Customer Details:</b>`,
      `• <b>Name:</b> ${escapeHtml(customer.fullName)}`,
      `• <b>Mobile:</b> 📞 <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>`,
      `• <b>Address:</b> ${escapeHtml(address)}`,
      customer.pincode ? `• <b>Pincode:</b> ${escapeHtml(customer.pincode)}` : '',
      customer.landmark ? `• <b>Landmark:</b> ${escapeHtml(customer.landmark)}` : '',
      customer.deliverySlot ? `• <b>Delivery Slot:</b> ${escapeHtml(customer.deliverySlot)}` : '',
      customer.notes ? `• <b>Customer Note:</b> <i>${escapeHtml(customer.notes)}</i>` : '',
      ``,
      `🛒 <b>Ordered Items (${order.items.length}):</b>`,
      itemsPreview,
      ``,
      `⚡ <a href="https://bheema-2.vercel.app/?view=dispatch"><b>👉 OPEN DISPATCH HUB IN COUNTER POS</b></a>`,
      `<i>Bheema Fireworks • Real-Time Order Dispatch</i>`,
    ]
      .filter((line) => line !== '')
      .join('\n');

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.warn('Telegram API notice:', data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to send Telegram alert (non-blocking):', err);
    return false;
  }
};

/**
 * Send an update alert when an order status changes (Confirmed, Dispatched, Delivered, Cancelled)
 */
export const sendTelegramStatusAlert = async (
  order: DeliveryOrder,
  newStatus: string,
  extraNote?: string
): Promise<boolean> => {
  try {
    const customer = order.customer;
    const phone = customer.phone || (customer as any).phoneNumber || '';

    const statusIcons: Record<string, string> = {
      confirmed: '✅ <b>ORDER CONFIRMED & PACKING</b>',
      out_for_delivery: '🚚 <b>OUT FOR DELIVERY / DISPATCHED</b>',
      delivered: '🎉 <b>ORDER DELIVERED SUCCESSFULLY</b>',
      cancelled: '❌ <b>ORDER CANCELLED</b>',
    };

    const statusHeader = statusIcons[newStatus] || `ℹ️ <b>ORDER STATUS: ${newStatus.toUpperCase()}</b>`;

    const message = [
      statusHeader,
      ``,
      `📦 <b>Order ID:</b> <code>${escapeHtml(order.orderNumber)}</code>`,
      `👤 <b>Customer:</b> ${escapeHtml(order.customer.fullName)} (${escapeHtml(phone)})`,
      `💰 <b>Amount:</b> ₹${order.finalPayable.toLocaleString('en-IN')}`,
      extraNote ? `📝 <b>Note:</b> ${escapeHtml(extraNote)}` : '',
      order.riderName ? `🛵 <b>Rider / Partner:</b> ${escapeHtml(order.riderName)}` : '',
      ``,
      `⚡ <a href="https://bheema-2.vercel.app/?view=dispatch"><b>View in Dispatch Hub</b></a>`,
    ]
      .filter((line) => line !== '')
      .join('\n');

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();
    return !!data.ok;
  } catch (err) {
    console.warn('Telegram status alert failed (non-blocking):', err);
    return false;
  }
};
