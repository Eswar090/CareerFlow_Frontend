import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle, Calendar, Award, Briefcase, 
  ChevronRight, Sparkles, Building2, TrendingUp, ArrowRight, 
  UserCheck, ShieldCheck
} from 'lucide-react';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';
import analyticsService from '../../services/analyticsService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, gradientClass, iconColorClass, trend }) => (
  <div className="bg-white dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-black/40 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradientClass} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125`}></div>
    <div className="flex items-center justify-between relative z-10">
      <div className="space-y-1">
        <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} text-white shadow-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  </div>
);

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#64748b'];

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
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const chartData = analytics?.applicationStatusDistribution?.map(s => ({
    name: s.status,
    value: s.count
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-indigo-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Smart Career Navigator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Ready to take the next step in your career? Browse campus placement drives, verify eligibility, track applications, and let AI analyze your skill readiness.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              to="/student/placement-drives" 
              className="px-5 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 text-sm"
            >
              <Award className="w-4 h-4 text-indigo-600" /> Placement Drives
            </Link>
            <Link 
              to="/student/jobs" 
              className="px-5 py-3 bg-indigo-950/60 hover:bg-indigo-950/80 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center gap-2 text-sm"
            >
              <Briefcase className="w-4 h-4 text-cyan-400" /> Browse Jobs
            </Link>
            <button 
              onClick={handleGenerateCareerInsights} 
              className="px-5 py-3 bg-violet-500/30 backdrop-blur-sm border border-violet-300/40 text-white font-bold rounded-xl hover:bg-violet-500/50 transition-all flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> AI Insights
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Applications" 
          value={analytics?.totalApplications || 0} 
          icon={FileText} 
          gradientClass="from-blue-600 to-indigo-600" 
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
          icon={Calendar} 
          gradientClass="from-violet-600 to-purple-600" 
        />
        <StatCard 
          title="Selected" 
          value={analytics?.selected || 0} 
          icon={Award} 
          gradientClass="from-amber-500 to-orange-600" 
        />
      </div>

      {/* Charts & Profile Strength Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Application Status Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Application Pipeline Distribution</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status breakdown of your active job and drive applications.</p>
            </div>
            <Link 
              to="/student/applications" 
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
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
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#0f172a', 
                      color: '#ffffff', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                    }}
                    itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center p-6">
              <div className="w-14 h-14 bg-white dark:bg-slate-850 rounded-2xl flex items-center justify-center shadow-xs mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Applications Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Explore placement drives or job postings and submit your application to view analytics.
              </p>
              <Link 
                to="/student/placement-drives" 
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Browse Drives
              </Link>
            </div>
          )}
        </div>

        {/* Profile Strength & Readiness Widget */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xl shadow-slate-200/40 dark:shadow-black/40 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Profile Readiness</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-100 dark:border-indigo-800/60">
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Completing your academic profile ensures automatic eligibility for campus placement drives.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"><Award className="w-4 h-4"/></div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Skills Added</span>
                    <span className="text-[10px] text-slate-400">Verified competencies</span>
                  </div>
                </div>
                <span className="font-black text-base text-indigo-600 dark:text-indigo-400">{analytics?.totalSkills || 0}</span>
              </div>
              
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center"><Briefcase className="w-4 h-4"/></div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Projects Logged</span>
                    <span className="text-[10px] text-slate-400">Portfolio showcases</span>
                  </div>
                </div>
                <span className="font-black text-base text-purple-600 dark:text-purple-400">{analytics?.totalProjects || 0}</span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><CheckCircle className="w-4 h-4"/></div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Resume Master</span>
                    <span className="text-[10px] text-slate-400">PDFBox parsed</span>
                  </div>
                </div>
                <span className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${analytics?.hasResume ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                  {analytics?.hasResume ? 'Uploaded' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
          
          <Link 
            to="/student/profile" 
            className="mt-6 w-full text-center text-xs font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Update Profile & Backlogs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* AI Career Intelligence Panel */}
      <AiInsightPanel
        title="AI Career Intelligence"
        loading={aiRecLoading}
        error={aiRecError}
        onGenerate={handleGenerateCareerInsights}
        hasData={!!aiRec}
      >
        {aiRec && (
          <div className="space-y-6 text-slate-700 dark:text-slate-300 mt-2">
            {aiRec.summary && (
              <p className="leading-relaxed font-medium bg-indigo-50/70 dark:bg-indigo-950/40 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200 text-sm">
                {aiRec.summary}
              </p>
            )}
            
            {aiRec.recommendedSkills && aiRec.recommendedSkills.length > 0 && (
              <div>
                <p className="font-black text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Recommended Skills to Acquire
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiRec.recommendedSkills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/60 dark:to-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs rounded-xl font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {aiRec.nextSteps && aiRec.nextSteps.length > 0 && (
              <div>
                <p className="font-black text-slate-900 dark:text-white mb-3 text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Action Roadmap
                </p>
                <div className="space-y-2.5">
                  {aiRec.nextSteps.map((step, i) => (
                    <div key={i} className="flex gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">{step}</p>
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
