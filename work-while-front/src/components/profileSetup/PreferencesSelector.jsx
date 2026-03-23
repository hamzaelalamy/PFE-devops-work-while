
// src/components/profile-setup/PreferencesSelector.js
import { useState } from 'react';

const workTypeOptions = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'internship', label: 'Internship' },
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'on-site', label: 'On-site' }
];

const popularLocations = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 
  'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
  'Safi', 'El Jadida', 'Mohammedia', 'Essaouira', 'Salé'
];

const PreferencesSelector = ({ preferences, onChange, onBack, onComplete }) => {
  const [localPreferences, setLocalPreferences] = useState({
    workType: preferences.workType || [],
    salaryRange: preferences.salaryRange || { min: 5000, max: 15000 },
    locations: preferences.locations || []
  });
  const [locationInput, setLocationInput] = useState('');

  const handleWorkTypeToggle = (typeId) => {
    const updatedWorkTypes = localPreferences.workType.includes(typeId)
      ? localPreferences.workType.filter(type => type !== typeId)
      : [...localPreferences.workType, typeId];
    
    updatePreferences('workType', updatedWorkTypes);
  };

  const handleSalaryChange = (type, value) => {
    const numValue = parseInt(value, 10);
    const updatedRange = { ...localPreferences.salaryRange };
    
    if (type === 'min') {
      updatedRange.min = numValue;
      // Ensure min doesn't exceed max
      if (numValue > updatedRange.max) {
        updatedRange.max = numValue;
      }
    } else {
      updatedRange.max = numValue;
      // Ensure max isn't below min
      if (numValue < updatedRange.min) {
        updatedRange.min = numValue;
      }
    }
    
    updatePreferences('salaryRange', updatedRange);
  };

  const addLocation = () => {
    if (locationInput.trim() && !localPreferences.locations.includes(locationInput.trim())) {
      updatePreferences('locations', [...localPreferences.locations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const removeLocation = (location) => {
    updatePreferences('locations', localPreferences.locations.filter(loc => loc !== location));
  };

  const addPopularLocation = (location) => {
    if (!localPreferences.locations.includes(location)) {
      updatePreferences('locations', [...localPreferences.locations, location]);
    }
  };

  const updatePreferences = (key, value) => {
    const updated = {
      ...localPreferences,
      [key]: value
    };
    setLocalPreferences(updated);
    onChange(updated);
  };

  const handleSubmit = () => {
    onComplete();
  };

  const isFormValid = () => {
    return localPreferences.workType.length > 0 && localPreferences.locations.length > 0;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What are your job preferences?</h2>
        <p className="text-gray-600">
          Tell us what you're looking for in your next role.
        </p>
      </div>

      {/* Work Type Preferences */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-2">Work Type</h3>
        <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
        <div className="flex flex-wrap gap-3">
          {workTypeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleWorkTypeToggle(option.id)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                localPreferences.workType.includes(option.id)
                  ? 'bg-blue-100 text-blue-800 border border-blue-400'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {option.label}
              {localPreferences.workType.includes(option.id) && (
                <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-2">Salary Range (monthly in $)</h3>
        <div className="flex items-center space-x-4">
          <div className="w-1/2">
            <label htmlFor="min-salary" className="block text-sm text-gray-500 mb-1">Minimum</label>
            <input
              type="number"
              id="min-salary"
              min="0"
              step="500"
              value={localPreferences.salaryRange.min}
              onChange={(e) => handleSalaryChange('min', e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="max-salary" className="block text-sm text-gray-500 mb-1">Maximum</label>
            <input
              type="number"
              id="max-salary"
              min={localPreferences.salaryRange.min}
              step="500"
              value={localPreferences.salaryRange.max}
              onChange={(e) => handleSalaryChange('max', e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Location Preferences */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-2">Preferred Locations</h3>
        <div className="flex items-center mb-3">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Add a city or location"
            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addLocation()}
          />
          <button
            type="button"
            onClick={addLocation}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>

        {/* Selected Locations */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {localPreferences.locations.length === 0 ? (
              <p className="text-sm text-gray-500">No locations selected yet</p>
            ) : (
              localPreferences.locations.map((location) => (
                <span 
                  key={location} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {location}
                  <button 
                    type="button" 
                    className="ml-1 h-4 w-4 rounded-full flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-600 focus:outline-none"
                    onClick={() => removeLocation(location)}
                  >
                    <span className="sr-only">Remove {location}</span>
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Popular Locations */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Popular locations</h4>
          <div className="flex flex-wrap gap-2">
            {popularLocations.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => addPopularLocation(location)}
                disabled={localPreferences.locations.includes(location)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  localPreferences.locations.includes(location)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Complete Profile
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PreferencesSelector;