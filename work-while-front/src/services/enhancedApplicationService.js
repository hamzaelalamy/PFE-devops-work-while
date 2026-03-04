// src/services/enhancedApplicationService.js - VERSION CORRIGÉE
import apiClient, { API_ENDPOINTS, handleApiError } from '../config/apiConfig';
import jobService from './jobService';

const enhancedApplicationService = {
    /**
     * Get applications for all employer's jobs
     * Utilise le nouvel endpoint /applications/employer/all
     */
    getAllMyJobApplications: async (page = 1, limit = 10, status = null) => {
        try {
            console.log('Fetching all applications for employer jobs');

            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);
            if (status) params.append('status', status);

            // ✅ CORRECTION: Utiliser le bon endpoint
            const response = await apiClient.get(`${API_ENDPOINTS.APPLICATIONS.GET_ALL_EMPLOYER_APPLICATIONS}?${params.toString()}`);
            const { data } = response.data;

            return {
                applications: data.applications || [],
                pagination: data.pagination || {},
                stats: data.stats || {}
            };

        } catch (error) {
            console.error('Error fetching all job applications:', error);

            // ✅ FALLBACK: Si l'endpoint n'existe pas encore, utiliser l'ancienne méthode
            if (error.response?.status === 404) {
                console.warn('Endpoint not found, falling back to individual job queries');
                return await enhancedApplicationService.getAllMyJobApplicationsFallback(page, limit, status);
            }

            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Méthode de fallback si l'endpoint principal n'est pas disponible
     */
    getAllMyJobApplicationsFallback: async (page = 1, limit = 10, status = null) => {
        try {
            // Récupérer tous les jobs de l'employeur
            const myJobs = await jobService.getMyJobs(1, 100);

            if (!myJobs || myJobs.length === 0) {
                return {
                    applications: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 0,
                        totalItems: 0,
                        itemsPerPage: limit
                    }
                };
            }

            // Récupérer les candidatures pour chaque job
            const allApplicationsPromises = myJobs.map(job =>
                enhancedApplicationService.getJobApplications(job._id, 1, 100, status)
                    .catch(error => {
                        console.warn(`Erreur lors de la récupération des candidatures pour le job ${job._id}:`, error);
                        return { applications: [] };
                    })
            );

            const allApplicationsResults = await Promise.all(allApplicationsPromises);

            // Fusionner toutes les candidatures
            let allApplications = [];
            allApplicationsResults.forEach((result, index) => {
                if (result.applications) {
                    const jobInfo = myJobs[index];
                    const applicationsWithJobInfo = result.applications.map(app => ({
                        ...app,
                        job: app.job || jobInfo
                    }));
                    allApplications = allApplications.concat(applicationsWithJobInfo);
                }
            });

            // Trier par date de création (plus récent en premier)
            allApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Appliquer la pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedApplications = allApplications.slice(startIndex, endIndex);

            const pagination = {
                currentPage: page,
                totalPages: Math.ceil(allApplications.length / limit),
                totalItems: allApplications.length,
                itemsPerPage: limit
            };

            return {
                applications: paginatedApplications,
                pagination
            };

        } catch (error) {
            console.error('Error in fallback method:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get applications for a specific job (for employers)
     */
    getJobApplications: async (jobId, page = 1, limit = 10, status = null) => {
        try {
            console.log('Fetching job applications for:', jobId);

            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', limit);
            if (status) params.append('status', status);

            const response = await apiClient.get(`${API_ENDPOINTS.APPLICATIONS.GET_JOB_APPLICATIONS(jobId)}?${params.toString()}`);
            const { data } = response.data;

            return {
                applications: data.applications || [],
                pagination: data.pagination || {},
                job: data.job || null
            };
        } catch (error) {
            console.error('Error fetching job applications:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Update application status (for employers)
     */
    updateApplicationStatus: async (applicationId, status, notes = '') => {
        try {
            console.log('Updating application status:', applicationId, status);

            const payload = { status };
            if (notes.trim()) {
                payload.notes = notes.trim();
            }

            const response = await apiClient.put(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId), payload);
            const { data } = response.data;

            return data.application;
        } catch (error) {
            console.error('Error updating application status:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get application statistics for employer
     * Utilise le nouvel endpoint /applications/employer/stats
     */
    getEmployerApplicationStats: async () => {
        try {
            console.log('Fetching employer application statistics');

            // ✅ CORRECTION: Utiliser le bon endpoint
            const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.GET_EMPLOYER_STATS);
            const { data } = response.data;

            return data.stats || {};
        } catch (error) {
            console.error('Error fetching employer application stats:', error);

            // ✅ FALLBACK: Si l'endpoint n'existe pas, calculer manuellement
            if (error.response?.status === 404) {
                console.warn('Stats endpoint not found, calculating manually');
                return await enhancedApplicationService.getEmployerApplicationStatsFallback();
            }

            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Méthode de fallback pour les statistiques
     */
    getEmployerApplicationStatsFallback: async () => {
        try {
            // Récupérer toutes les candidatures et calculer les stats
            const allApplicationsData = await enhancedApplicationService.getAllMyJobApplications(1, 1000);
            const applications = allApplicationsData.applications || [];

            const stats = {
                totalApplications: applications.length,
                pendingApplications: applications.filter(app => app.status === 'pending').length,
                reviewingApplications: applications.filter(app => app.status === 'reviewing').length,
                shortlistedApplications: applications.filter(app => app.status === 'shortlisted').length,
                interviewedApplications: applications.filter(app => app.status === 'interviewed').length,
                offeredApplications: applications.filter(app => app.status === 'offered').length,
                rejectedApplications: applications.filter(app => app.status === 'rejected').length,
                withdrawnApplications: applications.filter(app => app.status === 'withdrawn').length,
                thisWeekApplications: applications.filter(app => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(app.createdAt) > weekAgo;
                }).length
            };

            return stats;
        } catch (error) {
            console.error('Error in stats fallback method:', error);
            throw error;
        }
    },

    /**
     * Download CV file
     * Utilise le nouvel endpoint /applications/:applicationId/download-cv
     */
    downloadCV: async (applicationId, fileName) => {
        try {
            console.log('Downloading CV for application:', applicationId);

            // ✅ CORRECTION: Utiliser le bon endpoint
            const response = await apiClient.get(
                API_ENDPOINTS.APPLICATIONS.DOWNLOAD_CV(applicationId),
                { responseType: 'blob' }
            );

            // Créer le lien de téléchargement
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'CV.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error downloading CV:', error);

            // ✅ FALLBACK: Si l'endpoint n'existe pas, utiliser l'ancienne méthode
            if (error.response?.status === 404) {
                console.warn('Download endpoint not found, using fallback method');
                return await enhancedApplicationService.downloadCVFallback(applicationId, fileName);
            }

            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Méthode de fallback pour le téléchargement de CV
     */
    downloadCVFallback: async (applicationId, fileName) => {
        try {
            // Récupérer les détails de l'application
            const application = await enhancedApplicationService.getApplicationDetails(applicationId);

            if (!application || !application.resume || !application.resume.url) {
                throw new Error('CV non disponible pour cette candidature');
            }

            // Simulation de téléchargement
            const link = document.createElement('a');
            link.href = application.resume.url;
            link.download = fileName || application.resume.originalName || `CV_${application.applicant.firstName}_${application.applicant.lastName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        } catch (error) {
            console.error('Error in CV download fallback:', error);
            throw new Error('Erreur lors du téléchargement du CV');
        }
    },

    /**
     * Get application details with full candidate info
     */
    getApplicationDetails: async (applicationId) => {
        try {
            console.log('Fetching application details:', applicationId);

            // Pour cette démo, nous utilisons les données des candidatures existantes
            const allApplicationsData = await enhancedApplicationService.getAllMyJobApplications(1, 1000);
            const application = allApplicationsData.applications.find(app => app._id === applicationId);

            if (!application) {
                throw new Error('Candidature non trouvée');
            }

            return application;
        } catch (error) {
            console.error('Error fetching application details:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Add recruiter notes to application
     */
    addRecruiterNotes: async (applicationId, notes) => {
        try {
            console.log('Adding recruiter notes to application:', applicationId);

            // Utiliser l'endpoint de mise à jour du statut avec des notes
            const response = await apiClient.put(
                API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
                { notes }
            );
            const { data } = response.data;

            return data.application;
        } catch (error) {
            console.error('Error adding recruiter notes:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Schedule interview for application
     */
    scheduleInterview: async (applicationId, interviewData) => {
        try {
            console.log('Scheduling interview for application:', applicationId);

            // Mettre à jour le statut à "interviewed" avec des notes sur l'entretien
            const notes = `Entretien programmé pour le ${interviewData.date} à ${interviewData.time}`;

            const response = await apiClient.put(
                API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
                {
                    status: 'interviewed',
                    notes
                }
            );
            const { data } = response.data;

            return data.application;
        } catch (error) {
            console.error('Error scheduling interview:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Search applications with filters
     */
    searchApplications: async (searchParams) => {
        try {
            console.log('Searching applications with params:', searchParams);

            const {
                query = '',
                status = '',
                jobId = '',
                page = 1,
                limit = 10
            } = searchParams;

            // Récupérer toutes les candidatures
            const allApplicationsData = await enhancedApplicationService.getAllMyJobApplications(1, 1000, status);
            let applications = allApplicationsData.applications || [];

            // Appliquer les filtres
            if (query.trim()) {
                const searchTerm = query.toLowerCase();
                applications = applications.filter(app =>
                    app.applicant.firstName.toLowerCase().includes(searchTerm) ||
                    app.applicant.lastName.toLowerCase().includes(searchTerm) ||
                    app.applicant.email.toLowerCase().includes(searchTerm) ||
                    (app.skills && app.skills.some(skill =>
                        skill.name.toLowerCase().includes(searchTerm)
                    ))
                );
            }

            if (jobId) {
                applications = applications.filter(app => app.job._id === jobId);
            }

            // Pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedApplications = applications.slice(startIndex, endIndex);

            const pagination = {
                currentPage: page,
                totalPages: Math.ceil(applications.length / limit),
                totalItems: applications.length,
                itemsPerPage: limit
            };

            return {
                applications: paginatedApplications,
                pagination
            };
        } catch (error) {
            console.error('Error searching applications:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Bulk update application statuses
     */
    bulkUpdateStatus: async (applicationIds, status, notes = '') => {
        try {
            console.log('Bulk updating application statuses:', applicationIds, status);

            const updatePromises = applicationIds.map(id =>
                enhancedApplicationService.updateApplicationStatus(id, status, notes)
            );

            const results = await Promise.all(updatePromises);
            return results;
        } catch (error) {
            console.error('Error bulk updating applications:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    },

    /**
     * Get application timeline/history
     */
    getApplicationTimeline: async (applicationId) => {
        try {
            console.log('Fetching application timeline:', applicationId);

            const application = await enhancedApplicationService.getApplicationDetails(applicationId);

            if (!application) {
                return [];
            }

            // Créer une timeline basée sur les données de l'application
            const timeline = [
                {
                    status: 'submitted',
                    date: application.createdAt,
                    title: 'Candidature soumise',
                    description: 'La candidature a été soumise avec succès'
                }
            ];

            if (application.status !== 'pending') {
                timeline.push({
                    status: application.status,
                    date: application.updatedAt || application.createdAt,
                    title: `Candidature ${application.status}`,
                    description: `Le statut de la candidature a été mis à jour vers ${application.status}`
                });
            }

            return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Error fetching application timeline:', error);
            const errorInfo = handleApiError(error);
            throw new Error(errorInfo.message);
        }
    }
};

export default enhancedApplicationService;