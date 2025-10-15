import React from 'react';

interface HousingPreferencesData {
  homeType: string;
  rentOrBuy: string;
  rentPriceMin: number;
  rentPriceMax: number;
  buyPriceMin: number;
  buyPriceMax: number;
  bedrooms: number;
  bathrooms: number;
  parking: string;
}

interface HousingPreferencesProps {
  preferences: HousingPreferencesData;
  onUpdate: (preferences: HousingPreferencesData) => void;
  onNext: () => void;
  onBack: () => void;
  saving: boolean;
  errors: string[];
}

function HousingPreferences({ preferences, onUpdate, onNext, onBack, saving, errors }: HousingPreferencesProps): React.JSX.Element {
  function handleHomeTypeChange(homeType: string) {
    const updatedPreferences = { ...preferences, homeType };
    
    // If changing to Apartment, auto-set rentOrBuy to "rent"
    if (homeType === 'apartment') {
      updatedPreferences.rentOrBuy = 'rent';
    }
    
    // If changing from Apartment to another type and Studio is selected, reset to "Any"
    if (preferences.homeType === 'apartment' && homeType !== 'apartment' && preferences.bedrooms === -1) {
      updatedPreferences.bedrooms = 0;
    }
    
    onUpdate(updatedPreferences);
  }
  function handleRentMinChange(value: number) {
    if (value <= preferences.rentPriceMax) {
      onUpdate({ ...preferences, rentPriceMin: value });
    }
  }

  function handleRentMaxChange(value: number) {
    if (value >= preferences.rentPriceMin) {
      onUpdate({ ...preferences, rentPriceMax: value });
    }
  }

  function handleBuyMinChange(value: number) {
    if (value <= preferences.buyPriceMax) {
      onUpdate({ ...preferences, buyPriceMin: value });
    }
  }

  function handleBuyMaxChange(value: number) {
    if (value >= preferences.buyPriceMin) {
      onUpdate({ ...preferences, buyPriceMax: value });
    }
  }

  function handleBedroomsChange(value: number) {
    const updatedPreferences = { ...preferences, bedrooms: value };
    
    // If Studio is selected (bedrooms = -1), set bathrooms to 1
    if (value === -1) {
      updatedPreferences.bathrooms = 1;
    }
    
    onUpdate(updatedPreferences);
  }

  const homeTypeOptions = [
    'Apartment', 'Condo', 'Townhouse', 'House',
    'Duplex'
  ];

  const rentOrBuyOptions = [
    'Rent', 'Buy', 'Either'
  ];


  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Housing Preferences</h2>
          <span className="text-sm text-gray-500">Step 2 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '66%' }}></div>
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
        {/* Home Type */}
        <div>
          <label htmlFor="homeType" className="block text-sm font-medium text-gray-700 mb-1">
            Home Type
          </label>
          <select
            id="homeType"
            value={preferences.homeType}
            onChange={(e) => handleHomeTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="">Select home type</option>
            {homeTypeOptions.map(option => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Rent or Buy */}
        <div>
          <label htmlFor="rentOrBuy" className={`block text-sm font-medium mb-1 ${
            preferences.homeType === 'apartment' ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Rent or Buy
          </label>
          <select
            id="rentOrBuy"
            value={preferences.rentOrBuy}
            onChange={(e) => onUpdate({ ...preferences, rentOrBuy: e.target.value })}
            disabled={preferences.homeType === 'apartment'}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              preferences.homeType === 'apartment' 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-white'
            }`}
          >
            <option value="">Select preference</option>
            {rentOrBuyOptions.map(option => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Inputs */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Budget Range</h3>
          
          {/* Rent Price Inputs */}
          <div className={`mb-6 ${preferences.rentOrBuy === 'buy' ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Monthly Rent Budget
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rentMin" className="block text-xs text-gray-600 mb-1">
                  Minimum Rent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    id="rentMin"
                    min="500"
                    max="10000"
                    step="100"
                    value={preferences.rentPriceMin}
                    onChange={(e) => handleRentMinChange(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    placeholder="1000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="rentMax" className="block text-xs text-gray-600 mb-1">
                  Maximum Rent
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    id="rentMax"
                    min="500"
                    max="10000"
                    step="100"
                    value={preferences.rentPriceMax}
                    onChange={(e) => handleRentMaxChange(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    placeholder="3000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buy Price Inputs */}
          <div className={`${preferences.rentOrBuy === 'rent' ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Home Purchase Budget
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="buyMin" className="block text-xs text-gray-600 mb-1">
                  Minimum Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    id="buyMin"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={preferences.buyPriceMin}
                    onChange={(e) => handleBuyMinChange(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    placeholder="300000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="buyMax" className="block text-xs text-gray-600 mb-1">
                  Maximum Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    id="buyMax"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={preferences.buyPriceMax}
                    onChange={(e) => handleBuyMaxChange(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                    placeholder="800000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Bedrooms
            </label>
            <select
              id="bedrooms"
              value={preferences.bedrooms}
              onChange={(e) => handleBedroomsChange(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value={0}>Any</option>
              {preferences.homeType === 'apartment' && <option value={-1}>Studio</option>}
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5+</option>
            </select>
          </div>
          <div>
            <label htmlFor="bathrooms" className={`block text-sm font-medium mb-1 ${
              preferences.bedrooms === -1 ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Number of Bathrooms
            </label>
            <select
              id="bathrooms"
              value={preferences.bathrooms}
              onChange={(e) => onUpdate({ ...preferences, bathrooms: parseInt(e.target.value) || 0 })}
              disabled={preferences.bedrooms === -1}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                preferences.bedrooms === -1 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-white'
              }`}
            >
              <option value={0}>Any</option>
              <option value={1}>1</option>
              <option value={1.5}>1.5</option>
              <option value={2}>2</option>
              <option value={2.5}>2.5</option>
              <option value={3}>3</option>
              <option value={4}>4+</option>
            </select>
          </div>
        </div>

        {/* Parking */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.parking === 'required'}
              onChange={(e) => onUpdate({ 
                ...preferences, 
                parking: e.target.checked ? 'required' : 'not_required' 
              })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Parking Required
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onBack}
            disabled={saving}
            className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button 
            type="button"
            onClick={onNext}
            disabled={saving}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {saving ? 'Saving...' : 'Next: Amenities & Schools'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HousingPreferences;
