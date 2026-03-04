import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Environment aware URL handling
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api/v1'
        : 'https://workwhile-backend.onrender.com/api/v1'; // Fallback
};

const API_URL = getApiUrl();

export const fetchMarketOverview = createAsyncThunk(
    "analytics/fetchOverview",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.get(`${API_URL}/analytics/overview`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTopSectors = createAsyncThunk(
    "analytics/fetchSectors",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.get(`${API_URL}/analytics/sectors`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTopSkills = createAsyncThunk(
    "analytics/fetchSkills",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.get(`${API_URL}/analytics/skills`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchJobTrends = createAsyncThunk(
    "analytics/fetchTrends",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.get(`${API_URL}/analytics/trends`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const analyticsSlice = createSlice({
    name: "analytics",
    initialState: {
        overview: null,
        sectors: [],
        skills: [],
        trends: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketOverview.fulfilled, (state, action) => {
                state.overview = action.payload;
            })
            .addCase(fetchTopSectors.fulfilled, (state, action) => {
                state.sectors = action.payload;
            })
            .addCase(fetchTopSkills.fulfilled, (state, action) => {
                state.skills = action.payload;
            })
            .addCase(fetchJobTrends.fulfilled, (state, action) => {
                state.trends = action.payload;
            });
    },
});

export default analyticsSlice.reducer;
