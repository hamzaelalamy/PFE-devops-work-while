// src/routes/routes.jsx
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import store from '../redux/store';
import { checkAuthState } from '../redux/slices/authActions';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import LandingPage from '../pages/LandingPage';
import JobListingsPage from '../pages/JobListingsPage';
import JobDetailsPage from '../pages/JobDetailsPage';
import CompanyReviewPage from '../pages/CompanyReviewPage';
import CompanyDetailsPage from '../pages/CompanyDetailsPage';
import Loginpage from '../pages/Loginpage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import JobApplicationPage from '../pages/JobApplicationPage';
import CreateJobPage from '../pages/CreateJobPage';
import ScrapingDashboardPage from '../pages/ScrapingDashboardPage';
import AnalyticsDashboardPage from '../pages/AnalyticsDashboardPage';
import ManageUsersPage from '../pages/ManageUsersPage';
import ManageJobsPage from '../pages/ManageJobsPage';
import ManageCompaniesPage from '../pages/ManageCompaniesPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfileSetupPage from '../pages/ProfileSetupPage';

// Layout Components

// Pages - Correction de l'import Homepage

// Optional pages (create these if needed)
// import SalaryGuidePage from '../pages/SalaryGuidePage';
// import NotificationsPage from '../pages/NotificationsPage';
// import TestUploadPage from '../pages/TestUploadPage';

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
        </div>
    </div>
);

// Reuse existing profile setup page for /profile route
const ProfilePage = ProfileSetupPage;

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
        return (
            <Navigate
                to="/jobs"
                replace
                state={{
                    message: `Access denied. This page is only available for ${requiredRole}s.`,
                    type: 'error'
                }}
            />
        );
    }

    return children;
};

// Auth Redirect Component (redirect to home if already logged in)
const AuthRedirect = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Role-based Route Component
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role) && user?.role !== 'admin') {
        return (
            <Navigate
                to="/jobs"
                replace
                state={{
                    message: 'Access denied. You do not have permission to access this page.',
                    type: 'error'
                }}
            />
        );
    }

    return children;
};

// Public Route Component (accessible to all, but may show different content based on auth)
const PublicRoute = ({ children }) => {
    return children;
};

// Placeholder Pages for development
 
const SalaryGuidePage = () => (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Salary Guide</h1>
            <p className="text-gray-600 mb-8">
                Get insights into salary ranges for different positions in Morocco
            </p>
            <div className="text-blue-600 font-medium">Coming Soon!</div>
        </div>
    </div>
);

 
const NotificationsPage = () => (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
            <p className="text-gray-600 mb-8">
                Stay updated with your job applications and opportunities
            </p>
            <div className="text-blue-600 font-medium">Coming Soon!</div>
        </div>
    </div>
);

// App Content with Navigation
 
const AppContent = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.auth);

    useEffect(() => {
        // Check authentication state on app load
        dispatch(checkAuthState());
    }, [dispatch]);

    // Show loading screen during initial auth check
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes - Accessible to everyone */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <LandingPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/jobs"
                        element={
                            <PublicRoute>
                                <JobListingsPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/jobs/:id"
                        element={
                            <PublicRoute>
                                <JobDetailsPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/companies"
                        element={
                            <PublicRoute>
                                <CompanyReviewPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/companies/:id"
                        element={
                            <PublicRoute>
                                <CompanyDetailsPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/salaries"
                        element={
                            <PublicRoute>
                                <SalaryGuidePage />
                            </PublicRoute>
                        }
                    />

                    {/* Auth Routes - Redirect if already logged in */}
                    <Route
                        path="/login"
                        element={
                            <AuthRedirect>
                                <Loginpage />
                            </AuthRedirect>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <AuthRedirect>
                                <RegisterPage />
                            </AuthRedirect>
                        }
                    />

                    {/* Protected Routes - Require Authentication */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <NotificationsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Candidate-Only Routes */}
                    <Route
                        path="/jobs/:id/apply"
                        element={
                            <RoleBasedRoute allowedRoles={['candidate']}>
                                <JobApplicationPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/my-applications"
                        element={
                            <RoleBasedRoute allowedRoles={['candidate']}>
                                <JobListingsPage showMyApplications={true} />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/saved-jobs"
                        element={
                            <RoleBasedRoute allowedRoles={['candidate']}>
                                <JobListingsPage showSavedJobs={true} />
                            </RoleBasedRoute>
                        }
                    />

                    {/* Employer-Only Routes */}
                    <Route
                        path="/create-job"
                        element={
                            <RoleBasedRoute allowedRoles={['employer']}>
                                <CreateJobPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/my-jobs"
                        element={
                            <RoleBasedRoute allowedRoles={['employer']}>
                                <JobListingsPage showMyJobs={true} />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/jobs/:id/edit"
                        element={
                            <RoleBasedRoute allowedRoles={['employer']}>
                                <JobDetailsPage isEditing={true} />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/jobs/:id/applications"
                        element={
                            <RoleBasedRoute allowedRoles={['employer']}>
                                <JobDetailsPage showApplications={true} />
                            </RoleBasedRoute>
                        }
                    />

                    {/* Admin-Only Routes */}
                    <Route
                        path="/admin"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <DashboardPage isAdmin={true} />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/admin/scraping"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <ScrapingDashboardPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/admin/analytics"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <AnalyticsDashboardPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <ManageUsersPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/admin/jobs"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <ManageJobsPage />
                            </RoleBasedRoute>
                        }
                    />

                    <Route
                        path="/admin/companies"
                        element={
                            <RoleBasedRoute allowedRoles={['admin']}>
                                <ManageCompaniesPage />
                            </RoleBasedRoute>
                        }
                    />

                    {/* Development/Test Routes - Remove in production */}
                    {import.meta.env.DEV && (
                        <>
                            {/* Uncomment if you have TestUploadPage
              <Route
                path="/test-upload"
                element={
                  <ProtectedRoute>
                    <TestUploadPage />
                  </ProtectedRoute>
                }
              />
              */}
                        </>
                    )}

                    {/* Special Routes with Query Parameters */}
                    <Route
                        path="/jobs/search"
                        element={
                            <PublicRoute>
                                <JobListingsPage />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/companies/search"
                        element={
                            <PublicRoute>
                                <CompanyReviewPage />
                            </PublicRoute>
                        }
                    />

                    {/* Redirect Routes */}
                    <Route path="/job/:id" element={<Navigate to="/jobs/:id" replace />} />
                    <Route path="/company/:id" element={<Navigate to="/companies/:id" replace />} />
                    <Route path="/apply/:id" element={<Navigate to="/jobs/:id/apply" replace />} />

                    {/* 404 Route - Must be last */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

// Error Boundary Component
 
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Route error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Main App Router
const AppRouter = () => {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <Router>
                    <ScrollToTop />
                    <AppContent />
                </Router>
            </Provider>
        </ErrorBoundary>
    );
};

export default AppRouter;

// Export individual components for testing
export {
    ProtectedRoute,
    AuthRedirect,
    RoleBasedRoute,
    PublicRoute,
    LoadingSpinner
};