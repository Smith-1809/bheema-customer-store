import React, { useState, useMemo, useEffect } from 'react';
import { Product, MASTER_PRODUCTS, CATEGORIES } from './data/products';
import { POPULAR_BUNDLES, BundleDef } from './data/bundles';
import { matchProductSearch, CATEGORY_DISPLAY_NAMES, CATEGORY_CARD_TAGS } from './utils/crackerSearch';
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
import { FestiveCrackerEffects } from './components/FestiveCrackerEffects';
import { BrandLogoIntroSplash } from './components/BrandLogoIntroSplash';
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
  AlertCircle,
  Ban,
} from 'lucide-react';

export function App() {
  // Search, Category & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');

  // Cloud Product Images map { [productId]: imageUrl }
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  // Real-time Cloud Stock map { [productId]: current_stock }
  const [productStock, setProductStock] = useState<Record<string, number>>({});

  // Floating Stock Alert Toast Notification
  const [stockToast, setStockToast] = useState<{ message: string; type?: 'warning' | 'error' | 'info' } | null>(null);

  const showStockToast = (message: string, type: 'warning' | 'error' | 'info' = 'warning') => {
    setStockToast({ message, type });
    setTimeout(() => {
      setStockToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Fetch product images and live stock counts from Supabase on mount & subscribe to Realtime
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const loadProductsData = async () => {
      try {
        const { data } = await supabase.from('products').select('id, image_url, current_stock');
        if (data && Array.isArray(data)) {
          const imgMap: Record<string, string> = {};
          const stockMap: Record<string, number> = {};
          data.forEach((p: any) => {
            if (p.image_url) imgMap[p.id] = p.image_url;
            if (p.current_stock !== undefined && p.current_stock !== null) {
              stockMap[p.id] = Number(p.current_stock);
            }
          });
          setProductImages(imgMap);
          setProductStock(stockMap);
        }
      } catch (err) {
        console.warn('Could not load remote product stock & images:', err);
      }
    };

    loadProductsData();

    // Subscribe to realtime updates on table 'products'
    const channelId = `realtime_products_${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.new && payload.new.id) {
            const row = payload.new;
            if (row.current_stock !== undefined && row.current_stock !== null) {
              setProductStock((prev) => ({
                ...prev,
                [row.id]: Number(row.current_stock),
              }));
            }
            if (row.image_url !== undefined) {
              setProductImages((prev) => ({
                ...prev,
                [row.id]: row.image_url,
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  // Prevent background body scroll chaining on iOS Safari & mobile devices
  useEffect(() => {
    if (selectedProductDetail || selectedBundleId) {
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
  }, [selectedProductDetail, selectedBundleId]);

  // Sync cart to local storage
  const updateCart = (newCart: Record<string, number>) => {
    setCart(newCart);
    try {
      localStorage.setItem('bheema_online_cart', JSON.stringify(newCart));
    } catch {}
  };

  // Add to Bag / Update Quantity (Guarded by Live Realtime Stock)
  const handleAddToCart = (product: Product) => {
    const stock = productStock[product.id];
    if (stock !== undefined && stock <= 0) {
      showStockToast(`Sorry, ${product.name} is currently out of stock!`, 'error');
      return;
    }
    const currentQty = cart[product.id] || 0;
    if (stock !== undefined && currentQty >= stock) {
      showStockToast(`Only ${stock} units available in stock for ${product.name}!`, 'warning');
      return;
    }
    const newCart = { ...cart, [product.id]: currentQty + 1 };
    updateCart(newCart);
  };

  // Category Selection with Auto-Scroll to Catalog
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    if (searchQuery.trim().length > 0) {
      setSearchQuery('');
    }
    setTimeout(() => {
      const el = document.getElementById('cracker-catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const handleUpdateQuantity = (product: Product, newQty: number) => {
    if (newQty <= 0) {
      const newCart = { ...cart };
      delete newCart[product.id];
      updateCart(newCart);
    } else {
      const stock = productStock[product.id];
      if (stock !== undefined && newQty > stock) {
        updateCart({ ...cart, [product.id]: stock });
        showStockToast(`Maximum available stock (${stock}) reached for ${product.name}!`, 'warning');
        return;
      }
      updateCart({ ...cart, [product.id]: newQty });
    }
  };

  const handleClearCart = () => {
    updateCart({});
  };

  // Quick Add Combo Bundle into Cart with 10% Online Pricing (Guarded by Stock Limits)
  const handleAddBundleToCart = (bundle: BundleDef) => {
    const outOfStockItems = bundle.items.filter((item) => {
      const stock = productStock[item.productId];
      return stock !== undefined && stock <= 0;
    });

    if (outOfStockItems.length > 0) {
      showStockToast(
        `Notice: Some items in this combo are sold out (${outOfStockItems.map((i) => i.productName).join(', ')}). Available items were added!`,
        'warning'
      );
    }

    const updated = { ...cart };
    let addedCount = 0;
    bundle.items.forEach((item) => {
      const pid = item.productId;
      const stock = productStock[pid];
      if (stock !== undefined && stock <= 0) return;

      const current = updated[pid] || 0;
      const targetQty = current + item.defaultQty;
      const finalQty = stock !== undefined ? Math.min(targetQty, stock) : targetQty;
      if (finalQty > current) {
        updated[pid] = finalQty;
        addedCount++;
      }
    });

    if (addedCount > 0) {
      updateCart(updated);
      setSelectedBundleId(null);
      setIsCartOpen(true);
    } else {
      showStockToast('Sorry, this combo cannot be added because items are currently sold out.', 'error');
    }
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

    // Smart Search with Synonyms & Brand Mapping
    if (searchQuery.trim()) {
      const searchedInCat = result.filter((p) => matchProductSearch(p, searchQuery));
      // If no items found in currently selected category, search across all products
      if (searchedInCat.length === 0 && selectedCategory !== 'All') {
        result = MASTER_PRODUCTS.filter((p) => matchProductSearch(p, searchQuery));
      } else {
        result = searchedInCat;
      }
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
    <div className="min-h-screen bg-[#FFFDF7] text-slate-900 flex flex-col antialiased selection:bg-orange-500 selection:text-white relative">
      {/* 2-Second Brand Logo Intro Splash Screen */}
      <BrandLogoIntroSplash />

      {/* Festive Cracker Splashes & Side Margins Sparkler Crackles */}
      <FestiveCrackerEffects />

      {/* Top Navbar */}
      <StorefrontNavbar
        cartCount={totalCartCount}
        cartTotal={totalOnlineAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        categories={CATEGORIES}
        allProducts={MASTER_PRODUCTS}
        cart={cart}
        productImages={productImages}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
        onScrollToCatalog={() => {
          const el = document.getElementById('cracker-catalog-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28">
        {/* Grand Hero Banner */}
        <FestiveHeroBanner
          onSelectCategory={handleSelectCategory}
          onOpenComboModal={(bundleId) => setSelectedBundleId(bundleId)}
        />

        {/* Category Navigation Pills & Catalog Control Bar */}
        <div id="cracker-catalog-section" className="scroll-mt-28 sm:scroll-mt-24 pt-3 border-t border-amber-200">
          {/* Horizontal Category Navigation Carousel (Moved directly above Complete Cracker Catalog) */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-2 -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={(e) => {
                    handleSelectCategory(cat);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-900 border border-amber-200/90 shadow-2xs'
                  }`}
                >
                  {CATEGORY_DISPLAY_NAMES[cat] || (cat === 'All' ? '🌟 All Crackers' : cat)}
                </button>
              );
            })}
          </div>

          {/* Compact Bar: Item Count on Left, Small Sort on Right */}
          <div className="flex items-center justify-between gap-2 mb-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-800 bg-amber-100/90 border border-amber-200/90 px-2.5 py-0.5 rounded-full shadow-2xs">
                {filteredProducts.length} items
              </span>
              {searchQuery.trim() && (
                <span className="text-[10px] text-amber-900 font-bold bg-orange-100 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                  "{searchQuery}"
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 bg-white border border-amber-300/90 rounded-lg px-2 py-1 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-orange-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="default">Sort</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-amber-200 shadow-sm space-y-3">
            <Search className="w-10 h-10 mx-auto text-amber-400" />
            <h4 className="font-extrabold text-base text-slate-900">No crackers found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find anything matching "{searchQuery}". Try searching for Flower Pot, Lakshmi, Shot, or GC.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="py-2 px-4 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition-colors shadow-xs"
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
                stock={productStock[product.id]}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Bar on Mobile (when cart has items) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-[#FFFDF7] via-[#FFFDF7]/95 to-transparent pointer-events-none md:hidden">
          <div className="max-w-md mx-auto pointer-events-auto">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-2xl shadow-orange-500/30 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-white text-orange-600 flex items-center justify-center font-extrabold text-xs shadow-xs">
                  {totalCartCount}
                </span>
                <span>View Cracker Bag</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base">
                  ₹{totalOnlineAmount.toLocaleString('en-IN')}
                </span>
                <ArrowRight className="w-4 h-4 text-white" />
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
        productStock={productStock}
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
        productStock={productStock}
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
        <div 
          onClick={() => setSelectedProductDetail(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in overscroll-none touch-none"
        >
          <div 
            className="w-full max-w-md max-h-[92vh] bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-slate-900 flex flex-col touch-pan-y"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full Uncropped Product Image Container */}
            <div className="relative h-64 sm:h-76 w-full bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 flex items-center justify-center overflow-hidden border-b border-amber-200/80 p-3 shrink-0">
              {productImages[selectedProductDetail.id] || selectedProductDetail.imageUrl ? (
                <>
                  {/* Ambient Blurred Background of same cracker for aesthetic depth */}
                  <img
                    src={productImages[selectedProductDetail.id] || selectedProductDetail.imageUrl!}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                  />
                  {/* True Uncropped Full Cracker Photo (100% visible) */}
                  <img
                    src={productImages[selectedProductDetail.id] || selectedProductDetail.imageUrl!}
                    alt={selectedProductDetail.name}
                    className="relative z-1 max-w-full max-h-full w-auto h-auto object-contain rounded-lg drop-shadow-xl select-none"
                  />
                </>
              ) : (
                <div className="text-center p-4">
                  <Sparkles className="w-10 h-10 mx-auto text-orange-500 mb-2" />
                  <span className="text-xs uppercase font-extrabold text-amber-800">
                    {CATEGORY_CARD_TAGS[selectedProductDetail.category] || selectedProductDetail.category}
                  </span>
                </div>
              )}

              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md shadow-md transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="absolute bottom-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs border border-white/30 shadow-md">
                {calculateDiscountPercent(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)}% OFF Sivakasi MRP
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3 bg-[#FFFDF7] overflow-y-auto flex-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">
                  {CATEGORY_CARD_TAGS[selectedProductDetail.category] || selectedProductDetail.category} • Item #{selectedProductDetail.serialNo}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-0.5">
                  {selectedProductDetail.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-black text-2xl text-orange-600">
                  ₹{calculateOnlinePrice(selectedProductDetail.sellingPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{calculateDisplayMrp(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  (Save ₹{calculateOnlineSavings(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)} • {calculateDiscountPercent(calculateOnlinePrice(selectedProductDetail.sellingPrice), selectedProductDetail.category)}% OFF)
                </span>
              </div>

              {/* Stock Warning Notice */}
              {(() => {
                const detailStock = productStock[selectedProductDetail.id];
                const isDetailOutOfStock = detailStock !== undefined && detailStock <= 0;
                const isDetailLowStock = detailStock !== undefined && detailStock > 0 && detailStock <= 5;

                if (isDetailOutOfStock) {
                  return (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-bold">
                      <Ban className="w-4 h-4 text-red-500 shrink-0" />
                      <span>This item is currently sold out. Please check back later or choose another variety!</span>
                    </div>
                  );
                }
                if (isDetailLowStock) {
                  return (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2 font-bold">
                      <Flame className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0 animate-pulse" />
                      <span>🔥 Hurry! Only {detailStock} units left in stock for fast dispatch!</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-orange-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Sivakasi Premium Quality Guarantee</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  100% authentic festive fireworks with vibrant colors, high-altitude bursts, and safety certified packaging.
                </p>
              </div>

              <div className="pt-2">
                {(() => {
                  const detailStock = productStock[selectedProductDetail.id];
                  const isDetailOutOfStock = detailStock !== undefined && detailStock <= 0;

                  if (isDetailOutOfStock) {
                    return (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-400 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed select-none"
                      >
                        <Ban className="w-4 h-4 text-slate-400" />
                        <span>Currently Out of Stock</span>
                      </button>
                    );
                  }

                  return (
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductDetail);
                        setSelectedProductDetail(null);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Add to Bag</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combo Bundle Modal */}
      {activeBundle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overscroll-none touch-none">
          <div 
            className="w-full max-w-lg bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-2xl animate-scale-up max-h-[85vh] flex flex-col text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border-b border-orange-400 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 text-white flex items-center justify-center border border-white/30">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-white">{activeBundle.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-xs border border-white/30">
                      {activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? '86% OFF' : '87% OFF'}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-100 font-semibold">{activeBundle.tagline}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBundleId(null)}
                className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-[#FFFDF7]">
              <p className="text-xs text-slate-600">{activeBundle.description}</p>

              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                Varieties Included ({activeBundle.items.length} Varieties)
              </span>

              <div className="space-y-1.5 divide-y divide-amber-100">
                {activeBundle.items.map((item, idx) => {
                  const prod = productMap.get(item.productId);
                  const onlinePrice = prod ? calculateOnlinePrice(prod.sellingPrice) : 0;
                  const itemDiscount = prod 
                    ? calculateDiscountPercent(onlinePrice, prod.category)
                    : (activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? 86 : 87);

                  return (
                    <div key={idx} className="pt-1.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {item.defaultQty}x {item.productName}
                      </span>
                      <span className="text-[10px] text-red-700 font-extrabold bg-red-50 border border-red-200/90 px-2 py-0.5 rounded-full shadow-2xs shrink-0 ml-2">
                        {itemDiscount}% OFF
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-amber-200 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div>
                  <span className="text-[10px] text-stone-500 line-through font-bold block">
                    {activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? 'MRP ₹8,120' : 'MRP ₹24,800'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-black text-orange-600">
                      {activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? '₹1,160' : '₹3,100'}
                    </span>
                    <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded-full">
                      {activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? '86% OFF' : '87% OFF'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-700 font-black block">
                    {activeBundle.id === 'BUNDLE-SMALL-COMBO-10' ? 'Save ₹6,960' : 'Save ₹21,700'}
                  </span>
                  <span className="text-[9.5px] text-stone-500 font-semibold">Doorstep COD Ready</span>
                </div>
              </div>

              <button
                onClick={() => handleAddBundleToCart(activeBundle)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4 text-white" />
                <span>Add Full Combo to Bag (1-Click)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Festive Footer (Sunrise Saffron & Marigold Light Theme) */}
      <footer className="mt-auto border-t border-amber-200 bg-amber-50/70 text-slate-600 text-xs py-8 px-4 text-center space-y-3">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-900 font-black text-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>BHEEMA FIREWORKS • DIWALI 2026</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Fresh Sivakasi standard fireworks with fast local delivery. All products priced at direct online wholesale rates. Cash on Delivery (COD) available at your doorstep.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 text-[11px] font-bold text-slate-600">
            <button onClick={() => setIsTrackerOpen(true)} className="hover:text-orange-600 underline flex items-center gap-1.5">
              <span>Track Your Placed Order</span>
            </button>
            <span>•</span>
            <span className="text-emerald-700 font-bold">100% Cash on Delivery (Doorstep)</span>
          </div>
        </div>
      </footer>

      {/* Floating Real-time Stock Notification Toast */}
      {stockToast && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[92%] px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-amber-400/40 backdrop-blur-md animate-fade-in pointer-events-auto">
          {stockToast.type === 'error' ? (
            <Ban className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="flex-1 leading-snug">{stockToast.message}</span>
          <button 
            onClick={() => setStockToast(null)} 
            className="p-1 hover:text-amber-300 text-slate-400 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
