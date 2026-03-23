import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageJobsPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(Array.isArray(response.data.data) ? response.data.data : (response.data.data.data || []));
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleJobStatus = async (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';

        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_URL}/jobs/${jobId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchJobs();
            alert(`Job ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJobs();
            alert('Job deleted successfully');
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    Manage Jobs
                </h1>
                <button
                    onClick={() => navigate('/post-job')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create New Job
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading jobs...</div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No jobs found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left font-semibold">Title</th>
                                <th className="p-4 text-left font-semibold">Company</th>
                                <th className="p-4 text-left font-semibold">Location</th>
                                <th className="p-4 text-left font-semibold">Type</th>
                                <th className="p-4 text-left font-semibold">Status</th>
                                <th className="p-4 text-left font-semibold">Applications</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job) => (
                                <tr key={job._id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">{job.title}</div>
                                        {job.isScraped && (
                                            <span className="text-xs text-orange-600">Scraped</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {job.company?.name || job.companyName || 'N/A'}
                                    </td>
                                    <td className="p-4 text-gray-600">{job.location}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                                            job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                                job.status === 'closed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {job.applications?.length || 0}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/jobs/${job._id}`)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                title="View Job"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleJobStatus(job._id, job.status)}
                                                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                                title={job.status === 'active' ? 'Pause Job' : 'Activate Job'}
                                            >
                                                {job.status === 'active' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete Job"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageJobsPage;
