import { useState, useEffect } from 'react';
import { Search, TrendingUp, Filter, Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import supabase from '../lib/supabase';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications';

interface SocialRecipesProps {
  onNavigate: (screen: Screen) => void;
  onSelectRecipe?: (id: string) => void;
  activeDietaryFilters?: string[];
}

export function SocialRecipes({ onNavigate, onSelectRecipe, activeDietaryFilters = [] }: SocialRecipesProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'cheapest'>('trending');
  const [likedRecipes, setLikedRecipes] = useState<string[]>([]);
  const [recipesList, setRecipesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let query = supabase.from('public_recipes_feed').select('*');
        if (activeTab === 'recent') query = query.order('created_at', { ascending: false });
        if (activeTab === 'cheapest') query = query.order('total_cost', { ascending: true });
        if (activeTab === 'trending') query = query.order('like_count', { ascending: false });

        const { data } = await query;
        if (data) {
          const seen = new Set<string>();
          const unique = data.filter((r: any) => {
            if (seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
          });
          setRecipesList(unique);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [activeTab]);


  const toggleLike = async (recipeId: string, currentLikes: number) => {
    const isLiked = likedRecipes.includes(recipeId);
    setLikedRecipes(prev => isLiked ? prev.filter(id => id !== recipeId) : [...prev, recipeId]);
    setRecipesList(prev => prev.map(r => r.id === recipeId ? { ...r, like_count: isLiked ? r.like_count - 1 : r.like_count + 1 } : r));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      if (isLiked) {
        await supabase.from('recipe_likes').delete().eq('recipe_id', recipeId).eq('user_id', session.user.id);
      } else {
        await supabase.from('recipe_likes').insert({ recipe_id: recipeId, user_id: session.user.id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // if a filter is active, only show recipes whose tag array includes the filter id as a tag label.
  const tagMap: Record<string, string> = {
    vegan: 'vegan',
    vegetarian: 'vegetarian',
    'gluten-free': 'gluten',
    'dairy-free': 'dairy',
    halal: 'halal',
    organic: 'organic',
  };

  const displayedRecipes = activeDietaryFilters.length === 0
    ? recipesList
    : recipesList.filter((recipe) => {
        const recipeTags = (recipe.tags ?? []).map((t: string) => t.toLowerCase());
        return activeDietaryFilters.every((filterId) => {
          const keyword = tagMap[filterId] ?? filterId;
          return recipeTags.some((t: string) => t.includes(keyword));
        });
      });

  return (
    <div className="min-h-screen bg-[#4CAF50]">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white">Recipe Community</h1>
          <div className="flex items-center gap-2">
            {activeDietaryFilters.length > 0 && (
              <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                {activeDietaryFilters.length} filter{activeDietaryFilters.length > 1 ? 's' : ''} active
              </span>
            )}
            <button className="bg-white text-[#4CAF50] px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Share Recipe
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 rounded-lg"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'trending' 
                ? 'bg-white text-[#4CAF50]' 
                : 'bg-[#3d9644] text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button 
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'recent' 
                ? 'bg-white text-[#4CAF50]' 
                : 'bg-[#3d9644] text-white'
            }`}
          >
            Recent
          </button>
          <button 
            onClick={() => setActiveTab('cheapest')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'cheapest' 
                ? 'bg-white text-[#4CAF50]' 
                : 'bg-[#3d9644] text-white'
            }`}
          >
            Cheapest
          </button>
          <button onClick={() => onNavigate('dietary')} className={`ml-auto p-2 rounded-lg ${activeDietaryFilters.length > 0 ? 'bg-white text-[#4CAF50]' : 'bg-[#3d9644] text-white'}`}>
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recipe Cards */}
      <div className="bg-white rounded-t-3xl p-4 mt-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mb-4"></div>
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {activeDietaryFilters.length > 0
              ? 'No recipes match your dietary filters. Try adjusting them.'
              : 'No recipes found.'}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {/* Author Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold">
                      {recipe.author_name ? recipe.author_name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h4 className="text-gray-800">{recipe.author_name || 'Community Chef'}</h4>
                      <p className="text-gray-600 text-xs">{new Date(recipe.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button>
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Recipe Image */}
                <div className="relative">
                  <ImageWithFallback 
                    src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-medium">
                    <span className="text-[#4CAF50]">£{Number(recipe.total_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {recipe.cheapest_store_name || 'Compare Prices'}
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-4">
                  <h3 className="text-gray-800 mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{recipe.description}</p>
                  
                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {recipe.tags.map((tag: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <span className="text-[#4CAF50] block text-xs">Total Cost</span>
                      <div className="text-gray-800 font-medium">£{Number(recipe.total_cost || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-[#4CAF50] block text-xs">Per Serving</span>
                      <div className="text-gray-800 font-medium">
                        £{(Number(recipe.total_cost || 0) / (recipe.serves || 1)).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 block text-xs">Serves</span>
                      <div className="text-gray-800 font-medium">{recipe.serves || '-'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                    <button onClick={() => toggleLike(recipe.id, recipe.like_count)} className="flex items-center gap-2 transition-transform active:scale-95">
                      <Heart className={`w-5 h-5 ${likedRecipes.includes(recipe.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      <span className="text-gray-600 font-medium">{recipe.like_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600 font-medium">{recipe.comment_count || 0}</span>
                    </button>
                    <button onClick={() => {
                        if (onSelectRecipe) onSelectRecipe(recipe.id);
                        else onNavigate('recipe');
                    }} className="ml-auto text-[#4CAF50] font-medium text-sm">View Recipe &gt;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
