import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Compass, Bookmark, CheckCircle2, ArrowRight, 
  Sparkles, Award, Target, TrendingUp, Layers, ExternalLink,
  BookOpen, GitCompare, ListCheck, AlertCircle
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await careerPathService.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load CareerPath dashboard', err);
      setError('Unable to load CareerPath dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-emerald-500 from-emerald-500 to-teal-500';
    if (score >= 60) return 'text-indigo-500 from-indigo-500 to-violet-500';
    if (score >= 35) return 'text-amber-500 from-amber-500 to-orange-500';
    return 'text-rose-500 from-rose-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <CareerPathNav />
        <div className="animate-pulse space-y-6">
          <div className="h-40 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CareerPathNav />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-[#0a0f24] text-white p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              CareerPath Placement Guide
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Target Your Dream Career, {data?.studentName || 'Student'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 45+ verified companies, understand real recruitment rounds, assess your role readiness, and follow personalized preparation roadmaps.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <Link
              to="/student/career-path/companies"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-transform"
            >
              <Building2 className="w-4 h-4" />
              <span>Explore Companies</span>
            </Link>
            <Link
              to="/student/career-path/guide"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Service vs Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Companies</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {data?.totalCompanies || 45}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Verified reference profiles</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">IT Services</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {data?.serviceOrientedCount || 30}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">TCS, Infosys, Wipro & more</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product & Tech</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {data?.productOrientedCount || 15}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Google, Microsoft, Amazon</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Companies</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {data?.savedCompaniesCount || 0}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Saved to your target list</span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Readiness Score</span>
            <Link to="/student/career-path/readiness" className="text-indigo-500 hover:text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {data?.readinessScore || 0}%
            </span>
            <span className="text-xs font-bold text-indigo-500">
              {data?.readinessScore >= 80 ? 'Placement-Ready' : data?.readinessScore >= 60 ? 'Competitive' : 'Developing'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getReadinessColor(data?.readinessScore || 0)} transition-all duration-500`}
              style={{ width: `${Math.max(5, data?.readinessScore || 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Roadmap & Next Task Spotlight */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Active Placement Milestone
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target Role: <strong className="text-indigo-600 dark:text-indigo-400">{data?.currentTargetRole}</strong> &bull; Target Company: <strong className="text-slate-700 dark:text-slate-200">{data?.currentTargetCompany}</strong>
              </p>
            </div>
          </div>
          <Link
            to="/student/career-path/roadmaps"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
          >
            <span>View Full Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Next Recommended Step</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                {data?.recommendedNextTask || 'Create your first 60-day placement preparation roadmap.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/career-path/roadmaps')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors whitespace-nowrap"
          >
            Manage Roadmaps
          </button>
        </div>
      </div>

      {/* Recommendations & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Explainable Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Personalized Recommendations
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Based on your skills & profile</span>
          </div>

          <div className="space-y-3">
            {data?.recommendations && data.recommendations.length > 0 ? (
              data.recommendations.slice(0, 4).map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-start justify-between gap-4 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                        {rec.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {rec.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rec.explanation}
                    </p>
                    {rec.matchedSkills && rec.matchedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rec.matchedSkills.map((s, si) => (
                          <span key={si} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {rec.companyId ? (
                    <Link
                      to={`/student/career-path/companies/${rec.companyId}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/student/career-path/roles"
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 text-center space-y-2">
                <Target className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add skills to unlock smart recommendations</p>
                <p className="text-xs text-slate-500">Update your student profile skills to receive tailored company & role matches.</p>
                <Link
                  to="/student/skills"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Update My Skills
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Saved Companies Quick Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Target Companies
              </h2>
            </div>
            <Link
              to="/student/career-path/companies?savedOnly=true"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All ({data?.savedCompaniesCount || 0})
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            {data?.savedCompanies && data.savedCompanies.length > 0 ? (
              data.savedCompanies.map((c) => (
                <Link
                  key={c.id}
                  to={`/student/career-path/companies/${c.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center font-black text-xs text-indigo-600 dark:text-indigo-400">
                      {c.companyName?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {c.companyName}
                      </h3>
                      <span className="text-[10px] text-slate-400 block">{c.category?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))
            ) : (
              <div className="py-6 text-center space-y-2">
                <Bookmark className="w-6 h-6 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs text-slate-500">No companies saved yet.</p>
                <Link
                  to="/student/career-path/companies"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Browse Company Directory
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Companies Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Featured Recruitment Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified hiring processes, typical CTC ranges, and real official career links.
            </p>
          </div>
          <Link
            to="/student/career-path/companies"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>See all {data?.totalCompanies || 45} companies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.featuredCompanies && data.featuredCompanies.map((company) => (
            <div
              key={company.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/10 to-violet-600/10 dark:bg-white/10 flex items-center justify-center font-black text-sm text-indigo-600 dark:text-indigo-300">
                      {company.companyName?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {company.companyName}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {company.headquartersLocation}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    company.category === 'PRODUCT_ORIENTED'
                      ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                      : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {company.category === 'PRODUCT_ORIENTED' ? 'Product' : 'Services'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {company.overview}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Entry Package:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{company.fresherSalaryRange}</span>
                </div>
              </div>

              <div className="pt-4 mt-3 flex items-center justify-between gap-2">
                <Link
                  to={`/student/career-path/companies/${company.id}`}
                  className="flex-1 py-2 text-center rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-white/5 dark:hover:bg-indigo-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  View Guide
                </Link>
                {company.officialCareersUrl && (
                  <a
                    href={company.officialCareersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    title="Official Careers Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathDashboard;

