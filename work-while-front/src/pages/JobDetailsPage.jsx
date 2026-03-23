import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';
import applicationService from '../services/applicationService';

const JobDetailsPage = ({ isEditing = false, showApplications = false }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobData = await jobService.getJobById(id);
        console.log('Fetched job data:', jobData); // Debug log
        setJob(jobData);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details');
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkJobStatus = async () => {
      if (isAuthenticated && job && user) {
        try {
          // Only check applications for candidates
          if (user.role === 'candidate') {
            // Check if user has already applied to this job
            const applications = await applicationService.getMyApplications();
            console.log('User applications:', applications); // Debug log

            // Corrected: compare with job._id (string) instead of parseInt(id)
            const applied = applications.some(app => app.job?._id === id);
            setHasApplied(applied);
          }

          // Only check saved jobs for candidates
          if (user.role === 'candidate') {
            // Check if job is saved
            const savedJobs = await jobService.getSavedJobs();
            console.log('Saved jobs:', savedJobs); // Debug log

            // Corrected: compare with savedJob._id instead of savedJob.jobId
            const saved = savedJobs.some(savedJob => savedJob._id === id);
            setIsSaved(saved);
          }
        } catch (err) {
          console.error('Error checking job status:', err);
          // Don't show error to user for these non-critical checks
        }
      }
    };

    checkJobStatus();
  }, [isAuthenticated, id, job, user]);

  const handleApply = () => {
    // Check if it's a scraped job with an external link
    if (job.isScraped && (job.originalLink || job.url)) {
      window.open(job.originalLink || job.url, '_blank');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}/apply` } });
      return;
    }

    if (user?.needsProfileSetup) {
      navigate('/profile-setup');
      return;
    }

    if (hasApplied) {
      return;
    }

    navigate(`/jobs/${id}/apply`);
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    // Only candidates can save jobs
    if (user?.role !== 'candidate') {
      setError('Only candidates can save jobs');
      return;
    }

    try {
      if (isSaved) {
        await jobService.removeSavedJob(id);
        setIsSaved(false);
      } else {
        await jobService.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to save job');
      console.error('Error saving job:', err);
    }
  };

  const handleBackToJobs = () => {
    navigate('/jobs');
  };

  // Handle the case when we're in editing mode (protected route)
  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <h1 className="text-2xl font-bold mb-4">Edit Job Listing</h1>
        <p className="text-gray-600">Job editing functionality to be implemented</p>
      </div>
    );
  }

  // Handle the case when we're showing applications (protected route)
  if (showApplications) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <h1 className="text-2xl font-bold mb-4">Applications for this Job</h1>
        <p className="text-gray-600">Applications list to be implemented</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBackToJobs}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 text-center py-16 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-medium text-gray-600">Job not found</h2>
        <p className="mt-4 text-gray-500">The job listing you're looking for doesn't exist or has been removed</p>
        <button
          onClick={handleBackToJobs}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Back to Job Listings
        </button>
      </div>
    );
  }

  // Format date safely - use createdAt instead of postedDate
  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Date not available';

  // Format salary safely
  const formatSalary = () => {
    if (job.salary?.min && job.salary?.max) {
      return `${job.salary.min} - ${job.salary.max} ${job.salary.currency || 'USD'}`;
    } else if (job.salary?.min) {
      return `From ${job.salary.min} ${job.salary.currency || 'USD'}`;
    } else if (job.salary?.max) {
      return `Up to ${job.salary.max} ${job.salary.currency || 'USD'}`;
    }
    return 'Salary not specified';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
      <div className="mb-6">
        <button
          onClick={handleBackToJobs}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Jobs
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.company?.name || 'Company Name'}
                </h2>
                <p className="flex items-center text-gray-600 mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {job.location}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <span className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800">
                {job.status}
              </span>
              <p className="mt-2 text-gray-700 font-semibold text-lg">
                {formatSalary()}
              </p>
              {hasApplied && (
                <span className="mt-2 px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
                  You've Applied
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Posted on {formattedDate}
            </div>
            {job.applicationsCount !== undefined && (
              <div className="flex items-center ml-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                {job.applicationsCount} applications
              </div>
            )}
            {job.views !== undefined && (
              <div className="flex items-center ml-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {job.views} views
              </div>
            )}
            {job.type && (
              <div className="flex items-center ml-4">
                <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                  {job.type}
                </span>
              </div>
            )}
            {job.experienceLevel && (
              <div className="flex items-center ml-4">
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                  {job.experienceLevel} level
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </section>

          {job.requirements && job.requirements.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index} className="leading-relaxed">
                    {typeof req === 'object' ? req.name || req.description || 'Requirement' : req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="leading-relaxed">
                    {typeof benefit === 'object' ? benefit.name || benefit.description || 'Benefit' : benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.company?.description && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About the Company</h3>
              <p className="text-gray-700 leading-relaxed">
                {job.company.description}
              </p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800"
                >
                  Visit company website
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              )}
            </section>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Show Apply button only for candidates */}
            {(!user || user.role === 'candidate') && (
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`px-6 py-3 ${hasApplied
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium rounded-full flex-1 sm:flex-none sm:min-w-40 text-center`}
              >
                {hasApplied ? 'Already Applied' : (job.isScraped ? 'Apply on Company Site' : 'Apply Now')}
              </button>
            )}

            {/* Show Save button only for candidates */}
            {(!user || user.role === 'candidate') && (
              <button
                onClick={handleSaveJob}
                className={`px-6 py-3 ${isSaved
                  ? 'border border-blue-600 text-blue-700 bg-blue-50'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } font-medium rounded-full flex-1 sm:flex-none sm:min-w-40 text-center`}
              >
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
            )}

            {/* Show different buttons for employers */}
            {user?.role === 'employer' && (
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/jobs/${id}/applications`)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full"
                >
                  View Applications
                </button>
                <button
                  onClick={() => navigate(`/jobs/${id}/edit`)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-full"
                >
                  Edit Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;