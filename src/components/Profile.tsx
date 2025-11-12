import { ChevronLeft, User, Bell, Settings, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile';

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Profile</h1>
        <div className="w-6"></div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-gray-800">Smart Shopper</h2>
            <p className="text-gray-600">smartshopper@email.com</p>
          </div>
        </div>
        <button className="text-[#4CAF50]">Edit Profile</button>
      </div>

      <div className="p-6">
        {/* Preferences Section */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Preferences</h3>
          <div className="space-y-2">
            <button 
              onClick={() => onNavigate('dietary')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🥕</span>
                </div>
                <div className="text-left">
                  <h4 className="text-gray-800">Dietary Preferences</h4>
                  <p className="text-gray-600">Manage your dietary filters</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
                <div className="text-left">
                  <h4 className="text-gray-800">Loyalty Cards</h4>
                  <p className="text-gray-600">Manage loyalty card settings</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>

            <div className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
                <div className="text-left">
                  <h4 className="text-gray-800">Sustainability Mode</h4>
                  <p className="text-gray-600">Show eco-friendly options</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Notifications</h3>
          <button 
            onClick={() => onNavigate('notifications')}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-800">Notification Settings</h4>
                <p className="text-gray-600">Manage your alerts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Settings */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Settings</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">General Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Privacy & Security</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">Help & Support</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800">Help Center</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span className="text-gray-800">Contact Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">📖</span>
                <span className="text-gray-800">FAQ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-4">About</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-800">Terms & Conditions</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-gray-800">Privacy Policy</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-center">Version 1.0.0</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
