import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building, Briefcase, FileText, Calendar, 
  TrendingUp, ShieldCheck, Award, ArrowRight, Layers
} from 'lucide-react';
import adminService from '../../services/adminService';
import analyticsService from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, gradientClass }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125`}></div>
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#f43f5e', '#64748b'];

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-semibold">
        {error}
      </div>
    );
  }

  // Parse analytics data for charts
  const userRoleData = analytics?.userDistribution?.map(d => ({ name: d.status, value: d.count })) || [];
  const jobStatusData = analytics?.jobStatusDistribution?.map(d => ({ name: d.status, value: d.count })) || [];
  const appStatusData = analytics?.applicationStatusDistribution?.map(d => ({ name: d.status, value: d.count })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
            Platform Governance & Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time telemetry, user distribution, and institutional recruitment metrics.
          </p>
        </div>

        <Link 
          to="/admin/placement-drives" 
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 self-start"
        >
          <Award className="w-4 h-4" />
          Campus Placement Drives
        </Link>
      </div>

      {/* Stat Cards 6-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          gradientClass="from-blue-600 to-indigo-600" 
        />
        <StatCard 
          title="Students" 
          value={stats?.totalStudents || 0} 
          icon={Users} 
          gradientClass="from-indigo-600 to-violet-600" 
        />
        <StatCard 
          title="Companies" 
          value={stats?.totalCompanies || 0} 
          icon={Building} 
          gradientClass="from-violet-600 to-purple-600" 
        />
        <StatCard 
          title="Active Jobs" 
          value={stats?.totalActiveJobs || 0} 
          icon={Briefcase} 
          gradientClass="from-emerald-500 to-teal-600" 
        />
        <StatCard 
          title="Applications" 
          value={stats?.totalApplications || 0} 
          icon={FileText} 
          gradientClass="from-cyan-600 to-blue-600" 
        />
        <StatCard 
          title="Interviews" 
          value={stats?.totalInterviews || 0} 
          icon={Calendar} 
          gradientClass="from-amber-500 to-orange-600" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Distribution Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">User Roles Ratio</h2>
          <p className="text-xs text-slate-400 mb-6">Distribution between Students, Recruiters, and Administrators.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={userRoleData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: '#0f172a', 
                    color: '#ffffff', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Status Distribution */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Job Status Distribution</h2>
          <p className="text-xs text-slate-400 mb-6">Active vs Draft vs Closed postings on the platform.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={jobStatusData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: '#0f172a', 
                    color: '#ffffff', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Funnel Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Global Application Pipeline Volume</h2>
          <p className="text-xs text-slate-400 mb-6">Total candidates currently in each recruitment stage.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appStatusData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    backgroundColor: '#0f172a', 
                    color: '#ffffff', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                  }}
                  itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" name="Candidates" radius={[8, 8, 0, 0]}>
                  {appStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
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
