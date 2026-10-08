import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
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
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    
    setWithdrawing(id);
    try {
      await applicationService.withdrawApplication(id);
      // Refresh list
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(null);
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPLIED': return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">Applied</span>;
      case 'UNDER_REVIEW': return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">Under Review</span>;
      case 'SHORTLISTED': return <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">Shortlisted</span>;
      case 'TEST_SCHEDULED': return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">Test Scheduled</span>;
      case 'INTERVIEW_SCHEDULED': return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">Interview</span>;
      case 'SELECTED': return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">Selected</span>;
      case 'REJECTED': return <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">Rejected</span>;
      case 'WITHDRAWN': return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">Withdrawn</span>;
      default: return <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">{status}</span>;
    }
  };

  const canWithdraw = (status) => {
    return ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED'].includes(status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="p-4">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{app.jobTitle}</td>
                  <td className="p-4 text-gray-600">{app.companyName}</td>
                  <td className="p-4 text-gray-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4 text-right space-x-3">
                    <Link to={`/student/jobs/${app.jobId}`} className="text-sm text-blue-600 font-medium hover:underline">
                      View Job
                    </Link>
                    {canWithdraw(app.status) && (
                      <button 
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawing === app.id}
                        className="text-sm text-red-600 font-medium hover:underline disabled:opacity-50"
                      >
                        {withdrawing === app.id ? 'Withdrawing...' : 'Withdraw'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">You haven't applied to any jobs yet.</td>
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
