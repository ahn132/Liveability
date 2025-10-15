import React from 'react';

interface AmenitiesPreferencesData {
  interests: string[];
  location: string;
  lifestyle: string[];
  goodSchoolDistrict: boolean;
  proximityToAmenities: string;
  topAmenities: string[];
}

interface AmenitiesPreferencesProps {
  preferences: AmenitiesPreferencesData;
  onUpdate: (preferences: AmenitiesPreferencesData) => void;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}

function AmenitiesPreferences({ preferences, onUpdate, onBack, onNext, loading }: AmenitiesPreferencesProps): React.JSX.Element {
  function handleInterestToggle(interest: string) {
    onUpdate({
      ...preferences,
      interests: preferences.interests.includes(interest)
        ? preferences.interests.filter(i => i !== interest)
        : [...preferences.interests, interest]
    });
  }

  function handleLifestyleToggle(lifestyle: string) {
    onUpdate({
      ...preferences,
      lifestyle: preferences.lifestyle.includes(lifestyle)
        ? preferences.lifestyle.filter(l => l !== lifestyle)
        : [...preferences.lifestyle, lifestyle]
    });
  }

  function handleTopAmenitySelect(amenity: string, rank: number) {
    const newTopAmenities = [...preferences.topAmenities];
    newTopAmenities[rank] = amenity;
    onUpdate({
      ...preferences,
      topAmenities: newTopAmenities
    });
  }

  const interestOptions = [
    'Restaurants', 'Shopping', 'Entertainment', 'Outdoor Activities',
    'Cultural Events', 'Nightlife', 'Sports', 'Art & Museums'
  ];

  const amenityOptions = [
    'Grocery Store', 'Gym/Fitness Center', 'Coffee Shop', 'Library',
    'Park', 'Pharmacy', 'Bank', 'Gas Station', 'Hospital/Medical',
    'Public Transportation', 'Shopping Mall', 'Restaurant'
  ];

  const lifestyleOptions = [
    'Family-friendly', 'Pet-friendly', 'Public Transportation',
    'Walkable', 'Bike-friendly', 'Car-dependent'
  ];

  const proximityOptions = [
    'Very Important', 'Important', 'Somewhat Important', 'Not Important'
  ];

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Amenities & Schools</h2>
          <span className="text-sm text-gray-500">Step 3 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are you interested in? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map(interest => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.interests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Top 3 Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rank your top 3 most important amenities (in order of priority)
          </label>
          <div className="space-y-3">
            {[0, 1, 2].map(rank => (
              <div key={rank} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {rank + 1}
                </div>
                <select
                  value={preferences.topAmenities[rank] || ''}
                  onChange={(e) => handleTopAmenitySelect(e.target.value, rank)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">Select amenity</option>
                  {amenityOptions.map(amenity => (
                    <option key={amenity} value={amenity}>
                      {amenity}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Location Type */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Location Type
          </label>
          <select
            id="location"
            value={preferences.location}
            onChange={(e) => onUpdate({ ...preferences, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select location type</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        {/* Lifestyle Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Lifestyle Preferences (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {lifestyleOptions.map(lifestyle => (
              <label key={lifestyle} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.lifestyle.includes(lifestyle)}
                  onChange={() => handleLifestyleToggle(lifestyle)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{lifestyle}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Good School District */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.goodSchoolDistrict}
              onChange={(e) => onUpdate({ ...preferences, goodSchoolDistrict: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Being in a good school district is important to me
            </span>
          </label>
        </div>

        {/* Proximity to Amenities */}
        <div>
          <label htmlFor="proximity" className="block text-sm font-medium text-gray-700 mb-1">
            How important is proximity to amenities?
          </label>
          <select
            id="proximity"
            value={preferences.proximityToAmenities}
            onChange={(e) => onUpdate({ ...preferences, proximityToAmenities: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select importance level</option>
            {proximityOptions.map(option => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button 
            type="button"
            onClick={onNext}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AmenitiesPreferences;
