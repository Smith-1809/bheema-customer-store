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
  retailPrice: number;     // Strikethrough Printed MRP
  onlinePrice: number;     // Actual payable selling price
  savingsPerUnit: number;  // retailPrice - onlinePrice
  itemTotal: number;       // quantity * onlinePrice
  discountPercent?: number;// e.g. 75, 86, 90
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
 * Authoritative Sivakasi Category MRP Multipliers
 * Lakshmi / Bird / Jalli Kattu: *4 (75% OFF)
 * FP: *7 (86% OFF)
 * Atom / Bullet / Naraout: *7 (86% OFF)
 * Fancy: *7.5 (87% OFF)
 * GC: *7 (86% OFF)
 * T-Star / Thread: *9 (89% OFF)
 * Pencil: *8 (88% OFF)
 * Comet / Shot: *9 (89% OFF)
 * Wala: *10 (90% OFF)
 * Rocket: *8 (88% OFF)
 * Pipe: *6 (83% OFF)
 * Other / Unclassified: *4 (75% OFF)
 */
export const CATEGORY_MRP_MULTIPLIERS: Record<string, number> = {
  'Lakshmi / Bird / Jalli Kattu': 4,
  'FP': 7,
  'Atom / Bullet / Naraout': 7,
  'Fancy': 7.5,
  'GC': 7,
  'T-Star / Thread': 9,
  'Pencil': 8,
  'Comet / Shot': 9,
  'Wala': 10,
  'Rocket': 8,
  'Pipe': 6,
  'Other / Unclassified': 4,
};

export const getCategoryMultiplier = (category?: string): number => {
  if (!category) return 4;
  if (CATEGORY_MRP_MULTIPLIERS[category]) {
    return CATEGORY_MRP_MULTIPLIERS[category];
  }
  const cat = category.toLowerCase().trim();
  if (cat.includes('lakshmi') || cat.includes('bird') || cat.includes('jalli')) return 4;
  if (cat.includes('fp') || cat.includes('flower')) return 7;
  if (cat.includes('atom') || cat.includes('bullet') || cat.includes('naraout')) return 7;
  if (cat.includes('fancy')) return 7.5;
  if (cat.includes('gc') || cat.includes('chakkar')) return 7;
  if (cat.includes('star') || cat.includes('thread')) return 9;
  if (cat.includes('pencil')) return 8;
  if (cat.includes('comet') || cat.includes('shot')) return 9;
  if (cat.includes('wala') || cat.includes('garland')) return 10;
  if (cat.includes('rocket')) return 8;
  if (cat.includes('pipe')) return 6;
  return 4;
};

/**
 * Calculates the payable online price (customer actual price)
 */
export const calculateOnlinePrice = (retailPrice: number): number => {
  if (retailPrice <= 0) return 0;
  const discounted = retailPrice * 0.90;
  return Math.max(1, Math.round(discounted));
};

/**
 * Calculates the printed strikethrough MRP based on category multiplier
 */
export const calculateDisplayMrp = (payablePrice: number, category?: string): number => {
  if (payablePrice <= 0) return 0;
  const mult = getCategoryMultiplier(category);
  return Math.round(payablePrice * mult);
};

/**
 * Calculates the displayed festive discount percentage (e.g. 75%, 86%, 90%)
 */
export const calculateDiscountPercent = (payablePrice: number, category?: string): number => {
  const mrp = calculateDisplayMrp(payablePrice, category);
  if (mrp <= 0 || mrp <= payablePrice) return 0;
  return Math.round(((mrp - payablePrice) / mrp) * 100);
};

/**
 * Calculates the savings amount in Rupees against the printed MRP
 */
export const calculateOnlineSavings = (payablePrice: number, category?: string): number => {
  const mrp = calculateDisplayMrp(payablePrice, category);
  return Math.max(0, mrp - payablePrice);
};

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_DELIVERY_FEE = 49;
