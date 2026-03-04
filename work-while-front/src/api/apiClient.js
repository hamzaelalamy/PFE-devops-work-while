import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: '/api', // Use relative URL to leverage Vite's proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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

        // Redirect to login
        window.location.href = '/login';
      }
      // If it IS an auth request or we're on an auth page, just pass the error through
    }

    return Promise.reject(error);
  }
);

export default apiClient;