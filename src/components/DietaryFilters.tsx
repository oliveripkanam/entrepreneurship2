import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications';

interface DietaryFiltersProps {
  onNavigate: (screen: Screen) => void;
}

const dietaryOptions = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'nut-free', label: 'Nut-Free' },
  { id: 'organic', label: 'Organic' },
  { id: 'low-carb', label: 'Low Carb' }
];

export function DietaryFilters({ onNavigate }: DietaryFiltersProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelected([]);
  };

  const applyFilters = () => {
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('home')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Dietary Filters</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h3 className="text-gray-800 mb-2">Select Your Preferences</h3>
          <p className="text-gray-600">
            Customize your search results by selecting specific dietary requirements.
          </p>
        </div>

        {/* Filter Options */}
        <div className="space-y-3 mb-8">
          {dietaryOptions.map((option) => (
            <label 
              key={option.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-800">{option.label}</span>
              <input 
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => toggleFilter(option.id)}
                className="w-5 h-5 rounded border-gray-300 text-[#4CAF50] focus:ring-[#4CAF50]"
              />
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={resetFilters}
            className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-lg"
          >
            Reset Filters
          </button>
          <button 
            onClick={applyFilters}
            className="flex-1 bg-[#4CAF50] text-white py-3 rounded-lg"
          >
            Apply Filters
          </button>
        </div>

        {selected.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-800">
              {selected.length} filter{selected.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
