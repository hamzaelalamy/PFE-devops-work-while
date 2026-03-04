import React from 'react';
import { User } from 'lucide-react';
import StarRating from './StarRating';

const ReviewCard = ({ review, companyData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full flex flex-col">
      <div className="flex items-start mb-4">
        <div className="mr-4 bg-gray-200 rounded-full p-2 flex-shrink-0">
          <User size={32} className="text-gray-500" />
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">Anonymous</h3>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-500">{review.position}</span>
          </div>
          <div className="flex mt-1">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>
      
      {companyData && (
        <div className="flex items-center mb-4">
          <div className={`h-6 mr-2 ${companyData.darkBackground ? 'bg-black rounded p-1' : ''}`}>
            <img 
              src={companyData.logo} 
              alt={`${companyData.name} logo`} 
              className="h-full object-contain" 
            />
          </div>
          <span className="font-medium text-[#3c78e6]">{review.company}</span>
        </div>
      )}
      
      <p className="text-gray-700 mb-4 flex-grow">{review.comment}</p>
      
      <div className="mt-4 text-sm">
        <div className="mb-2">
          <span className="font-medium text-green-600">Pros: </span>
          <span className="text-gray-600">{review.pros}</span>
        </div>
        <div>
          <span className="font-medium text-red-600">Cons: </span>
          <span className="text-gray-600">{review.cons}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">{review.date}</span>
        <div className="flex space-x-2">
          <button className="text-sm text-[#3c78e6] hover:underline">Helpful</button>
          <button className="text-sm text-[#3c78e6] hover:underline">Report</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;