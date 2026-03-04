// src/components/profile-setup/ExperienceSelector.js
import React from 'react';

// TODO: Replace with API call to fetch experience levels from backend
// Example implementation:
// const [experienceLevels, setExperienceLevels] = useState([]);
// useEffect(() => {
//   const fetchExperienceLevels = async () => {
//     try {
//       const response = await fetch('/api/experience-levels');
//       const data = await response.json();
//       setExperienceLevels(data);
//     } catch (error) {
//       console.error('Error fetching experience levels:', error);
//     }
//   };
//   fetchExperienceLevels();
// }, []);
const experienceLevels = [
  { id: 'entry', label: '0-2 years', description: 'Entry level positions and junior roles' },
  { id: 'mid', label: '2-4 years', description: 'Mid-level positions with some experience' },
  { id: 'senior', label: '4-8 years', description: 'Senior roles with substantial experience' },
  { id: 'expert', label: '8+ years', description: 'Expert level and leadership positions' }
];

const ExperienceSelector = ({ onSelect, selectedLevel }) => {
  // TODO: Add error handling for API calls
  // TODO: Add loading state while fetching data
  // Example:
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What's your experience level?</h2>
        <p className="text-gray-600">
          This helps us find opportunities that match your skills and career stage.
        </p>
      </div>

      {/* TODO: Add loading spinner when fetching data */}
      {/* TODO: Add error message display when API calls fail */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {experienceLevels.map((level) => (
          <div
            key={level.id}
            className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedLevel === level.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-200'
            }`}
            onClick={() => onSelect(level.id)}
          >
            <h3 className="font-medium text-lg text-gray-900">{level.label}</h3>
            <p className="mt-1 text-gray-600">{level.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>You can always update this information later in your profile settings.</p>
      </div>
    </div>
  );
};

export default ExperienceSelector;