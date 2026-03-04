import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate checking user role
      const userData = {
        id: credentials.id || Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: credentials.name || credentials.username || 'Demo User',
        role: credentials.role || 'jobseeker',
      };
      
      // Check if user is a jobseeker
      if (userData.role !== 'jobseeker') {
        return rejectWithValue('Access denied. Only jobseekers can login.');
      }
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user is registering as a jobseeker
      if (userData.role !== 'jobseeker') {
        return rejectWithValue('Registration failed. Only jobseekers can register.');
      }
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name || 'New User',
        username: userData.username,
        role: 'jobseeker', // Force role to be jobseeker
        needsProfileSetup: true, // Flag to indicate profile setup is needed
      };
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('currentUser');
    return null;
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // Check if the saved user is a jobseeker
      if (user.role !== 'jobseeker') {
        localStorage.removeItem('currentUser');
        return rejectWithValue('Access denied. Only jobseekers can use this application.');
      }
      
      return user;
    }
    return null;
  }
);

export const completeProfileSetup = createAsyncThunk(
  'auth/completeProfileSetup',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('User not authenticated');
      }
      
      // Update the user profile with the new data
      const updatedUser = {
        ...user,
        needsProfileSetup: false, // Mark profile setup as completed
        profileCompleted: true,
        experienceLevel: profileData.experienceLevel,
        skills: profileData.skills,
        jobTitles: profileData.jobTitles,
        preferences: profileData.preferences
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Profile setup failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check auth state cases
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Complete profile setup cases
      .addCase(completeProfileSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfileSetup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(completeProfileSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;