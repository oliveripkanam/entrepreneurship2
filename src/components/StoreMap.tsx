import { useState, useEffect } from 'react';
import { ChevronLeft, Bell, MapPin, Navigation, List, Map as MapIcon } from 'lucide-react';
import supabase from '../lib/supabase';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works' | 'map';

interface StoreMapProps {
  onNavigate: (screen: Screen) => void;
}

export function StoreMap({ onNavigate }: StoreMapProps) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [storesData, setStoresData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase.from('stores').select('*');
        if (data) {
          const userLat = 51.5072;
          const userLng = -0.1276;

          const mapped = data.map((s) => {
             const dist = s.lat && s.lng 
                ? Math.sqrt(Math.pow((Number(s.lng) - userLng) * 43, 2) + Math.pow((Number(s.lat) - userLat) * 69, 2))
                : 1.5;

             return {
               id: s.id,
               name: s.name,
               chain: s.name,
               color: s.color,
               emoji: s.emoji,
               domain: s.domain,
               distance: Math.round(dist * 10) / 10,
               address: s.address || 'Location unknown',
               openUntil: s.open_until || 'Standard hours',
               hasLoyalty: s.has_loyalty || false,
               loyaltyName: s.loyalty_name || '',
             };
          }).sort((a,b) => a.distance - b.distance);
          setStoresData(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const getLogoUrl = (domain: string) => {
    if (domain === 'sainsburys.co.uk') return "https://cdn.brandfetch.io/id3jwaSrnD/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1685968241221";
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#4CAF50] p-6 pb-8">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => onNavigate('home')}>
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white">Nearby Stores</h1>
          <button onClick={() => onNavigate('notifications')}>
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* View Toggle */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-2 flex gap-2">
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              view === 'map' ? 'bg-[#4CAF50] text-white' : 'text-gray-500'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              view === 'list' ? 'bg-[#4CAF50] text-white' : 'text-gray-500'
            }`}
          >
            <List className="w-5 h-5" />
            <span>List</span>
          </button>
        </div>

        {/* Map View */}
        {view === 'map' && (
          <>
            <div className="bg-white rounded-xl shadow-sm h-96 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              {/* Your Location */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  <div className="w-4 h-4 bg-[#4CAF50] rounded-full border-4 border-white shadow-lg"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#4CAF50]/20 rounded-full animate-pulse"></div>
                </div>
              </div>
              {/* Store Pins */}
              {storesData.slice(0, 4).map((store, index) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  className={`absolute z-20 ${
                    index === 0 ? 'top-1/4 left-1/3' :
                    index === 1 ? 'top-1/3 right-1/4' :
                    index === 2 ? 'bottom-1/3 left-1/4' :
                    'bottom-1/4 right-1/3'
                  }`}
                >
                  <div className={`transform transition-all ${selectedStore === store.id ? 'scale-125' : ''}`}>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-[#4CAF50] text-xl">
                        <img src={getLogoUrl(store.domain)} alt={store.chain} className="w-7 h-7 object-contain" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerText=store.emoji; }} />
                      </div>
                      {selectedStore === store.id && (
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg p-3 w-48 whitespace-nowrap">
                          <p className="text-gray-900 text-sm mb-1">{store.name}</p>
                          <p className="text-gray-500 text-xs">{store.distance} miles away</p>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
                <Navigation className="w-5 h-5 text-gray-700" />
              </div>
              <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
                <MapPin className="w-5 h-5 text-[#4CAF50]" />
              </button>
            </div>

            {/* Quick Stats */}
            {storesData.length > 0 && (
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-xl shadow-md p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Closest Store</p>
                    <h3 className="text-white">{storesData[0].name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm mb-1">Distance</p>
                    <p className="text-white text-2xl">{storesData[0].distance}mi</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* List View */}
        {view === 'list' && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-500">{storesData.length} stores nearby</p>
              <button className="text-[#4CAF50] text-sm flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                Sort by distance
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {storesData.map((store) => (
                  <div key={store.id} className="bg-white rounded-xl shadow-sm p-5 border-2 border-transparent hover:border-[#4CAF50] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 text-2xl">
                        <img src={getLogoUrl(store.domain)} alt={store.chain} className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerText=store.emoji; }} />
                      </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-800 mb-1">{store.name}</h4>
                          <p className="text-gray-500 text-sm">{store.address}</p>
                        </div>
                        <div className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2">
                          {store.distance} mi
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-gray-600 text-sm">🕐 Open until {store.openUntil}</span>
                        {store.hasLoyalty && (
                          <span className="text-purple-600 text-sm">💳 {store.loyaltyName}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-[#4CAF50] text-white py-2 rounded-lg text-sm">Get Directions</button>
                        <button className="flex-1 border-2 border-gray-200 text-gray-700 py-2 rounded-lg text-sm">View Prices</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </>
        )}

        {/* Filter Chips */}
        <div className="mt-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All Stores', 'Tesco', "Sainsbury's", 'Aldi', 'Lidl', 'Morrisons'].map((name, i) => (
              <button key={name} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${i === 0 ? 'bg-[#4CAF50] text-white' : 'bg-white text-gray-700 shadow-sm'}`}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
