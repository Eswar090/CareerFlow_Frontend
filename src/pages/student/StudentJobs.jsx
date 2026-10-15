import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Loader2, Building, Clock, DollarSign, Sparkles } from 'lucide-react';
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
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatEmploymentType = (type) => {
    return type.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Explore Opportunities</h1>
          <p className="text-slate-500 font-medium mt-1">Find your dream role from thousands of listings</p>
        </div>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by job title, company, or keywords" 
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-56 relative">
            <MapPin className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Location"
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-56">
            <select 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-700 bg-slate-50/50 focus:bg-white cursor-pointer appearance-none"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
            >
              <option value="">Job Type (Any)</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
          <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Search
          </button>
        </div>
      </form>

      {/* Job List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl text-sm font-medium flex items-center gap-3">
            <span className="text-xl">⚠️</span> {error}
          </div>
        ) : jobs.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
               <Briefcase className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">No opportunities found</h3>
             <p className="text-slate-500 font-medium">Try adjusting your filters to see more results.</p>
           </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-indigo-600">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-5 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm text-indigo-600 group-hover:scale-105 transition-transform">
                      <Building className="w-8 h-8" />
                    </div>
                    <div>
                      <Link to={`/student/jobs/${job.id}`} className="hover:text-indigo-600 transition-colors">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{job.title}</h2>
                      </Link>
                      <div className="text-base font-bold text-indigo-600">{job.company?.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600 mb-5">
                    <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-slate-400"/> {job.location}</span>
                    <span className="flex items-center gap-1.5 font-medium px-3 py-1 bg-slate-100 rounded-lg text-slate-700">{formatEmploymentType(job.employmentType)}</span>
                    <span className="flex items-center gap-1.5 font-medium"><Briefcase className="w-4 h-4 text-slate-400"/> Exp: {job.experienceRequired} yrs</span>
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        <DollarSign className="w-4 h-4" /> ${job.salaryMin} - ${job.salaryMax}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">{job.description}</p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <span key={skill.id} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-700 text-xs rounded-lg border border-indigo-100/50 font-bold">
                          {skill.name} <span className="opacity-60 ml-1 text-[10px]">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:w-48 shrink-0 justify-end gap-3 pt-4 border-t border-slate-100 md:border-t-0 md:pt-0">
                  <Link to={`/student/jobs/${job.id}`} className="w-full text-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95">
                    View Details
                  </Link>
                  <button disabled className="w-full text-center px-6 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl border border-slate-200 cursor-not-allowed opacity-70">
                    Apply Later
                  </button>
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
