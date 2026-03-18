import { useState } from 'react';
import { ShoppingCart, ChefHat, Users, TrendingDown, Leaf, Settings, MapPin } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works' | 'map';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [sustainabilityEnabled, setSustainabilityEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-bold text-white tracking-tight">Pantry</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">UK</span>
        </div>
        <p className="text-white/90">Save more on every shop 💰</p>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4">
        {/* Main Features - Quick Actions */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Basket Comparison */}
            <button 
              onClick={() => onNavigate('basket')}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <ShoppingCart className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <h4 className="text-gray-800 mb-1 text-center">Basket Comparison</h4>
              <p className="text-gray-600 text-center">Compare prices across stores</p>
            </button>

            {/* Recipe to List */}
            <button 
              onClick={() => onNavigate('recipe')}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-3 mx-auto">
                <ChefHat className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <h4 className="text-gray-800 mb-1 text-center">Recipe to List</h4>
              <p className="text-gray-600 text-center">Convert recipes instantly</p>
            </button>
          </div>
        </div>

        {/* All Features Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">All Features</h3>
          
          <div className="space-y-3">
            {/* Social Recipes */}
            <button 
              onClick={() => onNavigate('social')}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Social Recipe Sharing</h4>
                <p className="text-gray-600">Community recipes with auto-calculated costs</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            {/* Price History */}
            <button 
              onClick={() => onNavigate('price-history')}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Price History Graphs</h4>
                <p className="text-gray-600">Track price trends over time</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            {/* Dietary Filters */}
            <button 
              onClick={() => onNavigate('dietary')}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🥕</span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Dietary Filters</h4>
                <p className="text-gray-600">Vegan, vegetarian, gluten-free & more</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            {/* Sustainability Rating */}
            <div className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Sustainability Ratings</h4>
                <p className="text-gray-600">Eco-friendly product indicators</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={sustainabilityEnabled} onChange={(e) => setSustainabilityEnabled(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>

            {/* Loyalty Pricing */}
            <div className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💳</span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Loyalty Pricing</h4>
                <p className="text-gray-600">Clubcard & Nectar discounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>

            {/* Price Drop Notifications */}
            <button 
              onClick={() => onNavigate('notifications')}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🔔</span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Price Drop Notifications</h4>
                <p className="text-gray-600">Get alerts when prices drop</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            {/* Nearby Stores */}
            <button 
              onClick={() => onNavigate('map')}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] transition-colors"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-gray-800">Nearby Stores</h4>
                <p className="text-gray-600">Find stores & get directions</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Quick Access to Settings */}
        <button 
          onClick={() => onNavigate('profile')}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800">Settings & Profile</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>
    </div>
  );
}