import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreferencesData {
  interests: string[];
  budget: string;
  location: string;
  lifestyle: string[];
}

function Preferences(): React.JSX.Element {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<PreferencesData>({
    interests: [],
    budget: '',
    location: '',
    lifestyle: []
  });
  const [loading, setLoading] = useState<boolean>(false);

  const interestOptions = [
    'Restaurants', 'Shopping', 'Entertainment', 'Outdoor Activities',
    'Cultural Events', 'Nightlife', 'Sports', 'Art & Museums'
  ];

  const lifestyleOptions = [
    'Family-friendly', 'Pet-friendly', 'Public Transportation',
    'Walkable', 'Bike-friendly', 'Car-dependent'
  ];

  function handleInterestToggle(interest: string) {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  }

  function handleLifestyleToggle(lifestyle: string) {
    setPreferences(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(lifestyle)
        ? prev.lifestyle.filter(l => l !== lifestyle)
        : [...prev.lifestyle, lifestyle]
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: Save preferences to backend
    console.log('Preferences:', preferences);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Preferences saved successfully!');
      navigate('/dashboard');
    }, 1000);
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Tell us about your preferences
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <select
            id="budget"
            value={preferences.budget}
            onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select budget range</option>
            <option value="low">$0 - $50k</option>
            <option value="medium">$50k - $100k</option>
            <option value="high">$100k+</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Location Type
          </label>
          <select
            id="location"
            value={preferences.location}
            onChange={(e) => setPreferences(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select location type</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        {/* Lifestyle */}
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

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {loading ? 'Saving Preferences...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}

export default Preferences;
