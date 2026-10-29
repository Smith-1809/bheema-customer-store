import React, { useState, useMemo, useEffect } from 'react';
import { Product, MASTER_PRODUCTS, CATEGORIES } from './data/products';
import { POPULAR_BUNDLES, BundleDef } from './data/bundles';
import { 
  calculateOnlinePrice, 
  calculateDisplayMrp, 
  calculateDiscountPercent, 
  calculateOnlineSavings, 
  DeliveryOrder 
} from './types/delivery';
import { StorefrontNavbar } from './components/StorefrontNavbar';
import { FestiveHeroBanner } from './components/FestiveHeroBanner';
import { ProductCardOnline } from './components/ProductCardOnline';
import { StoreCartDrawer } from './components/StoreCartDrawer';
import { CodCheckoutModal } from './components/CodCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerOrderTrackerModal } from './components/CustomerOrderTrackerModal';
import { getSupabase } from './lib/supabase';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Gift,
  ArrowUpDown,
  Search,
  X,
  ShieldCheck,
  Truck,
  Banknote,
  Flame,
} from 'lucide-react';

export function App() {
  // Search, Category & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');

  // Cloud Product Images map { [productId]: imageUrl }
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  // Fetch product images from Supabase on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const supabase = getSupabase();
        const { data } = await supabase.from('products').select('id, image_url');
        if (data && Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach((p: any) => {
            if (p.image_url) map[p.id] = p.image_url;
          });
          setProductImages(map);
        }
      } catch (err) {
        console.warn('Could not load remote product images:', err);
      }
    };
    loadImages();
  }, []);

  // Cart State { [productId]: quantity }
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('bheema_online_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState<{ code?: string; discount: number }>({ discount: 0 });
  const [placedOrder, setPlacedOrder] = useState<DeliveryOrder | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

  // Sync cart to local storage
  const updateCart = (newCart: Record<string, number>) => {
    setCart(newCart);
    try {
      localStorage.setItem('bheema_online_cart', JSON.stringify(newCart));
    } catch {}
  };

  // Add to Bag / Update Quantity
  const handleAddToCart = (product: Product) => {
    const currentQty = cart[product.id] || 0;
    const newCart = { ...cart, [product.id]: currentQty + 1 };
    updateCart(newCart);
  };

  const handleUpdateQuantity = (product: Product, newQty: number) => {
    if (newQty <= 0) {
      const newCart = { ...cart };
      delete newCart[product.id];
      updateCart(newCart);
    } else {
      updateCart({ ...cart, [product.id]: newQty });
    }
  };

  const handleClearCart = () => {
    updateCart({});
  };

  // Quick Add Combo Bundle into Cart with 10% Online Pricing
  const handleAddBundleToCart = (bundle: BundleDef) => {
    const updated = { ...cart };
    bundle.items.forEach((item) => {
      const pid = item.productId;
      const current = updated[pid] || 0;
      updated[pid] = current + item.defaultQty;
    });
    updateCart(updated);
    setSelectedBundleId(null);
    setIsCartOpen(true);
  };

  // Totals
  const productMap = useMemo(() => new Map(MASTER_PRODUCTS.map((p) => [p.id, p])), []);

  const { totalCartCount, totalOnlineAmount } = useMemo(() => {
    let count = 0;
    let amount = 0;
    Object.entries(cart).forEach(([pid, qty]) => {
      if (qty > 0) {
        count += qty;
        const prod = productMap.get(pid);
        if (prod) {
          amount += calculateOnlinePrice(prod.sellingPrice) * qty;
        }
      }
    });
    return { totalCartCount: count, totalOnlineAmount: amount };
  }, [cart, productMap]);

  // Filtered & Sorted Catalog
  const filteredProducts = useMemo(() => {
    let result = [...MASTER_PRODUCTS];

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.serialNo.toString() === q ||
          p.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  // Active combo bundle
  const activeBundle = useMemo(
    () => (selectedBundleId ? POPULAR_BUNDLES.find((b) => b.id === selectedBundleId) : null),
    [selectedBundleId]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <StorefrontNavbar
        cartCount={totalCartCount}
        cartTotal={totalOnlineAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28">
        {/* Grand Hero Banner */}
        <FestiveHeroBanner
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenComboModal={(bundleId) => setSelectedBundleId(bundleId)}
        />

        {/* Catalog Control Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-white">
              {selectedCategory === 'All' ? 'Complete Cracker Catalog' : selectedCategory}
            </span>
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="default">Default Catalog</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-600" />
            <h4 className="font-bold text-base text-white">No crackers found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find anything matching "{searchQuery}". Try searching for Flower Pot, Lakshmi, Shot, or GC.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="py-2 px-4 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCardOnline
                key={product.id}
                product={product}
                quantityInCart={cart[product.id] || 0}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                imageUrl={productImages[product.id] || product.imageUrl}
                onOpenDetail={(prod) => setSelectedProductDetail(prod)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Bar on Mobile (when cart has items) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pointer-events-none md:hidden">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-between shadow-2xl shadow-amber-500/30 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-xs">
                  {totalCartCount}
                </span>
                <span>View Cracker Bag</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base">
                  ₹{totalOnlineAmount.toLocaleString('en-IN')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Cart Drawer */}
      <StoreCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        allProducts={MASTER_PRODUCTS}
        productImages={productImages}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={(coupon, discount) => {
          setActiveCoupon({ code: coupon, discount: discount || 0 });
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Cash on Delivery Checkout Modal */}
      <CodCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        allProducts={MASTER_PRODUCTS}
        productImages={productImages}
        appliedCoupon={activeCoupon.code}
        couponDiscount={activeCoupon.discount}
        onOrderSuccess={(order) => {
          setIsCheckoutOpen(false);
          setCart({});
          try {
            localStorage.removeItem('bheema_online_cart');
          } catch {}
          setPlacedOrder(order);
        }}
      />

      {/* Order Success Celebratory Modal */}
      {placedOrder && (
        <OrderSuccessModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
          onTrackOrder={(orderId) => {
            setPlacedOrder(null);
            setTrackingOrderId(orderId);
            setIsTrackerOpen(true);
          }}
        />
      )}

      {/* Customer Live Order Tracker Modal */}
      <CustomerOrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackingOrderId(null);
        }}
        initialOrderId={trackingOrderId || undefined}
      />

      {/* Product Detail Quick View Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              {productImages[selectedProductDetail.id] || selectedProductDetail.imageUrl ? (
                <img
                  src={productImages[selectedProductDetail.id] || selectedProductDetail.imageUrl!}
                  alt={selectedProductDetail.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-2" />
                  <span className="text-xs uppercase font-extrabold text-amber-300">
                    {selectedProductDetail.category}
                  </span>
                </div>
              )}

              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs border border-white/20">
                {calculateDiscountPercent(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)}% OFF Sivakasi MRP
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {selectedProductDetail.category} • Item #{selectedProductDetail.serialNo}
                </span>
                <h3 className="font-black text-lg text-white mt-0.5">
                  {selectedProductDetail.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl text-amber-400">
                  ₹{calculateOnlinePrice(selectedProductDetail.sellingPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{calculateDisplayMrp(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  (Save ₹{calculateOnlineSavings(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)} • {calculateDiscountPercent(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)}% OFF)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sivakasi Premium Quality Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  100% authentic festive fireworks with vibrant colors, high-altitude bursts, and safety certified packaging.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProductDetail);
                    setSelectedProductDetail(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combo Bundle Modal */}
      {activeBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-slate-900 to-rose-500/20 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{activeBundle.name}</h3>
                  <span className="text-[11px] text-amber-300 font-semibold">{activeBundle.tagline}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBundleId(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
              <p className="text-xs text-slate-300">{activeBundle.description}</p>

              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Varieties Included ({activeBundle.items.length} Varieties)
              </span>

              <div className="space-y-1.5 divide-y divide-slate-850">
                {activeBundle.items.map((item, idx) => (
                  <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      {item.defaultQty}x {item.productName}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">10% Online Discount</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-850 border-t border-slate-800 shrink-0">
              <button
                onClick={() => handleAddBundleToCart(activeBundle)}
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Add Full Combo to Bag (1-Click)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Festive Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-8 px-4 text-center space-y-3">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-white font-extrabold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>BHEEMA FIREWORKS • DIWALI 2026</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Fresh Sivakasi standard fireworks with fast local delivery. All products priced at 10% lower direct online rates. Cash on Delivery (COD) available at your doorstep.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-semibold text-slate-400">
            <button onClick={() => setIsTrackerOpen(true)} className="hover:text-amber-300 underline flex items-center gap-1.5">
              <span>Track Your Placed Order</span>
            </button>
            <span>•</span>
            <span className="text-emerald-400 font-bold">100% Cash on Delivery (Doorstep)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
