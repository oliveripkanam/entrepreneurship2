import { useState } from 'react';
import { ChevronLeft, Bell, Settings, HelpCircle, Shield, LogOut, ChevronRight, X, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const { profile, user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const profileName = profile?.display_name || 'Smart Shopper';
  const profileEmail = user?.email || '';

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Profile</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{profileName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-gray-800">{profileName}</h2>
            <p className="text-gray-600">{profileEmail}</p>
          </div>
        </div>
        <button className="text-[#4CAF50] font-medium" onClick={() => onNavigate('edit-profile')}>
          Edit Profile
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Preferences</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('dietary')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"><span className="text-xl">🥕</span></div>
                <div className="text-left">
                  <h4 className="text-gray-800">Dietary Preferences</h4>
                  <p className="text-gray-600 text-sm">Manage your dietary filters</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"><span className="text-xl">💳</span></div>
                <div className="text-left">
                  <h4 className="text-gray-800">Loyalty Cards</h4>
                  <p className="text-gray-600 text-sm">Manage loyalty card settings</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><span className="text-xl">🌱</span></div>
                <div className="text-left">
                  <h4 className="text-gray-800">Sustainability Mode</h4>
                  <p className="text-gray-600 text-sm">Show eco-friendly options</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Notifications</h3>
          <button onClick={() => onNavigate('notifications')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-800">Notification Settings</h4>
                <p className="text-gray-600 text-sm">Manage your alerts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Settings</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('general-settings')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">General Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => onNavigate('privacy-security')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Privacy & Security</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Help & Support</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('help-center')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => onNavigate('contact-support')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span className="text-gray-800">Contact Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => onNavigate('faq')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <span className="text-gray-800">FAQ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">About</h3>
          <div className="space-y-2">
            <button onClick={() => onNavigate('how-pantry-works')} className="w-full flex items-center justify-between p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/25 rounded-lg hover:bg-[#4CAF50]/15 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">💡</span>
                <span className="text-[#4CAF50] font-medium">How Pantry Works</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#4CAF50]" />
            </button>
            <button onClick={() => setShowTutorial(true)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <span className="text-gray-800">Getting Started</span>
                  <p className="text-gray-500 text-xs">Learn how to use Pantry</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => onNavigate('terms')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-800">Terms & Conditions</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={() => onNavigate('privacy-policy')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-800">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-center text-sm">Version 1.0.0</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowTutorial(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-800 text-xl">Getting Started with Pantry</h2>
              <button onClick={() => setShowTutorial(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <p className="text-gray-700 text-sm">Welcome to Pantry! Here's a quick guide to help you save money on groceries and make smarter shopping decisions.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">📊</div>
                  <div>
                    <h3 className="text-gray-800 mb-1">1. Compare Prices Across Stores</h3>
                    <p className="text-gray-600 text-sm">Find the best deals across Tesco, Sainsbury's, Lidl, Aldi, and Morrisons.</p>
                  </div>
                </div>
                <div className="pl-13 space-y-1 text-sm text-gray-600">
                  <p>→ Go to <strong>Basket</strong> tab</p>
                  <p>→ Add items & compare prices instantly</p>
                  <p>→ Toggle <strong>Loyalty Prices</strong> for extra savings</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">🍝</div>
                  <div>
                    <h3 className="text-gray-800 mb-1">2. Convert Recipes to Shopping Lists</h3>
                    <p className="text-gray-600 text-sm">Turn any recipe into an optimized shopping list.</p>
                  </div>
                </div>
                <div className="pl-13 space-y-1 text-sm text-gray-600">
                  <p>→ Paste a recipe URL, YouTube or Instagram link</p>
                  <p>→ AI extracts ingredients automatically</p>
                  <p>→ See cost comparison per store</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">📍</div>
                  <div>
                    <h3 className="text-gray-800 mb-1">3. Find Nearby Stores</h3>
                    <p className="text-gray-600 text-sm">Discover stores near you and get directions.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">🔔</div>
                  <div>
                    <h3 className="text-gray-800 mb-1">4. Get Price Drop Alerts</h3>
                    <p className="text-gray-600 text-sm">Set up notifications when items drop in price.</p>
                  </div>
                </div>
              </div>
              <div className="text-center pt-2 pb-2">
                <button onClick={() => setShowTutorial(false)} className="bg-[#4CAF50] text-white px-8 py-3 rounded-xl font-medium">
                  Start Shopping Smart! 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
