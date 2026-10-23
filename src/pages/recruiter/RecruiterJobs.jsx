import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Plus, Loader2, Trash2, Edit, Users, Sparkles, AlertCircle, Clock } from 'lucide-react';
import jobService from '../../services/jobService';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getRecruiterJobs({ page: 0, size: 50 });
      setJobs(data.content || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job postings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await jobService.updateJobStatus(id, status);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      try {
        await jobService.deleteJob(id);
        fetchJobs();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const counts = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'OPEN').length,
    draft: jobs.filter(j => j.status === 'DRAFT').length,
    closed: jobs.filter(j => j.status === 'CLOSED').length
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading job postings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Talent Requisitions
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Job Openings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Publish openings, calibrate skill requirements, and track candidate submissions.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm transition shadow-md shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Job
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Postings</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{counts.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Active Openings</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{counts.open}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{counts.draft}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Closed Roles</p>
          <p className="text-2xl font-black text-slate-600 dark:text-slate-300 mt-1">{counts.closed}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Jobs Table */}
      {jobs.length === 0 && !error ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-16 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/40">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No jobs posted yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
            Create your first job listing to start receiving student applications.
          </p>
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Job Details</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Posted Date</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-5">
                      <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base">
                        {job.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location || 'Remote'}</span>
                        <span>•</span>
                        <span>Exp: {job.experienceRequired} yrs</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition ${
                          job.status === 'OPEN' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                            : job.status === 'DRAFT' 
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-5">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 rounded-lg text-xs font-bold">
                        {job.employmentType}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                      {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/recruiter/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-100 dark:border-indigo-800/50 rounded-xl transition"
                          title="View Applicants"
                        >
                          <Users className="w-3.5 h-3.5" /> Applicants
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job.id}/edit`}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
