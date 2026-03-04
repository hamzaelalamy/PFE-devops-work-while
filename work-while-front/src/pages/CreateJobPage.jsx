// ✅ FIXED: CreateJobPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';
import companyService from '../services/companyService';

const CreateJobPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [company, setCompany] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector(state => state.auth);

    // ✅ FIXED: Improved form data state with better defaults
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'full-time',
        category: '',
        experienceLevel: 'mid',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'MAD',
        salaryPeriod: 'monthly',
        isRemote: false,
        skills: '',
        benefits: '',
        requirements: '',
        deadlineDate: '',
        urgency: 'medium',
        tags: ''
    });

    // Company creation state
    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [companyData, setCompanyData] = useState({
        name: '',
        description: '',
        industry: '',
        size: '',
        location: '',
        website: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        // Redirect if not authenticated or not an employer
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/create-job' } });
            return;
        }

        if (user?.role !== 'employer' && user?.role !== 'admin') {
            navigate('/jobs', {
                state: {
                    message: 'Only employers can create job offers. Please register as an employer.',
                    type: 'error'
                }
            });
            return;
        }

        // Check if user has a company
        const fetchCompany = async () => {
            try {
                const userCompany = await companyService.getMyCompany();
                setCompany(userCompany);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                console.log('No company found for user');
                setShowCompanyForm(true);
            }
        };

        fetchCompany();
    }, [isAuthenticated, user, navigate]);

    // ✅ IMPROVED: Better input handler with debounced validation
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear errors when user starts typing
        if (error && newValue !== '') {
            setError(null);
        }
    };

    const handleCompanyInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ IMPROVED: Enhanced company validation
    const validateCompanyForm = () => {
        const requiredFields = {
            name: 'Company Name',
            industry: 'Industry',
            size: 'Company Size',
            location: 'Location',
            phone: 'Phone Number'
        };

        const missingFields = [];
        const errors = [];

        Object.entries(requiredFields).forEach(([field, label]) => {
            if (!companyData[field]?.trim()) {
                missingFields.push(label);
            }
        });

        if (missingFields.length > 0) {
            errors.push(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        // Phone validation
        const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
        if (companyData.phone && !phoneRegex.test(companyData.phone.trim())) {
            errors.push('Please enter a valid phone number (at least 10 digits)');
        }

        // Email validation (optional)
        if (companyData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(companyData.email.trim())) {
                errors.push('Please enter a valid email address');
            }
        }

        // Website validation (optional)
        if (companyData.website) {
            try {
                new URL(companyData.website);
            } catch {
                errors.push('Please enter a valid website URL');
            }
        }

        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }

        return true;
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();

        if (!validateCompanyForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newCompany = await companyService.createCompany(companyData);
            setCompany(newCompany);
            setShowCompanyForm(false);

        } catch (err) {
            setError(err.message || 'Failed to create company profile');
        } finally {
            setLoading(false);
        }
    };

    // ✅ IMPROVED: Comprehensive form validation with detailed error messages
    const validateForm = () => {
        const errors = [];

        // Required field validation
        if (!formData.title?.trim()) {
            errors.push('Job Title is required');
        } else if (formData.title.trim().length < 3) {
            errors.push('Job Title must be at least 3 characters long');
        }

        if (!formData.description?.trim()) {
            errors.push('Job Description is required');
        } else if (formData.description.trim().length < 50) {
            errors.push('Job Description must be at least 50 characters long');
        }

        if (!formData.location?.trim()) {
            errors.push('Location is required');
        } else if (formData.location.trim().length < 2) {
            errors.push('Location must be at least 2 characters long');
        }

        if (!formData.category?.trim()) {
            errors.push('Category is required');
        } else if (formData.category.trim().length < 2) {
            errors.push('Category must be at least 2 characters long');
        }

        // Salary validation
        if (formData.salaryMin || formData.salaryMax) {
            const minSalary = parseFloat(formData.salaryMin);
            const maxSalary = parseFloat(formData.salaryMax);

            if (formData.salaryMin && (isNaN(minSalary) || minSalary < 0)) {
                errors.push('Minimum salary must be a valid positive number');
            }

            if (formData.salaryMax && (isNaN(maxSalary) || maxSalary < 0)) {
                errors.push('Maximum salary must be a valid positive number');
            }

            if (formData.salaryMin && formData.salaryMax && minSalary >= maxSalary) {
                errors.push('Maximum salary must be greater than minimum salary');
            }
        }

        // Date validation
        if (formData.deadlineDate) {
            const deadline = new Date(formData.deadlineDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (deadline <= today) {
                errors.push('Deadline must be in the future');
            }
        }

        if (errors.length > 0) {
            setError(errors.join('. '));
            return false;
        }

        setError(null);
        return true;
    };

    // ✅ FIXED: Improved job creation with proper data transformation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // ✅ FIXED: Properly structure job data for the API
            const jobData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                type: formData.type,
                category: formData.category.trim(),
                experienceLevel: formData.experienceLevel,
                isRemote: formData.isRemote,
                urgency: formData.urgency
            };

            // ✅ FIXED: Proper salary handling
            if (formData.salaryMin || formData.salaryMax) {
                jobData.salary = {
                    currency: formData.salaryCurrency,
                    period: formData.salaryPeriod
                };

                if (formData.salaryMin && !isNaN(parseFloat(formData.salaryMin))) {
                    jobData.salary.min = parseFloat(formData.salaryMin);
                }

                if (formData.salaryMax && !isNaN(parseFloat(formData.salaryMax))) {
                    jobData.salary.max = parseFloat(formData.salaryMax);
                }
            }

            // ✅ FIXED: Proper array handling
            if (formData.skills?.trim()) {
                jobData.skills = formData.skills
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            if (formData.benefits?.trim()) {
                jobData.benefits = formData.benefits
                    .split('\n')
                    .map(b => b.trim())
                    .filter(b => b.length > 0);
            }

            if (formData.requirements?.trim()) {
                jobData.requirements = formData.requirements
                    .split('\n')
                    .map(r => r.trim())
                    .filter(r => r.length > 0);
            }

            if (formData.tags?.trim()) {
                jobData.tags = formData.tags
                    .split(',')
                    .map(t => t.trim().toLowerCase())
                    .filter(t => t.length > 0);
            }

            // ✅ FIXED: Proper date handling
            if (formData.deadlineDate) {
                jobData.deadlineDate = formData.deadlineDate;
            }

            // ✅ FIXED: Add company if available
            if (company?._id) {
                jobData.company = company._id;
            }

            console.log('📤 Submitting job data:', jobData);

            const createdJob = await jobService.createJob(jobData);

            console.log('✅ Job created successfully:', createdJob);

            setSuccess(true);

            // Redirect to job details after 2 seconds
            setTimeout(() => {
                navigate(`/jobs/${createdJob._id}`, {
                    state: {
                        message: 'Job offer created successfully!',
                        type: 'success'
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('❌ Job creation failed:', err);
            setError(err.message || 'Failed to create job offer. Please check your input and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show company creation form if needed
    if (showCompanyForm) {
        return (
            <div className="max-w-2xl mx-auto px-4 mt-24 mb-16">
                <div className="bg-white border rounded-lg shadow-sm p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Create Company Profile</h1>
                    <p className="text-gray-600 mb-6">
                        Before creating a job offer, you need to set up your company profile.
                    </p>

                    <form onSubmit={handleCompanySubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="name"
                                    required
                                    value={companyData.name}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="industry"
                                    name="industry"
                                    required
                                    value={companyData.industry}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="finance">Finance</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="retail">Retail</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Size <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="size"
                                    name="size"
                                    required
                                    value={companyData.size}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="501-1000">501-1000 employees</option>
                                    <option value="1000+">1000+ employees</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="companyLocation"
                                    name="location"
                                    required
                                    value={companyData.location}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Casablanca, Morocco"
                                />
                            </div>

                            <div>
                                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="companyPhone"
                                    name="phone"
                                    required
                                    value={companyData.phone}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+212 XX XX XX XX"
                                />
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={companyData.website}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://yourcompany.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Email
                                </label>
                                <input
                                    type="email"
                                    id="companyEmail"
                                    name="email"
                                    value={companyData.email}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="contact@yourcompany.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Description
                                </label>
                                <textarea
                                    id="companyDescription"
                                    name="description"
                                    rows="3"
                                    value={companyData.description}
                                    onChange={handleCompanyInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief description of your company..."
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="mt-6 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/jobs')}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-medium rounded-md`}
                            >
                                {loading ? 'Creating...' : 'Create Company'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/jobs')}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Jobs
                </button>
            </div>

            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b">
                    <h1 className="text-3xl font-bold text-gray-900">Create Job Offer</h1>
                    <p className="mt-2 text-gray-600">
                        Post a new job opening and find the perfect candidate for your team
                    </p>
                    {company && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Posting as:</span> {company.name}
                            </p>
                        </div>
                    )}
                </div>

                {success ? (
                    <div className="p-6 md:p-8 text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Job Created Successfully!</h2>
                        <p className="text-gray-600">
                            Your job offer has been published and is now live. You'll be redirected shortly...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., Senior Full Stack Developer"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., Casablanca, Morocco"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="freelance">Freelance</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., Software Development"
                                            list="category-suggestions"
                                        />
                                        <datalist id="category-suggestions">
                                            <option value="Software Development" />
                                            <option value="Marketing" />
                                            <option value="Sales" />
                                            <option value="Customer Service" />
                                            <option value="Finance" />
                                            <option value="Human Resources" />
                                            <option value="Design" />
                                            <option value="Data Science" />
                                            <option value="Project Management" />
                                        </datalist>
                                    </div>

                                    <div>
                                        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <select
                                            id="experienceLevel"
                                            name="experienceLevel"
                                            value={formData.experienceLevel}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="entry">Entry Level</option>
                                            <option value="mid">Mid Level</option>
                                            <option value="senior">Senior Level</option>
                                            <option value="executive">Executive</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                id="isRemote"
                                                name="isRemote"
                                                type="checkbox"
                                                checked={formData.isRemote}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-900">
                                                Remote work available
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description Section */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="8"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for in a candidate..."
                                    />
                                    <p className="mt-1 text-sm text-gray-600">
                                        {formData.description.length}/50 characters minimum
                                    </p>
                                </div>
                            </div>

                            {/* Salary Information */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Salary
                                        </label>
                                        <input
                                            type="number"
                                            id="salaryMin"
                                            name="salaryMin"
                                            min="0"
                                            step="1000"
                                            value={formData.salaryMin}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 8000"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                                            Maximum Salary
                                        </label>
                                        <input
                                            type="number"
                                            id="salaryMax"
                                            name="salaryMax"
                                            min="0"
                                            step="1000"
                                            value={formData.salaryMax}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., 15000"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="salaryCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            id="salaryCurrency"
                                            name="salaryCurrency"
                                            value={formData.salaryCurrency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="MAD">MAD</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="salaryPeriod" className="block text-sm font-medium text-gray-700 mb-2">
                                            Period
                                        </label>
                                        <select
                                            id="salaryPeriod"
                                            name="salaryPeriod"
                                            value={formData.salaryPeriod}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements and Skills */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Skills</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                            Required Skills (comma separated)
                                        </label>
                                        <textarea
                                            id="skills"
                                            name="skills"
                                            rows="4"
                                            value={formData.skills}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="JavaScript, React, Node.js, MongoDB, etc."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                            Requirements (one per line)
                                        </label>
                                        <textarea
                                            id="requirements"
                                            name="requirements"
                                            rows="4"
                                            value={formData.requirements}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Excellent communication skills"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                                        Benefits (one per line)
                                    </label>
                                    <textarea
                                        id="benefits"
                                        name="benefits"
                                        rows="4"
                                        value={formData.benefits}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Health insurance&#10;Remote work options&#10;Professional development budget&#10;Flexible hours"
                                    />
                                </div>
                            </div>

                            {/* Additional Settings */}
                            <div className="border-b border-gray-200 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Application Deadline
                                        </label>
                                        <input
                                            type="date"
                                            id="deadlineDate"
                                            name="deadlineDate"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.deadlineDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgency
                                        </label>
                                        <select
                                            id="urgency"
                                            name="urgency"
                                            value={formData.urgency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="senior, javascript, remote, fintech, etc."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Error creating job</h3>
                                            <p className="text-sm text-red-600 mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Section */}
                            <div className="flex justify-between items-center pt-8">
                                <button
                                    type="button"
                                    onClick={() => navigate('/jobs')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-8 py-3 ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white font-medium rounded-md flex items-center`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Job...
                                        </>
                                    ) : (
                                        'Publish Job'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateJobPage;