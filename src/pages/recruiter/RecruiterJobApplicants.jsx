import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Download, FileText } from 'lucide-react';
import applicationService from '../../services/applicationService';
import interviewService from '../../services/interviewService';
import { Calendar } from 'lucide-react';
import jobService from '../../services/jobService';
import matchingService from '../../services/matchingService';

const RecruiterJobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchMap, setMatchMap] = useState({});
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ interviewType: 'TECHNICAL', scheduledAt: '', meetingLink: '', location: '', interviewerName: '', notes: '' }); // applicationId → SkillMatchResponse

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // First get job details
      const jobData = await jobService.getJobById(id);
      setJob(jobData);
      
      // Then get applicants
      const appData = await applicationService.getJobApplications(id);
      const apps = appData.data || appData;
      setApplicants(apps);

      // Load match scores lazily (non-blocking) – one request per applicant
      const scores = {};
      await Promise.all(apps.map(async (app) => {
        try {
          const mRes = await matchingService.getApplicationMatch(app.id);
          scores[app.id] = mRes.data || mRes;
        } catch (_) {
          // ignore per-applicant failure
        }
      }));
      setMatchMap(scores);
    } catch (err) {
      setError('Failed to load applicants or job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(appId, newStatus);
      // Update local state
      setApplicants(applicants.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  
  const openInterviewModal = (app) => {
    setSelectedApp(app);
    setShowInterviewModal(true);
    setInterviewForm({ interviewType: 'TECHNICAL', scheduledAt: '', meetingLink: '', location: '', interviewerName: '', notes: '' });
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await interviewService.createInterview(selectedApp.id, interviewForm);
      alert('Interview scheduled successfully');
      setShowInterviewModal(false);
      setApplicants(applicants.map(app => app.id === selectedApp.id ? { ...app, status: 'INTERVIEW_SCHEDULED' } : app));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const downloadResume = (app) => {
    // We can assume resumeUrl has a base /api endpoint, or we just open it in new tab.
    // The backend provides a download URL at: /api/students/me/resumes/{id}/download for students, 
    // but for recruiters we need an endpoint. Actually, the backend might just have it as part of a file server,
    // or maybe they didn't write a specific recruiter resume download endpoint.
    // Let's rely on the URL if it's full, or we might need to use a general URL.
    if (app.resumeUrl) {
       window.open(`http://localhost:8080/${app.resumeUrl}`, '_blank');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED': return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Applied</span>;
      case 'UNDER_REVIEW': return <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">Under Review</span>;
      case 'SHORTLISTED': return <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Shortlisted</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">Rejected</span>;
      case 'WITHDRAWN': return <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">Withdrawn</span>;
      default: return <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/recruiter/jobs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applicants for {job?.title}</h2>
          <p className="text-gray-500 mt-1">{applicants.length} total applications</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {applicants.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants yet</h3>
          <p className="text-gray-500">Wait for students to apply to this job posting.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                <th className="p-4">Student Name</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Skill Match</th>
                <th className="p-4">Status</th>
                <th className="p-4">Resume</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants.map((app) => {
                const m = matchMap[app.id];
                return (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{app.studentName}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {m ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${m.eligible ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ width: `${m.matchScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${m.eligible ? 'text-green-700' : 'text-red-600'}`}>
                          {m.matchScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => downloadResume(app)}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Download className="w-4 h-4" /> View Resume
                    </button>
                    {app.coverLetter && (
                      <div className="mt-2 text-xs text-gray-500 line-clamp-2" title={app.coverLetter}>
                        <strong>Cover:</strong> {app.coverLetter}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {app.status === 'WITHDRAWN' ? (
                      <span className="text-sm text-gray-400">Withdrawn by student</span>
                    ) : (
                      <>
                        {app.status === 'SHORTLISTED' && (
                          <button
                            onClick={() => openInterviewModal(app)}
                            className="ml-2 inline-flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                          >
                            <Calendar className="w-3 h-3"/> Schedule Interview
                          </button>
                        )}
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="TEST_SCHEDULED">Test Scheduled</option>
                          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                          <option value="SELECTED">Selected</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule Interview for {selectedApp?.studentName}</h2>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Interview Type</label>
                <select 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewType: e.target.value})}
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="HR">HR</option>
                  <option value="MANAGERIAL">Managerial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({...interviewForm, scheduledAt: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Meeting Link (Online)</label>
                <input 
                  type="url" 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location (Offline)</label>
                <input 
                  type="text" 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.location}
                  onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Interviewer Name</label>
                <input 
                  type="text" 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.interviewerName}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  className="w-full mt-1 border rounded-lg p-2"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({...interviewForm, notes: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecruiterJobApplicants;

