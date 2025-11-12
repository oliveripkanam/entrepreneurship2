import { useState } from 'react';
import { ChevronLeft, Bell, Trash2, Plus } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile';

interface BasketComparisonProps {
  onNavigate: (screen: Screen) => void;
}

const basketItems = [
  {
    id: 1,
    name: 'Organic Free-Range Eggs (Large)',
    quantity: '6 per tray',
    image: 'eggs',
    prices: {
      tesco: 2.80,
      sainsburys: 2.85,
      aldi: 2.30,
      lidl: 2.45,
      morrisons: 2.70
    }
  },
  {
    id: 2,
    name: 'Wholemeal Bread (800g)',
    quantity: '1 loaf',
    image: 'bread',
    prices: {
      tesco: 1.20,
      sainsburys: 1.35,
      aldi: 1.10,
      lidl: 1.05,
      morrisons: 1.25
    }
  },
  {
    id: 3,
    name: 'Semi-Skimmed Milk (2 Litres)',
    quantity: '1 bottle',
    image: 'milk',
    prices: {
      tesco: 1.75,
      sainsburys: 1.80,
      aldi: 1.60,
      lidl: 1.65,
      morrisons: 1.80
    }
  }
];

const storeInfo = {
  tesco: { name: 'Tesco', color: '#00539F', emoji: '🔵' },
  sainsburys: { name: "Sainsbury's", color: '#F06C00', emoji: '🟠' },
  aldi: { name: 'Aldi', color: '#00A0E3', emoji: '🔷' },
  lidl: { name: 'Lidl', color: '#0050AA', emoji: '🟦' },
  morrisons: { name: 'Morrisons', color: '#FFD200', emoji: '🟡' }
};

export function BasketComparison({ onNavigate }: BasketComparisonProps) {
  const [distance, setDistance] = useState(5);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(true);

  const calculateTotal = (store: string) => {
    return basketItems.reduce((sum, item) => sum + item.prices[store as keyof typeof item.prices], 0);
  };

  const stores = [
    { key: 'aldi', name: 'Aldi', total: calculateTotal('aldi'), ...storeInfo.aldi },
    { key: 'lidl', name: 'Lidl', total: calculateTotal('lidl'), ...storeInfo.lidl },
    { key: 'tesco', name: 'Tesco', total: calculateTotal('tesco'), ...storeInfo.tesco },
    { key: 'sainsburys', name: "Sainsbury's", total: calculateTotal('sainsburys'), ...storeInfo.sainsburys },
    { key: 'morrisons', name: 'Morrisons', total: calculateTotal('morrisons'), ...storeInfo.morrisons }
  ].sort((a, b) => a.total - b.total);

  const cheapestStore = stores[0].key;
  const loyaltySavings = 2.45;

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
          <p className="text-gray-600 mt-2">Showing stores within {distance} miles radius</p>
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
          <h3 className="text-gray-800 mb-4">Compare Total Prices</h3>
          <div className="space-y-3">
            {stores.map((store, index) => (
              <div 
                key={store.key} 
                className={`bg-white rounded-xl shadow-sm p-5 border-2 ${
                  index === 0 ? 'border-[#4CAF50]' : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" 
                         style={{ backgroundColor: `${store.color}20` }}>
                      {store.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{store.name}</h4>
                      <p className="text-gray-600">{basketItems.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl text-gray-800 mb-1">
                      £{store.total.toFixed(2)}
                    </div>
                    {index === 0 && (
                      <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs inline-block">
                        ✓ Cheapest
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
              const itemCheapestStore = Object.entries(item.prices).reduce((min, [store, price]) => 
                price < item.prices[min as keyof typeof item.prices] ? store : min
              , 'tesco');
              
              return (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-4xl shadow-inner">
                      {item.image === 'eggs' && '🥚'}
                      {item.image === 'bread' && '🍞'}
                      {item.image === 'milk' && '🥛'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{item.name}</h4>
                      <p className="text-gray-600 mb-2">{item.quantity}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Cheapest: {storeInfo[itemCheapestStore as keyof typeof storeInfo].name}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-500 h-fit">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Price comparison table */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(item.prices).map(([store, price]) => {
                        const info = storeInfo[store as keyof typeof storeInfo];
                        const isCheapest = store === itemCheapestStore;
                        return (
                          <div key={store} className={`text-center p-2 rounded-lg ${
                            isCheapest ? 'bg-green-100 border-2 border-green-400' : 'bg-white'
                          }`}>
                            <div className="text-xs text-gray-600 mb-1" title={info.name}>
                              {info.emoji}
                            </div>
                            <div className={`text-sm ${isCheapest ? 'text-green-700 font-medium' : 'text-gray-800'}`}>
                              £{price.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-gray-600 text-center">
                      🔵 Tesco | 🟠 Sainsbury's | 🔷 Aldi | 🟦 Lidl | 🟡 Morrisons
                    </div>
                  </div>
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