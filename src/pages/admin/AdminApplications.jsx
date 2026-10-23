import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Clock, CheckCircle2, Award, XCircle, Building2, User } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchApps();
  }, [status]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await adminService.getApplications(0, 50, status);
      setApps(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (appStatus) => {
    switch(appStatus) {
      case 'APPLIED': 
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">Applied</span>;
      case 'UNDER_REVIEW': 
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">Under Review</span>;
      case 'SHORTLISTED': 
        return <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-200">Shortlisted</span>;
      case 'INTERVIEW_SCHEDULED': 
        return <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200">Interview</span>;
      case 'SELECTED': 
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Selected</span>;
      case 'REJECTED': 
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">Rejected</span>;
      default: 
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{appStatus}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Platform Pipeline
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Monitoring</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Global view of candidate progress across all recruiting partners and college departments.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Logged Submissions: <strong className="text-indigo-600">{apps.length}</strong>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4">
        <select 
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Application Stages</option>
          <option value="APPLIED">Applied</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="SELECTED">Selected / Hired</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Querying platform pipeline...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-5">Student Candidate</th>
                  <th className="p-5">Position</th>
                  <th className="p-5">Company</th>
                  <th className="p-5">Current Status</th>
                  <th className="p-5">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {apps.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> {app.studentName}
                      </span>
                    </td>
                    <td className="p-5 text-slate-800 text-xs font-semibold">{app.jobTitle}</td>
                    <td className="p-5 text-slate-600 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.companyName}
                      </span>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-5 text-slate-400 text-xs font-medium">
                      {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 text-sm font-medium">
                      No applications recorded under this filter.
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

export default AdminApplications;
