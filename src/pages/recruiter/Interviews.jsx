import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import { 
  Calendar, User, Check, X, Trash2, Clock, CheckCircle2, AlertCircle, 
  Sparkles, Video, MapPin, Edit3, Loader2, Filter, Users, ExternalLink
} from 'lucide-react';

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [rescheduleForm, setRescheduleForm] = useState({
    interviewType: 'TECHNICAL',
    scheduledAt: '',
    meetingLink: '',
    location: '',
    interviewerName: '',
    notes: ''
  });

  const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getRecruiterInterviews(0, 100);
      const data = res.data?.content || res.data || [];
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load interviews:', err);
      setErrorMessage('Failed to load interview sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await interviewService.updateInterviewStatus(id, { status });
      setInterviews(interviews.map(i => i.id === id ? { ...i, status } : i));
      setSuccessMessage(`Interview marked as ${status.toLowerCase()}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update interview status');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this interview record?')) return;
    try {
      await interviewService.deleteInterview(id);
      setInterviews(interviews.filter(i => i.id !== id));
      setSuccessMessage('Interview deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete interview');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const openRescheduleModal = (inv) => {
    setSelectedInterview(inv);
    setModalError('');
    // Format existing scheduledAt to YYYY-MM-DDTHH:mm for datetime-local input
    let formattedDate = '';
    if (inv.scheduledAt) {
      try {
        const d = new Date(inv.scheduledAt);
        formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      } catch (_) {}
    }

    setRescheduleForm({
      interviewType: inv.type || inv.interviewType || 'TECHNICAL',
      scheduledAt: formattedDate,
      meetingLink: inv.meetingLink || '',
      location: inv.location || '',
      interviewerName: inv.interviewerName || '',
      notes: inv.notes || ''
    });
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!rescheduleForm.scheduledAt) {
      setModalError('Scheduled date and time is required.');
      return;
    }

    const scheduledDate = new Date(rescheduleForm.scheduledAt);
    if (scheduledDate <= new Date()) {
      setModalError('Cannot reschedule an interview in the past. Please choose a future time.');
      return;
    }

    try {
      setModalLoading(true);
      const res = await interviewService.updateInterview(selectedInterview.id, rescheduleForm);
      const updated = res.data || res;
      setInterviews(interviews.map(i => i.id === selectedInterview.id ? { ...i, ...updated, status: updated.status || 'RESCHEDULED' } : i));
      setShowRescheduleModal(false);
      setSuccessMessage(`Interview rescheduled for ${selectedInterview.studentName}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to reschedule interview. Please check the details and try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'RESCHEDULED':
        return (
          <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Rescheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const filteredInterviews = interviews.filter(inv => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SCHEDULED') return inv.status === 'SCHEDULED' || inv.status === 'RESCHEDULED';
    return inv.status === activeFilter;
  });

  const countByFilter = (filter) => {
    if (filter === 'ALL') return interviews.length;
    if (filter === 'SCHEDULED') return interviews.filter(i => i.status === 'SCHEDULED' || i.status === 'RESCHEDULED').length;
    return interviews.filter(i => i.status === filter).length;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Evaluation Sessions
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interview Sessions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Coordinate technical and HR interviews, manage schedules, reschedule dates, and log candidate evaluations.
          </p>
        </div>

        <Link
          to="/recruiter/applicants"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-600/20 transition self-start sm:self-auto cursor-pointer"
        >
          <Users className="w-4 h-4" /> Schedule from Applicants
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: 'ALL', label: 'All Sessions' },
          { key: 'SCHEDULED', label: 'Upcoming / Scheduled' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'CANCELLED', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeFilter === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {countByFilter(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-72 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading interview schedule...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/40">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {activeFilter === 'ALL' ? 'No interviews scheduled yet' : `No ${activeFilter.toLowerCase()} interviews`}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-4">
            {activeFilter === 'ALL'
              ? 'Shortlist candidates in the Applicants tab and schedule interviews to see them here.'
              : 'There are currently no interview sessions matching this filter tab.'}
          </p>
          {activeFilter === 'ALL' && (
            <Link
              to="/recruiter/applicants"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
            >
              Go to Candidate Applicants
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredInterviews.map((inv) => (
            <div 
              key={inv.id} 
              className="bg-white dark:bg-slate-900/90 p-6 md:p-7 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group"
            >
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {inv.jobTitle || 'Interview Session'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Candidate: {inv.studentName}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-transparent dark:border-white/5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {new Date(inv.scheduledAt).toLocaleString(undefined, { 
                      month: 'short', day: 'numeric', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                  <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold uppercase tracking-wider text-[11px] border border-transparent dark:border-white/5">
                    {inv.type || inv.interviewType || 'TECHNICAL'}
                  </span>
                  {getStatusBadge(inv.status)}
                </div>

                {(inv.meetingLink || inv.location || inv.interviewerName || inv.notes) && (
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    <div className="flex flex-wrap gap-4">
                      {inv.meetingLink && (
                        <a 
                          href={inv.meetingLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Meeting URL <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {inv.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {inv.location}
                        </span>
                      )}
                      {inv.interviewerName && (
                        <span>Interviewer: <strong className="text-slate-700 dark:text-slate-200">{inv.interviewerName}</strong></span>
                      )}
                    </div>
                    {inv.notes && (
                      <p className="text-slate-600 dark:text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        "{inv.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0 self-stretch md:self-auto justify-end">
                {(inv.status === 'SCHEDULED' || inv.status === 'RESCHEDULED') && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(inv.id, 'COMPLETED')} 
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5"/> Complete
                    </button>
                    <button 
                      onClick={() => openRescheduleModal(inv)} 
                      className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5"/> Reschedule
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(inv.id, 'CANCELLED')} 
                      className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5"/> Cancel
                    </button>
                  </>
                )}
                {inv.status === 'CANCELLED' && (
                  <button 
                    onClick={() => openRescheduleModal(inv)} 
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5"/> Re-open & Reschedule
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(inv.id)} 
                  className="px-3 py-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5"/> Delete Record
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Reschedule Interview
                </h2>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Candidate: {selectedInterview.studentName} ({selectedInterview.jobTitle})
                </p>
              </div>
              <button 
                onClick={() => setShowRescheduleModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {modalError}
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Round Type *</label>
                <select 
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
                  value={rescheduleForm.interviewType}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, interviewType: e.target.value})}
                  required
                >
                  <option value="TECHNICAL">Technical Round</option>
                  <option value="HR">HR / Behavioral</option>
                  <option value="MANAGERIAL">Managerial / Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">New Date & Time *</label>
                <input 
                  type="datetime-local" 
                  min={minDateTime}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  value={rescheduleForm.scheduledAt}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, scheduledAt: e.target.value})}
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Must be scheduled in the future.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Virtual Meeting Link</label>
                  <input 
                    type="url" 
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    value={rescheduleForm.meetingLink}
                    onChange={(e) => setRescheduleForm({...rescheduleForm, meetingLink: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Campus Location</label>
                  <input 
                    type="text" 
                    placeholder="Room 204, Placement Block"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    value={rescheduleForm.location}
                    onChange={(e) => setRescheduleForm({...rescheduleForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Interviewer Name / Panel Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lead Architect"
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  value={rescheduleForm.interviewerName}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, interviewerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Reason for Rescheduling / Special Instructions</label>
                <textarea 
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none resize-none"
                  placeholder="Notice for candidate regarding rescheduled timing or format..."
                  value={rescheduleForm.notes}
                  onChange={(e) => setRescheduleForm({...rescheduleForm, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowRescheduleModal(false)} 
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={modalLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {modalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalLoading ? 'Saving...' : 'Update & Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviews;
