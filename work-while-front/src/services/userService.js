// src/services/userService.js
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';

const userService = {
    /**
     * Get current user profile
     */
    getProfile: async () => {
        try {
            console.log('Fetching user profile');

            const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
            const { data } = response.data;

            return data.user;
        } catch (error) {
            console.error('Error fetching profile:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (profileData) => {
        try {
            console.log('Updating user profile:', profileData);

            const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
            const { data } = response.data;

            return data.user;
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword, newPassword) => {
        try {
            console.log('Changing password');

            const response = await apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
                currentPassword,
                newPassword
            });

            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get saved jobs
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
     * Save a job
     */
    saveJob: async (jobId) => {
        try {
            console.log('Saving job:', jobId);

            const response = await apiClient.post(API_ENDPOINTS.USERS.SAVE_JOB(jobId));
            return response.data;
        } catch (error) {
            console.error('Error saving job:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Remove saved job
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
     * Upload avatar
     */
    uploadAvatar: async (file) => {
        try {
            console.log('Uploading avatar:', file.name);

            // For now, we'll create a mock URL
            // In a real app, you'd upload to a cloud service like Cloudinary
            const avatarUrl = URL.createObjectURL(file);

            const response = await apiClient.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, {
                avatarUrl
            });

            const { data } = response.data;
            return data.user;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Delete account
     */
    deleteAccount: async () => {
        try {
            console.log('Deleting account');

            await apiClient.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT);
            return true;
        } catch (error) {
            console.error('Error deleting account:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get user by ID (for admin or public profiles)
     */
    getUserById: async (userId) => {
        try {
            console.log('Fetching user by ID:', userId);

            const response = await apiClient.get(API_ENDPOINTS.USERS.GET_USER(userId));
            const { data } = response.data;

            return data.user;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get all users (admin only)
     */
    getAllUsers: async (filters = {}) => {
        try {
            console.log('Fetching all users with filters:', filters);

            const params = new URLSearchParams();

            if (filters.role) params.append('role', filters.role);
            if (filters.search) params.append('search', filters.search);
            if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
            if (filters.page) params.append('page', filters.page);
            if (filters.limit) params.append('limit', filters.limit);

            const queryString = params.toString();
            const url = queryString ? `${API_ENDPOINTS.USERS.GET_USERS}?${queryString}` : API_ENDPOINTS.USERS.GET_USERS;

            const response = await apiClient.get(url);
            const { data } = response.data;

            return {
                users: data.users || [],
                pagination: data.pagination || {}
            };
        } catch (error) {
            console.error('Error fetching all users:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update user status (admin only)
     */
    updateUserStatus: async (userId, isActive) => {
        try {
            console.log('Updating user status:', userId, isActive);

            const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_USER_STATUS(userId), {
                isActive
            });

            const { data } = response.data;
            return data.user;
        } catch (error) {
            console.error('Error updating user status:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get user statistics
     */
    getUserStats: async (userId = null) => {
        try {
            console.log('Fetching user statistics');

            // If no userId provided, get stats for current user
            const user = userId ?
                await userService.getUserById(userId) :
                await userService.getProfile();

            if (!user) {
                throw new Error('User not found');
            }

            // Get additional data
            const savedJobs = await userService.getSavedJobs(1, 1000);

            const stats = {
                profileCompleteness: calculateProfileCompleteness(user),
                totalSavedJobs: savedJobs.length,
                accountAge: Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)),
                lastLoginDays: user.lastLogin ? Math.floor((new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)) : null
            };

            return stats;
        } catch (error) {
            console.error('Error fetching user stats:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Search users
     */
    searchUsers: async (searchParams) => {
        try {
            console.log('Searching users with params:', searchParams);

            const {
                query = '',
                role = '',
                isActive = true,
                page = 1,
                limit = 10
            } = searchParams;

            const params = new URLSearchParams();

            if (query.trim()) params.append('search', query.trim());
            if (role) params.append('role', role);
            params.append('isActive', isActive);
            params.append('page', page);
            params.append('limit', limit);

            const response = await apiClient.get(`${API_ENDPOINTS.USERS.GET_USERS}?${params.toString()}`);
            const { data } = response.data;

            return {
                users: data.users || [],
                pagination: data.pagination || {}
            };
        } catch (error) {
            console.error('Error searching users:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Validate profile data
     */
    validateProfileData: (profileData) => {
        const errors = [];

        if (!profileData.firstName?.trim()) {
            errors.push('First name is required');
        }

        if (!profileData.lastName?.trim()) {
            errors.push('Last name is required');
        }

        if (!profileData.email?.trim()) {
            errors.push('Email is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(profileData.email)) {
                errors.push('Please provide a valid email address');
            }
        }

        if (profileData.profile?.phone && !/^\+?[\d\s\-()]{10,}$/.test(profileData.profile.phone)) {
            errors.push('Please provide a valid phone number');
        }

        if (profileData.profile?.bio && profileData.profile.bio.length > 500) {
            errors.push('Bio cannot exceed 500 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Get user role options
     */
    getUserRoleOptions: () => {
        return [
            { value: 'candidate', label: 'Candidate' },
            { value: 'employer', label: 'Employer' },
            { value: 'admin', label: 'Administrator' }
        ];
    }
};

/**
 * Calculate profile completeness percentage
 */
const calculateProfileCompleteness = (user) => {
    const fields = [
        user.firstName,
        user.lastName,
        user.email,
        user.profile?.phone,
        user.profile?.location,
        user.profile?.bio,
        user.profile?.skills?.length > 0,
        user.profile?.experience,
        user.profile?.education,
        user.profile?.avatar
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
};

export default userService;