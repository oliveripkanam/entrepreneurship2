import { useState } from 'react';
import { ChevronLeft, MapPin, Navigation, List, Map as MapIcon } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'map';

interface StoreMapProps {
  onNavigate: (screen: Screen) => void;
}

const nearbyStores = [
  {
    id: 1,
    name: 'Tesco Express',
    chain: 'Tesco',
    emoji: '🔵',
    distance: 0.3,
    address: '45 High Street, London SW1A 1AA',
    openUntil: '11:00 PM',
    hasLoyalty: true,
    loyaltyName: 'Clubcard',
    lat: 51.505,
    lng: -0.09
  },
  {
    id: 2,
    name: 'Sainsbury\'s Local',
    chain: 'Sainsbury\'s',
    emoji: '🟠',
    distance: 0.5,
    address: '12 Victoria Road, London SW1A 2BB',
    openUntil: '10:00 PM',
    hasLoyalty: true,
    loyaltyName: 'Nectar',
    lat: 51.508,
    lng: -0.085
  },
  {
    id: 3,
    name: 'Lidl',
    chain: 'Lidl',
    emoji: '🟦',
    distance: 0.7,
    address: '88 Oxford Street, London W1D 1BS',
    openUntil: '9:00 PM',
    hasLoyalty: false,
    lat: 51.512,
    lng: -0.095
  },
  {
    id: 4,
    name: 'Aldi',
    chain: 'Aldi',
    emoji: '🔷',
    distance: 0.9,
    address: '23 Baker Street, London NW1 6XE',
    openUntil: '10:00 PM',
    hasLoyalty: false,
    lat: 51.515,
    lng: -0.08
  },
  {
    id: 5,
    name: 'Morrisons Daily',
    chain: 'Morrisons',
    emoji: '🟡',
    distance: 1.2,
    address: '67 Regent Street, London W1B 4EA',
    openUntil: '11:00 PM',
    hasLoyalty: false,
    lat: 51.502,
    lng: -0.1
  },
  {
    id: 6,
    name: 'Tesco Superstore',
    chain: 'Tesco',
    emoji: '🔵',
    distance: 1.5,
    address: '156 Kensington High Street, London W8 7RG',
    openUntil: 'Midnight',
    hasLoyalty: true,
    loyaltyName: 'Clubcard',
    lat: 51.5,
    lng: -0.105
  }
];

export function StoreMap({ onNavigate }: StoreMapProps) {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-gray-900">Nearby Stores</h1>
        <button className="w-6 h-6" />
      </div>

      {/* View Toggle */}
      <div className="px-6 pt-6 pb-4">
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              view === 'map' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <MapIcon className={`w-5 h-5 ${view === 'map' ? 'text-[#4CAF50]' : 'text-gray-500'}`} />
            <span className={view === 'map' ? 'text-gray-900' : 'text-gray-500'}>Map</span>
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              view === 'list' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <List className={`w-5 h-5 ${view === 'list' ? 'text-[#4CAF50]' : 'text-gray-500'}`} />
            <span className={view === 'list' ? 'text-gray-900' : 'text-gray-500'}>List</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="px-6">
          {/* Mock Map Display */}
          <div className="bg-gray-100 rounded-2xl h-96 mb-6 relative overflow-hidden">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* Your Location */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-4 h-4 bg-[#4CAF50] rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#4CAF50]/20 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Store Pins */}
            {nearbyStores.slice(0, 4).map((store, index) => (
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
                <div className={`transform transition-all ${
                  selectedStore === store.id ? 'scale-125' : ''
                }`}>
                  <div className="relative">
                    <div className="text-4xl">{store.emoji}</div>
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

            {/* Compass */}
            <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
              <Navigation className="w-5 h-5 text-gray-700" />
            </div>

            {/* Center on Me Button */}
            <button className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
              <MapPin className="w-5 h-5 text-[#4CAF50]" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#4CAF50]/10 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Closest Store</p>
                <h3 className="text-gray-900">{nearbyStores[0].name}</h3>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm mb-1">Distance</p>
                <p className="text-[#4CAF50] text-2xl">{nearbyStores[0].distance}mi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="px-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-500">{nearbyStores.length} stores nearby</p>
            <button className="text-[#4CAF50] text-sm flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              Sort by distance
            </button>
          </div>

          <div className="space-y-3">
            {nearbyStores.map((store) => (
              <div
                key={store.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#4CAF50] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Store Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{store.emoji}</span>
                  </div>

                  {/* Store Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900 mb-1">{store.name}</h4>
                        <p className="text-gray-500 text-sm">{store.address}</p>
                      </div>
                      <div className="bg-[#4CAF50]/10 text-[#4CAF50] px-3 py-1 rounded-full text-sm whitespace-nowrap ml-2">
                        {store.distance} mi
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <span>🕐</span>
                        <span>Open until {store.openUntil}</span>
                      </div>
                      {store.hasLoyalty && (
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-purple-600">💳</span>
                          <span className="text-purple-600">{store.loyaltyName}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#4CAF50] text-white py-2 rounded-xl text-sm">
                        Get Directions
                      </button>
                      <button className="flex-1 border-2 border-gray-100 text-gray-700 py-2 rounded-xl text-sm">
                        View Prices
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
            All Stores
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">
            🔵 Tesco
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">
            🟠 Sainsbury's
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">
            🔷 Aldi
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">
            🟦 Lidl
          </button>
        </div>
      </div>
    </div>
  );
}
