import { useState } from 'react';
import { ChevronLeft, Check, Link as LinkIcon, Instagram, Youtube, Video, Filter } from 'lucide-react';
import { PRICE_LAST_UPDATED } from '../utils/priceData';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface RecipeToListProps {
  onNavigate: (screen: Screen) => void;
}

const mockIngredients = [
  { name: 'Chicken Breast', amount: '500g', checked: true },
  { name: 'Greek Yogurt', amount: '200g', checked: true },
  { name: 'Onion', amount: '1 medium', checked: true },
  { name: 'Chopped Tomatoes', amount: '1 can', checked: true },
  { name: 'Garlic', amount: '2 cloves', checked: true },
  { name: 'Ginger Paste', amount: '1 tsp', checked: true },
  { name: 'Garam Masala', amount: '1 tbsp', checked: true },
  { name: 'Turmeric', amount: '1 tsp', checked: true },
  { name: 'Cumin', amount: '1 tsp', checked: true },
  { name: 'Fresh Coriander', amount: 'for garnish', checked: true }
];

const storeInfo = {
  aldi: { name: 'Aldi', emoji: '🔷', price: 11.80 },
  lidl: { name: 'Lidl', emoji: '🟦', price: 12.10 },
  tesco: { name: 'Tesco', emoji: '🔵', price: 12.45 },
  morrisons: { name: 'Morrisons', emoji: '🟡', price: 12.90 },
  sainsburys: { name: "Sainsbury's", emoji: '🟠', price: 13.20 }
};

export function RecipeToList({ onNavigate }: RecipeToListProps) {
  const [url, setUrl] = useState('');
  const [extracted, setExtracted] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [inputMethod, setInputMethod] = useState<'url' | 'instagram' | 'youtube' | 'shorts'>('url');
  const [ingredients, setIngredients] = useState(mockIngredients);

  const handleExtract = () => {
    setExtracted(true);
  };

  const toggleIngredient = (index: number) => {
    setIngredients(ingredients.map((ing, i) => 
      i === index ? { ...ing, checked: !ing.checked } : ing
    ));
  };

  const sortedStores = Object.entries(storeInfo)
    .sort((a, b) => a[1].price - b[1].price)
    .map(([key, value]) => ({ key, ...value }));

  const cheapestStore = sortedStores[0];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-gray-900">Recipe to List</h1>
        <button>
          <Filter className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      <div className="px-6 pt-6">
        {/* Input Method Selection */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">Choose Source</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setInputMethod('url')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                inputMethod === 'url' 
                  ? 'border-[#4CAF50] bg-green-50' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <LinkIcon className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'url' ? 'text-[#4CAF50]' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'url' ? 'text-[#4CAF50]' : 'text-gray-600'}`}>
                Recipe URL
              </div>
            </button>

            <button 
              onClick={() => setInputMethod('instagram')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                inputMethod === 'instagram' 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <Instagram className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'instagram' ? 'text-pink-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'instagram' ? 'text-pink-500' : 'text-gray-600'}`}>
                Instagram
              </div>
            </button>

            <button 
              onClick={() => setInputMethod('youtube')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                inputMethod === 'youtube' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <Youtube className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'youtube' ? 'text-red-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'youtube' ? 'text-red-500' : 'text-gray-600'}`}>
                YouTube
              </div>
            </button>

            <button 
              onClick={() => setInputMethod('shorts')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                inputMethod === 'shorts' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-100 bg-white'
              }`}
            >
              <Video className={`w-8 h-8 mx-auto mb-2 ${
                inputMethod === 'shorts' ? 'text-red-500' : 'text-gray-400'
              }`} />
              <div className={`text-sm ${inputMethod === 'shorts' ? 'text-red-500' : 'text-gray-600'}`}>
                Shorts
              </div>
            </button>
          </div>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <h4 className="text-gray-900 mb-3">
            {inputMethod === 'url' && 'Paste Recipe URL'}
            {inputMethod === 'instagram' && 'Paste Instagram Link'}
            {inputMethod === 'youtube' && 'Paste YouTube Link'}
            {inputMethod === 'shorts' && 'Paste Shorts Link'}
          </h4>
          
          <input 
            type="text"
            placeholder={
              inputMethod === 'url' ? 'https://www.bbcgoodfood.com/...' :
              inputMethod === 'instagram' ? 'https://www.instagram.com/reel/...' :
              'https://www.youtube.com/...'
            }
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-4 border-2 border-gray-100 rounded-2xl mb-4 focus:border-[#4CAF50] focus:outline-none"
          />

          <button 
            onClick={handleExtract}
            className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl"
          >
            🤖 Extract with AI
          </button>
        </div>

        {/* Loyalty Toggle */}
        <div className="mb-6 bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-gray-900 mb-1">💳 Loyalty Pricing</h4>
              <p className="text-gray-500 text-sm">Include discounts</p>
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
        </div>

        {/* Extracted Recipe */}
        {extracted && (
          <>
            {/* Recipe Header */}
            <div className="mb-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white">
              <h3 className="mb-3">🍛 Chicken Tikka Masala</h3>
              <div className="flex items-center gap-4 text-white/90">
                <span className="text-sm">⏱️ 45 mins</span>
                <span className="text-sm">👥 Serves 4</span>
                <span className="text-sm">🔥 Medium</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <span className="text-white/90 text-sm">£{(cheapestStore.price / 4).toFixed(2)} per serving</span>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="mb-6">
              <h3 className="text-gray-900 mb-4">Ingredients ({ingredients.length})</h3>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <button
                    key={index}
                    onClick={() => toggleIngredient(index)}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#4CAF50] transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                      ingredient.checked 
                        ? 'bg-[#4CAF50] border-[#4CAF50]' 
                        : 'border-gray-300'
                    }`}>
                      {ingredient.checked && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-gray-900">{ingredient.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{ingredient.amount}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Store Comparison */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-900">Store Comparison</h3>
                <span className="text-gray-400 text-xs">Updated: {PRICE_LAST_UPDATED}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sortedStores.map((store, index) => (
                  <div 
                    key={store.key}
                    className={`bg-white rounded-2xl p-5 border-2 ${
                      index === 0 ? 'border-[#4CAF50]' : 'border-gray-100'
                    } shadow-sm`}
                  >
                    <div className="text-3xl mb-3 text-center">{store.emoji}</div>
                    <h4 className="text-gray-900 text-center mb-1">{store.name}</h4>
                    <p className="text-gray-500 text-sm text-center mb-3">{ingredients.length} items</p>
                    <div className="text-center">
                      <div className={`text-2xl mb-2 ${index === 0 ? 'text-[#4CAF50]' : 'text-gray-900'}`}>
                        £{store.price.toFixed(2)}
                      </div>
                      {index === 0 ? (
                        <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs inline-block">
                          Cheapest
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">
                          +£{(store.price - cheapestStore.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Deal Card */}
            <div className="mb-6 bg-[#4CAF50] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{cheapestStore.emoji}</div>
                <div>
                  <p className="text-white/80 text-sm">Best Deal at</p>
                  <h3 className="text-white">{cheapestStore.name}</h3>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white/90">Total Cost</span>
                  <span className="text-2xl">£{cheapestStore.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">You Save</span>
                  <span>£{(sortedStores[sortedStores.length - 1].price - cheapestStore.price).toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-white text-[#4CAF50] py-4 rounded-xl mb-2">
                Add to Basket
              </button>
              <button className="w-full bg-transparent border-2 border-white text-white py-4 rounded-xl">
                View Full Recipe
              </button>
            </div>

            {/* Sustainability Info */}
            <div className="p-5 bg-green-50 rounded-2xl border-2 border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-2">Sustainability Info</h4>
                  <p className="text-gray-600 text-sm mb-3">3 items have eco-friendly alternatives available</p>
                  <div className="space-y-2">
                    <div className="bg-white rounded-xl p-3 flex items-center justify-between">
                      <span className="text-gray-900 text-sm">Organic Chicken</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">♻️ Eco</span>
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