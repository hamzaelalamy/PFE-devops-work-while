import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchMarketOverview,
    fetchTopSectors,
    fetchTopSkills,
    fetchJobTrends
} from '../redux/slices/analyticsSlice';

import { Activity, TrendingUp, Users, Briefcase, Building } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

 
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-2 rounded-full opacity-20`} style={{ backgroundColor: color }}>
                <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
        </div>
    </div>
);

const AnalyticsDashboardPage = () => {
    const dispatch = useDispatch();
    const { overview, sectors, skills, trends, loading } = useSelector((state) => state.analytics);

    useEffect(() => {
        dispatch(fetchMarketOverview());
        dispatch(fetchTopSectors());
        dispatch(fetchTopSkills());
        dispatch(fetchJobTrends());
    }, [dispatch]);

    if (loading || !overview) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-20 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Activity className="w-8 h-8 text-blue-600" />
                Market Insights Dashboard
            </h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Jobs" value={overview.totalJobs} icon={Briefcase} color="#0088FE" />
                <StatCard title="Active Companies" value={overview.totalCompanies} icon={Building} color="#00C49F" />
                <StatCard title="Total Candidates" value={overview.totalCandidates} icon={Users} color="#FFBB28" />
                <StatCard title="Total Applications" value={overview.totalApplications} icon={TrendingUp} color="#FF8042" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Salary Trends / Sectors */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Top Sectors by Volume & Salary</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={sectors}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="count" name="Job Count" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="avgSalary" name="Avg Salary (MAD)" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Source Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Internal vs External Data Source</h2>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={overview.sourceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {overview.sourceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Job Trends Over Time */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Job Posting Velocity (Last 30 Days)</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={trends}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Skills Cloud */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Most In-Demand Skills</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={skills}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="_id" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#ff7300" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboardPage;
