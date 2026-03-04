import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companyService from '../../services/companyService';

export const fetchCompanies = createAsyncThunk(
    'companies/fetchAll',
    async (_, thunkAPI) => {
        try {
            return await companyService.getAllCompanies();
        } catch (error) {
            const message = error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    companies: [],
    company: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const companySlice = createSlice({
    name: 'companies',
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
            .addCase(fetchCompanies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = companySlice.actions;
export default companySlice.reducer;
