import { useState } from 'react';
import { ChevronLeft, Bell, Trash2, Plus, Minus, Star, ChevronDown } from 'lucide-react';
import { PRICES_LAST_UPDATED } from '../lib/priceData';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works' | 'map';

type SortOption = 'price' | 'distance' | 'smart';

interface BasketComparisonProps {
  onNavigate: (screen: Screen) => void;
}

const basketItems = [
  {
    id: 1,
    name: 'Organic Free-Range Eggs (Large)',
    quantity: '6 per tray',
    image: 'https://dm.emea.cms.aldi.cx/is/image/aldiprodeu/product/jpg/scaleWidth/500/e43e7551-3f17-4d69-9be5-79bcb7129041/British%20Organic%20Eggs%206%20Pack',
    prices: {
      tesco: { regular: 2.80, loyalty: 2.50, rating: 4.3, reviews: 142, quality: 'Premium' },
      sainsburys: { regular: 2.85, loyalty: 2.60, rating: 4.1, reviews: 98, quality: 'Premium' },
      aldi: { regular: 2.30, loyalty: 2.30, rating: 4.0, reviews: 67, quality: 'Fresh' },
      lidl: { regular: 2.45, loyalty: 2.45, rating: 3.9, reviews: 54, quality: 'Fresh' },
      morrisons: { regular: 2.70, loyalty: 2.55, rating: 4.2, reviews: 89, quality: 'Value' }
    }
  },
  {
    id: 2,
    name: 'Wholemeal Bread (800g)',
    quantity: '1 loaf',
    image: 'https://imgproxy-retcat.assets.schwarz/2AgFSlZ4t2k2WLk1yNeMPYnGXhvYp2e7Dq-qDHIFn_o/sm:1/w:1278/h:959/cz/M6Ly9wcm9kLWNhd/GFsb2ctbWVkaWEvdWsvMS84MjYwMTlGREFEREY1RTA0QzE1QTU5MzU/wQUI0MTQ1RDI1QUFDODdCQkQzMEI1RTBEOTYwQzU4NUM1MEU1OTE3LmpwZw.jpg',
    prices: {
      tesco: { regular: 1.20, loyalty: 1.00, rating: 4.0, reviews: 203, quality: 'Fresh' },
      sainsburys: { regular: 1.35, loyalty: 1.15, rating: 4.2, reviews: 156, quality: 'Premium' },
      aldi: { regular: 1.10, loyalty: 1.10, rating: 3.8, reviews: 89, quality: 'Value' },
      lidl: { regular: 1.05, loyalty: 1.05, rating: 3.7, reviews: 72, quality: 'Value' },
      morrisons: { regular: 1.25, loyalty: 1.10, rating: 4.1, reviews: 134, quality: 'Fresh' }
    }
  },
  {
    id: 3,
    name: 'Semi-Skimmed Milk (2 Litres)',
    quantity: '1 bottle',
    image: 'https://dm.emea.cms.aldi.cx/is/image/aldiprodeu/product/jpg/scaleWidth/500/fb259109-9f17-403f-83f8-15a183c4cba5/Filtered%20British%20Semi%20Skimmed%20Milk',
    prices: {
      tesco: { regular: 1.75, loyalty: 1.55, rating: 4.4, reviews: 312, quality: 'Fresh' },
      sainsburys: { regular: 1.80, loyalty: 1.60, rating: 4.3, reviews: 245, quality: 'Fresh' },
      aldi: { regular: 1.60, loyalty: 1.60, rating: 4.1, reviews: 178, quality: 'Value' },
      lidl: { regular: 1.65, loyalty: 1.65, rating: 4.0, reviews: 134, quality: 'Value' },
      morrisons: { regular: 1.80, loyalty: 1.65, rating: 4.2, reviews: 198, quality: 'Fresh' }
    }
  }
];

const storeInfo = {
  tesco: { name: 'Tesco', color: '#00539F', emoji: '🔵', domain: 'tesco.com', distance: 0.3 },
  sainsburys: { name: "Sainsbury's", color: '#F06C00', emoji: '🟠', domain: 'sainsburys.co.uk', distance: 0.5 },
  aldi: { name: 'Aldi', color: '#00A0E3', emoji: '🔷', domain: 'aldi.co.uk', distance: 0.9 },
  lidl: { name: 'Lidl', color: '#0050AA', emoji: '🟦', domain: 'lidl.co.uk', distance: 0.7 },
  morrisons: { name: 'Morrisons', color: '#FFD200', emoji: '🟡', domain: 'morrisons.com', distance: 1.2 }
};

const qualityColors: Record<string, string> = {
  Premium: 'bg-purple-100 text-purple-700',
  Fresh: 'bg-green-100 text-green-700',
  Value: 'bg-blue-100 text-blue-700',
};

export function BasketComparison({ onNavigate }: BasketComparisonProps) {
  const [distance, setDistance] = useState(5);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [itemCounts, setItemCounts] = useState<Record<number, number>>(() =>
    Object.fromEntries(basketItems.map(i => [i.id, 1]))
  );
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const getPrice = (item: typeof basketItems[0], store: string) => {
    const p = item.prices[store as keyof typeof item.prices];
    return loyaltyEnabled ? p.loyalty : p.regular;
  };

  const calculateTotal = (store: string) =>
    basketItems.reduce((sum, item) => sum + getPrice(item, store) * (itemCounts[item.id] || 1), 0);

  const calculateSmartScore = (store: { total: number; distance: number }) => {
    const priceScore = 1 / store.total;
    const distScore = 1 / store.distance;
    return priceScore * 0.6 + distScore * 0.4;
  };

  const stores = Object.entries(storeInfo)
    .map(([key, info]) => ({ key, ...info, total: calculateTotal(key) }))
    .sort((a, b) => {
      if (sortBy === 'price') return a.total - b.total;
      if (sortBy === 'distance') return a.distance - b.distance;
      return calculateSmartScore(b) - calculateSmartScore(a);
    });

  const sortLabels: Record<SortOption, string> = {
    price: 'Cheapest',
    distance: 'Nearest',
    smart: 'Best Value',
  };

  const loyaltySavings = basketItems.reduce((sum, item) => {
    const reg = Object.values(item.prices).reduce((s, p) => s + p.regular, 0) / 5;
    const loy = Object.values(item.prices).reduce((s, p) => s + p.loyalty, 0) / 5;
    return sum + (reg - loy) * (itemCounts[item.id] || 1);
  }, 0);

  const updateCount = (id: number, delta: number) =>
    setItemCounts(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));

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
          {loyaltyEnabled && (
            <div className="bg-white/20 rounded-lg p-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <div className="text-white">
                <span className="font-medium">You're saving £{loyaltySavings.toFixed(2)}</span> with loyalty cards!
              </div>
            </div>
          )}
        </div>

        {/* Basket Totals */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800">Compare Total Prices</h3>
            <span className="text-gray-400 text-xs">Updated: {PRICES_LAST_UPDATED}</span>
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

          <div className="space-y-3">
            {stores.filter(s => s.distance <= distance).map((store, index) => (
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
                        src={store.name === "Sainsbury's" 
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
                      <p className="text-gray-500 text-xs">{store.distance} mi away · {basketItems.length} items</p>
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
                    {index > 0 && (
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

        {/* Basket Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800">Your Basket ({basketItems.length} items)</h3>
            <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {basketItems.map((item) => {
              const count = itemCounts[item.id] || 1;
              const cheapestStore = Object.entries(item.prices).reduce(
                (min, [store, data]) => {
                  const price = loyaltyEnabled ? data.loyalty : data.regular;
                  return price < (loyaltyEnabled ? min.loyalty : min.regular)
                    ? { store, ...data }
                    : { store: min.store, regular: min.regular, loyalty: min.loyalty, rating: min.rating, reviews: min.reviews, quality: min.quality };
                },
                { store: 'tesco', ...item.prices.tesco }
              );
              
              return (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-3 mb-3">
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{item.name}</h4>
                      <p className="text-gray-600 mb-2">{item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Cheapest: {storeInfo[cheapestStore.store as keyof typeof storeInfo].name}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-500 h-fit">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600 text-sm">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCount(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-gray-800 w-8 text-center">{count}</span>
                      <button
                        onClick={() => updateCount(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Expandable Price Comparison */}
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between text-sm text-[#4CAF50] mb-2"
                  >
                    <span>Compare prices & reviews</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedItem === item.id && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      {Object.entries(item.prices).map(([store, data]) => {
                        const info = storeInfo[store as keyof typeof storeInfo];
                        const price = loyaltyEnabled ? data.loyalty : data.regular;
                        const isCheapest = store === cheapestStore.store;
                        const logoUrl = store === 'sainsburys'
                          ? "https://cdn.brandfetch.io/id3jwaSrnD/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1685968241221"
                          : `https://www.google.com/s2/favicons?domain=${info.domain}&sz=128`;

                        return (
                          <div key={store} className={`flex items-center gap-3 p-3 rounded-lg bg-white ${isCheapest ? 'ring-2 ring-[#4CAF50]' : 'border border-gray-100'}`}>
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
                              <img src={logoUrl} alt={info.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-800 text-sm">{info.name}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${qualityColors[data.quality]}`}>{data.quality}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-500">{data.rating} ({data.reviews})</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={`text-sm font-medium ${isCheapest ? 'text-[#4CAF50]' : 'text-gray-800'}`}>
                                £{(price * count).toFixed(2)}
                              </div>
                              {loyaltyEnabled && data.regular !== data.loyalty && (
                                <div className="text-xs text-gray-400 line-through">£{(data.regular * count).toFixed(2)}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Compact price grid (when not expanded) */}
                  {expandedItem !== item.id && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(item.prices).map(([store, data]) => {
                          const info = storeInfo[store as keyof typeof storeInfo];
                          const price = loyaltyEnabled ? data.loyalty : data.regular;
                          const isCheapest = store === cheapestStore.store;
                          const logoUrl = store === 'sainsburys' 
                            ? "https://cdn.brandfetch.io/id3jwaSrnD/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1685968241221"
                            : `https://www.google.com/s2/favicons?domain=${info.domain}&sz=128`;

                          return (
                            <div key={store} className="flex flex-col items-center gap-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white overflow-hidden shadow-sm transition-all ${
                                isCheapest ? 'ring-2 ring-[#4CAF50] ring-offset-1' : 'border border-gray-100'
                              }`}>
                                <img 
                                  src={logoUrl}
                                  alt={info.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className={`text-xs font-medium ${isCheapest ? 'text-[#4CAF50]' : 'text-gray-600'}`}>
                                £{(price * count).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-6 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl shadow-lg p-6 text-white">
          <h3 className="mb-4">💡 Smart Shopping Tip</h3>
          <p className="mb-4">
            Shop at <span className="font-medium">{stores[0].name}</span> to save £{(stores[stores.length - 1].total - stores[0].total).toFixed(2)} compared to the most expensive option!
          </p>
          <button className="w-full bg-white text-[#4CAF50] py-3 rounded-lg font-medium">
            View {stores[0].name} Shopping List
          </button>
        </div>
      </div>
    </div>
  );
}