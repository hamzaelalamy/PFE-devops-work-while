
import CompanyCard from './CompanyCard';

const CompanyList = ({ companies }) => {
    return (
        <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Top Reviewed Companies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {companies.map(company => (
                    <CompanyCard key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
};

export default CompanyList;