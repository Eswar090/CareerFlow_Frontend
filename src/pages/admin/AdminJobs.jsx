import React, { useState, useEffect } from 'react';
import { Loader2, Search, Briefcase, ShieldCheck, MapPin, Building2, Users } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [status]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getJobs(0, 50, search, status);
      setJobs(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const closeJob = async (id) => {
    if (!window.confirm('Are you sure you want to close this job requisition? This action cannot be easily undone.')) return;
    try {
      await adminService.updateJobStatus(id, 'CLOSED');
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close job');
    }
  };

  const getStatusBadge = (jobStatus) => {
    switch (jobStatus) {
      case 'OPEN':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">Open</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">Draft</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-full">Closed</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{jobStatus}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Platform Listings
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Job Requisitions</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Monitor all posted openings, applicant intake volumes, and hiring status across departments.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Listed: <strong className="text-indigo-600">{jobs.length}</strong>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by role title..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white"
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-indigo-600/20"
          >
            Search
          </button>
        </form>

        <select 
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Requisition Statuses</option>
          <option value="OPEN">Open (Accepting Applicants)</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Querying platform job requisitions...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-5">Position</th>
                  <th className="p-5">Hiring Company</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Requisition Status</th>
                  <th className="p-5">Applicants</th>
                  <th className="p-5 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </td>
                    <td className="p-5 text-slate-700 text-xs font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location || 'Remote'}
                      </span>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5" /> {job.applicationCount || 0}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {job.status === 'OPEN' && (
                        <button 
                          onClick={() => closeJob(job.id)}
                          className="text-xs font-bold px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition"
                        >
                          Close Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400 text-sm font-medium">
                      No jobs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
