// src/services/jobService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';
import applicationService from './applicationService';

const jobService = {
  /**
   * Get all jobs with filters and pagination
   */
  getAllJobs: async (filters = {}) => {
    try {
      console.log('Fetching jobs with filters:', filters);

      // Build query parameters
      const params = new URLSearchParams();

      // Add filters if they exist
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.jobType) params.append('type', filters.jobType);
      if (filters.category) params.append('category', filters.category);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      if (filters.isRemote) params.append('isRemote', filters.isRemote);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.JOBS.GET_JOBS}?${queryString}` : API_ENDPOINTS.JOBS.GET_JOBS;

      const response = await apiClient.get(url);
      const { data } = response.data;

      return data.jobs || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get job by ID
   */
  getJobById: async (jobId) => {
    try {
      console.log('Fetching job by ID:', jobId);

      const response = await apiClient.get(API_ENDPOINTS.JOBS.GET_JOB(jobId));
      const { data } = response.data;

      return data.job;
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Create a new job (for employers) - FIXED VERSION
   */
  createJob: async (jobData) => {
    try {
      console.log('Creating job - Raw input:', jobData);

      // ✅ FIXED: Better data validation and transformation
      const transformedJobData = {
        title: String(jobData.title || '').trim(),
        description: String(jobData.description || '').trim(),
        location: String(jobData.location || '').trim(),
        type: jobData.type || 'full-time',
        category: String(jobData.category || '').trim(),
        experienceLevel: jobData.experienceLevel || 'mid',
        isRemote: Boolean(jobData.isRemote),
        urgency: jobData.urgency || 'medium'
      };

      // ✅ FIXED: Proper salary handling with validation
      if (jobData.salary) {
        // Backend expects salary object
        transformedJobData.salary = {
          currency: jobData.salary.currency || 'USD',
          period: jobData.salary.period || 'yearly'
        };

        // Only add min/max if they are valid numbers
        if (jobData.salary.min && !isNaN(jobData.salary.min) && jobData.salary.min > 0) {
          transformedJobData.salary.min = Number(jobData.salary.min);
        }
        if (jobData.salary.max && !isNaN(jobData.salary.max) && jobData.salary.max > 0) {
          transformedJobData.salary.max = Number(jobData.salary.max);
        }

        // Validate salary range
        if (transformedJobData.salary.min && transformedJobData.salary.max) {
          if (transformedJobData.salary.min >= transformedJobData.salary.max) {
            throw new Error('Maximum salary must be greater than minimum salary');
          }
        }
      }

      // ✅ FIXED: Proper array handling with validation
      if (jobData.skills) {
        if (Array.isArray(jobData.skills)) {
          transformedJobData.skills = jobData.skills
            .map(skill => String(skill).trim())
            .filter(skill => skill.length > 0)
            .slice(0, 20); // Limit to 20 skills
        } else if (typeof jobData.skills === 'string') {
          transformedJobData.skills = jobData.skills
            .split(',')
            .map(skill => String(skill).trim())
            .filter(skill => skill.length > 0)
            .slice(0, 20);
        }
      }

      if (jobData.benefits) {
        if (Array.isArray(jobData.benefits)) {
          transformedJobData.benefits = jobData.benefits
            .map(benefit => String(benefit).trim())
            .filter(benefit => benefit.length > 0)
            .slice(0, 10); // Limit to 10 benefits
        } else if (typeof jobData.benefits === 'string') {
          transformedJobData.benefits = jobData.benefits
            .split('\n')
            .map(benefit => String(benefit).trim())
            .filter(benefit => benefit.length > 0)
            .slice(0, 10);
        }
      }

      if (jobData.requirements) {
        if (Array.isArray(jobData.requirements)) {
          transformedJobData.requirements = jobData.requirements
            .map(req => String(req).trim())
            .filter(req => req.length > 0)
            .slice(0, 15); // Limit to 15 requirements
        } else if (typeof jobData.requirements === 'string') {
          transformedJobData.requirements = jobData.requirements
            .split('\n')
            .map(req => String(req).trim())
            .filter(req => req.length > 0)
            .slice(0, 15);
        }
      }

      if (jobData.tags) {
        if (Array.isArray(jobData.tags)) {
          transformedJobData.tags = jobData.tags
            .map(tag => String(tag).trim().toLowerCase())
            .filter(tag => tag.length > 0)
            .slice(0, 10); // Limit to 10 tags
        } else if (typeof jobData.tags === 'string') {
          transformedJobData.tags = jobData.tags
            .split(',')
            .map(tag => String(tag).trim().toLowerCase())
            .filter(tag => tag.length > 0)
            .slice(0, 10);
        }
      }

      // ✅ FIXED: Proper date handling
      if (jobData.deadlineDate) {
        const deadline = new Date(jobData.deadlineDate);
        if (!isNaN(deadline.getTime()) && deadline > new Date()) {
          transformedJobData.deadlineDate = deadline.toISOString();
        }
      }

      // ✅ FIXED: Company ID validation
      if (jobData.company) {
        // Validate ObjectId format (24 hex characters)
        if (typeof jobData.company === 'string' && /^[0-9a-fA-F]{24}$/.test(jobData.company)) {
          transformedJobData.company = jobData.company;
        }
      }

      // ✅ FIXED: Client-side validation before sending
      const validationErrors = [];

      if (!transformedJobData.title || transformedJobData.title.length < 3) {
        validationErrors.push('Job title must be at least 3 characters long');
      }

      if (!transformedJobData.description || transformedJobData.description.length < 50) {
        validationErrors.push('Job description must be at least 50 characters long');
      }

      if (!transformedJobData.location || transformedJobData.location.length < 2) {
        validationErrors.push('Location must be at least 2 characters long');
      }

      if (!transformedJobData.category || transformedJobData.category.length < 2) {
        validationErrors.push('Category must be at least 2 characters long');
      }

      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      console.log('Creating job - Transformed data:', transformedJobData);

      const response = await apiClient.post(API_ENDPOINTS.JOBS.CREATE_JOB, transformedJobData);
      const { data } = response.data;

      console.log('Job created successfully:', data.job);
      return data.job;
    } catch (error) {
      console.error('Error creating job:', error);

      // ✅ FIXED: Better error handling
      if (error.response) {
        console.error('Server response:', error.response.data);

        // Handle validation errors specifically
        if (error.response.status === 400) {
          const serverMessage = error.response.data?.message || 'Validation failed';
          throw new Error(`Validation Error: ${serverMessage}`);
        }

        // Handle server errors
        if (error.response.status === 500) {
          const serverMessage = error.response.data?.message || 'Server error occurred';
          throw new Error(`Server Error: ${serverMessage}`);
        }
      }

      // Handle network or other errors
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Update job (for employers)
   */
  updateJob: async (jobId, jobData) => {
    try {
      console.log('Updating job:', jobId, jobData);

      const response = await apiClient.put(API_ENDPOINTS.JOBS.UPDATE_JOB(jobId), jobData);
      const { data } = response.data;

      return data.job;
    } catch (error) {
      console.error('Error updating job:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Delete job (for employers)
   */
  deleteJob: async (jobId) => {
    try {
      console.log('Deleting job:', jobId);

      await apiClient.delete(API_ENDPOINTS.JOBS.DELETE_JOB(jobId));
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get my jobs (for employers)
   */
  getMyJobs: async (page = 1, limit = 10) => {
    try {
      console.log('Fetching my jobs');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      const response = await apiClient.get(`${API_ENDPOINTS.JOBS.GET_MY_JOBS}?${params.toString()}`);
      const { data } = response.data;

      return data.jobs || [];
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Save a job (for candidates)
   */
  saveJob: async (jobId) => {
    try {
      console.log('Saving job:', jobId);

      const response = await apiClient.post(API_ENDPOINTS.USERS.SAVE_JOB(jobId));
      const { data } = response.data;

      return data;
    } catch (error) {
      console.error('Error saving job:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Remove saved job (for candidates)
   */
  removeSavedJob: async (jobId) => {
    try {
      console.log('Removing saved job:', jobId);

      await apiClient.delete(API_ENDPOINTS.USERS.UNSAVE_JOB(jobId));
      return true;
    } catch (error) {
      console.error('Error removing saved job:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get saved jobs (for candidates)
   */
  getSavedJobs: async (page = 1, limit = 10) => {
    try {
      console.log('Fetching saved jobs');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);

      const response = await apiClient.get(`${API_ENDPOINTS.USERS.SAVED_JOBS}?${params.toString()}`);
      const { data } = response.data;

      return data.savedJobs || [];
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Semantic Search
   */
  semanticSearch: async (query) => {
    try {
      console.log('Performing semantic search for query:', query);
      const response = await apiClient.get(`${API_ENDPOINTS.JOBS.SEMANTIC_SEARCH}?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error during semantic search:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get user applications (wrapper for applicationService)
   */
  getUserApplications: async (page = 1, limit = 10, status = null) => {
    try {
      return await applicationService.getMyApplications(page, limit, status);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  },

  /**
   * Search jobs with advanced filters
   */
  searchJobs: async (searchParams) => {
    try {
      console.log('Searching jobs with params:', searchParams);

      const {
        query = '',
        location = '',
        type = '',
        category = '',
        experienceLevel = '',
        minSalary = '',
        maxSalary = '',
        isRemote = false,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
      } = searchParams;

      const params = new URLSearchParams();

      if (query.trim()) params.append('search', query.trim());
      if (location.trim()) params.append('location', location.trim());
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (minSalary) params.append('minSalary', minSalary);
      if (maxSalary) params.append('maxSalary', maxSalary);
      if (isRemote) params.append('isRemote', 'true');
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', page);
      params.append('limit', limit);

      const response = await apiClient.get(`${API_ENDPOINTS.JOBS.GET_JOBS}?${params.toString()}`);
      const { data } = response.data;

      return {
        jobs: data.jobs || [],
        pagination: data.pagination || {}
      };
    } catch (error) {
      console.error('Error searching jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get job statistics (for dashboard)
   */
  getJobStats: async () => {
    try {
      console.log('Fetching job statistics');

      // This would require a new endpoint on the backend
      // For now, we'll return mock data or calculate from existing endpoints
      const jobs = await jobService.getAllJobs({ limit: 1000 });

      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: jobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0),
        categoriesCount: [...new Set(jobs.map(job => job.category))].length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get featured jobs (latest or most popular)
   */
  getFeaturedJobs: async (limit = 6) => {
    try {
      console.log('Fetching featured jobs');

      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await apiClient.get(`${API_ENDPOINTS.JOBS.GET_JOBS}?${params.toString()}`);
      const { data } = response.data;

      return data.jobs || [];
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get related jobs based on skills/category
   */
  getRelatedJobs: async (jobId, limit = 4) => {
    try {
      console.log('Fetching related jobs for:', jobId);

      // First get the current job to know its category/skills
      const currentJob = await jobService.getJobById(jobId);

      if (!currentJob) {
        return [];
      }

      // Search for jobs in the same category, excluding current job
      const params = new URLSearchParams();
      if (currentJob.category) params.append('category', currentJob.category);
      params.append('limit', limit + 1); // Get one extra in case current job is included
      params.append('sortBy', 'createdAt');
      params.append('sortOrder', 'desc');

      const response = await apiClient.get(`${API_ENDPOINTS.JOBS.GET_JOBS}?${params.toString()}`);
      const { data } = response.data;

      // Filter out the current job and limit results
      const relatedJobs = (data.jobs || [])
        .filter(job => job._id !== jobId)
        .slice(0, limit);

      return relatedJobs;
    } catch (error) {
      console.error('Error fetching related jobs:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  }
};

export default jobService;