import { useState } from 'react';
import { ChevronLeft, Bell, Check, Link as LinkIcon, Instagram, Youtube, Video } from 'lucide-react';
import { PRICES_LAST_UPDATED } from '../lib/priceData';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile';

interface RecipeToListProps {
  onNavigate: (screen: Screen) => void;
}

const mockIngredients = [
  { name: 'Chicken Breast (500g)', checked: true },
  { name: 'Greek Yogurt (200g)', checked: true },
  { name: 'Onion (1)', checked: true },
  { name: 'Chopped Tomatoes (1 can)', checked: true },
  { name: 'Garlic (2 cloves)', checked: true },
  { name: 'Ginger Paste (1 tsp)', checked: true },
  { name: 'Garam Masala (1 tbsp)', checked: true },
  { name: 'Turmeric (1 tsp)', checked: true },
  { name: 'Cumin (1 tsp)', checked: true },
  { name: 'Fresh Coriander (for garnish)', checked: true }
];

const storeInfo = {
  tesco: { name: 'Tesco', color: '#00539F', emoji: '🔵', price: 12.45 },
  sainsburys: { name: "Sainsbury's", color: '#F06C00', emoji: '🟠', price: 13.20 },
  aldi: { name: 'Aldi', color: '#00A0E3', emoji: '🔷', price: 11.80 },
  lidl: { name: 'Lidl', color: '#0050AA', emoji: '🟦', price: 12.10 },
  morrisons: { name: 'Morrisons', color: '#FFD200', emoji: '🟡', price: 12.90 }
};

export function RecipeToList({ onNavigate }: RecipeToListProps) {
  const [url, setUrl] = useState('');
  const [extracted, setExtracted] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [inputMethod, setInputMethod] = useState<'url' | 'instagram' | 'youtube' | 'shorts'>('url');

  const handleExtract = () => {
    setExtracted(true);
  };

  const sortedStores = Object.entries(storeInfo)
    .sort((a, b) => a[1].price - b[1].price)
    .map(([key, value]) => ({ key, ...value }));

  const cheapestStore = sortedStores[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => onNavigate('home')}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white">Recipe to List</h1>
          <button onClick={() => onNavigate('notifications')}>
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>
        <p className="text-white/90">Convert recipes from anywhere into smart shopping lists</p>
      </div>

      <div className="px-6 mt-4">
        {/* AI Conversion Info Card */}
        <div 
          className="mb-6 rounded-xl shadow-lg p-5 text-white mt-8"
          style={{
            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899)',
            backgroundSize: '200% 100%',
            animation: 'gradient 3s linear infinite'
          }}
        >
          <style>
            {`
              @keyframes gradient {
                0% { background-position: 100% 0%; }
                100% { background-position: -100% 0%; }
              }
            `}
          </style>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="font-medium">AI-Powered Recipe Extraction</h3>
              <p className="text-white/90 text-sm">We support multiple sources!</p>
            </div>
          </div>
        </div>

        {/* Input Method Selection */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Choose Your Source</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setInputMethod('url')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inputMethod === 'url' 
                  ? 'border-[#4CAF50] bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <LinkIcon className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'url' ? 'text-[#4CAF50]' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'url' ? 'text-[#4CAF50] font-medium' : 'text-gray-600'}`}>
                Recipe URL
              </div>
              <div className="text-xs text-gray-500 mt-1">BBC, AllRecipes, etc.</div>
            </button>

            <button 
              onClick={() => setInputMethod('instagram')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inputMethod === 'instagram' 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Instagram className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'instagram' ? 'text-pink-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'instagram' ? 'text-pink-500 font-medium' : 'text-gray-600'}`}>
                Instagram Reels
              </div>
              <div className="text-xs text-gray-500 mt-1">Food videos</div>
            </button>

            <button 
              onClick={() => setInputMethod('youtube')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inputMethod === 'youtube' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Youtube className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'youtube' ? 'text-red-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'youtube' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                YouTube Videos
              </div>
              <div className="text-xs text-gray-500 mt-1">Cooking tutorials</div>
            </button>

            <button 
              onClick={() => setInputMethod('shorts')}
              className={`p-4 rounded-xl border-2 transition-all ${
                inputMethod === 'shorts' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Video className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'shorts' ? 'text-red-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'shorts' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                YouTube Shorts
              </div>
              <div className="text-xs text-gray-500 mt-1">Quick recipes</div>
            </button>
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-5">
          <h4 className="text-gray-800 mb-3">
            {inputMethod === 'url' && 'Paste Recipe URL'}
            {inputMethod === 'instagram' && 'Paste Instagram Reel Link'}
            {inputMethod === 'youtube' && 'Paste YouTube Video Link'}
            {inputMethod === 'shorts' && 'Paste YouTube Shorts Link'}
          </h4>
          
          <input 
            type="text"
            placeholder={
              inputMethod === 'url' ? 'e.g. https://www.bbcgoodfood.com/recipes/...' :
              inputMethod === 'instagram' ? 'e.g. https://www.instagram.com/reel/...' :
              'e.g. https://www.youtube.com/...'
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg mb-4 focus:border-[#4CAF50] focus:outline-none"
          />

          <button 
            onClick={handleExtract}
            className="w-full bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            🤖 Extract Ingredients with AI
          </button>
        </div>

        {/* Loyalty Toggle */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h4 className="text-gray-800">Loyalty Pricing</h4>
                <p className="text-gray-600 text-sm">Include Clubcard & Nectar</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={loyaltyEnabled}
                onChange={(e) => setLoyaltyEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
            </label>
          </div>
        </div>

        {/* Extracted Ingredients */}
        {extracted && (
          <>
            {/* Recipe Info */}
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-5 text-white">
                <h3 className="mb-2">🍛 Chicken Tikka Masala</h3>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>⏱️ 45 mins</span>
                  <span>👥 Serves 4</span>
                  <span>🔥 Medium</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-gray-800 mb-3">Ingredients ({mockIngredients.length})</h4>
                <div className="space-y-2">
                  {mockIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-5 h-5 rounded border-2 border-[#4CAF50] flex items-center justify-center bg-green-50">
                        <Check className="w-3 h-3 text-[#4CAF50]" />
                      </div>
                      <span className="text-gray-800 flex-1">{ingredient.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Store Comparison */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">📊 Price Comparison by Store</h3>
                <span className="text-gray-400 text-xs">Updated: {PRICES_LAST_UPDATED}</span>
              </div>
              <div className="space-y-3">
                {sortedStores.map((store, index) => (
                  <div 
                    key={store.key}
                    className={`bg-white rounded-xl p-5 shadow-sm border-2 ${
                      index === 0 ? 'border-[#4CAF50]' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                             style={{ backgroundColor: `${store.color}20` }}>
                          {store.emoji}
                        </div>
                        <div>
                          <h4 className="text-gray-800 font-medium">{store.name}</h4>
                          <p className="text-gray-600 text-sm">{mockIngredients.length} items · £{(store.price / 4).toFixed(2)}/serving</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl mb-1 ${index === 0 ? 'text-[#4CAF50]' : 'text-gray-800'}`}>
                          £{store.price.toFixed(2)}
                        </div>
                        {index === 0 ? (
                          <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs inline-block">
                            ✓ Cheapest
                          </div>
                        ) : (
                          <div className="text-gray-500 text-xs">
                            +£{(store.price - cheapestStore.price).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Deal Highlight */}
            <div className="mb-6 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-white/20">
                  {cheapestStore.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">🎉 Best Deal Found!</h3>
                  <p className="text-white/90">{cheapestStore.name} offers the lowest total price</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/90">Total Cost:</span>
                  <span className="text-2xl font-medium">£{cheapestStore.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/90">You Save:</span>
                  <span className="text-xl">£{(sortedStores[sortedStores.length - 1].price - cheapestStore.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/90">Per Serving (serves 4):</span>
                  <span className="text-lg">£{(cheapestStore.price / 4).toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-white text-[#4CAF50] py-3 rounded-lg font-medium mb-2">
                Add All to Basket
              </button>
              <button className="w-full bg-transparent border-2 border-white text-white py-3 rounded-lg font-medium">
                View Full Shopping List
              </button>
            </div>

            {/* Sustainability Info */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-gray-800 mb-2">Sustainability Rating</h4>
                  <p className="text-gray-700 mb-3">2 items in this recipe have high sustainability ratings. Consider these eco-friendly alternatives:</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <span className="text-gray-800">Organic Chicken Breast</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">♻️ Eco-Friendly</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                      <span className="text-gray-800">Organic Greek Yogurt</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">♻️ Eco-Friendly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}