import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Download, FileText, Calendar, 
  Sparkles, CheckCircle2, Clock, Award, XCircle, AlertCircle, X, Check, Building2, Filter, Briefcase, Mail
} from 'lucide-react';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import jobService from '../../services/jobService';
import matchingService from '../../services/matchingService';

const RecruiterJobApplicants = () => {
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState(id || '');
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [matchMap, setMatchMap] = useState({});
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ 
    interviewType: 'TECHNICAL', 
    scheduledAt: '', 
    meetingLink: '', 
    location: '', 
    interviewerName: '', 
    notes: '' 
  });

  // Calculate current date-time for datetime-local min attribute
  const minDateTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedJobId(id);
    }
  }, [id]);

  useEffect(() => {
    fetchApplications(selectedJobId);
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      const res = await jobService.getRecruiterJobs();
      const list = res.data || res || [];
      setJobs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Could not load recruiter jobs list:', err);
    }
  };

  const fetchApplications = async (jobIdFilter) => {
    try {
      setLoading(true);
      setError(null);

      // If a specific job ID is requested, fetch job details as well
      if (jobIdFilter) {
        try {
          const jobData = await jobService.getJobById(jobIdFilter);
          setJob(jobData);
        } catch (_) {
          setJob(null);
        }
      } else {
        setJob(null);
      }

      // Fetch applications scoped to recruiter's company (with optional jobId query param)
      const res = await applicationService.getRecruiterApplications(jobIdFilter || null);
      const apps = res.data || res || [];
      setApplicants(Array.isArray(apps) ? apps : []);

      // Fetch match scores for each application asynchronously
      const scores = {};
      await Promise.all(
        (Array.isArray(apps) ? apps : []).map(async (app) => {
          try {
            const mRes = await matchingService.getApplicationMatch(app.id);
            scores[app.id] = mRes.data || mRes;
          } catch (_) {}
        })
      );
      setMatchMap(scores);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Failed to load candidate applications or job specifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      setApplicants(applicants.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      setSuccessMessage(`Candidate status updated to ${newStatus.replace(/_/g, ' ')}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update candidate status');
    }
  };

  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setModalError('');
    setShowInterviewModal(true);
    setInterviewForm({ 
      interviewType: 'TECHNICAL', 
      scheduledAt: '', 
      meetingLink: '', 
      location: '', 
      interviewerName: '', 
      notes: '' 
    });
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!interviewForm.scheduledAt) {
      setModalError('Scheduled date and time is required.');
      return;
    }

    const scheduledDate = new Date(interviewForm.scheduledAt);
    if (scheduledDate <= new Date()) {
      setModalError('Cannot schedule an interview in the past. Please select a future date and time.');
      return;
    }

    try {
      setModalLoading(true);
      await interviewService.createInterview(selectedApp.id, interviewForm);
      setSuccessMessage(`Interview scheduled successfully for ${selectedApp.studentName}`);
      setTimeout(() => setSuccessMessage(''), 4000);
      setShowInterviewModal(false);
      
      // Update local state to reflect INTERVIEW_SCHEDULED
      setApplicants(applicants.map(app => 
        app.id === selectedApp.id ? { ...app, status: 'INTERVIEW_SCHEDULED' } : app
      ));
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to schedule interview. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDownloadResume = async (app) => {
    try {
      setDownloadingId(app.id);
      const response = await applicationService.downloadApplicantResume(app.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = (app.studentName || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.setAttribute('download', `${safeName}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading resume:', err);
      // Fallback check if resumeUrl is accessible directly
      if (app.resumeUrl) {
        window.open(app.resumeUrl.startsWith('http') ? app.resumeUrl : `http://localhost:8080/${app.resumeUrl}`, '_blank');
      } else {
        alert(err.response?.data?.message || 'Resume document not available for this applicant.');
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED': 
        return <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800">Applied</span>;
      case 'UNDER_REVIEW': 
        return <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-200 dark:border-amber-800">Under Review</span>;
      case 'SHORTLISTED': 
        return <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold rounded-full border border-cyan-200 dark:border-cyan-800">Shortlisted</span>;
      case 'TEST_SCHEDULED': 
        return <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800">Test Scheduled</span>;
      case 'INTERVIEW_SCHEDULED': 
        return <span className="px-2.5 py-1 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-full border border-violet-200 dark:border-violet-800">Interview Scheduled</span>;
      case 'SELECTED': 
        return <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">Selected</span>;
      case 'REJECTED': 
        return <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full border border-rose-200 dark:border-rose-800">Rejected</span>;
      case 'WITHDRAWN': 
        return <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">Withdrawn</span>;
      default: 
        return <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link 
          to="/recruiter/jobs" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </Link>

        {/* Job Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">Position:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition cursor-pointer shadow-xs max-w-xs"
          >
            <option value="">All Job Positions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} {j.status ? `(${j.status})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Candidate Pipeline
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {job ? `Applicants: ${job.title}` : 'Company Candidate Applications'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Review applicant skill match percentages, download verified resumes, progress candidate stages, and schedule interview rounds.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 self-start md:self-auto text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{applicants.length}</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Retrieving applicant submissions...</p>
        </div>
      ) : applicants.length === 0 && !error ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/40">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Candidate submissions will appear here once students discover and apply to your job postings.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-5">Applicant</th>
                  <th className="p-5">Job Position</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Match Rating</th>
                  <th className="p-5">Stage</th>
                  <th className="p-5">Resume / Pitch</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {applicants.map((app) => {
                  const m = matchMap[app.id];
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {app.studentName}
                        </div>
                        {app.studentEmail && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{app.studentEmail}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg">
                          <Briefcase className="w-3 h-3 text-indigo-500" />
                          {app.jobTitle || 'Position'}
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 dark:text-slate-400 text-xs font-medium whitespace-nowrap">
                        {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5">
                        {m ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${m.eligible ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                style={{ width: `${m.matchScore}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${m.eligible ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                              {m.matchScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => handleDownloadResume(app)}
                          disabled={downloadingId === app.id}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-100 dark:border-indigo-800/50 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                        >
                          {downloadingId === app.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>Download Resume</span>
                        </button>
                        {app.coverLetter && (
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs" title={app.coverLetter}>
                            <strong>Pitch:</strong> {app.coverLetter}
                          </p>
                        )}
                      </td>
                      <td className="p-5 text-right">
                        {app.status === 'WITHDRAWN' ? (
                          <span className="text-xs text-slate-400 italic">Withdrawn by student</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openInterviewModal(app)}
                              title="Schedule Interview"
                              className="inline-flex items-center gap-1.5 text-xs font-bold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-3 py-1.5 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900 transition cursor-pointer"
                            >
                              <Calendar className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400"/> Schedule Interview
                            </button>
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              className="text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition cursor-pointer"
                            >
                              <option value="APPLIED">Applied</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="TEST_SCHEDULED">Test Scheduled</option>
                              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                              <option value="SELECTED">Selected</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Schedule Interview
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Candidate: {selectedApp?.studentName}
                  </span>
                  {selectedApp?.studentEmail && (
                    <span className="text-slate-400 font-medium">({selectedApp.studentEmail})</span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {selectedApp?.jobTitle || job?.title || 'Selected Role'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowInterviewModal(false)}
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

            <form onSubmit={handleScheduleInterview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Round Type *</label>
                <select 
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none cursor-pointer"
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewType: e.target.value})}
                  required
                >
                  <option value="TECHNICAL">Technical Round</option>
                  <option value="HR">HR / Behavioral</option>
                  <option value="MANAGERIAL">Managerial / Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Scheduled Date & Time *</label>
                <input 
                  type="datetime-local" 
                  min={minDateTime}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({...interviewForm, scheduledAt: e.target.value})}
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Interviews must be scheduled for a future date and time.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Virtual Meeting Link</label>
                  <input 
                    type="url" 
                    placeholder="https://meet.google.com/xyz-..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Campus Location</label>
                  <input 
                    type="text" 
                    placeholder="Room 204, Placement Cell"
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                    value={interviewForm.location}
                    onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Interviewer Name / Panel Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lead Software Architect & Tech Lead"
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none"
                  value={interviewForm.interviewerName}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Special Instructions / Candidate Notes</label>
                <textarea 
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none resize-none"
                  placeholder="Coding exercise instructions, required ID proofs, or candidate preparation guidelines..."
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({...interviewForm, notes: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowInterviewModal(false)} 
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
                  {modalLoading ? 'Scheduling...' : 'Confirm & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobApplicants;
