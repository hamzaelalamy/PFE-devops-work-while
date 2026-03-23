
// CompanyCard.jsx

const CompanyCard = ({ company }) => {
  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition cursor-pointer flex flex-col"
    >
      <div className={`h-16 flex items-center justify-center mb-4 ${company.darkBackground ? 'bg-black rounded-lg p-2' : ''}`}>
        <img 
          src={company.logo} 
          alt={`${company.name} logo`} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-[#3c78e6] mb-2">{company.name}</h3>
      <div className="flex items-center mb-3">
        <div className="flex mr-2">
          <StarRating rating={company.rating} />
        </div>
        <span className="text-gray-700 font-medium">{company.rating}</span>
      </div>
      <p className="text-gray-500">{company.reviewCount} reviews</p>
      <button className="mt-4 text-[#3c78e6] font-medium hover:underline">
        View Reviews
      </button>
    </div>
  );
};

export default CompanyCard;