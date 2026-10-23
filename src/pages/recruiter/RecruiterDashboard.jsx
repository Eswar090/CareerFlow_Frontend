import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FileText, CheckCircle, Users, ChevronRight, 
  BarChart2, PlusCircle, Award, Calendar, ArrowRight, Building2
} from 'lucide-react';
import analyticsService from '../../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, gradientClass }) => (
  <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125`}></div>
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-xs text-slate-400 dark:text-slate-400 font-extrabold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const jobChartData = analytics?.jobStatistics?.map(j => ({
    name: j.jobTitle.length > 15 ? j.jobTitle.substring(0, 15) + '...' : j.jobTitle,
    applications: j.applicationCount
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            Recruiter Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Oversee your active vacancies, review applicant pipelines, and manage campus placement drives.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <Link 
            to="/recruiter/placement-drives" 
            className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 border border-slate-700/50"
          >
            <Award className="w-4 h-4 text-cyan-400" />
            Campus Drives
          </Link>
          <Link 
            to="/recruiter/jobs/create" 
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Open Jobs" 
          value={analytics?.openJobs || 0} 
          icon={Briefcase} 
          gradientClass="from-cyan-600 to-blue-600" 
        />
        <StatCard 
          title="Total Applications" 
          value={analytics?.totalApplications || 0} 
          icon={FileText} 
          gradientClass="from-indigo-600 to-violet-600" 
        />
        <StatCard 
          title="Shortlisted" 
          value={analytics?.shortlisted || 0} 
          icon={CheckCircle} 
          gradientClass="from-emerald-500 to-teal-600" 
        />
        <StatCard 
          title="Interviews" 
          value={analytics?.interviews || 0} 
          icon={Users} 
          gradientClass="from-amber-500 to-orange-600" 
        />
      </div>

      {/* Main Grid: BarChart + Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Analytics Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Applications per Job Role</h2>
              <p className="text-xs text-slate-400 mt-0.5">Applicant interest volume across your active postings.</p>
            </div>
            <Link 
              to="/recruiter/jobs" 
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1"
            >
              All Jobs <ChevronRight className="w-4 h-4"/>
            </Link>
          </div>

          {jobChartData.length > 0 ? (
            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8' }} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#0f172a', 
                      color: '#ffffff', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                    }}
                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="applications" name="Applications" radius={[8, 8, 0, 0]}>
                    {jobChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center p-6">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-xs mb-3 text-slate-400">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Application Data</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Post job listings or campus placement drives to view real-time applicant distribution.
              </p>
            </div>
          )}
        </div>

        {/* Quick Summary Card */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-none p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-1">Recruitment Overview</h2>
            <p className="text-xs text-slate-400 mb-6">Key milestones across your hiring funnel.</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Total Postings Created</span>
                <span className="font-black text-base text-cyan-600 dark:text-cyan-400">{analytics?.totalJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Closed / Concluded</span>
                <span className="font-black text-base text-slate-500 dark:text-slate-400">{analytics?.closedJobs || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Selected / Hired</span>
                <span className="font-black text-base text-emerald-600 dark:text-emerald-400">{analytics?.selected || 0}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-6">
            <Link 
              to="/recruiter/applicants" 
              className="w-full text-center text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-cyan-600 dark:hover:bg-cyan-600 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 border border-slate-700/50"
            >
              Review Applicant Pool <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/recruiter/placement-drives" 
              className="w-full text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5"
            >
              Manage Placement Drives
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
