import { useState } from 'react';
import { Plus, Minus, X, ShoppingCart, Check, ChevronDown, ChevronRight, MapPin, TrendingDown, Zap, Leaf, Star } from 'lucide-react';
import { PRICE_LAST_UPDATED } from '../utils/priceData';
import { ComparisonDrawer } from './ComparisonDrawer';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface BasketComparisonProps {
  onNavigate: (screen: Screen) => void;
}

const basketItems = [
  {
    id: 1,
    name: 'Organic Free-Range Eggs',
    quantity: '6 per tray',
    image: '🥚',
    count: 1,
    hasEcoAlternative: true,
    prices: {
      tesco: { regular: 2.80, loyalty: 2.50, rating: 4.5, reviews: 342, quality: 'Premium' },
      sainsburys: { regular: 2.85, loyalty: 2.55, rating: 4.7, reviews: 289, quality: 'Premium' },
      aldi: { regular: 2.30, loyalty: 2.30, rating: 4.3, reviews: 156, quality: 'Value' },
      lidl: { regular: 2.45, loyalty: 2.45, rating: 4.4, reviews: 198, quality: 'Fresh' },
      morrisons: { regular: 2.70, loyalty: 2.45, rating: 4.6, reviews: 224, quality: 'Premium' }
    }
  },
  {
    id: 2,
    name: 'Wholemeal Bread',
    quantity: '800g loaf',
    image: '🍞',
    count: 2,
    hasEcoAlternative: false,
    prices: {
      tesco: { regular: 1.20, loyalty: 1.00, rating: 4.2, reviews: 512, quality: 'Fresh' },
      sainsburys: { regular: 1.35, loyalty: 1.15, rating: 4.4, reviews: 438, quality: 'Premium' },
      aldi: { regular: 1.10, loyalty: 1.10, rating: 4.0, reviews: 267, quality: 'Value' },
      lidl: { regular: 1.05, loyalty: 1.05, rating: 4.1, reviews: 301, quality: 'Value' },
      morrisons: { regular: 1.25, loyalty: 1.10, rating: 4.3, reviews: 389, quality: 'Fresh' }
    }
  },
  {
    id: 3,
    name: 'Semi-Skimmed Milk',
    quantity: '2 Litres',
    image: '🥛',
    count: 1,
    hasEcoAlternative: true,
    prices: {
      tesco: { regular: 1.75, loyalty: 1.55, rating: 4.6, reviews: 678, quality: 'Fresh' },
      sainsburys: { regular: 1.80, loyalty: 1.60, rating: 4.5, reviews: 592, quality: 'Fresh' },
      aldi: { regular: 1.60, loyalty: 1.60, rating: 4.4, reviews: 423, quality: 'Value' },
      lidl: { regular: 1.65, loyalty: 1.65, rating: 4.3, reviews: 381, quality: 'Value' },
      morrisons: { regular: 1.80, loyalty: 1.60, rating: 4.7, reviews: 534, quality: 'Premium' }
    }
  },
  {
    id: 4,
    name: 'Chicken Breast',
    quantity: '500g',
    image: '🍗',
    count: 1,
    hasEcoAlternative: false,
    prices: {
      tesco: { regular: 3.50, loyalty: 3.00, rating: 4.3, reviews: 445, quality: 'Fresh' },
      sainsburys: { regular: 3.75, loyalty: 3.25, rating: 4.6, reviews: 398, quality: 'Premium' },
      aldi: { regular: 2.99, loyalty: 2.99, rating: 4.1, reviews: 289, quality: 'Value' },
      lidl: { regular: 3.10, loyalty: 3.10, rating: 4.2, reviews: 312, quality: 'Fresh' },
      morrisons: { regular: 3.60, loyalty: 3.20, rating: 4.5, reviews: 356, quality: 'Premium' }
    }
  }
];

const storeInfo = {
  tesco: { name: 'Tesco', color: '#00539F', emoji: '🔵', distance: 1.2 },
  sainsburys: { name: "Sainsbury's", color: '#F06C00', emoji: '🟠', distance: 2.8 },
  aldi: { name: 'Aldi', color: '#00A0E3', emoji: '🔷', distance: 3.5 },
  lidl: { name: 'Lidl', color: '#0050AA', emoji: '🟦', distance: 4.1 },
  morrisons: { name: 'Morrisons', color: '#FFD200', emoji: '🟡', distance: 0.8 }
};

type SortOption = 'price' | 'distance' | 'smart';

export function BasketComparison({ onNavigate }: BasketComparisonProps) {
  const [distance, setDistance] = useState(5);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [sustainabilityEnabled, setSustainabilityEnabled] = useState(true);
  const [items, setItems] = useState(basketItems);
  const [selectedItem, setSelectedItem] = useState<typeof basketItems[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('smart');

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, count: Math.max(0, item.count + change) }
        : item
    ).filter(item => item.count > 0));
  };

  const handleItemClick = (item: typeof basketItems[0]) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleSwapStore = (itemId: number, newStore: string) => {
    // This can be used for future functionality if needed
    console.log(`Swapping item ${itemId} to ${newStore}`);
  };

  const calculateTotal = (store: string) => {
    return items.reduce((sum, item) => {
      const price = loyaltyEnabled 
        ? item.prices[store as keyof typeof item.prices].loyalty 
        : item.prices[store as keyof typeof item.prices].regular;
      return sum + (price * item.count);
    }, 0);
  };

  const stores = Object.keys(storeInfo).map(key => ({
    key,
    ...storeInfo[key as keyof typeof storeInfo],
    total: calculateTotal(key)
  }));

  const cheapestStore = [...stores].sort((a, b) => a.total - b.total)[0];
  const closestStore = [...stores].sort((a, b) => a.distance - b.distance)[0];

  // Smart Match algorithm: balance price and distance
  const calculateSmartScore = (store: typeof stores[0]) => {
    const priceRange = Math.max(...stores.map(s => s.total)) - Math.min(...stores.map(s => s.total));
    const distanceRange = Math.max(...stores.map(s => s.distance)) - Math.min(...stores.map(s => s.distance));
    
    const normalizedPrice = priceRange > 0 ? (store.total - cheapestStore.total) / priceRange : 0;
    const normalizedDistance = distanceRange > 0 ? (store.distance - closestStore.distance) / distanceRange : 0;
    
    // Weight: 60% price, 40% distance
    return (normalizedPrice * 0.6) + (normalizedDistance * 0.4);
  };

  const smartMatchStore = [...stores].sort((a, b) => 
    calculateSmartScore(a) - calculateSmartScore(b)
  )[0];

  // Sort stores based on selected option
  const sortedStores = [...stores].sort((a, b) => {
    if (sortBy === 'price') return a.total - b.total;
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'smart') return calculateSmartScore(a) - calculateSmartScore(b);
    return 0;
  });

  const totalSavings = loyaltyEnabled 
    ? items.reduce((sum, item) => {
        const cheapestStoreKey = cheapestStore.key as keyof typeof item.prices;
        const regularPrice = item.prices[cheapestStoreKey].regular;
        const loyaltyPrice = item.prices[cheapestStoreKey].loyalty;
        return sum + ((regularPrice - loyaltyPrice) * item.count);
      }, 0)
    : 0;

  const getBestValueTag = (store: typeof stores[0]) => {
    if (sortBy === 'smart' && store.key === smartMatchStore.key) {
      return { label: 'Best Value', color: 'bg-[#4CAF50]' };
    }
    if (sortBy === 'price' && store.key === cheapestStore.key) {
      return { label: 'Cheapest', color: 'bg-[#4CAF50]' };
    }
    if (sortBy === 'distance' && store.key === closestStore.key) {
      return { label: 'Nearest', color: 'bg-[#4CAF50]' };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => onNavigate('home')}>
          <X className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-gray-900">Basket Comparison</h1>
        <div className="w-6"></div>
      </div>

      <div className="px-6 pt-6">
        {/* Distance Slider */}
        <div className="mb-6 bg-gray-50 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-gray-900">Store Distance</label>
            <span className="text-[#4CAF50]">{distance} miles</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4CAF50]"
          />
        </div>

        {/* Loyalty Toggle */}
        <div className="mb-6 bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">💳 Loyalty Pricing</h4>
              <p className="text-gray-500 text-sm">Clubcard & Nectar discounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={loyaltyEnabled}
                onChange={(e) => setLoyaltyEnabled(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4CAF50]"></div>
            </label>
          </div>
          {loyaltyEnabled && totalSavings > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-[#4CAF50]">✨ You're saving £{totalSavings.toFixed(2)} with loyalty cards!</span>
            </div>
          )}
        </div>

        {/* Sustainability Toggle */}
        <div className="mb-6 bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">🌿 Sustainable Options</h4>
              <p className="text-gray-500 text-sm">Show eco-friendly alternatives</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={sustainabilityEnabled}
                onChange={(e) => setSustainabilityEnabled(e.target.checked)}
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4CAF50]"></div>
            </label>
          </div>
        </div>

        {/* Quick Chips - Visual Map/List Hybrid */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Quick Compare</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex-shrink-0 bg-gradient-to-br from-green-50 to-green-100 border-2 border-[#4CAF50] rounded-2xl p-4 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-xs text-[#4CAF50] font-medium">CHEAPEST</span>
              </div>
              <div className="text-2xl mb-1">{cheapestStore.emoji}</div>
              <p className="text-gray-900 font-medium mb-1">{cheapestStore.name}</p>
              <p className="text-lg text-[#4CAF50] font-semibold">£{cheapestStore.total.toFixed(2)}</p>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{cheapestStore.distance} mi</span>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 rounded-2xl p-4 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">NEAREST</span>
              </div>
              <div className="text-2xl mb-1">{closestStore.emoji}</div>
              <p className="text-gray-900 font-medium mb-1">{closestStore.name}</p>
              <p className="text-lg text-blue-600 font-semibold">{closestStore.distance} mi</p>
              <div className="flex items-center gap-1 mt-1 text-gray-500">
                <span className="text-xs">£{closestStore.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex-shrink-0 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-500 rounded-2xl p-4 min-w-[160px]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">SMART MATCH</span>
              </div>
              <div className="text-2xl mb-1">{smartMatchStore.emoji}</div>
              <p className="text-gray-900 font-medium mb-1">{smartMatchStore.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">£{smartMatchStore.total.toFixed(2)}</p>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-600">{smartMatchStore.distance} mi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sort By Toggle */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-900">Sort By</h3>
            <span className="text-gray-400 text-xs">Updated: {PRICE_LAST_UPDATED}</span>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setSortBy('price')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'price'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              💰 Price
            </button>
            <button
              onClick={() => setSortBy('distance')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'distance'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              📍 Distance
            </button>
            <button
              onClick={() => setSortBy('smart')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'smart'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              ⚡ Smart
            </button>
          </div>
        </div>

        {/* Store Comparison Cards - List View */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Store Totals ({items.length} items)</h3>
          <div className="space-y-3">
            {sortedStores.map((store) => {
              const bestValueTag = getBestValueTag(store);
              const priceDiff = store.total - cheapestStore.total;
              const distanceDiff = store.distance - closestStore.distance;

              return (
                <div
                  key={store.key}
                  className={`bg-white rounded-2xl p-5 border-2 shadow-sm ${
                    bestValueTag ? 'border-[#4CAF50]' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Store Icon */}
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {store.emoji}
                    </div>

                    {/* Store Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-900 font-medium">{store.name}</h4>
                        {bestValueTag && (
                          <span className={`${bestValueTag.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                            {bestValueTag.label}
                          </span>
                        )}
                      </div>
                      
                      {/* Price and Distance Row */}
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xl font-semibold ${
                            bestValueTag ? 'text-[#4CAF50]' : 'text-gray-900'
                          }`}>
                            £{store.total.toFixed(2)}
                          </span>
                          {priceDiff > 0 && (
                            <span className="text-xs text-gray-400">
                              +£{priceDiff.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-300">|</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 font-medium">
                            {store.distance} mi
                          </span>
                          {distanceDiff > 0 && (
                            <span className="text-xs text-gray-400">
                              +{distanceDiff.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Value Indicator */}
                      {sortBy === 'smart' && store.key === smartMatchStore.key && (
                        <p className="text-xs text-[#4CAF50]">
                          ⚡ Best balance of price and proximity
                        </p>
                      )}
                      {sortBy === 'smart' && store.key !== smartMatchStore.key && (
                        <p className="text-xs text-gray-400">
                          {priceDiff > 0 && distanceDiff > 0 
                            ? `£${priceDiff.toFixed(2)} more, ${distanceDiff.toFixed(1)} mi further`
                            : priceDiff > 0
                            ? `£${priceDiff.toFixed(2)} more expensive`
                            : distanceDiff > 0
                            ? `${distanceDiff.toFixed(1)} mi further away`
                            : 'Similar value'}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Your Basket Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-900">Your Items</h3>
            <button className="text-[#4CAF50]">
              <Plus className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item) => {
              const cheapestPrice = Math.min(
                ...Object.values(item.prices).map(p => loyaltyEnabled ? p.loyalty : p.regular)
              );
              const itemCheapestStore = Object.entries(item.prices).reduce((min, [store, price]) => {
                const currentPrice = loyaltyEnabled ? price.loyalty : price.regular;
                const minPrice = loyaltyEnabled 
                  ? item.prices[min as keyof typeof item.prices].loyalty 
                  : item.prices[min as keyof typeof item.prices].regular;
                return currentPrice < minPrice ? store : min;
              }, 'tesco');
              const cheapestStoreInfo = storeInfo[itemCheapestStore as keyof typeof storeInfo];
              const cheapestStoreData = item.prices[itemCheapestStore as keyof typeof item.prices];

              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-[#4CAF50] transition-colors relative"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 pr-6">
                      <h4 className="text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-gray-500 text-sm mb-2">{item.quantity}</p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[#4CAF50] font-semibold">£{cheapestPrice.toFixed(2)}</span>
                        
                        {/* Quality Rating Badge */}
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-xs border border-amber-100">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {cheapestStoreData.rating.toFixed(1)}
                        </span>
                        
                        {sustainabilityEnabled && item.hasEcoAlternative && (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs">
                            <Leaf className="w-3 h-3" />
                            Eco
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">
                          {cheapestStoreInfo.emoji} {cheapestStoreInfo.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-gray-900 w-6 text-center">{item.count}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Deal Summary */}
        <div className="bg-[#4CAF50] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{cheapestStore.emoji}</div>
            <div>
              <p className="text-white/80 text-sm">Shop at</p>
              <h3 className="text-white">{cheapestStore.name}</h3>
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-white/90">Total</span>
              <span className="text-2xl">£{cheapestStore.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">Save vs. most expensive</span>
              <span>£{(stores[stores.length - 1].total - cheapestStore.total).toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-white text-[#4CAF50] py-4 rounded-xl">
            View Shopping List
          </button>
        </div>
      </div>

      {/* Comparison Drawer */}
      <ComparisonDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        item={selectedItem}
        loyaltyEnabled={loyaltyEnabled}
        onSwap={handleSwapStore}
      />
    </div>
  );
}