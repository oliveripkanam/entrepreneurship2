import { ChevronLeft, TrendingDown, Bell as BellIcon } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications';

interface NotificationsProps {
  onNavigate: (screen: Screen) => void;
}

const notifications = [
  {
    id: 1,
    type: 'price-drop',
    product: 'Organic Free-Range Eggs (Large)',
    store: 'Tesco',
    oldPrice: 2.80,
    newPrice: 2.30,
    savings: 0.50,
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'price-drop',
    product: 'Semi-Skimmed Milk (2 Litres)',
    store: 'Aldi',
    oldPrice: 1.75,
    newPrice: 1.50,
    savings: 0.25,
    time: '5 hours ago'
  },
  {
    id: 3,
    type: 'watched-item',
    product: 'Greek Yogurt (500g)',
    store: "Sainsbury's",
    oldPrice: 2.50,
    newPrice: 2.00,
    savings: 0.50,
    time: '1 day ago'
  },
  {
    id: 4,
    type: 'price-drop',
    product: 'Wholemeal Bread (800g)',
    store: 'Morrisons',
    oldPrice: 1.25,
    newPrice: 1.00,
    savings: 0.25,
    time: '2 days ago'
  },
  {
    id: 5,
    type: 'basket-savings',
    message: 'Your basket total has dropped by £1.75 at Lidl',
    time: '3 days ago'
  }
];

export function Notifications({ onNavigate }: NotificationsProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Notifications</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-gray-800">Price Drop Alerts</h3>
          <p className="text-gray-600">Stay updated on price changes for items in your basket</p>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              {notification.type === 'basket-savings' ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BellIcon className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-1">{notification.message}</p>
                    <p className="text-gray-600">{notification.time}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 text-[#4CAF50]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-800 mb-1">{notification.product}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-600 line-through">£{notification.oldPrice.toFixed(2)}</span>
                      <span className="text-[#4CAF50]">£{notification.newPrice.toFixed(2)}</span>
                      <span className="bg-green-100 text-[#4CAF50] px-2 py-1 rounded text-xs">
                        Save £{notification.savings.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{notification.store}</p>
                    <p className="text-gray-600">{notification.time}</p>
                  </div>
                  <button className="text-[#4CAF50]">
                    View
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State Message (hidden when there are notifications) */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-800 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              We'll notify you when prices drop on your watched items
            </p>
          </div>
        )}

        {/* Settings */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-gray-800 mb-3">Notification Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Price Drop Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Basket Total Changes</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">New Recipe Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4CAF50]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
