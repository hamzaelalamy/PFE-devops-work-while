import React from 'react';

const IndustryCategories = () => {
    const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design', 'Engineering', 'Customer Service'];

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Browse Reviews by Industry</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((category, index) => (
                    <div key={index} className="bg-white rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                        <span className="text-gray-700 font-medium">{category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndustryCategories;