import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import { clearError, loginSuccess } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [localLoading, setLocalLoading] = useState(false); // Use LOCAL loading state

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated, error: reduxError } = useSelector(state => state.auth);

  // Get redirect path from location state or default to jobs page
  const from = location.state?.from || '/jobs';

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearError());
    setLocalError('');
  }, [dispatch]);

  useEffect(() => {
    // If the user is authenticated, redirect accordingly
    if (isAuthenticated && user) {
      if (user.needsProfileSetup) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when user types
    if (localError) setLocalError('');
    if (reduxError) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submission with data:', formData);

    // Don't clear local error yet, let it be replaced by new error if any
    // Use LOCAL loading state to prevent component unmounting
    setLocalLoading(true);

    try {
      // Use a direct axios instance to avoid global interceptors that cause reloads on 401
      // This is a specific fix for the login page to ensure errors are handled gracefully
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const responseData = response.data;
      const { user, token } = responseData.data;

      // Clear any errors on successful login
      setLocalError('');
      dispatch(clearError());

      // Manually update Redux state
      dispatch(loginSuccess({ user, token }));

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user._id,
        role: user.role,
        email: formData.email,
        firstName: user.firstName,
        lastName: user.lastName,
        needsProfileSetup: user.role === 'candidate' ? user.needsProfileSetup : false
      }));

      console.log('Login successful:', responseData);
      // Redirect handled by useEffect
    } catch (err) {
      console.error('Login failed:', err);

      // IMPORTANT: Set LOCALLOADING to false (not Redux loading)
      setLocalLoading(false);

      // Extract error message safely
      let errorMessage = 'Invalid email or password. Please try again.';

      if (err.response) {
        // Server responded with an error (e.g., 401)
        console.log('Error response:', err.response.data);
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        // Something else happened
        console.error('Error setting up request:', err.message);
        errorMessage = err.message || errorMessage;
      }

      console.log('Setting error message:', errorMessage);
      setLocalError(errorMessage);

      // DO NOT clear the form data - keep the email so user can try again
      // Only clear password for security
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  // Combine local and redux errors for display
  const displayError = localError || reduxError;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {displayError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {displayError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={localLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${localLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {localLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;