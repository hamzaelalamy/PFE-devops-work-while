import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

// Async thunks
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (filters, thunkAPI) => {
        try {
            return await jobService.getAllJobs(filters);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchJobById = createAsyncThunk(
    'jobs/fetchById',
    async (id, thunkAPI) => {
        try {
            return await jobService.getJobById(id);
        } catch (error) {
            const message = error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    jobs: [],
    job: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchJobById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.job = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = jobSlice.actions;
export default jobSlice.reducer;
