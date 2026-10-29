import { Product } from '../data/products';

export type DeliveryOrderStatus = 
  | 'pending'           // 🟡 New COD Order placed by customer, awaiting admin approval
  | 'confirmed'         // 🔵 Accepted by store, packing in progress (estimated 1-2 hours)
  | 'out_for_delivery'  // 🟣 Assigned to rider, out on the road
  | 'delivered'         // 🟢 Successfully delivered & Cash/UPI collected
  | 'cancelled';        // 🔴 Cancelled by store or customer

export interface DeliveryOrderItem {
  productId: string;
  serialNo: number;
  productName: string;
  category: string;
  quantity: number;
  retailPrice: number;     // Crossed-out Retail MRP
  onlinePrice: number;     // 10% lower direct online price
  savingsPerUnit: number;  // retailPrice - onlinePrice
  itemTotal: number;       // quantity * onlinePrice
  imageUrl?: string | null;
}

export interface DeliveryCustomerInfo {
  fullName: string;
  phone: string;           // 10-digit WhatsApp number
  address: string;         // Door / Flat / House, Street, Area
  landmark: string;        // Nearby landmark (Temple, School, etc.)
  city: string;            // Default: local city / delivery zone
  pincode: string;
  deliverySlot: string;    // e.g. "Express (1-2 Hours)", "Evening (6 PM - 9 PM)"
  notes?: string;          // Special instructions
}

export interface StatusHistoryEntry {
  status: DeliveryOrderStatus;
  timestamp: string;
  note: string;
  updatedBy?: string;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;              // e.g. "BHEEMA-COD-8492"
  createdAt: string;
  updatedAt: string;
  customer: DeliveryCustomerInfo;
  items: DeliveryOrderItem[];
  itemCount: number;
  totalRetailAmount: number;        // Total if purchased at retail
  totalOnlineAmount: number;        // Subtotal at 10% discounted online price
  discountSavings: number;          // Total ₹ saved by ordering online
  appliedCoupon?: string;           // Promo code if applied
  couponDiscount: number;           // Extra coupon discount amount
  deliveryFee: number;              // Free above ₹999 or ₹0
  finalPayable: number;             // Total COD amount to collect at doorstep
  paymentMethod: 'COD';
  status: DeliveryOrderStatus;
  statusHistory: StatusHistoryEntry[];
  riderName?: string;               // Assigned delivery boy / partner (NAGA, SAI, SMITH, etc.)
  cancellationReason?: string;
  adminNotes?: string;
  source: 'online_store';
}

/**
 * Calculates the standard 10% discount for online store listing
 * Rounds to nearest whole rupee for clean pricing
 */
export const calculateOnlinePrice = (retailPrice: number): number => {
  if (retailPrice <= 0) return 0;
  const discounted = retailPrice * 0.90;
  return Math.max(1, Math.round(discounted));
};

export const calculateOnlineSavings = (retailPrice: number): number => {
  const online = calculateOnlinePrice(retailPrice);
  return Math.max(0, retailPrice - online);
};

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_DELIVERY_FEE = 49;
