import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Activity,
    BarChart3,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Edit,
    Eye,
    FileText,
    Mail,
    PieChart,
    Plus,
    TrendingUp,
    User,
    Users,
    XCircle,
} from 'lucide-react';


import applicationService from '../services/applicationService';
import jobService from '../services/jobService';
import userService from '../services/userService';

const DashboardPage = ({ isAdmin = false }) => {
    const { user } = useSelector(state => state.auth);
    useNavigate();
    // États pour les données
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [recentData, setRecentData] = useState({
        applications: [],
        jobs: [],
        activities: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (user?.role === 'candidate') {
                    await fetchCandidateDashboard();
                } else if (user?.role === 'employer') {
                    await fetchEmployerDashboard();
                } else if (user?.role === 'admin' || isAdmin) {
                    await fetchAdminDashboard();
                }
            } catch (err) {
                setError(err.message || 'Failed to load dashboard data');
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.role, isAdmin]);

    const fetchCandidateDashboard = async () => {
        const [applicationsData, savedJobs, userStats] = await Promise.all([
            applicationService.getMyApplications(1, 5).catch(() => []),
            jobService.getSavedJobs(1, 5).catch(() => []),
            userService.getUserStats().catch(() => ({}))
        ]);

        setStats({
            totalApplications: applicationsData.length,
            pendingApplications: applicationsData.filter(app => app.status === 'pending').length,
            shortlistedApplications: applicationsData.filter(app => app.status === 'shortlisted').length,
            savedJobs: savedJobs.length,
            profileCompleteness: userStats.profileCompleteness || 0
        });

        setRecentData({
            applications: applicationsData,
            jobs: savedJobs,
            activities: generateRecentActivities(applicationsData, savedJobs)
        });
    };

    const fetchEmployerDashboard = async () => {
        try {
            // Récupérer les jobs de l'employeur
            const myJobs = await jobService.getMyJobs(1, 10);

            // Essayer de récupérer les candidatures pour chaque job
            let allApplications = [];
            let totalApplications = 0;
            let pendingApplications = 0;
            let shortlistedApplications = 0;

            try {
                // Essayer de récupérer les candidatures pour chaque job
                const applicationPromises = myJobs.slice(0, 5).map(async (job) => {
                    try {
                        return await applicationService.getJobApplications(job._id, 1, 10);
                    } catch (error) {
                        console.warn(`Unable to retrieve applications for job ${job._id}:`, error.message);
                        return [];
                    }
                });

                const applicationsResults = await Promise.all(applicationPromises);

                applicationsResults.forEach(applications => {
                    if (Array.isArray(applications)) {
                        allApplications = allApplications.concat(applications);
                        totalApplications += applications.length;
                        pendingApplications += applications.filter(app => app.status === 'pending').length;
                        shortlistedApplications += applications.filter(app => app.status === 'shortlisted').length;
                    }
                });

            } catch (applicationsError) {
                console.warn('Unable to retrieve application data:', applicationsError.message);

                // Utiliser des données de démonstration pour les candidatures
                allApplications = generateDemoApplications(myJobs);
                totalApplications = allApplications.length;
                pendingApplications = allApplications.filter(app => app.status === 'pending').length;
                shortlistedApplications = allApplications.filter(app => app.status === 'shortlisted').length;
            }

            setStats({
                totalJobs: myJobs.length,
                activeJobs: myJobs.filter(job => job.status === 'active').length,
                totalApplications,
                pendingApplications,
                shortlistedApplications
            });

            setRecentData({
                jobs: myJobs,
                applications: allApplications.slice(0, 5),
                activities: generateEmployerActivities(myJobs, allApplications)
            });

        } catch (error) {
            console.error('Error in fetchEmployerDashboard:', error);
            throw error;
        }
    };

    const fetchAdminDashboard = async () => {
        // Pour l'admin, on simule des données (à remplacer par de vraies APIs)
        setStats({
            totalUsers: 1250,
            totalJobs: 340,
            totalApplications: 2840,
            totalCompanies: 85,
            activeJobs: 280,
            newUsersThisMonth: 45
        });

        setRecentData({
            activities: [
                { id: 1, type: 'user_registered', message: 'New user registered: John Doe', time: '2 hours ago' },
                { id: 2, type: 'job_posted', message: 'New job posted: Senior Developer', time: '4 hours ago' },
                { id: 3, type: 'application_submitted', message: '15 new applications received', time: '6 hours ago' }
            ]
        });
    };

    // Générer des candidatures de démonstration si les vraies données ne sont pas disponibles
    const generateDemoApplications = (jobs) => {
        if (!jobs || jobs.length === 0) return [];

        const demoApplicants = [
            {
                _id: 'demo1',
                applicant: {
                    _id: 'user1',
                    firstName: 'Ahmed',
                    lastName: 'Benali',
                    email: 'ahmed.benali@email.com',
                    profile: {
                        phone: '+212 6 12 34 56 78',
                        location: 'Casablanca, Morocco'
                    }
                },
                status: 'pending',
                createdAt: new Date('2024-01-15'),
                job: jobs[0],
                coverLetter: 'I am very interested in this position...',
                personalInfo: {
                    firstName: 'Ahmed',
                    lastName: 'Benali',
                    email: 'ahmed.benali@email.com',
                    phone: '+212 6 12 34 56 78'
                },
                resume: {
                    filename: 'ahmed_benali_cv.pdf',
                    originalName: 'CV Ahmed Benali.pdf',
                    url: '/uploads/resumes/ahmed_benali_cv.pdf'
                }
            },
            {
                _id: 'demo2',
                applicant: {
                    _id: 'user2',
                    firstName: 'Fatima',
                    lastName: 'El Mansouri',
                    email: 'fatima.elmansouri@email.com',
                    profile: {
                        phone: '+212 6 87 65 43 21',
                        location: 'Rabat, Morocco'
                    }
                },
                status: 'shortlisted',
                createdAt: new Date('2024-01-10'),
                job: jobs[0],
                coverLetter: 'With my 7 years of experience...',
                personalInfo: {
                    firstName: 'Fatima',
                    lastName: 'El Mansouri',
                    email: 'fatima.elmansouri@email.com',
                    phone: '+212 6 87 65 43 21'
                },
                resume: {
                    filename: 'fatima_elmansouri_cv.pdf',
                    originalName: 'CV Fatima El Mansouri.pdf',
                    url: '/uploads/resumes/fatima_elmansouri_cv.pdf'
                }
            }
        ];

        return demoApplicants;
    };

    const generateRecentActivities = (applications, savedJobs) => {
        const activities = [];

        applications.slice(0, 3).forEach(app => {
            activities.push({
                id: app._id,
                type: 'application',
                message: `Application for ${app.job?.title}`,
                time: getTimeAgo(app.createdAt),
                status: app.status
            });
        });

        savedJobs.slice(0, 2).forEach(job => {
            activities.push({
                id: job._id,
                type: 'saved',
                message: `Job saved: ${job.title}`,
                time: getTimeAgo(job.createdAt)
            });
        });

        return activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const generateEmployerActivities = (jobs, applications) => {
        const activities = [];

        jobs.slice(0, 3).forEach(job => {
            activities.push({
                id: job._id,
                type: 'job_posted',
                message: `Job posted: ${job.title}`,
                time: getTimeAgo(job.createdAt),
                applicationsCount: job.applicationsCount || 0
            });
        });

        applications.slice(0, 2).forEach(app => {
            activities.push({
                id: app._id,
                type: 'application_received',
                message: `New application from ${app.applicant.firstName} ${app.applicant.lastName}`,
                time: getTimeAgo(app.createdAt),
                status: app.status
            });
        });

        return activities;
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await applicationService.updateApplicationStatus(applicationId, newStatus);

            // Mettre à jour localement
            setRecentData(prev => ({
                ...prev,
                applications: prev.applications.map(app =>
                    app._id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            }));

            // Recalculer les stats
            const updatedApplications = recentData.applications.map(app =>
                app._id === applicationId ? { ...app, status: newStatus } : app
            );

            setStats(prevStats => ({
                ...prevStats,
                pendingApplications: updatedApplications.filter(app => app.status === 'pending').length,
                shortlistedApplications: updatedApplications.filter(app => app.status === 'shortlisted').length
            }));

        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const downloadCV = (application) => {
        if (application.resume && application.resume.url) {
            const link = document.createElement('a');
            link.href = application.resume.url;
            link.download = application.resume.originalName || `CV_${application.applicant.firstName}_${application.applicant.lastName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewing: 'bg-blue-100 text-blue-800',
            shortlisted: 'bg-green-100 text-green-800',
            interviewed: 'bg-purple-100 text-purple-800',
            offered: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            withdrawn: 'bg-gray-100 text-gray-800',
            active: 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Pending',
            reviewing: 'Reviewing',
            shortlisted: 'Shortlisted',
            interviewed: 'Interviewed',
            offered: 'Offer Sent',
            rejected: 'Rejected',
            withdrawn: 'Withdrawn',
            active: 'Active'
        };
        return texts[status] || status;
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-24 mb-16">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-64 bg-gray-200 rounded-lg"></div>
                        <div className="h-64 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 mt-24 mb-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Dashboard Loading Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 mt-24 mb-16">
            {/* En-tête */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isAdmin || user?.role === 'admin' ? 'Admin Dashboard' :
                        user?.role === 'employer' ? 'Employer Dashboard' :
                            'My Dashboard'}
                </h1>
                <p className="text-gray-600 mt-2">
                    Welcome back, {user?.firstName || user?.name || 'User'}! Here's what's happening with your account.
                </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {renderStatsCards()}
            </div>

            {/* Grille de contenu principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne de gauche - largeur 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    {renderMainContent()}
                </div>

                {/* Colonne de droite - largeur 1/3 */}
                <div className="space-y-6">
                    {renderSidebar()}
                </div>
            </div>
        </div>
    );

    function renderStatsCards() {
        if (isAdmin || user?.role === 'admin') {
            return (
                <>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<Users className="h-8 w-8" />}
                        color="blue"
                        change="+12%"
                    />
                    <StatCard
                        title="Active Jobs"
                        value={stats.activeJobs}
                        icon={<Briefcase className="h-8 w-8" />}
                        color="green"
                        change="+8%"
                    />
                    <StatCard
                        title="Applications"
                        value={stats.totalApplications}
                        icon={<FileText className="h-8 w-8" />}
                        color="purple"
                        change="+23%"
                    />
                    <StatCard
                        title="Companies"
                        value={stats.totalCompanies}
                        icon={<TrendingUp className="h-8 w-8" />}
                        color="orange"
                        change="+5%"
                    />
                </>
            );
        } else if (user?.role === 'employer') {
            return (
                <>
                    <StatCard
                        title="My Jobs"
                        value={stats.totalJobs}
                        icon={<Briefcase className="h-8 w-8" />}
                        color="blue"
                    />
                    <StatCard
                        title="Active Jobs"
                        value={stats.activeJobs}
                        icon={<CheckCircle className="h-8 w-8" />}
                        color="green"
                    />
                    <StatCard
                        title="Total Applications"
                        value={stats.totalApplications}
                        icon={<FileText className="h-8 w-8" />}
                        color="purple"
                    />
                    <StatCard
                        title="Pending Review"
                        value={stats.pendingApplications}
                        icon={<Clock className="h-8 w-8" />}
                        color="orange"
                    />
                </>
            );
        } else {
            return (
                <>
                    <StatCard
                        title="Applications"
                        value={stats.totalApplications}
                        icon={<FileText className="h-8 w-8" />}
                        color="blue"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pendingApplications}
                        icon={<Clock className="h-8 w-8" />}
                        color="orange"
                    />
                    <StatCard
                        title="Shortlisted"
                        value={stats.shortlistedApplications}
                        icon={<CheckCircle className="h-8 w-8" />}
                        color="green"
                    />
                    <StatCard
                        title="Saved Jobs"
                        value={stats.savedJobs}
                        icon={<Briefcase className="h-8 w-8" />}
                        color="purple"
                    />
                </>
            );
        }
    }

    function renderMainContent() {
        if (isAdmin || user?.role === 'admin') {
            return (
                <>
                    <RecentActivity activities={recentData.activities} isAdmin={true} />
                    <SystemOverview />
                </>
            );
        } else if (user?.role === 'employer') {
            return (
                <>
                    <RecentApplications
                        applications={recentData.applications}
                        onStatusUpdate={handleStatusUpdate}
                        onDownloadCV={downloadCV}
                        getStatusColor={getStatusColor}
                        getStatusText={getStatusText}
                        formatDate={formatDate}
                    />
                    <RecentJobs jobs={recentData.jobs} />
                    <RecentActivity activities={recentData.activities} />
                </>
            );
        } else {
            return (
                <>
                    <RecentApplications applications={recentData.applications} />
                    <RecentActivity activities={recentData.activities} />
                </>
            );
        }
    }

    function renderSidebar() {
        if (user?.role === 'employer') {
            return (
                <>
                    <QuickActions />
                    <JobPerformance />
                </>
            );
        } else if (user?.role === 'candidate') {
            return (
                <>
                    <ProfileCompletion completeness={stats.profileCompleteness} />
                    <RecommendedJobs />
                </>
            );
        } else {
            return (
                <>
                    <PlatformMetrics />
                    <QuickLinks />
                </>
            );
        }
    }
};

/* eslint-disable unused-imports/no-unused-vars */
// Composants utilitaires — used via JSX
const StatCard = ({ title, value, icon, color, change }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
                    {change && (
                        <p className="text-sm text-green-600 mt-1">
                            <span className="font-medium">{change}</span> from last month
                        </p>
                    )}
                </div>
                <div className={`${colorClasses[color]} text-white p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Composant RecentApplications amélioré pour les employeurs
const RecentApplications = ({
    applications,
    onStatusUpdate,
    onDownloadCV,
    getStatusColor,
    getStatusText,
    formatDate
}) => {
    const navigate = useNavigate();

    // Si c'est pour un candidat (pas de callbacks), utiliser l'ancien composant
    if (!onStatusUpdate) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    <Link to="/my-applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View All
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No applications yet</p>
                        <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="font-medium text-gray-900">{app.job?.title}</h4>
                                    <p className="text-sm text-gray-500">{app.job?.company?.name}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusBadge status={app.status} />
                                    <Link to={`/jobs/${app.job?._id}`} className="text-blue-600 hover:text-blue-800">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Version pour employeurs avec gestion des candidatures
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <button
                    onClick={() => navigate('/applications')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View All
                </button>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                    <p className="text-sm text-gray-400 mt-1">Applications will appear here when candidates apply to your jobs</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map(app => (
                        <div key={app._id} className="border border-gray-200 rounded-lg p-4">
                            {/* En-tête avec infos candidat */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        {app.applicant.profile?.avatar ? (
                                            <img
                                                src={app.applicant.profile.avatar}
                                                alt={`${app.applicant.firstName} ${app.applicant.lastName}`}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {app.applicant.firstName} {app.applicant.lastName}
                                        </h4>
                                        <p className="text-sm text-gray-500">{app.job?.title}</p>
                                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center">
                                                <Mail className="h-3 w-3 mr-1" />
                                                {app.applicant.email}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatDate && formatDate(app.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor && getStatusColor(app.status)}`}>
                                    {getStatusText && getStatusText(app.status)}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center space-x-2">
                                    {app.resume && onDownloadCV && (
                                        <button
                                            onClick={() => onDownloadCV(app)}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <Download className="h-3 w-3 mr-1" />
                                            Resume
                                        </button>
                                    )}

                                    <button className="inline-flex items-center px-3 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </button>
                                </div>

                                {app.status === 'pending' && onStatusUpdate && (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onStatusUpdate(app._id, 'shortlisted')}
                                            className="inline-flex items-center px-3 py-1 border border-green-300 rounded text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => onStatusUpdate(app._id, 'rejected')}
                                            className="inline-flex items-center px-3 py-1 border border-red-300 rounded text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100"
                                        >
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RecentJobs = ({ jobs }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">My Job Posts</h3>
                <Link to="/my-jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No job posts yet</p>
                    <button
                        onClick={() => navigate('/create-job')}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Create First Job
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.slice(0, 5).map(job => (
                        <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">{job.title}</h4>
                                <p className="text-sm text-gray-500">{job.location}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    {job.applicationsCount || 0} applications
                                </span>
                                <StatusBadge status={job.status} />
                                <div className="flex space-x-1">
                                    <Link to={`/jobs/${job._id}/applications`} className="text-blue-600 hover:text-blue-800">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                    <Link to={`/jobs/${job._id}/edit`} className="text-gray-600 hover:text-gray-800">
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RecentActivity = ({ activities, isAdmin = false }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isAdmin ? 'System Activity' : 'Recent Activity'}
        </h3>

        {activities.length === 0 ? (
            <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
            </div>
        ) : (
            <div className="space-y-4">
                {activities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <ActivityIcon type={activity.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const QuickActions = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/create-job')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Job
                </button>
                <button
                    onClick={() => navigate('/my-jobs')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Manage Jobs
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Users className="h-4 w-4 mr-2" />
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

const ProfileCompletion = ({ completeness }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
        <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
                <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Progress
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                        {completeness}%
                    </span>
                </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                    style={{ width: `${completeness}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
            </div>
        </div>

        {completeness < 100 && (
            <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Complete your profile to increase your chances:</p>
                <Link to="/profile" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Complete Profile →
                </Link>
            </div>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        pending: { color: 'yellow', text: 'Pending' },
        reviewing: { color: 'blue', text: 'Reviewing' },
        shortlisted: { color: 'green', text: 'Shortlisted' },
        interviewed: { color: 'purple', text: 'Interviewed' },
        offered: { color: 'green', text: 'Offer' },
        rejected: { color: 'red', text: 'Rejected' },
        withdrawn: { color: 'gray', text: 'Withdrawn' },
        active: { color: 'green', text: 'Active' },
        paused: { color: 'yellow', text: 'Paused' },
        closed: { color: 'red', text: 'Closed' },
        draft: { color: 'gray', text: 'Draft' }
    };

    const config = statusConfig[status] || { color: 'gray', text: status };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${config.color === 'green' ? 'bg-green-100 text-green-800' :
                config.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    config.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        config.color === 'red' ? 'bg-red-100 text-red-800' :
                            config.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'}`}
        >
            {config.text}
        </span>
    );
};

const ActivityIcon = ({ type }) => {
    const iconProps = { className: "h-5 w-5 text-gray-400" };

    switch (type) {
        case 'application':
        case 'application_received':
            return <FileText {...iconProps} />;
        case 'saved':
            return <Briefcase {...iconProps} />;
        case 'job_posted':
            return <Plus {...iconProps} />;
        case 'user_registered':
            return <Users {...iconProps} />;
        default:
            return <Activity {...iconProps} />;
    }
};

// Composants placeholder pour les sections manquantes
const JobPerformance = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Performance</h3>
        <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Performance analytics coming soon</p>
        </div>
    </div>
);

const RecommendedJobs = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
        <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Personalized recommendations coming soon</p>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                Browse All Jobs
            </Link>
        </div>
    </div>
);

const SystemOverview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="text-center py-8">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">System analytics coming soon</p>
        </div>
    </div>
);

const PlatformMetrics = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Metrics</h3>
        <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Detailed metrics coming soon</p>
        </div>
    </div>
);

const QuickLinks = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
            <Link to="/admin/users" className="block text-blue-600 hover:text-blue-800 text-sm">
                Manage Users
            </Link>
            <Link to="/admin/jobs" className="block text-blue-600 hover:text-blue-800 text-sm">
                Manage Jobs
            </Link>
            <Link to="/admin/companies" className="block text-blue-600 hover:text-blue-800 text-sm">
                Manage Companies
            </Link>
            <Link to="/admin/scraping" className="block text-blue-600 hover:text-blue-800 text-sm">
                Scraping Dashboard
            </Link>
            <Link to="/admin/analytics" className="block text-blue-600 hover:text-blue-800 text-sm">
                Analytics Dashboard
            </Link>
        </div>
    </div>
);

export default DashboardPage;