import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

export const fetchMyApplications = createAsyncThunk(
    'applications/fetchMy',
    async (_, thunkAPI) => {
        try {
            return await applicationService.getMyApplications();
        } catch (error) {
            const message = error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    applications: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const applicationSlice = createSlice({
    name: 'applications',
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
            .addCase(fetchMyApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
