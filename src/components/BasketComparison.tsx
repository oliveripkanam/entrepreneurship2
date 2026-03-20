import { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Trash2, Plus, Minus, Star, ChevronDown, ShoppingCart, Search, X } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works' | 'map';

type SortOption = 'price' | 'distance' | 'smart';

interface BasketComparisonProps {
  onNavigate: (screen: Screen) => void;
}

export function BasketComparison({ onNavigate }: BasketComparisonProps) {
  const { user } = useAuth();
  const [distance, setDistance] = useState(5);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  
  const [basketId, setBasketId] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [storeTotals, setStoreTotals] = useState<any[]>([]);
  const [storeDetails, setStoreDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Search Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // ask for user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null) // permission denied or unavailable
      );
    }
  }, []);

  useEffect(() => {
    const fetchBasket = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // fetch store metadata (lat/lng, has_loyalty) once for distance + loyalty calcs
        const { data: storesData } = await supabase.from('stores').select('id, lat, lng, has_loyalty, loyalty_name');
        if (storesData) {
          const map: Record<string, any> = {};
          storesData.forEach(s => { map[s.id] = s; });
          setStoreDetails(map);
        }

        const { data: bId, error: rpcError } = await supabase.rpc('get_or_create_default_basket');
        if (rpcError) throw rpcError;
        setBasketId(bId);
        await refreshData(bId);
      } catch (err) {
        console.error('Error fetching basket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBasket();
  }, [user]);

  const refreshData = async (bId: string) => {
    const [itemsRes, totalsRes] = await Promise.all([
      supabase.from('basket_items_with_prices').select('*').eq('basket_id', bId),
      supabase.from('basket_store_totals').select('*').eq('basket_id', bId)
    ]);
    if (itemsRes.data) setItems(itemsRes.data);
    if (totalsRes.data) setStoreTotals(totalsRes.data);
  };

  const updateCount = async (basketItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await supabase.from('basket_items').update({ quantity: newQuantity }).eq('id', basketItemId);
      if (basketId) await refreshData(basketId);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (basketItemId: string) => {
    try {
      await supabase.from('basket_items').delete().eq('id', basketItemId);
      if (basketId) await refreshData(basketId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const searchProducts = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);
      
      if (!error && data) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Error searching products:', err);
    } finally {
      setSearching(false);
    }
  };

  const addToBasket = async (productId: string) => {
    if (!basketId) return;
    try {
      const { error } = await supabase.from('basket_items').insert({
        basket_id: basketId,
        product_id: productId,
        quantity: 1
      });
      if (error && error.code === '23505') {
        console.log('Item already in basket');
      }
      await refreshData(basketId);
      setIsSearchModalOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error adding to basket:', err);
    }
  };

  // haversine formula
  const haversineMiles = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3958.8; // earth radius (miles)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const stores = storeTotals.map(st => {
    const detail = storeDetails[st.store_id] || {};
    // real distance from user's location to this store's coordinates
    const dist = (userLocation && detail.lat && detail.lng)
      ? haversineMiles(userLocation.lat, userLocation.lng, Number(detail.lat), Number(detail.lng))
      : null; // null = location unavailable
    // only apply loyalty discount for stores that actually have loyalty programmes
    const hasLoyalty = Boolean(detail.has_loyalty);
    const finalPrice = loyaltyEnabled && hasLoyalty ? st.total_price * 0.9 : st.total_price;

    return {
      key: st.store_id,
      name: st.store_name,
      emoji: st.store_emoji,
      domain: st.store_domain,
      color: st.store_color,
      total: finalPrice,
      originalTotal: st.total_price,
      hasLoyalty,
      loyaltyName: detail.loyalty_name || null,
      distance: dist,
      itemCount: st.item_count
    };
  }).sort((a, b) => {
    if (sortBy === 'price') return a.total - b.total;
    if (sortBy === 'distance') {
      // if location is unavailable fall back to price sort
      if (a.distance === null && b.distance === null) return a.total - b.total;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    }
    // smart = weighted price + distance score
    const priceScore = (v: number) => 1 / (v || 1);
    const distScore = (v: number | null) => v !== null ? 1 / (v || 0.1) : 0;
    const scoreA = priceScore(a.total) * 0.6 + distScore(a.distance) * 0.4;
    const scoreB = priceScore(b.total) * 0.6 + distScore(b.distance) * 0.4;
    return scoreB - scoreA;
  });

  const sortLabels: Record<SortOption, string> = {
    price: 'Cheapest',
    distance: 'Nearest',
    smart: 'Best Value',
  };

  const loyaltySavings = loyaltyEnabled
    ? stores.reduce((acc, st) => acc + (st.hasLoyalty ? st.originalTotal - st.total : 0), 0)
    : 0;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
             <div className="w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-600">Loading your personalized basket...</p>
           </div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
             <p className="text-gray-600">Please sign in to view your basket.</p>
             <button onClick={() => onNavigate('home')} className="ml-4 text-[#4CAF50] underline">Go Home</button>
           </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => onNavigate('home')}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white">Basket Comparison</h1>
          <button onClick={() => onNavigate('notifications')}>
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Distance Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-800">Filter by Distance</label>
            <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full">{distance} miles</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
          />
          <p className="text-gray-600 mt-2">Showing stores within a {distance}-mile radius</p>
        </div>

        {/* Loyalty Toggle */}
        <div className="mb-6 bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h4 className="text-white mb-1">💳 Loyalty Pricing</h4>
              <p className="text-white/90">Include Clubcard & Nectar discounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={loyaltyEnabled}
                onChange={(e) => setLoyaltyEnabled(e.target.checked)}
              />
              <div className="w-14 h-7 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/50"></div>
            </label>
          </div>
          {loyaltyEnabled && loyaltySavings > 0 && (
            <div className="bg-white/20 rounded-lg p-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <div className="text-white">
                <span className="font-medium">You're saving ~£{loyaltySavings.toFixed(2)}</span> with loyalty cards!
              </div>
            </div>
          )}
        </div>

        {/* Basket Totals */}
        {stores.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-800">Compare Total Prices</h3>
              <span className="text-gray-400 text-xs">Live updates</span>
            </div>

            {/* Sort Toggle */}
            <div className="flex gap-2 mb-4 bg-white rounded-xl shadow-sm p-1">
              {(['price', 'distance', 'smart'] as SortOption[]).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                    sortBy === opt ? 'bg-[#4CAF50] text-white' : 'text-gray-500'
                  }`}
                >
                  {opt === 'price' ? '💰 Price' : opt === 'distance' ? '📍 Distance' : '⚡ Smart'}
                </button>
              ))}
            </div>

            {/* distance filter */}
            <div className="space-y-3">
              {stores.filter(s => {
                if (s.distance === null) return true; // no location, show all
                return s.distance <= distance;
              }).map((store, index) => (
                <div 
                  key={store.key} 
                  className={`bg-white rounded-xl shadow-sm p-5 border-2 ${
                    index === 0 ? 'border-[#4CAF50]' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 overflow-hidden">
                        <img 
                          src={store.name.toLowerCase().includes('sainsbury') 
                            ? "https://cdn.brandfetch.io/id3jwaSrnD/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1685968241221"
                            : `https://www.google.com/s2/favicons?domain=${store.domain}&sz=128`
                          }
                          alt={store.name} 
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = store.emoji;
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1">{store.name}</h4>
                        <p className="text-gray-500 text-xs">
                          {store.distance !== null
                            ? `${store.distance.toFixed(1)} mi away · `
                            : ''}{store.itemCount} items
                          {loyaltyEnabled && store.hasLoyalty && store.loyaltyName
                            ? ` · ${store.loyaltyName} price`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-gray-800 mb-1">
                        £{store.total.toFixed(2)}
                      </div>
                      {index === 0 && (
                        <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs inline-block">
                          ✓ {sortLabels[sortBy]}
                        </div>
                      )}
                      {index > 0 && stores[0] && (
                        <div className="text-gray-500 text-xs">
                          +£{(store.total - stores[0].total).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basket Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800">Your Basket ({items.length} items)</h3>
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="bg-[#000] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          
          {items.length === 0 ? (
             <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
               <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
               <p>Your basket is empty. Add products to compare prices!</p>
             </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const count = item.quantity;
                const prices: Record<string, number> = item.prices || {};
                
                // determine cheapest store for this item
                const storeEntries = Object.keys(prices);
                let cheapestStoreId = storeEntries[0];
                let minPrice = Infinity;
                
                storeEntries.forEach(stId => {
                   const storeHasLoyalty = Boolean((storeDetails[stId] || {}).has_loyalty);
                   const p = loyaltyEnabled && storeHasLoyalty ? prices[stId] * 0.9 : prices[stId];
                   if (p < minPrice) {
                     minPrice = p;
                     cheapestStoreId = stId;
                   }
                });

                return (
                  <div key={item.basket_item_id} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex gap-3 mb-3">
                      <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-gray-300 text-xs text-center p-1">No Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-1">{item.product_name}</h4>
                        <p className="text-gray-600 mb-2">{item.product_quantity}</p>
                        {cheapestStoreId && (
                           <div className="flex items-center gap-2">
                             <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                               Cheapest: {storeTotals.find(s => s.store_id === cheapestStoreId)?.store_name || cheapestStoreId}
                             </span>
                           </div>
                        )}
                      </div>
                      <button onClick={() => removeItem(item.basket_item_id)} className="text-red-500 h-fit">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600 text-sm">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCount(item.basket_item_id, count - 1)}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-gray-800 w-8 text-center">{count}</span>
                        <button
                          onClick={() => updateCount(item.basket_item_id, count + 1)}
                          className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Expandable Price Comparison */}
                    <button
                      onClick={() => setExpandedItem(expandedItem === item.basket_item_id ? null : item.basket_item_id)}
                      className="w-full flex items-center justify-between text-sm text-[#4CAF50] mb-2"
                    >
                      <span>Compare prices</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedItem === item.basket_item_id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedItem === item.basket_item_id && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                        {storeEntries.map((stId) => {
                          const originalPrice = prices[stId];
                          const stInfo = storeTotals.find(s => s.store_id === stId);
                          const detail2 = storeDetails[stId] || {};
                          const storeHasLoyalty = Boolean(detail2.has_loyalty);
                          const price = loyaltyEnabled && storeHasLoyalty ? originalPrice * 0.9 : originalPrice;
                          const isCheapest = stId === cheapestStoreId;
                          const storeName = stInfo?.store_name || stId;
                          const emoji = stInfo?.store_emoji || '🛒';

                          return (
                            <div key={stId} className={`flex items-center gap-3 p-3 rounded-lg bg-white ${isCheapest ? 'ring-2 ring-[#4CAF50]' : 'border border-gray-100'}`}>
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden shrink-0 text-xl">
                                {emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-gray-800 text-sm">{storeName}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={`text-sm font-medium ${isCheapest ? 'text-[#4CAF50]' : 'text-gray-800'}`}>
                                  £{(price * count).toFixed(2)}
                                </div>
                                {loyaltyEnabled && (
                                  <div className="text-xs text-gray-400 line-through">£{(originalPrice * count).toFixed(2)}</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Card */}
        {stores.length > 0 && (
          <div className="mb-6 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl shadow-lg p-6 text-white">
            <h3 className="mb-4">💡 Smart Shopping Tip</h3>
            <p className="mb-4">
              Shop at <span className="font-medium">{stores[0].name}</span> to save £{(stores[stores.length - 1].total - stores[0].total).toFixed(2)} compared to the most expensive option!
            </p>
            <button className="w-full bg-white text-[#4CAF50] py-3 rounded-lg font-medium">
              View {stores[0].name} Shopping List
            </button>
          </div>
        )}
        {/* Search Modal */}
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 sm:p-0">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in shadow-2xl">
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur">
                <h3 className="text-lg font-bold text-gray-800">Add to Basket</h3>
                <button 
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2 bg-gray-200/50 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-100 flex-shrink-0 bg-white">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => searchProducts(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 rounded-xl transition-all outline-none text-gray-800 placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 bg-gray-50/30">
                {searching ? (
                  <div className="p-8 flex justify-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50]/50 transition-colors group">
                        <div className="w-14 h-14 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-1 shrink-0 group-hover:bg-[#4CAF50]/5 transition-colors">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                          ) : (
                            <ShoppingCart className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-800 font-medium truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{product.quantity || '1 unit'}</p>
                        </div>
                        <button
                          onClick={() => addToBasket(product.id)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors shrink-0"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery.length > 0 ? (
                  <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                    <p>No products found for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try a different search term.</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                    <ShoppingCart className="w-12 h-12 mb-3 text-gray-200" />
                    <p className="text-sm">Type to search for groceries</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}