import React from 'react';

interface CommutePreferencesData {
  workLocation: {
    street: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
  maxCommuteTime: number;
  transportationMethod: string;
  walkability: boolean;
}

interface CommutePreferencesProps {
  preferences: CommutePreferencesData;
  onUpdate: (preferences: CommutePreferencesData) => void;
  onNext: () => void;
}

function CommutePreferences({ preferences, onUpdate, onNext }: CommutePreferencesProps): React.JSX.Element {
  function handleWorkLocationChange(field: keyof CommutePreferencesData['workLocation'], value: string) {
    onUpdate({
      ...preferences,
      workLocation: {
        ...preferences.workLocation,
        [field]: value
      }
    });
  }

  function handleMaxCommuteTimeChange(value: number) {
    onUpdate({
      ...preferences,
      maxCommuteTime: value
    });
  }

  function handleTransportationMethodChange(method: string) {
    onUpdate({
      ...preferences,
      transportationMethod: method
    });
  }

  function handleWalkabilityChange(checked: boolean) {
    onUpdate({
      ...preferences,
      walkability: checked
    });
  }

  const transportationOptions = [
    'Car', 'Public Transit', 'Bike', 'Walk', 'Rideshare', 'Multiple Methods'
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Commute Preferences</h2>
          <span className="text-sm text-gray-500">Step 1 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '33%' }}></div>
        </div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
        {/* Work/School Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Work/School Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                value={preferences.workLocation.street}
                onChange={(e) => handleWorkLocationChange('street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                value={preferences.workLocation.city}
                onChange={(e) => handleWorkLocationChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="New York"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                value={preferences.workLocation.state}
                onChange={(e) => handleWorkLocationChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="NY"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={preferences.workLocation.zipCode}
                onChange={(e) => handleWorkLocationChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="10001"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={preferences.workLocation.country}
                onChange={(e) => handleWorkLocationChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        {/* Max Commute Time */}
        <div>
          <label htmlFor="maxCommuteTime" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Commute Time (minutes)
          </label>
          <input
            type="number"
            id="maxCommuteTime"
            min="5"
            max="120"
            step="5"
            value={preferences.maxCommuteTime}
            onChange={(e) => handleMaxCommuteTimeChange(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            placeholder="30"
          />
        </div>

        {/* Transportation Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Transportation Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {transportationOptions.map(method => (
              <label key={method} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="transportation"
                  value={method.toLowerCase().replace(/\s+/g, '_')}
                  checked={preferences.transportationMethod === method.toLowerCase().replace(/\s+/g, '_')}
                  onChange={() => handleTransportationMethodChange(method.toLowerCase().replace(/\s+/g, '_'))}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Walkability */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.walkability}
              onChange={(e) => handleWalkabilityChange(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              High walkability is important to me
            </span>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Next: Housing Preferences
        </button>
      </form>
    </div>
  );
}

export default CommutePreferences;
