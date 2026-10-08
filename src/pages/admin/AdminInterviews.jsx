import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Interview Monitoring</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4">
        <select 
          className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={status} onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm font-medium text-gray-500">
                <th className="p-4">Candidate</th>
                <th className="p-4">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Interview Type</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {interviews.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{inv.candidateName}</td>
                  <td className="p-4 text-gray-600 text-sm">{inv.jobTitle}</td>
                  <td className="p-4 text-gray-600 text-sm">{inv.companyName}</td>
                  <td className="p-4 text-sm">{inv.interviewType}</td>
                  <td className="p-4 text-sm">{new Date(inv.scheduledAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${inv.status === 'SCHEDULED' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {interviews.length === 0 && <div className="p-8 text-center text-gray-500">No interviews found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminInterviews;

