import { useState, useEffect } from 'react';
import { Building2, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageCompaniesPage = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/companies`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both array (direct) and object (paginated/wrapped) responses
            const companiesData = response.data.data;
            setCompanies(Array.isArray(companiesData) ? companiesData : (companiesData.companies || []));
        } catch (error) {
            console.error('Error fetching companies:', error);
            alert('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompany = async (companyId) => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/companies/${companyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCompanies();
            alert('Company deleted successfully');
        } catch (error) {
            console.error('Error deleting company:', error);
            alert('Failed to delete company');
        }
    };

    const filteredCompanies = companies.filter(company => {
        const matchesSearch =
            company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.location?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    Manage Companies
                </h1>
                <div className="text-sm text-gray-600">
                    Total Companies: {companies.length}
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading companies...</div>
                ) : filteredCompanies.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No companies found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left font-semibold">Company</th>
                                <th className="p-4 text-left font-semibold">Industry</th>
                                <th className="p-4 text-left font-semibold">Location</th>
                                <th className="p-4 text-left font-semibold">Size</th>
                                <th className="p-4 text-left font-semibold">Active Jobs</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCompanies.map((company) => (
                                <tr key={company._id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {company.logo ? (
                                                <img
                                                    src={company.logo}
                                                    alt={company.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="font-medium">{company.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{company.industry || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{company.location || 'N/A'}</td>
                                    <td className="p-4 text-gray-600">{company.size || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                                            {company.jobCount || 0}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/companies/${company._id}`)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View Company"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete Company"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageCompaniesPage;
