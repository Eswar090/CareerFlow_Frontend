import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Calendar, Award, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';
import analyticsService from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, gradientClass, iconColorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
    <div className="flex items-center gap-5 relative z-10">
      <div className={`p-4 rounded-xl bg-gradient-to-br ${gradientClass} text-white shadow-lg`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [aiRec, setAiRec] = useState(null);
  const [aiRecLoading, setAiRecLoading] = useState(false);
  const [aiRecError, setAiRecError] = useState('');
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getStudentAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCareerInsights = async () => {
    setAiRecLoading(true);
    setAiRecError('');
    try {
      const res = await aiService.getCareerRecommendations();
      setAiRec(res.data || res);
    } catch (err) {
      setAiRecError(err.response?.data?.message || 'Could not generate career recommendations. Please try again later.');
    } finally {
      setAiRecLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  const chartData = analytics?.applicationStatusDistribution?.map(s => ({
    name: s.status,
    value: s.count
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-indigo-100 text-lg mb-8 font-medium">Ready to take the next step in your career? Track your applications, improve your skills, and let our AI guide your journey.</p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/student/jobs" className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 flex items-center gap-2">
              <Briefcase className="w-5 h-5" /> Browse Jobs
            </Link>
            <button onClick={handleGenerateCareerInsights} className="px-6 py-3 bg-indigo-500/30 backdrop-blur-sm border border-indigo-400/50 text-white font-bold rounded-xl hover:bg-indigo-500/50 transition-colors flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> AI Insights
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Applications" value={analytics?.totalApplications || 0} icon={FileText} gradientClass="from-blue-500 to-cyan-500" />
        <StatCard title="Shortlisted" value={analytics?.shortlisted || 0} icon={CheckCircle} gradientClass="from-emerald-400 to-teal-500" />
        <StatCard title="Interviews" value={analytics?.interviews || 0} icon={Calendar} gradientClass="from-purple-500 to-fuchsia-500" />
        <StatCard title="Selected" value={analytics?.selected || 0} icon={Award} gradientClass="from-amber-400 to-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-800">Application Status Overview</h2>
            <Link to="/student/applications" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No applications yet. Start applying!</p>
            </div>
          )}
        </div>

        {/* Profile Completion Widget */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col">
          <h2 className="text-xl font-black text-slate-800 mb-6">Profile Strength</h2>
          
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Award className="w-5 h-5"/></div>
                <span className="font-bold text-slate-700">Skills Added</span>
              </div>
              <span className="font-black text-xl text-indigo-600">{analytics?.totalSkills || 0}</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Briefcase className="w-5 h-5"/></div>
                <span className="font-bold text-slate-700">Projects</span>
              </div>
              <span className="font-black text-xl text-purple-600">{analytics?.totalProjects || 0}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle className="w-5 h-5"/></div>
                <span className="font-bold text-slate-700">Resume Status</span>
              </div>
              <span className={`font-bold px-3 py-1 rounded-full text-xs ${analytics?.hasResume ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {analytics?.hasResume ? 'Uploaded' : 'Missing'}
              </span>
            </div>
          </div>
          
          <Link to="/student/profile" className="mt-8 block w-full text-center text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 py-3.5 rounded-xl transition-colors shadow-lg shadow-slate-900/20">
            Complete Your Profile
          </Link>
        </div>
      </div>

      <AiInsightPanel
        title="AI Career Intelligence"
        loading={aiRecLoading}
        error={aiRecError}
        onGenerate={handleGenerateCareerInsights}
        hasData={!!aiRec}
      >
        {aiRec && (
          <div className="space-y-6 text-slate-700 mt-2">
            {aiRec.summary && <p className="leading-relaxed font-medium bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 text-indigo-900">{aiRec.summary}</p>}
            
            {aiRec.recommendedSkills && aiRec.recommendedSkills.length > 0 && (
              <div>
                <p className="font-black text-slate-900 mb-3 text-lg">Skills to Acquire</p>
                <div className="flex flex-wrap gap-2.5">
                  {aiRec.recommendedSkills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-800 text-sm rounded-xl font-bold shadow-sm border border-violet-200/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {aiRec.nextSteps && aiRec.nextSteps.length > 0 && (
              <div>
                <p className="font-black text-slate-900 mb-3 text-lg">Action Plan</p>
                <div className="space-y-3">
                  {aiRec.nextSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <p className="font-medium text-slate-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AiInsightPanel>
    </div>
  );
};

export default StudentDashboard;
