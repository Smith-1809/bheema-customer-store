/**
 * Google Analytics 4 (GA4) Integration for Bheema Fireworks
 * Measurement ID: G-7JBS584JD7
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-7JBS584JD7';

/**
 * Send custom event to Google Analytics 4
 */
export const trackGAEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track Add to Cart
 */
export const trackAddToCart = (productName: string, productId: string, price: number, quantity: number = 1) => {
  trackGAEvent('add_to_cart', {
    currency: 'INR',
    value: price * quantity,
    items: [
      {
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity,
      },
    ],
  });
};

/**
 * Track Initiate Checkout
 */
export const trackBeginCheckout = (value: number, itemCount: number) => {
  trackGAEvent('begin_checkout', {
    currency: 'INR',
    value: value,
    items_count: itemCount,
  });
};

/**
 * Track Successful Order Purchase
 */
export const trackPurchase = (orderId: string, value: number, itemCount: number) => {
  trackGAEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: value,
    items_count: itemCount,
  });
};

/**
 * Track Product Search
 */
export const trackSearch = (searchTerm: string) => {
  if (!searchTerm.trim()) return;
  trackGAEvent('search', {
    search_term: searchTerm.trim(),
  });
};
