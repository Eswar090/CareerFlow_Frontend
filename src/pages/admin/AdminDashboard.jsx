import React, { useState, useEffect } from 'react';
import { Users, Building, Briefcase, FileText, Calendar, TrendingUp } from 'lucide-react';
import adminService from '../../services/adminService';
import analyticsService from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b', '#06b6d4'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getDashboardStats(),
        analyticsService.getAdminAnalytics()
      ]);
      setStats(statsRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  // Parse analytics data for charts
  const userRoleData = analytics?.userDistribution?.map(d => ({ name: d.status, value: d.count })) || [];
  const jobStatusData = analytics?.jobStatusDistribution?.map(d => ({ name: d.status, value: d.count })) || [];
  const appStatusData = analytics?.applicationStatusDistribution?.map(d => ({ name: d.status, value: d.count })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500 mt-1">Overview of the CareerFlow platform activity and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Students" value={stats?.totalStudents || 0} icon={Users} colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard title="Companies" value={stats?.totalCompanies || 0} icon={Building} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Active Jobs" value={stats?.totalActiveJobs || 0} icon={Briefcase} colorClass="bg-green-50 text-green-600" />
        <StatCard title="Applications" value={stats?.totalApplications || 0} icon={FileText} colorClass="bg-yellow-50 text-yellow-600" />
        <StatCard title="Interviews" value={stats?.totalInterviews || 0} icon={Calendar} colorClass="bg-pink-50 text-pink-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">User Roles Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userRoleData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {userRoleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Status Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Job Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={jobStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {jobStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Application Status Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="value" name="Applications" radius={[4, 4, 0, 0]}>
                  {appStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
