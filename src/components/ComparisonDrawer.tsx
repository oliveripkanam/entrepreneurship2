import { ArrowUpDown, Star, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from './ui/drawer';

interface BasketItem {
  id: number;
  name: string;
  quantity: string;
  image: string;
  count: number;
  prices: {
    tesco: { regular: number; loyalty: number; rating: number; reviews: number; quality: string };
    sainsburys: { regular: number; loyalty: number; rating: number; reviews: number; quality: string };
    aldi: { regular: number; loyalty: number; rating: number; reviews: number; quality: string };
    lidl: { regular: number; loyalty: number; rating: number; reviews: number; quality: string };
    morrisons: { regular: number; loyalty: number; rating: number; reviews: number; quality: string };
  };
}

interface ComparisonDrawerProps {
  item: BasketItem | null;
  isOpen: boolean;
  onClose: () => void;
  loyaltyEnabled: boolean;
  onSwap?: (itemId: number, newStore: string) => void;
}

const storeInfo = {
  tesco: { name: 'Tesco', color: '#00539F', emoji: '🔵' },
  sainsburys: { name: "Sainsbury's", color: '#F06C00', emoji: '🟠' },
  aldi: { name: 'Aldi', color: '#00A0E3', emoji: '🔷' },
  lidl: { name: 'Lidl', color: '#0050AA', emoji: '🟦' },
  morrisons: { name: 'Morrisons', color: '#FFD200', emoji: '🟡' }
};

// Calculate unit price from package size
const calculateUnitPrice = (price: number, quantity: string): string => {
  const match = quantity.match(/(\d+)\s*(g|kg|ml|l|litres?|per|tray)/i);
  if (!match) return '—';
  
  const amount = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  // Convert to standard units (per kg or per litre)
  if (unit === 'g') {
    return `£${((price / amount) * 1000).toFixed(2)}/kg`;
  } else if (unit === 'kg') {
    return `£${(price / amount).toFixed(2)}/kg`;
  } else if (unit === 'ml') {
    return `£${((price / amount) * 1000).toFixed(2)}/L`;
  } else if (unit === 'l' || unit.startsWith('litre')) {
    return `£${(price / amount).toFixed(2)}/L`;
  } else if (unit === 'per' || unit === 'tray') {
    return `£${(price / amount).toFixed(2)}/unit`;
  }
  
  return '—';
};

export function ComparisonDrawer({ 
  item, 
  isOpen, 
  onClose, 
  loyaltyEnabled,
  onSwap 
}: ComparisonDrawerProps) {
  if (!item) return null;

  const [sortOption, setSortOption] = useState<'price' | 'quality'>('price');
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  // Get comparison data for all stores
  const allComparisons = Object.entries(storeInfo).map(([key, info]) => {
    const priceData = item.prices[key as keyof typeof item.prices];
    const price = loyaltyEnabled ? priceData.loyalty : priceData.regular;
    
    return {
      storeKey: key,
      ...info,
      price,
      unitPrice: calculateUnitPrice(price, item.quantity),
      rating: priceData.rating,
      reviews: priceData.reviews,
      quality: priceData.quality
    };
  });

  // Apply quality filter
  let filteredComparisons = allComparisons;
  if (qualityFilter !== 'all') {
    filteredComparisons = allComparisons.filter(c => c.quality === qualityFilter);
  }

  // Sort based on selected option
  const comparisons = [...filteredComparisons].sort((a, b) => {
    if (sortOption === 'price') {
      return a.price - b.price;
    } else {
      // Sort by rating descending
      return b.rating - a.rating;
    }
  });

  const cheapestPrice = Math.min(...allComparisons.map(c => c.price));
  const highestRated = Math.max(...allComparisons.map(c => c.rating));

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Fresh': return 'bg-green-100 text-green-700 border-green-200';
      case 'Value': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                ? 'fill-amber-200 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              {item.image}
            </div>
            <div className="flex-1">
              <DrawerTitle className="text-gray-900">{item.name}</DrawerTitle>
              <DrawerDescription className="text-gray-500">{item.quantity}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-4 pb-8 overflow-y-auto max-h-[60vh]">
          {/* Sort and Filter Controls */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900">Price Comparison</h3>
            </div>
            
            {/* Sort Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-3">
              <button
                onClick={() => setSortOption('price')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  sortOption === 'price'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Price
              </button>
              <button
                onClick={() => setSortOption('quality')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  sortOption === 'quality'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <Star className="w-4 h-4" />
                Quality
              </button>
            </div>

            {/* Quality Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setQualityFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  qualityFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Quality
              </button>
              <button
                onClick={() => setQualityFilter('Premium')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  qualityFilter === 'Premium'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Premium
              </button>
              <button
                onClick={() => setQualityFilter('Fresh')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  qualityFilter === 'Fresh'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Fresh
              </button>
              <button
                onClick={() => setQualityFilter('Value')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  qualityFilter === 'Value'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Value
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="space-y-3">
            {comparisons.map((store) => {
              const isCheapest = store.price === cheapestPrice;
              const isHighestRated = store.rating === highestRated;
              
              return (
                <div
                  key={store.storeKey}
                  className={`rounded-xl p-4 border-2 ${
                    sortOption === 'price' && isCheapest
                      ? 'bg-[#4CAF50]/10 border-[#4CAF50]'
                      : sortOption === 'quality' && isHighestRated
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{store.emoji}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 font-medium">{store.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getQualityColor(store.quality)}`}>
                            {store.quality}
                          </span>
                        </div>
                        <div className="text-gray-500 text-sm">{store.unitPrice}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-semibold mb-1 ${
                        sortOption === 'price' && isCheapest ? 'text-[#4CAF50]' : 'text-gray-900'
                      }`}>
                        £{store.price.toFixed(2)}
                      </div>
                      {sortOption === 'price' && isCheapest && (
                        <div className="bg-[#4CAF50] text-white px-2 py-0.5 rounded-full text-xs inline-block">
                          Cheapest
                        </div>
                      )}
                      {sortOption === 'price' && !isCheapest && (
                        <div className="text-gray-400 text-xs">
                          +£{(store.price - cheapestPrice).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quality & Reviews Section */}
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {renderStars(store.rating)}
                        <span className="text-sm font-semibold text-gray-900">{store.rating.toFixed(1)}</span>
                      </div>
                      {sortOption === 'quality' && isHighestRated && (
                        <div className="bg-amber-400 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Top Rated
                        </div>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{store.reviews.toLocaleString()} customer reviews</p>
                    
                    {/* Sample Review Preview */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-gray-600 text-xs italic">
                        {store.quality === 'Premium' && "Excellent quality and freshness. Worth the premium price."}
                        {store.quality === 'Fresh' && "Always fresh and good quality for the price."}
                        {store.quality === 'Value' && "Great value for money. Does the job well."}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">— Recent customer</p>
                    </div>
                  </div>
                  
                  {/* Swap Button */}
                  <button
                    onClick={() => {
                      if (onSwap) {
                        onSwap(item.id, store.storeKey);
                      }
                      onClose();
                    }}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      (sortOption === 'price' && isCheapest) || (sortOption === 'quality' && isHighestRated)
                        ? 'bg-[#4CAF50] text-white hover:bg-[#45a049]'
                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {(sortOption === 'price' && isCheapest) || (sortOption === 'quality' && isHighestRated)
                      ? 'Choose Best Option'
                      : 'Select This Store'}
                  </button>
                </div>
              );
            })}
          </div>

          {comparisons.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No products match the selected quality filter</p>
              <button 
                onClick={() => setQualityFilter('all')}
                className="text-[#4CAF50] text-sm mt-2 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {loyaltyEnabled && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-blue-900 text-sm">
                💳 <span className="font-medium">Loyalty pricing enabled</span> — Prices shown include Clubcard & Nectar discounts
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
