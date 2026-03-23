import { useState } from 'react';
import {
    Briefcase,
    Eye,
    GraduationCap
} from 'lucide-react';

// Données de démonstration pour les candidatures
const demoApplications = [
    {
        _id: 'app1',
        applicant: {
            _id: 'user1',
            firstName: 'Ahmed',
            lastName: 'Benali',
            email: 'ahmed.benali@email.com',
            profile: {
                phone: '+212 6 12 34 56 78',
                location: 'Casablanca, Maroc',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                bio: 'Développeur passionné avec 5 ans d\'expérience en développement web moderne.',
                website: 'https://ahmed-benali.dev',
                linkedin: 'https://linkedin.com/in/ahmed-benali',
                github: 'https://github.com/ahmed-benali'
            }
        },
        job: {
            _id: 'job1',
            title: 'Développeur React Senior',
            company: {
                name: 'TechCorp',
                logo: null,
                location: 'Casablanca, Maroc'
            }
        },
        status: 'pending',
        createdAt: new Date('2024-01-15T10:30:00'),
        coverLetter: `Bonjour,

Je vous écris pour exprimer mon vif intérêt pour le poste de Développeur React Senior au sein de votre équipe. Avec mes 5 années d'expérience en développement web et ma spécialisation en React et l'écosystème JavaScript moderne, je suis convaincu que mon profil correspond parfaitement à vos attentes.

Au cours de ma carrière, j'ai eu l'opportunité de travailler sur de nombreux projets complexes, allant de la création d'applications web single-page à la mise en place d'architectures microservices.

Cordialement,
Ahmed Benali`,
        personalInfo: {
            firstName: 'Ahmed',
            lastName: 'Benali',
            email: 'ahmed.benali@email.com',
            phone: '+212 6 12 34 56 78'
        },
        experience: {
            totalYears: 5,
            relevantYears: 4,
            previousPositions: [
                {
                    title: 'Développeur Full-Stack',
                    company: 'Digital Agency',
                    duration: '2022 - Présent',
                    description: 'Développement d\'applications web avec React, Node.js, et MongoDB.'
                },
                {
                    title: 'Développeur Frontend',
                    company: 'StartupTech',
                    duration: '2020 - 2022',
                    description: 'Création d\'interfaces utilisateur modernes avec React et TypeScript.'
                }
            ]
        },
        skills: [
            { name: 'React', level: 'expert', yearsOfExperience: 4 },
            { name: 'JavaScript', level: 'expert', yearsOfExperience: 5 },
            { name: 'TypeScript', level: 'advanced', yearsOfExperience: 3 },
            { name: 'Node.js', level: 'advanced', yearsOfExperience: 3 }
        ],
        education: [
            {
                degree: 'Master en Informatique',
                field: 'Génie Logiciel',
                institution: 'Université Hassan II',
                graduationYear: 2019,
                gpa: 3.8
            }
        ],
        languages: [
            { name: 'Arabe', proficiency: 'native' },
            { name: 'Français', proficiency: 'fluent' },
            { name: 'Anglais', proficiency: 'fluent' }
        ],
        expectedSalary: {
            amount: 50000,
            currency: 'MAD',
            period: 'yearly'
        },
        resume: {
            filename: 'ahmed_benali_cv.pdf',
            originalName: 'CV Ahmed Benali.pdf',
            url: '#'
        },
        notes: {
            recruiterNotes: ''
        },
        timeline: [
            {
                status: 'submitted',
                date: new Date('2024-01-15T10:30:00'),
                title: 'Candidature soumise',
                description: 'La candidature a été soumise avec succès'
            }
        ],
        compatibilityScore: 85
    },
    {
        _id: 'app2',
        applicant: {
            _id: 'user2',
            firstName: 'Fatima',
            lastName: 'El Mansouri',
            email: 'fatima.elmansouri@email.com',
            profile: {
                phone: '+212 6 87 65 43 21',
                location: 'Rabat, Maroc',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=150&h=150&fit=crop&crop=face'
            }
        },
        job: {
            _id: 'job1',
            title: 'Développeur React Senior',
            company: { name: 'TechCorp', logo: null }
        },
        status: 'shortlisted',
        createdAt: new Date('2024-01-10'),
        coverLetter: 'Avec mes 7 ans d\'expérience...',
        personalInfo: {
            firstName: 'Fatima',
            lastName: 'El Mansouri',
            email: 'fatima.elmansouri@email.com',
            phone: '+212 6 87 65 43 21'
        },
        skills: [
            { name: 'Vue.js', level: 'expert' },
            { name: 'React', level: 'advanced' }
        ],
        resume: {
            filename: 'fatima_elmansouri_cv.pdf',
            originalName: 'CV Fatima El Mansouri.pdf',
            url: '#'
        }
    }
];

const demoJobs = [
    {
        _id: 'job1',
        title: 'Développeur React Senior',
        location: 'Casablanca, Maroc',
        type: 'full-time',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        applicationsCount: 12
    },
    {
        _id: 'job2',
        title: 'Designer UX/UI',
        location: 'Rabat, Maroc',
        type: 'full-time',
        status: 'active',
        createdAt: new Date('2023-12-20'),
        applicationsCount: 8
    }
];

const IntegratedDashboard = () => {
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' ou 'application-details'
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [applications, setApplications] = useState(demoApplications);
    const [activeTab, setActiveTab] = useState('overview');

    // Statistiques calculées
    const stats = {
        totalJobs: demoJobs.length,
        activeJobs: demoJobs.filter(job => job.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        shortlistedApplications: applications.filter(app => app.status === 'shortlisted').length
    };

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setCurrentView('application-details');
        setActiveTab('overview');
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedApplication(null);
    };

    const handleStatusUpdate = (applicationId, newStatus) => {
        setApplications(apps =>
            apps.map(app =>
                app._id === applicationId
                    ? { ...app, status: newStatus }
                    : app
            )
        );

        // Mettre à jour l'application sélectionnée si c'est la même
        if (selectedApplication && selectedApplication._id === applicationId) {
            setSelectedApplication(prev => ({
                ...prev,
                status: newStatus,
                timeline: [
                    ...prev.timeline,
                    {
                        status: newStatus,
                        date: new Date(),
                        title: `Statut mis à jour vers ${getStatusText(newStatus)}`,
                        description: `Le statut de la candidature a été changé vers ${getStatusText(newStatus)}`
                    }
                ]
            }));
        }
    };

    const downloadCV = (application) => {
        alert(`Téléchargement du CV de ${application.applicant.firstName} ${application.applicant.lastName}`);
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
            active: 'bg-green-100 text-green-800',
            paused: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'En attente',
            reviewing: 'En révision',
            shortlisted: 'Présélectionné',
            interviewed: 'Entretien passé',
            offered: 'Offre envoyée',
            rejected: 'Rejeté',
            withdrawn: 'Retiré',
            active: 'Actif',
            paused: 'En pause'
        };
        return texts[status] || status;
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'reviewing':
                return <Eye className="h-4 w-4" />;
            case 'shortlisted':
                return <CheckCircle className="h-4 w-4" />;
            case 'interviewed':
                return <MessageSquare className="h-4 w-4" />;
            case 'offered':
                return <Award className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getSkillLevelColor = (level) => {
        const colors = {
            beginner: 'bg-gray-100 text-gray-800',
            intermediate: 'bg-blue-100 text-blue-800',
            advanced: 'bg-purple-100 text-purple-800',
            expert: 'bg-green-100 text-green-800'
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };

    const getProficiencyColor = (proficiency) => {
        const colors = {
            basic: 'bg-gray-100 text-gray-800',
            conversational: 'bg-blue-100 text-blue-800',
            fluent: 'bg-green-100 text-green-800',
            native: 'bg-emerald-100 text-emerald-800'
        };
        return colors[proficiency] || 'bg-gray-100 text-gray-800';
    };

    // Rendu du dashboard principal
    if (currentView === 'dashboard') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Employeur</h1>
                    <p className="text-gray-600 mt-2">
                        Bienvenue ! Gérez vos offres et candidatures.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Mes Offres"
                        value={stats.totalJobs}
                        icon={<Briefcase className="h-8 w-8" />}
                        color="blue"
                    />
                    <StatCard
                        title="Offres Actives"
                        value={stats.activeJobs}
                        icon={<CheckCircle className="h-8 w-8" />}
                        color="green"
                    />
                    <StatCard
                        title="Candidatures"
                        value={stats.totalApplications}
                        icon={<FileText className="h-8 w-8" />}
                        color="purple"
                    />
                    <StatCard
                        title="En Attente"
                        value={stats.pendingApplications}
                        icon={<Clock className="h-8 w-8" />}
                        color="orange"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Candidatures récentes */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Candidatures Récentes</h3>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Voir tout
                                </button>
                            </div>

                            <div className="space-y-4">
                                {applications.slice(0, 3).map(app => (
                                    <div key={app._id} className="border border-gray-200 rounded-lg p-4">
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
                                                            {formatDate(app.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                {getStatusText(app.status)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                {app.resume && (
                                                    <button
                                                        onClick={() => downloadCV(app)}
                                                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        CV
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleViewApplication(app)}
                                                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Voir Détails
                                                </button>
                                            </div>

                                            {app.status === 'pending' && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                                        className="inline-flex items-center px-3 py-1 border border-green-300 rounded text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                                    >
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
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
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer une Offre
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Gérer les Offres
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Rendu de la page de détails
    if (currentView === 'application-details' && selectedApplication) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleBackToDashboard}
                                    className="flex items-center text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="h-5 w-5 mr-1" />
                                    Retour au dashboard
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}
                                    </h1>
                                    <p className="text-gray-600">Candidature pour {selectedApplication.job.title}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status)}`}>
                                    {getStatusIcon(selectedApplication.status)}
                                    <span className="ml-1">{getStatusText(selectedApplication.status)}</span>
                                </div>
                                {selectedApplication.compatibilityScore && (
                                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                        <Star className="h-4 w-4 text-blue-600 mr-1" />
                                        <span className="text-blue-800 font-medium">{selectedApplication.compatibilityScore}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Navigation par onglets */}
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6">
                                        {[
                                            { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
                                            { id: 'experience', label: 'Expérience', icon: Briefcase },
                                            { id: 'education', label: 'Formation', icon: GraduationCap }
                                        ].map(tab => {
                                            // eslint-disable-next-line unused-imports/no-unused-vars
                                            const Icon = tab.icon;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                                        activeTab === tab.id
                                                            ? 'border-blue-500 text-blue-600'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4 mr-2" />
                                                    {tab.label}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            {/* Lettre de motivation */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lettre de motivation</h3>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                                        {selectedApplication.coverLetter}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Compétences */}
                                            {selectedApplication.skills && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Compétences</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedApplication.skills.map((skill, index) => (
                                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                <span className="font-medium text-gray-900">{skill.name}</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                                                                        {skill.level}
                                                                    </span>
                                                                    {skill.yearsOfExperience && (
                                                                        <span className="text-sm text-gray-500">
                                                                            {skill.yearsOfExperience} an{skill.yearsOfExperience > 1 ? 's' : ''}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Langues */}
                                            {selectedApplication.languages && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Langues</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {selectedApplication.languages.map((language, index) => (
                                                            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                                                <div className="font-medium text-gray-900">{language.name}</div>
                                                                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(language.proficiency)}`}>
                                                                    {language.proficiency}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'experience' && selectedApplication.experience && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Expérience professionnelle</h3>
                                            <div className="space-y-6">
                                                {selectedApplication.experience.previousPositions?.map((position, index) => (
                                                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{position.title}</h4>
                                                                <p className="text-blue-600 font-medium">{position.company}</p>
                                                                <p className="text-sm text-gray-500">{position.duration}</p>
                                                            </div>
                                                            <Briefcase className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <p className="mt-2 text-gray-700">{position.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'education' && selectedApplication.education && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Formation</h3>
                                            <div className="space-y-6">
                                                {selectedApplication.education.map((education, index) => (
                                                    <div key={index} className="border-l-4 border-green-200 pl-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{education.degree}</h4>
                                                                <p className="text-green-600 font-medium">{education.field}</p>
                                                                <p className="text-blue-600">{education.institution}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    Diplômé en {education.graduationYear}
                                                                    {education.gpa && ` • Note: ${education.gpa}/4.0`}
                                                                </p>
                                                            </div>
                                                            <GraduationCap className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Informations du candidat */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="text-center mb-4">
                                    {selectedApplication.applicant.profile?.avatar ? (
                                        <img
                                            src={selectedApplication.applicant.profile.avatar}
                                            alt={`${selectedApplication.applicant.firstName} ${selectedApplication.applicant.lastName}`}
                                            className="h-20 w-20 rounded-full mx-auto object-cover"
                                        />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                                            <User className="h-10 w-10 text-gray-600" />
                                        </div>
                                    )}
                                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                                        {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}
                                    </h3>
                                    <p className="text-gray-600">{selectedApplication.job.title}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {selectedApplication.applicant.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {selectedApplication.personalInfo.phone}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {selectedApplication.applicant.profile?.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Candidature le {formatDate(selectedApplication.createdAt)}
                                    </div>
                                    {selectedApplication.expectedSalary && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            {selectedApplication.expectedSalary.amount.toLocaleString()} {selectedApplication.expectedSalary.currency}
                                        </div>
                                    )}
                                </div>

                                {/* Liens externes */}
                                {(selectedApplication.applicant.profile?.website || selectedApplication.applicant.profile?.linkedin || selectedApplication.applicant.profile?.github) && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Liens</h4>
                                        <div className="space-y-2">
                                            {selectedApplication.applicant.profile?.website && (
                                                <a
                                                    href={selectedApplication.applicant.profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    Site web
                                                </a>
                                            )}
                                            {selectedApplication.applicant.profile?.linkedin && (
                                                <a
                                                    href={selectedApplication.applicant.profile.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <Building className="h-4 w-4 mr-2" />
                                                    LinkedIn
                                                </a>
                                            )}
                                            {selectedApplication.applicant.profile?.github && (
                                                <a
                                                    href={selectedApplication.applicant.profile.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    <BookOpen className="h-4 w-4 mr-2" />
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    {selectedApplication.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedApplication._id, 'shortlisted')}
                                                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Présélectionner
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(selectedApplication._id, 'rejected')}
                                                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Rejeter
                                            </button>
                                        </>
                                    )}

                                    {selectedApplication.status === 'shortlisted' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApplication._id, 'interviewed')}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Programmer entretien
                                        </button>
                                    )}

                                    {selectedApplication.status === 'interviewed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(selectedApplication._id, 'offered')}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                                        >
                                            <Award className="h-4 w-4 mr-2" />
                                            Faire une offre
                                        </button>
                                    )}

                                    <button
                                        onClick={() => downloadCV(selectedApplication)}
                                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Télécharger CV
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique</h3>
                                <div className="space-y-4">
                                    {selectedApplication.timeline?.map((event, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    {getStatusIcon(event.status)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                <p className="text-sm text-gray-500">{event.description}</p>
                                                <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Composant StatCard
// eslint-disable-next-line unused-imports/no-unused-vars
const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        orange: 'bg-orange-500'
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
                </div>
                <div className={`${colorClasses[color]} text-white p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default IntegratedDashboard;