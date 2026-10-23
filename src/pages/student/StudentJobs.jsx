import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Loader2, Building2, Clock, DollarSign, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';
import jobService from '../../services/jobService';

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [location, employmentType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.searchJobs({
        search,
        location,
        employmentType,
        page: 0,
        size: 20
      });
      setJobs(data.content || []);
    } catch (err) {
      setError('Failed to fetch job opportunities. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatEmploymentType = (type) => {
    if (!type) return '';
    return type.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Live Career Listings
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Browse verified openings, match your skillset, and apply with your optimized resume.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs self-start md:self-auto">
          Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{jobs.length}</span> active roles
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <form 
        onSubmit={handleSearch} 
        className="bg-white dark:bg-slate-900/80 p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative z-10 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by job title, skill keywords, or company..." 
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-60 relative">
            <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 pointer-events-none" />
            <input 
              type="text"
              placeholder="City / Remote"
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-56">
            <select 
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 cursor-pointer text-sm"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Employment: All</option>
              <option value="FULL_TIME" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Full-time</option>
              <option value="PART_TIME" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Part-time</option>
              <option value="INTERNSHIP" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Internship</option>
              <option value="CONTRACT" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Contract</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 active:scale-95 text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Find Jobs
          </button>
        </div>
      </form>

      {/* Job Listings Stream */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-72 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Scanning available opportunities...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 p-6 rounded-2xl text-sm font-semibold flex items-center gap-3">
            <span className="text-2xl">⚠️</span> {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50/60 dark:bg-indigo-950/60 rounded-3xl flex items-center justify-center mb-5 border border-indigo-100 dark:border-indigo-800/60">
              <Briefcase className="w-9 h-9 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No matching positions found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              Try adjusting your search terms or location filter to discover more roles.
            </p>
          </div>
        ) : (
          jobs.map(job => (
            <div 
              key={job.id} 
              className="bg-white dark:bg-slate-900/80 p-6 md:p-7 rounded-3xl border border-slate-200/70 dark:border-slate-800/80 shadow-xs hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-indigo-600"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center shrink-0 shadow-xs text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <Link to={`/student/jobs/${job.id}`} className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                          {job.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{job.company?.name || 'Verified Company'}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {job.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold border border-indigo-100 dark:border-indigo-800/60">
                      <Briefcase className="w-3.5 h-3.5" /> {formatEmploymentType(job.employmentType)}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg text-slate-700 dark:text-slate-300">
                      Exp: {job.experienceRequired} yrs
                    </span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold border border-emerald-200 dark:border-emerald-800/60">
                        <DollarSign className="w-3.5 h-3.5" /> ₹{job.salaryMin || 0} - ₹{job.salaryMax || 'Open'}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.slice(0, 6).map(skill => (
                        <span 
                          key={skill.id} 
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {job.skills.length > 6 && (
                        <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 text-xs rounded-lg font-semibold">
                          +{job.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col shrink-0 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:pt-0 lg:w-44 justify-center">
                  <Link 
                    to={`/student/jobs/${job.id}`} 
                    className="w-full text-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/20 active:scale-95 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentJobs;
