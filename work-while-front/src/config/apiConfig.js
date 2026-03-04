// src/config/apiConfig.js
import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://1c1004c46f8f.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
    // Essential header for ngrok
    'ngrok-skip-browser-warning': 'true',
    // Additional headers for CORS
    'Accept': 'application/json',
  },
  timeout: 30000, // Increased timeout for ngrok
  withCredentials: true // Important for cookies and auth
});

// Define all API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    SAVED_JOBS: '/users/saved-jobs',
    SAVE_JOB: (jobId) => `/users/save-job/${jobId}`,
    UNSAVE_JOB: (jobId) => `/users/save-job/${jobId}`,
    UPLOAD_AVATAR: '/users/upload-avatar',
    DELETE_ACCOUNT: '/users/profile',
    GET_USERS: '/users',
    GET_USER: (id) => `/users/${id}`,
    UPDATE_USER_STATUS: (id) => `/users/${id}/status`
  },
  JOBS: {
    GET_JOBS: '/jobs',
    GET_JOB: (id) => `/jobs/${id}`,
    CREATE_JOB: '/jobs',
    GET_MY_JOBS: '/jobs/my/jobs',
    UPDATE_JOB: (id) => `/jobs/${id}`,
    DELETE_JOB: (id) => `/jobs/${id}`
  },
  APPLICATIONS: {
    CREATE: '/applications',
    GET_MY_APPLICATIONS: '/applications/my',
    GET_JOB_APPLICATIONS: (jobId) => `/applications/job/${jobId}`,
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
    WITHDRAW: (id) => `/applications/${id}/withdraw`
  },
  COMPANIES: {
    CREATE: '/companies',
    GET_MY_COMPANY: '/companies/my',
    UPDATE_COMPANY: '/companies/my',
    GET_COMPANIES: '/companies',
    GET_COMPANY: (id) => `/companies/${id}`
  },
  // Test endpoints
  HEALTH: '/health',
  CORS_TEST: '/cors-test',
  PING: '/ping'
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Always add ngrok header
    config.headers['ngrok-skip-browser-warning'] = 'true';

    // Log requests in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      const baseURL = config.baseURL || '';
      const url = config.url || '';
      const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;
      console.log(`🚀 ${config.method?.toUpperCase()} ${fullURL}`, config.data || '');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      const baseURL = response.config.baseURL || '';
      const url = response.config.url || '';
      const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;
      console.log(`✅ ${response.config.method?.toUpperCase()} ${fullURL}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Enhanced error logging
    if (error.config && import.meta.env.VITE_DEBUG_API === 'true') {
      const baseURL = error.config.baseURL || '';
      const url = error.config.url || '';
      const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;

      console.error(`❌ ${error.config?.method?.toUpperCase()} ${fullURL}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        corsHeaders: {
          'Access-Control-Allow-Origin': error.response?.headers?.['access-control-allow-origin'],
          'Access-Control-Allow-Credentials': error.response?.headers?.['access-control-allow-credentials']
        }
      });
    }

    // Handle network errors (common with ngrok)
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('🌐 Network Error - Check ngrok connection');
      return Promise.reject({
        ...error,
        message: 'Connection failed. Please check if the backend server is running.'
      });
    }

    // Handle CORS errors specifically
    if (error.message?.includes('CORS') || error.response?.status === 0) {
      console.error('🚫 CORS Error detected');
      return Promise.reject({
        ...error,
        message: 'CORS error. Please check server configuration.'
      });
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if this is a login/register request or if we're on the login/register page
      const isAuthRequest = originalRequest.url && (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/register')
      );
      const isAuthPage = window.location.pathname.includes('/login') ||
        window.location.pathname.includes('/register');

      // Only clear auth data and redirect if it's NOT an auth request and NOT on auth page
      if (!isAuthRequest && !isAuthPage) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        window.location.href = '/login';
      }
      // If it IS an auth request or we're on an auth page, just pass the error through
      // without redirecting - let the page handle it
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      status,
      message: data.message || data.error || 'An error occurred',
      errors: data.errors || []
    };
  } else if (error.request) {
    // Request was made but no response received (likely CORS or network)
    return {
      status: 0,
      message: 'Network error - please check your connection and backend server',
      errors: []
    };
  } else {
    // Something else happened
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      errors: []
    };
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiClient.get(API_ENDPOINTS.CORS_TEST);
    console.log('✅ API Connection successful!', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    const errorInfo = handleApiError(error);
    return { success: false, error: errorInfo };
  }
};

// Test CORS specifically
export const testCORS = async () => {
  try {
    console.log('🧪 Testing CORS...');

    // First try a simple ping
    const pingResponse = await apiClient.get(API_ENDPOINTS.PING);
    console.log('✅ Ping successful:', pingResponse.data);

    // Then try the CORS test endpoint
    const corsResponse = await apiClient.get(API_ENDPOINTS.CORS_TEST);
    console.log('✅ CORS test successful:', corsResponse.data);

    return {
      success: true,
      ping: pingResponse.data,
      cors: corsResponse.data
    };
  } catch (error) {
    console.error('❌ CORS test failed:', error);
    const errorInfo = handleApiError(error);
    return { success: false, error: errorInfo };
  }
};

// Helper to get current API base URL
export const getApiBaseUrl = () => {
  return apiClient.defaults.baseURL;
};

// Helper to update base URL (useful when ngrok URL changes)
export const updateApiBaseUrl = (newBaseUrl) => {
  apiClient.defaults.baseURL = newBaseUrl;
  console.log(`🔄 API Base URL updated to: ${newBaseUrl}`);
};

export default apiClient;