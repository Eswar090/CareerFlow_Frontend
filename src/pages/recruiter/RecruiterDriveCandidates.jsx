import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Users, ArrowLeft, Search, CheckCircle2, 
  Award, Clock, AlertCircle, RefreshCw, XCircle, 
  ChevronRight, Calendar, Phone, Mail, GraduationCap, 
  ExternalLink, MessageSquare, Filter
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';

const STAGES = [
  { key: 'REGISTERED', label: 'Registered', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' },
  { key: 'IN_REVIEW', label: 'In Review', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' },
  { key: 'ASSESSMENT', label: 'Assessment', color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60' },
  { key: 'TECHNICAL_INTERVIEW', label: 'Technical Interview', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' },
  { key: 'HR_INTERVIEW', label: 'HR Interview', color: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60' },
  { key: 'SELECTED', label: 'Selected / Offer Extended', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' },
  { key: 'REJECTED', label: 'Not Selected', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' },
  { key: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
];

const RecruiterDriveCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Stage Advancement Modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, [id, statusFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dRes, cRes] = await Promise.all([
        placementDriveService.getRecruiterDriveDetails(id),
        placementDriveService.getRecruiterDriveCandidates(id, {
          search: search || undefined,
          status: statusFilter || undefined
        })
      ]);
      setDrive(dRes.data);
      setCandidates(cRes.data?.content || cRes.data || []);
    } catch (err) {
      console.error('Failed to load drive candidates', err);
      setError('Failed to fetch candidates for this drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status || 'SHORTLISTED');
    setRemarks(candidate.remarks || '');
    setError(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    try {
      setUpdating(true);
      setError(null);
      await placementDriveService.updateCandidateStatusByRecruiter(selectedCandidate.registrationId, {
        status: newStatus,
        remarks: remarks || undefined
      });
      setSuccessMsg(`Status updated to ${newStatus} for ${selectedCandidate.studentName || 'candidate'}`);
      setSelectedCandidate(null);
      setRemarks('');
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStageConfig = (status) => {
    return STAGES.find(s => s.key === status) || { label: status, color: 'bg-slate-100 text-slate-700' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/recruiter/placement-drives')}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Company Placement Drives
      </button>

      {/* Drive Header Summary */}
      <div className="bg-white dark:bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Recruitment Funnel & Pipeline
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {drive?.title || 'Placement Drive Candidates'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            Drive Date: <strong className="text-slate-700 dark:text-slate-300">{formatDate(drive?.driveDate)}</strong> • 
            Venue: <strong className="text-slate-700 dark:text-slate-300">{drive?.location || 'Campus'}</strong> • 
            Status: <span className="uppercase font-black text-indigo-600 dark:text-indigo-400">{drive?.status}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Applicants</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{candidates.length}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              statusFilter === '' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Candidates ({candidates.length})
          </button>
          {STAGES.filter(s => s.key !== 'WITHDRAWN').map(st => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st.key 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCandidates()}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Candidates Table / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">Loading candidate registrations...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <Users className="w-16 h-16 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Registered Candidates</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            {statusFilter || search 
              ? 'No candidates match the selected filter.' 
              : 'No students have registered for this placement drive yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => {
            const stCfg = getStageConfig(c.status);
            const canScheduleInterview = ['SHORTLISTED', 'TECHNICAL_INTERVIEW', 'HR_INTERVIEW'].includes(c.status);

            return (
              <div
                key={c.registrationId}
                className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Candidate Info */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {c.studentName || 'Student Applicant'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${stCfg.color}`}>
                      {stCfg.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Reg: {formatDate(c.registeredAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {c.studentEmail && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.studentEmail}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> 
                      {c.branch || 'Branch N/A'} • CGPA: <strong className="text-slate-800 dark:text-slate-200">{c.cgpa ? c.cgpa.toFixed(1) : 'N/A'}</strong>
                    </span>
                    {c.activeBacklogs > 0 && (
                      <span className="text-rose-500 font-bold text-[11px]">
                        Backlogs: {c.activeBacklogs}
                      </span>
                    )}
                  </div>

                  {c.remarks && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 py-1 rounded-xl font-semibold border border-indigo-100 dark:border-indigo-900/40 mt-1 inline-block">
                      Note: {c.remarks}
                    </p>
                  )}
                </div>

                {/* Candidate Stage Action Buttons */}
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  {canScheduleInterview && (
                    <Link
                      to="/recruiter/interviews"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition flex items-center gap-1.5"
                      title="Schedule Interview in Interview Module"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                    </Link>
                  )}

                  <button
                    onClick={() => handleOpenStatusModal(c)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    Advance Stage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stage Advancement Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Advance Recruitment Stage</h2>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {selectedCandidate.studentName} • {selectedCandidate.branch || 'Candidate'}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Recruitment Stage *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-bold"
                >
                  {STAGES.filter(s => s.key !== 'WITHDRAWN').map(st => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Recruiter Feedback & Stage Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Scored 88% in coding assessment. Recommended for Round 1 technical interview."
                  className="w-full p-3.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 resize-none font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {updating ? 'Saving Stage...' : 'Confirm Stage Transition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDriveCandidates;
