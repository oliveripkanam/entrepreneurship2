import { ShoppingCart, ChefHat, Users, TrendingDown, Leaf, Settings, Search, MapPin, Bell, Check } from 'lucide-react';
import { useState } from 'react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [sustainabilityEnabled, setSustainabilityEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        {/* Pantry Branding */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-gray-900 text-3xl">Pantry</h1>
            <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">UK</span>
          </div>
          <p className="text-gray-500">Save more on every shop 💰</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products or recipes"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="px-6 mb-8">
        <h3 className="text-gray-900 mb-4">Main Features</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Basket Comparison Card */}
          <button 
            onClick={() => onNavigate('basket')}
            className="bg-white border border-gray-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingCart className="w-7 h-7 text-[#4CAF50]" />
            </div>
            <h4 className="text-gray-900 mb-2">Basket Compare</h4>
            <p className="text-gray-500 text-sm">Compare prices across stores</p>
          </button>

          {/* Recipe to List Card */}
          <button 
            onClick={() => onNavigate('recipe')}
            className="bg-white border border-gray-100 rounded-3xl p-6 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center mb-4">
              <ChefHat className="w-7 h-7 text-[#4CAF50]" />
            </div>
            <h4 className="text-gray-900 mb-2">Recipe to List</h4>
            <p className="text-gray-500 text-sm">Convert recipes instantly</p>
          </button>
        </div>
      </div>

      {/* User Preferences */}
      <div className="px-6 mb-8">
        <h3 className="text-gray-900 mb-4">Preferences</h3>
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-gray-900 text-sm font-medium">Sustainability</h4>
                <p className="text-gray-500 text-xs">Show eco-friendly badges</p>
              </div>
            </div>
            <button
              onClick={() => setSustainabilityEnabled(!sustainabilityEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                sustainabilityEnabled ? 'bg-[#4CAF50]' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                sustainabilityEnabled ? 'translate-x-5' : ''
              }`}>
                {sustainabilityEnabled && (
                  <Check className="w-3 h-3 text-[#4CAF50]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="px-6 pb-24">
        <h3 className="text-gray-900 mb-4">All Features</h3>
        <div className="space-y-2">
          {/* Price History - Prioritized */}
          <button 
            onClick={() => onNavigate('price-history')}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-900 text-sm">Price History</h4>
                <p className="text-gray-400 text-xs">Track price trends</p>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="text-gray-300">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Price Alerts - Prioritized */}
          <button 
            onClick={() => onNavigate('notifications')}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-900 text-sm">Price Alerts</h4>
                <p className="text-gray-400 text-xs">Get notified on drops</p>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="text-gray-300">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Social Recipes */}
          <button 
            onClick={() => onNavigate('social')}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-900 text-sm">Social Recipes</h4>
                <p className="text-gray-400 text-xs">Community recipes</p>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="text-gray-300">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dietary Filters */}
          <button 
            onClick={() => onNavigate('dietary')}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">🥕</span>
              </div>
              <div className="text-left">
                <h4 className="text-gray-900 text-sm">Dietary Filters</h4>
                <p className="text-gray-400 text-xs">Vegan, gluten-free & more</p>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="text-gray-300">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Map */}
          <button 
            onClick={() => onNavigate('map')}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#4CAF50] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-900 text-sm">Store Locator</h4>
                <p className="text-gray-400 text-xs">Find nearby stores</p>
              </div>
            </div>
            <svg width="6" height="10" viewBox="0 0 8 14" fill="none" className="text-gray-300">
              <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}