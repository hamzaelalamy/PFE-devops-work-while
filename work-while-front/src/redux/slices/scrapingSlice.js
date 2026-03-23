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

// Async Thunks
export const triggerScraping = createAsyncThunk(
    "scraping/trigger",
    async (source, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const response = await axios.post(
                `${API_URL}/admin/scraping/trigger`,
                { source },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const getScrapingHistory = createAsyncThunk(
    "scraping/getHistory",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/admin/scraping/history`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getScrapedJobs = createAsyncThunk(
    "scraping/getJobs",
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const response = await axios.get(
                `${API_URL}/admin/scraping/jobs`,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const approveScrapedJob = createAsyncThunk(
    "scraping/approveJob",
    async (id, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            await axios.put(
                `${API_URL}/admin/scraping/jobs/${id}/approve`,
                {},
                config
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const rejectScrapedJob = createAsyncThunk(
    "scraping/rejectJob",
    async (id, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            await axios.delete(
                `${API_URL}/admin/scraping/jobs/${id}/reject`,
                config
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const bulkApproveJobs = createAsyncThunk(
    "scraping/bulkApprove",
    async (jobIds, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const response = await axios.post(
                `${API_URL}/admin/scraping/jobs/bulk-approve`,
                { jobIds },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const bulkRejectJobs = createAsyncThunk(
    "scraping/bulkReject",
    async (jobIds, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const response = await axios.post(
                `${API_URL}/admin/scraping/jobs/bulk-reject`,
                { jobIds },
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const scrapingSlice = createSlice({
    name: "scraping",
    initialState: {
        history: [],
        scrapedJobs: [],
        loading: false,
        error: null,
        scrapingStatus: null, // message from backend
    },
    reducers: {
        clearStatus: (state) => {
            state.scrapingStatus = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Trigger
            .addCase(triggerScraping.pending, (state) => {
                state.loading = true;
                state.scrapingStatus = "Requesting scraping...";
            })
            .addCase(triggerScraping.fulfilled, (state, action) => {
                state.loading = false;
                state.scrapingStatus = action.payload.message;
            })
            .addCase(triggerScraping.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // History
            .addCase(getScrapingHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            })
            // Jobs
            .addCase(getScrapedJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getScrapedJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.scrapedJobs = action.payload;
            })
            // Approve
            .addCase(approveScrapedJob.fulfilled, (state, action) => {
                state.scrapedJobs = state.scrapedJobs.filter(job => job._id !== action.payload);
            })
            // Reject
            .addCase(rejectScrapedJob.fulfilled, (state, action) => {
                state.scrapedJobs = state.scrapedJobs.filter(job => job._id !== action.payload);
            })
            // Bulk Approve
            .addCase(bulkApproveJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(bulkApproveJobs.fulfilled, (state, _action) => {
                state.loading = false;
                // Jobs are now published, refresh will remove them
            })
            .addCase(bulkApproveJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Bulk Reject
            .addCase(bulkRejectJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(bulkRejectJobs.fulfilled, (state, _action) => {
                state.loading = false;
                // Jobs are deleted, refresh will remove them
            })
            .addCase(bulkRejectJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearStatus } = scrapingSlice.actions;
export default scrapingSlice.reducer;
