import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Globe, Mail, Phone, ArrowLeft, Briefcase } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CompanyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/companies/${id}`);
                setCompany(response.data.data);
            } catch (err) {
                console.error('Error fetching company details:', err);
                setError('Failed to load company details. The company might not exist.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompanyDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="min-h-screen pt-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Company not found'}</h2>
                    <button
                        onClick={() => navigate('/companies')}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Companies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header/Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="w-24 h-24 bg-white rounded-lg shadow-md p-1">
                                    {company.logo ? (
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                                            <Building2 className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 mb-1">
                                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                                    <p className="text-gray-500">{company.industry}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <div className="md:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {company.description || 'No description available.'}
                                    </p>
                                </section>

                                {/* We could add a list of active jobs here if available in the API response or via a separate call */}
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Company Details</h3>

                                    <div className="space-y-3 text-sm">
                                        {company.size && (
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block font-medium text-gray-900">Size</span>
                                                    {company.size} employees
                                                </div>
                                            </div>
                                        )}

                                        {company.location && (
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block font-medium text-gray-900">Location</span>
                                                    {company.location}
                                                </div>
                                            </div>
                                        )}

                                        {company.website && (
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block font-medium text-gray-900">Website</span>
                                                    <a
                                                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Visit Website
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {company.email && (
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block font-medium text-gray-900">Contact Email</span>
                                                    <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                                                        {company.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {company.phone && (
                                            <div className="flex items-start gap-3 text-gray-600">
                                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <span className="block font-medium text-gray-900">Phone</span>
                                                    <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                                                        {company.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsPage;
