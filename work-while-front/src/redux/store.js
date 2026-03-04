// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import applicationReducer from "./slices/applicationSlice";
import companyReducer from "./slices/companySlice";
import notificationReducer from "./slices/notificationSlice";
import scrapingReducer from "./slices/scrapingSlice";
import analyticsReducer from "./slices/analyticsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer,
        applications: applicationReducer,
        companies: companyReducer,
        notifications: notificationReducer,
        scraping: scrapingReducer,
        analytics: analyticsReducer,
    },
});

export default store;