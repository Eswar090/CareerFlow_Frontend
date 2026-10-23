import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Briefcase, Building2, Calendar, Clock, CheckCircle2, XCircle, ArrowUpRight, Award, Trash2 } from 'lucide-react';
import applicationService from '../../services/applicationService';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getStudentApplications();
      setApplications(res.data || res);
    } catch (err) {
      setError('Failed to load application history.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    setWithdrawing(id);
    try {
      await applicationService.withdrawApplication(id);
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(null);
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800/60">
            <Clock className="w-3.5 h-3.5" /> Applied
          </span>
        );
      case 'UNDER_REVIEW': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Under Review
          </span>
        );
      case 'SHORTLISTED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold rounded-full border border-cyan-200 dark:border-cyan-800/60">
            <Award className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Shortlisted
          </span>
        );
      case 'TEST_SCHEDULED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800/60">
            <Calendar className="w-3.5 h-3.5" /> Test Scheduled
          </span>
        );
      case 'INTERVIEW_SCHEDULED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full border border-violet-200 dark:border-violet-800/60">
            <Calendar className="w-3.5 h-3.5" /> Interview
          </span>
        );
      case 'SELECTED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Selected
          </span>
        );
      case 'REJECTED': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full border border-rose-200 dark:border-rose-800/60">
            <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" /> Rejected
          </span>
        );
      case 'WITHDRAWN': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">
            Withdrawn
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  const canWithdraw = (status) => {
    return ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED'].includes(status);
  };

  const counts = {
    total: applications.length,
    active: applications.filter(a => ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'TEST_SCHEDULED', 'INTERVIEW_SCHEDULED'].includes(a.status)).length,
    interviews: applications.filter(a => ['INTERVIEW_SCHEDULED', 'TEST_SCHEDULED'].includes(a.status)).length,
    selected: applications.filter(a => a.status === 'SELECTED').length
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-72">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Job Applications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Track your candidate status, recruitment stages, and recruiter feedback.
          </p>
        </div>
        <Link 
          to="/student/jobs" 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 text-sm self-start md:self-auto cursor-pointer"
        >
          Explore More Jobs <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Submissions</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{counts.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40">
          <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{counts.active}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40">
          <p className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider">Interviews</p>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">{counts.interviews}</p>
        </div>
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40">
          <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Offers / Selected</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{counts.selected}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center gap-2 text-sm font-semibold">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Applications Table Card */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="p-5">Position</th>
                <th className="p-5">Company</th>
                <th className="p-5">Applied Date</th>
                <th className="p-5">Current Stage</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {app.jobTitle}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {app.companyName}
                    </span>
                  </td>
                  <td className="p-5 text-slate-500 dark:text-slate-400 font-medium text-xs">
                    {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-5">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        to={`/student/jobs/${app.jobId}`} 
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition"
                      >
                        View Job
                      </Link>
                      {canWithdraw(app.status) && (
                        <button 
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawing === app.id}
                          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-3 py-1.5 rounded-lg transition disabled:opacity-50 cursor-pointer"
                        >
                          {withdrawing === app.id ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
                      <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No applications submitted yet</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 mb-4">
                      Explore active listings and apply with your optimized credentials.
                    </p>
                    <Link
                      to="/student/jobs"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                    >
                      Browse Jobs
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
