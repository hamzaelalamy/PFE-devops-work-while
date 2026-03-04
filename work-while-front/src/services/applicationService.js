import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const applicationService = {
  /**
   * Create a new job application
   */
  createApplication: async (applicationData) => {
    try {
      console.log('Creating application:', applicationData);

      // Handle FormData for file uploads
      const isFormData = applicationData instanceof FormData;

      const config = {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
        }
      };

      const response = await apiClient.post(API_ENDPOINTS.APPLICATIONS.CREATE, applicationData, config);
      const { data } = response.data;

      return data.application;
    } catch (error) {
      console.error('Error creating application:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get my applications (for candidates)
   */
  getMyApplications: async (page = 1, limit = 10, status = null) => {
    try {
      console.log('Fetching my applications');

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await apiClient.get(`${API_ENDPOINTS.APPLICATIONS.GET_MY_APPLICATIONS}?${params.toString()}`);
      const { data } = response.data;

      return data.applications || [];
    } catch (error) {
      console.error('Error fetching my applications:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get applications for a specific job (for employers)
   */
  getJobApplications: async (jobId, page = 1, limit = 10, status = null) => {
    try {
      console.log('Fetching job applications for:', jobId);

      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (status) params.append('status', status);

      const response = await apiClient.get(`${API_ENDPOINTS.APPLICATIONS.GET_JOB_APPLICATIONS(jobId)}?${params.toString()}`);
      const { data } = response.data;

      return data.applications || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Update application status (for employers)
   */
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    try {
      console.log('Updating application status:', applicationId, status);

      const payload = { status };
      if (notes.trim()) {
        payload.notes = notes.trim();
      }

      const response = await apiClient.put(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId), payload);
      const { data } = response.data;

      return data.application;
    } catch (error) {
      console.error('Error updating application status:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Withdraw application (for candidates)
   */
  withdrawApplication: async (applicationId) => {
    try {
      console.log('Withdrawing application:', applicationId);

      const response = await apiClient.put(API_ENDPOINTS.APPLICATIONS.WITHDRAW(applicationId));
      const { data } = response.data;

      return data.application;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get application statistics for a candidate
   */
  getApplicationStats: async () => {
    try {
      console.log('Fetching application statistics');

      const applications = await applicationService.getMyApplications(1, 1000);

      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        interviewed: applications.filter(app => app.status === 'interviewed').length,
        offered: applications.filter(app => app.status === 'offered').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        withdrawn: applications.filter(app => app.status === 'withdrawn').length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Check if user has applied to a specific job
   */
  hasAppliedToJob: async (jobId) => {
    try {
      console.log('Checking if applied to job:', jobId);

      const applications = await applicationService.getMyApplications(1, 1000);
      return applications.some(app => app.job._id === jobId);
    } catch (error) {
      console.error('Error checking job application:', error);
      return false;
    }
  },

  /**
   * Get application by ID
   */
  getApplicationById: async (applicationId) => {
    try {
      console.log('Fetching application by ID:', applicationId);

      const applications = await applicationService.getMyApplications(1, 1000);
      return applications.find(app => app._id === applicationId) || null;
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get recent applications (for dashboard)
   */
  getRecentApplications: async (limit = 5) => {
    try {
      console.log('Fetching recent applications');

      const applications = await applicationService.getMyApplications(1, limit);
      return applications;
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Upload application documents
   */
  uploadDocument: async (file, documentType = 'resume') => {
    try {
      console.log('Uploading document:', file.name, documentType);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentType);

      // This would require a new endpoint for file upload
      // For now, we'll return a mock response
      const mockResponse = {
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };

      return mockResponse;
    } catch (error) {
      console.error('Error uploading document:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Get application timeline/history
   */
  getApplicationTimeline: async (applicationId) => {
    try {
      console.log('Fetching application timeline:', applicationId);

      const application = await applicationService.getApplicationById(applicationId);

      if (!application) {
        return [];
      }

      const timeline = [
        {
          status: 'submitted',
          date: application.createdAt,
          title: 'Application Submitted',
          description: 'Your application has been submitted successfully'
        }
      ];

      if (application.reviewedAt) {
        timeline.push({
          status: application.status,
          date: application.reviewedAt,
          title: `Application ${application.status}`,
          description: application.notes || `Your application status has been updated to ${application.status}`
        });
      }

      return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error fetching application timeline:', error);
      const errorInfo = handleApiError(error);
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Validate application data before submission
   */
  validateApplicationData: (applicationData) => {
    const errors = [];
    console.log('Validating application data:', applicationData);

    // Required fields validation
    if (!applicationData.get('jobId')) {
      errors.push('Job ID is required');
    }

    if (!applicationData.get('personalInfo')) {
      errors.push('Personal information is required');
    } else {
      try {
        const personalInfo = JSON.parse(applicationData.get('personalInfo'));

        if (!personalInfo.firstName?.trim()) {
          errors.push('First name is required');
        }

        if (!personalInfo.lastName?.trim()) {
          errors.push('Last name is required');
        }

        if (!personalInfo.email?.trim()) {
          errors.push('Email is required');
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(personalInfo.email)) {
            errors.push('Please provide a valid email address');
          }
        }

        if (!personalInfo.phone?.trim()) {
          errors.push('Phone number is required');
        }

        // Validate totalExperience as a number
        if (personalInfo.totalExperience && isNaN(personalInfo.totalExperience)) {
          errors.push('Total experience must be a valid number');
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        errors.push('Invalid personal information format');
      }
    }

    if (!applicationData.get('resume')) {
      errors.push('Resume is required');
    }

    const coverLetter = applicationData.get('coverLetter');
    if (coverLetter && coverLetter.length < 50) {
      errors.push('Cover letter should be at least 50 characters long');
    }

    // Validate expectedSalary
    if (applicationData.get('expectedSalary')) {
      try {
        const expectedSalary = JSON.parse(applicationData.get('expectedSalary'));
        if (expectedSalary.amount && isNaN(expectedSalary.amount)) {
          errors.push('Expected salary amount must be a valid number');
        }
        // Define valid currencies based on server requirements
        const validCurrencies = ['USD', 'EUR', 'GBP', 'MAD']; // Adjust based on server enum
        if (expectedSalary.currency && !validCurrencies.includes(expectedSalary.currency)) {
          errors.push(`Currency must be one of: ${validCurrencies.join(', ')}`);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        errors.push('Invalid expected salary format');
      }
    }

    console.log('Validation errors:', errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default applicationService;