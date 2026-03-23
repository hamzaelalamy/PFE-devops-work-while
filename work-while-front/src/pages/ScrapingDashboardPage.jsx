import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    triggerScraping,
    getScrapingHistory,
    getScrapedJobs,
    approveScrapedJob,
    rejectScrapedJob,
    bulkApproveJobs,
    bulkRejectJobs,
    clearStatus
} from '../redux/slices/scrapingSlice';

const ScrapingDashboardPage = () => {
    const dispatch = useDispatch();
    const {
        history,
        scrapedJobs,
        loading,
        error,
        scrapingStatus
    } = useSelector((state) => state.scraping);

    const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'history'
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        dispatch(getScrapedJobs());
        dispatch(getScrapingHistory());
    }, [dispatch]);

    const handleTrigger = (source) => {
        dispatch(triggerScraping(source));
    };

    const handleApprove = async (id) => {
        if (window.confirm('Are you sure you want to approve/publish this job?')) {
            try {
                await dispatch(approveScrapedJob(id)).unwrap();
                alert('Job approved and published successfully!');
                dispatch(getScrapedJobs()); // Refresh the list
            } catch (error) {
                console.error('Approve error:', error);
                alert(`Failed to approve job: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to delete this job permanently?')) {
            try {
                await dispatch(rejectScrapedJob(id)).unwrap();
                alert('Job rejected and deleted successfully!');
                dispatch(getScrapedJobs()); // Refresh the list
            } catch (error) {
                console.error('Reject error:', error);
                alert(`Failed to reject job: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleSelectJob = (jobId) => {
        setSelectedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedJobs([]);
        } else {
            setSelectedJobs(scrapedJobs.map(job => job._id));
        }
        setSelectAll(!selectAll);
    };

    const handleBulkApprove = async () => {
        console.log('[BULK APPROVE] Function called');
        console.log('[BULK APPROVE] Selected jobs:', selectedJobs);
        console.log('[BULK APPROVE] Selected jobs length:', selectedJobs.length);

        if (selectedJobs.length === 0) {
            console.log('[BULK APPROVE] No jobs selected, showing alert');
            alert('Please select at least one job to approve.');
            return;
        }

        console.log('[BULK APPROVE] Processing bulk approval...');
        try {
            console.log('[BULK APPROVE] Calling bulkApproveJobs with:', selectedJobs);
            const result = await dispatch(bulkApproveJobs(selectedJobs)).unwrap();
            console.log('[BULK APPROVE] Success! Result:', result);
            alert(`${selectedJobs.length} job(s) approved and published successfully!`);
            setSelectedJobs([]);
            setSelectAll(false);
            dispatch(getScrapedJobs());
        } catch (error) {
            console.error('[BULK APPROVE] Error occurred:', error);
            console.error('[BULK APPROVE] Error message:', error.message);
            console.error('[BULK APPROVE] Error stack:', error.stack);
            alert(`Failed to approve jobs: ${error.message || 'Unknown error'}`);
        }
    };

    const handleBulkReject = async () => {
        console.log('[BULK REJECT] Function called');
        console.log('[BULK REJECT] Selected jobs:', selectedJobs);
        console.log('[BULK REJECT] Selected jobs length:', selectedJobs.length);

        if (selectedJobs.length === 0) {
            console.log('[BULK REJECT] No jobs selected, showing alert');
            alert('Please select at least one job to reject.');
            return;
        }

        console.log('[BULK REJECT] Processing bulk rejection...');
        try {
            console.log('[BULK REJECT] Calling bulkRejectJobs with:', selectedJobs);
            const result = await dispatch(bulkRejectJobs(selectedJobs)).unwrap();
            console.log('[BULK REJECT] Success! Result:', result);
            alert(`${selectedJobs.length} job(s) rejected and deleted successfully!`);
            setSelectedJobs([]);
            setSelectAll(false);
            dispatch(getScrapedJobs());
        } catch (error) {
            console.error('[BULK REJECT] Error occurred:', error);
            console.error('[BULK REJECT] Error message:', error.message);
            console.error('[BULK REJECT] Error stack:', error.stack);
            alert(`Failed to reject jobs: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Database className="w-8 h-8 text-blue-600" />
                    Scraping Dashboard
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch(getScrapedJobs())}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Control Panel */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Control Center</h2>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => handleTrigger('maroc-annonce')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" /> Scrape MarocAnnonce
                    </button>
                    <button
                        onClick={() => handleTrigger('rekrute')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" /> Scrape Rekrute
                    </button>
                    <button
                        onClick={() => handleTrigger('all')}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        <Play className="w-4 h-4" /> Scrape ALL
                    </button>
                </div>

                {scrapingStatus && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex justify-between items-center">
                        <span>{scrapingStatus}</span>
                        <button onClick={() => dispatch(clearStatus())}><X className="w-4 h-4" /></button>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                        Error: {error}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'jobs' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Draft Jobs ({scrapedJobs.length})
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'history' ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('history')}
                >
                    Execution History
                </button>
            </div>

            {/* Content */}
            {activeTab === 'jobs' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {scrapedJobs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No drafted jobs found. Start scraping!</div>
                    ) : (
                        <>
                            {/* Bulk Actions Bar */}
                            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {selectedJobs.length} of {scrapedJobs.length} selected
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleBulkApprove}
                                        disabled={selectedJobs.length === 0}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Approve Selected
                                    </button>
                                    <button
                                        onClick={handleBulkReject}
                                        disabled={selectedJobs.length === 0}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject Selected
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 border-b w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                        </th>
                                        <th className="p-4 border-b">Title</th>
                                        <th className="p-4 border-b">Company/Source</th>
                                        <th className="p-4 border-b">Location</th>
                                        <th className="p-4 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scrapedJobs.map((job) => (
                                        <tr key={job._id} className="hover:bg-gray-50">
                                            <td className="p-4 border-b">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedJobs.includes(job._id)}
                                                    onChange={() => handleSelectJob(job._id)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                            </td>
                                            <td className="p-4 border-b font-medium">
                                                <a href={job.originalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {job.title}
                                                </a>
                                            </td>
                                            <td className="p-4 border-b">
                                                {job.source}
                                            </td>
                                            <td className="p-4 border-b">{job.location}</td>
                                            <td className="p-4 border-b flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(job._id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Approve & Publish"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(job._id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject & Delete"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b">Date</th>
                                <th className="p-4 border-b">Source</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Found/Inserted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b text-sm text-gray-600">
                                        {new Date(log.startTime).toLocaleString()}
                                    </td>
                                    <td className="p-4 border-b font-medium">{log.source}</td>
                                    <td className="p-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs ${log.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            log.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b">
                                        {log.jobsFound} / {log.jobsInserted}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ScrapingDashboardPage;
