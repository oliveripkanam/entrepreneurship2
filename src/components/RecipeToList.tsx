import { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Check, Link as LinkIcon, Instagram, Youtube, Video, ShoppingCart, Plus } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile';

interface RecipeToListProps {
  onNavigate: (screen: Screen) => void;
  recipeId?: string | null;
  onResetRecipe?: () => void;
}

export function RecipeToList({ onNavigate, recipeId, onResetRecipe }: RecipeToListProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [extracted, setExtracted] = useState(false);
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [inputMethod, setInputMethod] = useState<'url' | 'instagram' | 'youtube' | 'shorts'>('url');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [storePrices, setStorePrices] = useState<any[]>([]);
  const [recipeName, setRecipeName] = useState('');
  const [recipeServes, setRecipeServes] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [basketStatus, setBasketStatus] = useState<'idle' | 'adding' | 'success' | 'error'>('idle');
  const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());

  const handleExtract = async (overrideId?: string) => {
    if (!url && !overrideId) return;
    setAnalyzing(true);
    setError(null);
    try {
      let recipeData;
      if (overrideId) {
        const { data } = await supabase.from('recipes').select('*').eq('id', overrideId).maybeSingle();
        recipeData = data;
      } else {
        const { data } = await supabase.from('recipes').select('*').limit(1).maybeSingle();
        recipeData = data;
      }
      
      if (recipeData) {
        setRecipeName(recipeData.title);
        setRecipeServes(recipeData.serves || 4);
        const { data: ingData } = await supabase.from('recipe_ingredients').select('*').eq('recipe_id', recipeData.id).order('sort_order');
        if (ingData) {
          const seen = new Set<string>();
          const unique = ingData.filter(i => {
            if (seen.has(i.id)) return false;
            seen.add(i.id);
            return true;
          });
          setIngredients(unique.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, product_id: i.product_id, checked: true })));
        }

        const { data: storeData } = await supabase.rpc('get_recipe_costs_by_store', { p_recipe_id: recipeData.id });
        if (storeData) {
           setStorePrices(storeData.map((s: any) => ({
             key: s.store_id,
             name: s.store_name,
             emoji: s.store_emoji,
             color: s.store_name.toLowerCase().includes('tesco') ? '#00539F' : 
                    s.store_name.toLowerCase().includes('aldi') ? '#00A0E3' : 
                    s.store_name.toLowerCase().includes('sainsbury') ? '#F06C00' : '#4CAF50',
             price: Number(s.total_cost)
           })).sort((a: any, b: any) => a.price - b.price));
        }
      } else {
        setError('Recipe data could not be found.');
      }
      setExtracted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const getOrCreateBasket = async (): Promise<string | null> => {
    if (!user) return null;
    const { data, error } = await supabase.rpc('get_or_create_default_basket');
    if (error) { console.error('Basket error:', error); return null; }
    return data as string;
  };

  const addSingleToBasket = async (productId: string) => {
    const basketId = await getOrCreateBasket();
    if (!basketId) { alert('Please sign in to add items to your basket.'); return; }
    const { error } = await supabase.from('basket_items').upsert(
      { basket_id: basketId, product_id: productId, quantity: 1 },
      { onConflict: 'basket_id,product_id', ignoreDuplicates: false }
    );
    if (!error) setAddedProductIds(prev => new Set([...prev, productId]));
  };

  const addAllToBasket = async () => {
    const basketId = await getOrCreateBasket();
    if (!basketId) { alert('Please sign in to add items to your basket.'); return; }
    setBasketStatus('adding');
    const linked = ingredients.filter(i => i.product_id);
    if (linked.length === 0) {
      setBasketStatus('error');
      setTimeout(() => setBasketStatus('idle'), 3000);
      return;
    }

    const deduped = Array.from(
      new Map(linked.map(i => [i.product_id, { basket_id: basketId, product_id: i.product_id, quantity: 1 }])).values()
    );

    const { error } = await supabase.from('basket_items').upsert(deduped, { onConflict: 'basket_id,product_id', ignoreDuplicates: true });
    if (error) {
      console.error('Add to basket error:', error);
      setBasketStatus('error');
    } else {
      setBasketStatus('success');
      setAddedProductIds(prev => new Set([...prev, ...linked.map(i => i.product_id)]));
    }
    setTimeout(() => setBasketStatus('idle'), 3000);
  };

  const cheapestStore = storePrices[0] || { name: 'Store', price: 0, emoji: '🛒' };

  useEffect(() => {
    if (recipeId) {
      handleExtract(recipeId);
    }
  }, [recipeId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-30 shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              if (onResetRecipe) onResetRecipe();
              onNavigate('social');
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Recipe to List</h1>
          <button onClick={() => onNavigate('notifications')}>
            <Bell className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="px-6 mt-4">
        {/* Input Section */}
        {!recipeId && !extracted && (
          <>
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
                onClick={() => handleExtract()}
                disabled={!url || analyzing}
                className={`w-full py-4 rounded-lg font-medium shadow-md transition-shadow flex items-center justify-center gap-2 ${
                  !url || analyzing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white hover:shadow-lg'
                }`}
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
                    Analyzing Recipe...
                  </>
                ) : (
                  '🤖 Extract Ingredients with AI'
                )}
              </button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </>
        )}
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
                <h3 className="mb-2">🍛 {recipeName}</h3>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span>👥 Serves {recipeServes}</span>
                  {storePrices.length > 0 && <span>💰 From £{cheapestStore.price.toFixed(2)}</span>}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-gray-800 mb-3">Ingredients ({ingredients.length})</h4>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => {
                    const isLinked = Boolean(ingredient.product_id);
                    const isAdded = isLinked && addedProductIds.has(ingredient.product_id);
                    return (
                      <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-5 h-5 rounded border-2 border-[#4CAF50] flex items-center justify-center bg-green-50 flex-shrink-0">
                          <Check className="w-3 h-3 text-[#4CAF50]" />
                        </div>
                        <span className="text-gray-800 flex-1">
                          {ingredient.name}
                          {ingredient.quantity && <span className="text-gray-500 text-sm ml-1">({ingredient.quantity})</span>}
                        </span>
                        {isLinked ? (
                          <button
                            onClick={() => addSingleToBasket(ingredient.product_id)}
                            disabled={isAdded}
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isAdded
                                ? 'bg-[#4CAF50] text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-[#4CAF50] hover:text-white'
                            }`}
                            title={isAdded ? 'Added!' : 'Add to basket'}
                          >
                            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 flex-shrink-0">manual</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {ingredients.filter(i => i.product_id).length < ingredients.length && (
                  <p className="text-xs text-gray-400 mt-3 italic">Items marked "manual" aren't in our product database. Add them manually via the search in your basket.</p>
                )}
              </div>
            </div>

            {/* Store Comparison */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800">📊 Price Comparison by Store</h3>
                <span className="text-gray-400 text-xs">Updated: Today</span>
              </div>
              <div className="space-y-3">
                {storePrices.length === 0 ? (
                  <div className="text-center text-gray-400 py-6 bg-white rounded-xl shadow-sm">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p>No linked products found — shop manually using the search in your basket.</p>
                  </div>
                ) : storePrices.map((store, index) => (
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
                          <p className="text-gray-600 text-sm">{ingredients.length} items · £{(store.price / 4).toFixed(2)}/serving</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl mb-1 ${index === 0 ? 'text-[#4CAF50]' : 'text-gray-800'}`}>
                          £{loyaltyEnabled ? (store.price * 0.9).toFixed(2) : store.price.toFixed(2)}
                        </div>
                        {index === 0 ? (
                          <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs inline-block">
                            ✓ Cheapest
                          </div>
                        ) : (
                          <div className="text-gray-500 text-xs">
                            +£{loyaltyEnabled 
                               ? ((store.price - cheapestStore.price) * 0.9).toFixed(2) 
                               : (store.price - cheapestStore.price).toFixed(2)}
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
                  <span className="text-2xl font-medium">£{loyaltyEnabled ? (cheapestStore.price * 0.9).toFixed(2) : cheapestStore.price.toFixed(2)}</span>
                </div>
                {storePrices.length > 1 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/90">You Save:</span>
                    <span className="text-xl">£{loyaltyEnabled 
                       ? ((storePrices[storePrices.length - 1].price - cheapestStore.price) * 0.9).toFixed(2) 
                       : (storePrices[storePrices.length - 1].price - cheapestStore.price).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white/90">Per Serving (serves {recipeServes}):</span>
                  <span className="text-lg">£{loyaltyEnabled ? ((cheapestStore.price * 0.9) / recipeServes).toFixed(2) : (cheapestStore.price / recipeServes).toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={addAllToBasket}
                disabled={basketStatus === 'adding'}
                className={`w-full py-3 rounded-lg font-medium mb-2 flex items-center justify-center gap-2 transition-all ${
                  basketStatus === 'success' ? 'bg-white/30 text-white' :
                  basketStatus === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-white text-[#4CAF50] hover:bg-green-50'
                }`}
              >
                {basketStatus === 'adding' && <div className="w-4 h-4 border-2 border-[#4CAF50] border-t-transparent rounded-full animate-spin"></div>}
                {basketStatus === 'success' && <Check className="w-4 h-4" />}
                {basketStatus === 'success' ? 'Added to Basket!' :
                 basketStatus === 'error' ? 'No linked products to add' :
                 basketStatus === 'adding' ? 'Adding...' :
                 '🛒 Add All to Basket'}
              </button>
              <button 
                onClick={() => onNavigate('basket')}
                className="w-full bg-transparent border-2 border-white text-white py-3 rounded-lg font-medium"
              >
                View Basket
              </button>
            </div>

            {/* No prices yet info */}
            {storePrices.length === 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                <strong>No price data found</strong> — ingredients aren't linked to products in the database. You can still shop by adding items manually from the Basket tab.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}