import { useState } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronRight, ChevronLeft, Info, BookOpen, Award, Bell, X, DollarSign, BarChart3, Share2, TrendingDown, Leaf } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header with Profile */}
      <div className="px-6 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900 mb-1">Smart Shopper</h2>
            <p className="text-gray-500">smartshopper@email.com</p>
          </div>
          <button className="text-gray-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 8L17 10L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 pt-6">
        <div className="space-y-2">
          {/* Orders */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Orders</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* My Details */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">My Details</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Delivery Address */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Delivery Address</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Payment Methods */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Payment Methods</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Loyalty Card */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <Settings className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Loyalty Cards</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Dietary Preferences */}
          <button 
            onClick={() => onNavigate('dietary')}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50"
          >
            <div className="flex items-center gap-4">
              <span className="text-xl ml-1">🥕</span>
              <span className="text-gray-900">Dietary Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Notifications */}
          <button 
            onClick={() => onNavigate('notifications')}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50"
          >
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Help */}
          <button className="w-full flex items-center justify-between py-4 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">Help</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* About */}
          <button 
            onClick={() => setShowAbout(true)}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50"
          >
            <div className="flex items-center gap-4">
              <Info className="w-6 h-6 text-gray-700" />
              <span className="text-gray-900">About</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Log Out Button */}
        <button className="w-full mt-8 bg-gray-50 text-[#4CAF50] py-4 rounded-2xl flex items-center justify-center gap-3">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowAbout(false)}>
          <div 
            className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 text-xl">About</h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Getting Started Tutorial */}
              <button 
                onClick={() => {
                  setShowAbout(false);
                  setShowTutorial(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#4CAF50] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-gray-900">Getting Started</h4>
                    <p className="text-gray-500 text-sm">Learn how to use Pantry</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* How Pantry Works */}
              <button 
                onClick={() => {
                  setShowAbout(false);
                  setShowHowItWorks(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#4CAF50] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-gray-900">How Pantry Works</h4>
                    <p className="text-gray-500 text-sm">Our business model</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Terms & Conditions */}
              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#4CAF50] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📄</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-gray-900">Terms & Conditions</h4>
                    <p className="text-gray-500 text-sm">Legal information</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Privacy Policy */}
              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#4CAF50] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-gray-900">Privacy Policy</h4>
                    <p className="text-gray-500 text-sm">How we protect your data</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* App Version */}
              <div className="p-4 bg-gray-50 rounded-2xl text-center mt-4">
                <p className="text-gray-500 text-sm">Pantry v1.0.0</p>
                <p className="text-gray-400 text-xs mt-1">Made with 💚 in the UK</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTutorial(false)}>
          <div 
            className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 text-xl">Getting Started with Pantry</h2>
              <button 
                onClick={() => setShowTutorial(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Intro */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                <p className="text-gray-700 text-sm">
                  Welcome to Pantry! Here's a quick guide to help you save money on groceries and make smarter shopping decisions.
                </p>
              </div>

              {/* Feature 1: Price Comparison */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">1. Compare Prices Across Stores</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Find the best deals across Tesco, Sainsbury's, Lidl, Aldi, and Morrisons.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Basket</strong> tab</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Add items to your basket</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">See total costs at each store instantly</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Toggle <strong>Loyalty Prices</strong> for Clubcard/Nectar savings</span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Recipe to List */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🍳</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">2. Convert Recipes to Shopping Lists</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Turn any recipe into an optimized shopping list.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Recipe</strong> tab</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Paste a recipe URL (or YouTube/Instagram link)</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Pantry extracts ingredients automatically</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">See which store offers the best price for that recipe</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Dietary Filters */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🥕</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">3. Filter by Dietary Requirements</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Shop safely with filters for allergies and preferences.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Profile</strong> → <strong>Dietary Preferences</strong></span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Set filters (vegan, gluten-free, nut-free, etc.)</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Only see products that match your needs</span>
                  </div>
                </div>
              </div>

              {/* Feature 4: Social Recipes */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">4. Share & Discover Recipes</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Join the community to share budget-friendly recipes.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Social</strong> tab</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Browse trending recipes with cost breakdowns</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Share your own recipes and tips</span>
                  </div>
                </div>
              </div>

              {/* Feature 5: Price History */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">5. Track Price History</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      See price trends to know when to buy.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Price History</strong> tab</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Search for any product</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">View price graphs across stores and time</span>
                  </div>
                </div>
              </div>

              {/* Feature 6: Sustainability */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">6. Sustainability Ratings</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Make eco-friendly choices with product ratings.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Look for the 🌱 sustainability score on products</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Filter by eco-friendly options in your basket</span>
                  </div>
                </div>
              </div>

              {/* Feature 7: Price Drop Notifications */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">7. Get Price Drop Alerts</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Never miss a deal on your favorite products.
                    </p>
                  </div>
                </div>
                <div className="pl-13 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Go to <strong>Notifications</strong> in Profile</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Watch products you buy regularly</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-[#4CAF50] mt-0.5">→</span>
                    <span className="text-gray-600">Get notified when prices drop</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-yellow-100">
                <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>Pro Tips</span>
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Save time:</strong> Use recipe links to auto-populate your basket</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Save money:</strong> Always check loyalty prices before checkout</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Shop smart:</strong> Check price history to buy at the best time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5 flex-shrink-0">✓</span>
                    <span><strong>Stay updated:</strong> Price data refreshes regularly for accuracy</span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="text-center pt-2 pb-2">
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="bg-[#4CAF50] text-white px-8 py-3 rounded-2xl font-medium"
                >
                  Start Shopping Smart! 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How Pantry Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowHowItWorks(false)}>
          <div 
            className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 text-xl">How Pantry Works</h2>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Main Explanation */}
              <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-100">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Free Price Comparison</h3>
                    <p className="text-gray-600 text-sm">
                      Pantry is completely free to use. We compare prices across all major UK supermarkets to help you save money on every shop.
                    </p>
                  </div>
                </div>
              </div>

              {/* How We Make Money */}
              <div>
                <h3 className="text-gray-900 mb-3">How We Make Money</h3>
                <div className="space-y-3">
                  {/* Affiliate Links */}
                  <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🔗</span>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">Affiliate Links</h4>
                      <p className="text-gray-600 text-sm">
                        When you click through to a supermarket and make a purchase, we may earn a small commission. This doesn't affect your price.
                      </p>
                    </div>
                  </div>

                  {/* Premium Features */}
                  <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⭐</span>
                    </div>
                    <div>
                      <h4 className="text-gray-900 mb-1">Premium Features (Coming Soon)</h4>
                      <p className="text-gray-600 text-sm">
                        We're working on advanced features like price drop alerts, shopping automation, and meal planning that will be available as optional premium subscriptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Privacy */}
              <div className="bg-purple-50 rounded-2xl p-5 border-2 border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">We Don't Sell Your Data</h3>
                    <p className="text-gray-600 text-sm">
                      Your shopping habits and personal information are private. We never sell your data to third parties. Period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Our Promise */}
              <div className="p-5 bg-gray-50 rounded-2xl">
                <h3 className="text-gray-900 mb-3">Our Promise</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5">✓</span>
                    <span>Always free price comparison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5">✓</span>
                    <span>Transparent about how we make money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5">✓</span>
                    <span>Your data stays private</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4CAF50] mt-0.5">✓</span>
                    <span>No hidden fees or surprise charges</span>
                  </li>
                </ul>
              </div>

              {/* Questions */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">Have questions?</p>
                <button className="text-[#4CAF50]">Contact Support →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}