import { useState, useEffect } from 'react';
import { ChevronLeft, Bell } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import supabase from '../lib/supabase';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications';

interface PriceHistoryProps {
  onNavigate: (screen: Screen) => void;
}

export function PriceHistory({ onNavigate }: PriceHistoryProps) {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [productName, setProductName] = useState('Organic Whole Milk (2L)');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data: firstItem } = await supabase.from('price_history').select('product_id').limit(1).maybeSingle();
        if (firstItem) {
          const pid = firstItem.product_id;
          const [mRes, yRes, pRes] = await Promise.all([
            supabase.from('price_history_monthly').select('*').eq('product_id', pid).order('recorded_at'),
            supabase.from('price_history_yearly').select('*').eq('product_id', pid).order('year'),
            supabase.from('products').select('name').eq('id', pid).single()
          ]);
          if (mRes.data) setMonthlyData(mRes.data);
          if (yRes.data) setYearlyData(yRes.data);
          if (pRes.data) setProductName(pRes.data.name);
        }
      } catch (err) {
        console.error('Error fetching price history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const data = timeframe === 'monthly' ? monthlyData : yearlyData;
  const lastUpdated = monthlyData.length > 0 
    ? new Date(monthlyData[monthlyData.length - 1].recorded_at).toLocaleDateString() 
    : 'Today';

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
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-64">
            <div className="w-10 h-10 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading price trends...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-100 mt-8">
            <p>No price history data available yet.</p>
          </div>
        ) : (
          <>
            {/* Product Info */}
            <div className="mb-6">
              <h2 className="text-gray-800 mb-2">{productName} Price Trend</h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">{timeframe === 'monthly' ? '(Last 12 Months)' : '(Last 5 Years)'}</p>
                <span className="text-gray-400 text-xs">Updated: {lastUpdated}</span>
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
          </>
        )}
      </div>
    </div>
  );
}
