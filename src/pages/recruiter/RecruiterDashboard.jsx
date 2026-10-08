import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Users, ChevronRight, BarChart2 } from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

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

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const RecruiterDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getRecruiterAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10">Loading dashboard...</div>;
  }

  const jobChartData = analytics?.jobStatistics?.map(j => ({
    name: j.jobTitle.length > 15 ? j.jobTitle.substring(0, 15) + '...' : j.jobTitle,
    applications: j.applicationCount
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your job postings and applicants efficiently.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
          <Briefcase className="w-4 h-4"/> Post a New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Open Jobs" value={analytics?.openJobs || 0} icon={Briefcase} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Total Applications" value={analytics?.totalApplications || 0} icon={FileText} colorClass="bg-purple-50 text-purple-600" />
        <StatCard title="Shortlisted" value={analytics?.shortlisted || 0} icon={CheckCircle} colorClass="bg-green-50 text-green-600" />
        <StatCard title="Interviews" value={analytics?.interviews || 0} icon={Users} colorClass="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Applications per Job</h2>
            <Link to="/recruiter/jobs" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
              View all jobs <ChevronRight className="w-4 h-4"/>
            </Link>
          </div>

          {jobChartData.length > 0 ? (
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="applications" name="Applications" radius={[4, 4, 0, 0]}>
                    {jobChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <BarChart2 className="w-12 h-12 text-gray-300 mb-2"/>
              <p>No job statistics available.</p>
              <p className="text-sm">Post jobs and receive applications to see charts.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total Jobs Created</span>
                <span className="font-bold">{analytics?.totalJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Closed Jobs</span>
                <span className="font-bold">{analytics?.closedJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Candidates Selected</span>
                <span className="font-bold">{analytics?.selected || 0}</span>
              </div>
            </div>
            <Link to="/recruiter/applications" className="mt-4 block w-full text-center text-sm text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">
              Review Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
