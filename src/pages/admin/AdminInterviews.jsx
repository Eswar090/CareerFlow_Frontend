import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Calendar, Building2, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, [status]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getInterviews(0, 50, status);
      setInterviews(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (invStatus) => {
    switch (invStatus) {
      case 'SCHEDULED':
        return <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Scheduled</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">{invStatus}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Evaluation Sessions
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Monitoring</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Global audit of scheduled candidate rounds, completion ratios, and recruiter feedback sessions.
          </p>
        </div>
        <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          Logged Sessions: <strong className="text-indigo-600">{interviews.length}</strong>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4">
        <select 
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Session Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm font-semibold text-slate-500">Querying platform interview logs...</p>
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
                  <th className="p-5">Interview Type</th>
                  <th className="p-5">Scheduled Date & Time</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {interviews.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> {inv.candidateName}
                      </span>
                    </td>
                    <td className="p-5 text-slate-800 text-xs font-semibold">{inv.jobTitle}</td>
                    <td className="p-5 text-slate-600 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {inv.companyName}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider text-[11px]">
                        {inv.interviewType || 'TECHNICAL'}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(inv.scheduledAt).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(inv.status)}
                    </td>
                  </tr>
                ))}
                {interviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-400 text-sm font-medium">
                      No interviews scheduled under this status.
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

export default AdminInterviews;
