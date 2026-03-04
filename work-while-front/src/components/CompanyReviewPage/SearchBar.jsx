import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a company..."
                    className="w-full px-6 py-4 pr-12 text-lg rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: '#3c78e6' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <button className="text-white p-2 rounded-full transition" style={{ backgroundColor: '#3c78e6' }}>
                        <Search size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;