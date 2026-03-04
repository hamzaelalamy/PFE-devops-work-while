// src/services/companyService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const companyService = {
    /**
     * Create a new company profile
     */
    createCompany: async (companyData) => {
        try {
            console.log('Creating company:', companyData);

            const response = await apiClient.post(API_ENDPOINTS.COMPANIES.CREATE, companyData);
            const { data } = response.data;

            return data.company;
        } catch (error) {
            console.error('Error creating company:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get my company profile
     */
    getMyCompany: async () => {
        try {
            console.log('Fetching my company');

            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.GET_MY_COMPANY);
            const { data } = response.data;

            return data.company;
        } catch (error) {
            console.error('Error fetching my company:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update company profile
     */
    updateCompany: async (companyData) => {
        try {
            console.log('Updating company:', companyData);

            const response = await apiClient.put(API_ENDPOINTS.COMPANIES.UPDATE_COMPANY, companyData);
            const { data } = response.data;

            return data.company;
        } catch (error) {
            console.error('Error updating company:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get all companies (public)
     */
    getAllCompanies: async (filters = {}) => {
        try {
            console.log('Fetching all companies with filters:', filters);

            const params = new URLSearchParams();

            if (filters.search) params.append('search', filters.search);
            if (filters.industry) params.append('industry', filters.industry);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const queryString = params.toString();
            const url = queryString ? `${API_ENDPOINTS.COMPANIES.GET_COMPANIES}?${queryString}` : API_ENDPOINTS.COMPANIES.GET_COMPANIES;

            const response = await apiClient.get(url);
            const { data } = response.data;

            return data.companies || [];
        } catch (error) {
            console.error('Error fetching companies:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get company by ID
     */
    getCompanyById: async (companyId) => {
        try {
            console.log('Fetching company by ID:', companyId);

            const response = await apiClient.get(API_ENDPOINTS.COMPANIES.GET_COMPANY(companyId));
            const { data } = response.data;

            return data.company;
        } catch (error) {
            console.error('Error fetching company by ID:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Search companies
     */
    searchCompanies: async (searchParams) => {
        try {
            console.log('Searching companies with params:', searchParams);

            const {
                query = '',
                industry = '',
                size = '',
                location = '',
                verified = null,
                page = 1,
                limit = 10
            } = searchParams;

            const params = new URLSearchParams();

            if (query.trim()) params.append('search', query.trim());
            if (industry) params.append('industry', industry);
            if (size) params.append('size', size);
            if (location.trim()) params.append('location', location.trim());
            if (verified !== null) params.append('verified', verified);
            params.append('page', page);
            params.append('limit', limit);

            const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES.GET_COMPANIES}?${params.toString()}`);
            const { data } = response.data;

            return {
                companies: data.companies || [],
                pagination: data.pagination || {}
            };
        } catch (error) {
            console.error('Error searching companies:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get company statistics
     */
    getCompanyStats: async (companyId = null) => {
        try {
            console.log('Fetching company statistics');

            // If no companyId provided, get stats for user's company
            const company = companyId ?
                await companyService.getCompanyById(companyId) :
                await companyService.getMyCompany();

            if (!company) {
                throw new Error('Company not found');
            }

            const stats = {
                totalJobs: company.jobs?.length || 0,
                activeJobs: 0, // Would need to fetch job details
                totalApplications: 0, // Would need to fetch application data
                companyViews: 0 // Would need view tracking
            };

            return stats;
        } catch (error) {
            console.error('Error fetching company stats:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get featured companies
     */
    getFeaturedCompanies: async (limit = 6) => {
        try {
            console.log('Fetching featured companies');

            const params = new URLSearchParams();
            params.append('limit', limit);
            params.append('verified', 'true'); // Only verified companies

            const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES.GET_COMPANIES}?${params.toString()}`);
            const { data } = response.data;

            return data.companies || [];
        } catch (error) {
            console.error('Error fetching featured companies:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get companies by industry
     */
    getCompaniesByIndustry: async (industry, limit = 10) => {
        try {
            console.log('Fetching companies by industry:', industry);

            const params = new URLSearchParams();
            params.append('industry', industry);
            params.append('limit', limit);

            const response = await apiClient.get(`${API_ENDPOINTS.COMPANIES.GET_COMPANIES}?${params.toString()}`);
            const { data } = response.data;

            return data.companies || [];
        } catch (error) {
            console.error('Error fetching companies by industry:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Validate company data
     */
    validateCompanyData: (companyData) => {
        const errors = [];

        if (!companyData.name?.trim()) {
            errors.push('Company name is required');
        }

        if (!companyData.industry) {
            errors.push('Industry is required');
        }

        if (!companyData.size) {
            errors.push('Company size is required');
        }

        if (!companyData.location?.trim()) {
            errors.push('Location is required');
        }

        if (companyData.website && !/^https?:\/\/.+/.test(companyData.website)) {
            errors.push('Please provide a valid website URL');
        }

        if (companyData.description && companyData.description.length > 2000) {
            errors.push('Description cannot exceed 2000 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Get industry options
     */
    getIndustryOptions: () => {
        return [
            { value: 'technology', label: 'Technology' },
            { value: 'finance', label: 'Finance' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'education', label: 'Education' },
            { value: 'retail', label: 'Retail' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'other', label: 'Other' }
        ];
    },

    /**
     * Get company size options
     */
    getCompanySizeOptions: () => {
        return [
            { value: '1-10', label: '1-10 employees' },
            { value: '11-50', label: '11-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '201-500', label: '201-500 employees' },
            { value: '501-1000', label: '501-1000 employees' },
            { value: '1000+', label: '1000+ employees' }
        ];
    }
};

export default companyService;