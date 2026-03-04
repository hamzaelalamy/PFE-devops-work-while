// src/redux/slices/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../api/authService.js';

/**
 * Register a new user
 */
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Dispatching registerUser with data:', userData);
            const response = await authService.register(userData);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.userId,
                    role: response.role,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    needsProfileSetup: userData.role === 'candidate' // Only candidates need profile setup
                }));
            }

            return response;
        } catch (error) {
            console.error('Register error:', error);
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

/**
 * Login a user
 */
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Dispatching loginUser with:', credentials);
            const response = await authService.login(credentials);

            // Store token and user info in localStorage for persistence
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.userId,
                    role: response.role,
                    email: credentials.email,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    needsProfileSetup: false // Existing users don't need profile setup
                }));
            }

            return response;
        } catch (error) {
            console.error('Login error:', error);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

/**
 * Logout the current user
 */
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();

            // Remove token and user info from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return null;
        } catch (error) {
            // Even if the API call fails, we want to clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

/**
 * Check if user is already authenticated
 */
export const checkAuthState = createAsyncThunk(
    'auth/checkState',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                return null;
            }

            // Validate token by calling the API
            try {
                const response = await authService.getCurrentUser();
                const user = JSON.parse(userStr);

                return {
                    user: {
                        ...user,
                        ...response.user
                    },
                    token
                };
                // eslint-disable-next-line no-unused-vars
            } catch (apiError) {
                // Token is invalid, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return null;
            }
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue(error.message || 'Authentication check failed');
        }
    }
);

/**
 * Complete profile setup for new users
 */
export const completeProfileSetup = createAsyncThunk(
    'auth/completeProfileSetup',
    async (profileData, { getState, rejectWithValue }) => {
        try {
            // This would typically call an API to update the profile
            // For now, we'll just simulate and update local storage

            const { user } = getState().auth;
            if (!user) {
                return rejectWithValue('User not authenticated');
            }

            // Update the user profile with the new data
            const updatedUser = {
                ...user,
                needsProfileSetup: false,
                profileCompleted: true,
                ...profileData
            };

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.message || 'Profile setup failed');
        }
    }
);

/**
 * Forgot password
 */
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error) {
            console.error('Forgot password error:', error);
            return rejectWithValue(error.message || 'Failed to send reset email');
        }
    }
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await authService.resetPassword(token, password);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.userId,
                    role: response.role,
                    email: response.user.email,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    needsProfileSetup: false
                }));
            }

            return response;
        } catch (error) {
            console.error('Reset password error:', error);
            return rejectWithValue(error.message || 'Password reset failed');
        }
    }
);