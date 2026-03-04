// src/components/profile-setup/SkillsSelector.js
import React, { useState } from 'react';

const SkillsSelector = ({ availableSkills, selectedSkills, onChange, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedSkills, setLocalSelectedSkills] = useState(selectedSkills || []);
  
  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSkill = (skill) => {
    let updatedSkills;
    if (localSelectedSkills.includes(skill)) {
      updatedSkills = localSelectedSkills.filter(s => s !== skill);
    } else {
      updatedSkills = [...localSelectedSkills, skill];
    }
    setLocalSelectedSkills(updatedSkills);
  };

  const handleContinue = () => {
    onChange(localSelectedSkills);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">What skills do you have?</h2>
        <p className="text-gray-600">
          Select all the skills and technologies you're proficient in. Choose at least 3.
        </p>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <label htmlFor="skill-search" className="sr-only">Search skills</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="skill-search"
            name="search"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search for skills..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Selected skills */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected skills ({localSelectedSkills.length})</h3>
        <div className="flex flex-wrap gap-2">
          {localSelectedSkills.length === 0 ? (
            <p className="text-sm text-gray-500">No skills selected yet</p>
          ) : (
            localSelectedSkills.map((skill) => (
              <span 
                key={skill} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
                <button 
                  type="button" 
                  className="ml-1 h-4 w-4 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                  onClick={() => handleToggleSkill(skill)}
                >
                  <span className="sr-only">Remove {skill}</span>
                  <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Available skills */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Available skills</h3>
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
          <div className="flex flex-wrap gap-2">
            {filteredSkills.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No skills found matching your search</p>
            ) : (
              filteredSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    localSelectedSkills.includes(skill)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                  {localSelectedSkills.includes(skill) && (
                    <svg className="ml-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
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
          onClick={handleContinue}
          disabled={localSelectedSkills.length < 3}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            localSelectedSkills.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Continue
          <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SkillsSelector;