import { useState } from 'react';
import { Search, TrendingUp, Filter, Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface SocialRecipesProps {
  onNavigate: (screen: Screen) => void;
}

const recipes = [
  {
    id: 1,
    author: 'Sarah Kitchen',
    authorInitial: 'S',
    timeAgo: '2 hours ago',
    title: 'Classic Spaghetti Bolognese',
    description: 'A hearty Italian classic that the whole family will love',
    tags: ['Italian', 'Dinner', 'Family Friendly'],
    totalCost: 8.50,
    cheapestStore: 'Aldi',
    serves: 4,
    likes: 234,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1623243020684-9f8bcefe6e94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBib2xvZ25lc2UlMjBwYXN0YXxlbnwxfHx8fDE3NjI4NzQ5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    author: 'GreenEats',
    authorInitial: 'G',
    timeAgo: '1 day ago',
    title: 'Vegan Buddha Bowl',
    description: 'Nutritious and colorful plant-based bowl',
    tags: ['Vegan', 'Healthy', 'Lunch'],
    totalCost: 6.20,
    cheapestStore: 'Lidl',
    serves: 2,
    likes: 189,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1589442305595-62647c1514f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRkaGElMjBib2xvZ25lc2UlMjBwYXN0YXxlbnwxfHx8fDE3NjI4NzQ5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    author: 'Foodie Mark',
    authorInitial: 'F',
    timeAgo: '2 days ago',
    title: 'Budget Chicken Curry',
    description: 'A delicious and hearty chicken curry recipe that won\'t break the bank. Serve with rice or naan',
    tags: ['Indian', 'Dinner', 'Budget'],
    totalCost: 6.20,
    cheapestStore: "Sainsbury's",
    serves: 4,
    likes: 156,
    comments: 9,
    image: 'https://images.unsplash.com/photo-1729824159986-376b49c6b7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY3VycnklMjBkaXNofGVufDF8fHx8MTc2MjgwMjU1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function SocialRecipes({ onNavigate }: SocialRecipesProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'cheapest'>('trending');
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);

  const toggleLike = (recipeId: number) => {
    setLikedRecipes(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  return (
    <div className="min-h-screen bg-[#4CAF50]">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white">Recipe Community</h1>
          <button className="bg-white text-[#4CAF50] px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Share Recipe
          </button>
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
          <button className="ml-auto bg-[#3d9644] text-white p-2 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recipe Cards */}
      <div className="bg-white rounded-t-3xl p-4 mt-4">
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              {/* Author Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-700">{recipe.authorInitial}</span>
                  </div>
                  <div>
                    <h4 className="text-gray-800">{recipe.author}</h4>
                    <p className="text-gray-600">{recipe.timeAgo}</p>
                  </div>
                </div>
                <button>
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Recipe Image */}
              <div className="relative">
                <ImageWithFallback 
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full">
                  <span className="text-[#4CAF50]">£{recipe.totalCost.toFixed(2)}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full">
                  {recipe.cheapestStore}
                </div>
              </div>

              {/* Recipe Content */}
              <div className="p-4">
                <h3 className="text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-3">{recipe.description}</p>
                
                {/* Tags */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {recipe.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[#4CAF50]">Total Cost</span>
                    <div className="text-gray-800">£{recipe.totalCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Cheapest at</span>
                    <div className="text-gray-800">{recipe.cheapestStore}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Serves</span>
                    <div className="text-gray-800">{recipe.serves}</div>
                  </div>
                </div>

                {/* Price per serving */}
                <div className="mb-4 bg-green-50 rounded-lg p-3">
                  <div className="text-center">
                    <span className="text-gray-600 text-sm">Price per serving: </span>
                    <span className="text-[#4CAF50]">£{(recipe.totalCost / recipe.serves).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                  <button 
                    onClick={() => toggleLike(recipe.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        likedRecipes.includes(recipe.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                    <span className="text-gray-600">{recipe.likes}</span>
                  </button>
                  <button className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{recipe.comments}</span>
                  </button>
                  <button className="ml-auto text-[#4CAF50]">View Recipe</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}