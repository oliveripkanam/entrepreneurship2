import { useState } from 'react';
import { ChevronLeft, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRICES_LAST_UPDATED } from '../lib/priceData';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications';

interface PriceHistoryProps {
  onNavigate: (screen: Screen) => void;
}

const monthlyData = [
  { month: 'Mar 23', price: 2.20, avgPrice: 2.25 },
  { month: 'Apr 23', price: 2.25, avgPrice: 2.28 },
  { month: 'May 23', price: 2.30, avgPrice: 2.30 },
  { month: 'Jun 23', price: 2.50, avgPrice: 2.45 },
  { month: 'Jul 23', price: 2.60, avgPrice: 2.52 },
  { month: 'Aug 23', price: 2.55, avgPrice: 2.50 },
  { month: 'Sep 23', price: 2.65, avgPrice: 2.55 },
  { month: 'Oct 23', price: 2.70, avgPrice: 2.58 },
  { month: 'Nov 23', price: 2.75, avgPrice: 2.62 },
  { month: 'Dec 23', price: 2.65, avgPrice: 2.60 },
  { month: 'Jan 24', price: 2.50, avgPrice: 2.55 },
  { month: 'Feb 24', price: 2.45, avgPrice: 2.48 }
];

const yearlyData = [
  { year: '2020', price: 1.80, avgPrice: 1.85 },
  { year: '2021', price: 1.95, avgPrice: 2.00 },
  { year: '2022', price: 2.20, avgPrice: 2.25 },
  { year: '2023', price: 2.55, avgPrice: 2.50 },
  { year: '2024', price: 2.45, avgPrice: 2.48 }
];

export function PriceHistory({ onNavigate }: PriceHistoryProps) {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const data = timeframe === 'monthly' ? monthlyData : yearlyData;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Price History</h1>
        <button onClick={() => onNavigate('notifications')}>
          <Bell className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="p-6">
        {/* Product Info */}
        <div className="mb-6">
          <h2 className="text-gray-800 mb-2">Organic Whole Milk (2L) Price Trend</h2>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{timeframe === 'monthly' ? '(Last 12 Months)' : '(Last 5 Years)'}</p>
            <span className="text-gray-400 text-xs">Updated: {PRICES_LAST_UPDATED}</span>
          </div>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'monthly' 
                ? 'bg-[#4CAF50] text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeframe('yearly')}
            className={`px-4 py-2 rounded-lg ${
              timeframe === 'yearly' 
                ? 'bg-[#4CAF50] text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Chart */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey={timeframe === 'monthly' ? 'month' : 'year'} 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#4CAF50" 
                strokeWidth={2}
                name="Actual Price"
                dot={{ fill: '#4CAF50' }}
              />
              <Line 
                type="monotone" 
                dataKey="avgPrice" 
                stroke="#ff9800" 
                strokeWidth={2}
                name="Average Price"
                dot={{ fill: '#ff9800' }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Analysis */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
          <h4 className="text-gray-800 mb-2">Price Trend Analysis</h4>
          <p className="text-gray-600 mb-3">
            Analyze price trends to discover the best times for purchasing Organic Whole Milk (2L). Fluctuations can indicate seasonal changes or promotional periods.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
              <span className="text-gray-700">Actual Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff9800] rounded-full"></div>
              <span className="text-gray-700">Average Price</span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📉</div>
            <div>
              <h4 className="text-gray-800 mb-1">Good Time to Buy!</h4>
              <p className="text-gray-600">
                Current price is below the average. This is a great opportunity to stock up on this item.
              </p>
            </div>
          </div>
        </div>

        {/* Watch Item */}
        <button className="w-full bg-[#4CAF50] text-white py-3 rounded-lg mt-6">
          Watch This Item for Price Drops
        </button>
      </div>
    </div>
  );
}
