import React, { useState, useEffect } from 'react';
import interviewService from '../../services/interviewService';
import { Calendar, User, Check, X, Edit, Plus, Trash2 } from 'lucide-react';

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await interviewService.getRecruiterInterviews();
      setInterviews(res.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await interviewService.updateInterviewStatus(id, { status });
      setInterviews(interviews.map(i => i.id === id ? { ...i, status } : i));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to cancel and delete this interview?')) return;
    try {
      await interviewService.deleteInterview(id);
      setInterviews(interviews.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Interviews</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg border">No interviews scheduled yet.</div>
      ) : (
        <div className="grid gap-6">
          {interviews.map(inv => (
            <div key={inv.id} className="bg-white p-6 rounded-xl border flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{inv.jobTitle}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <User className="w-4 h-4" /> Candidate: {inv.studentName}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{new Date(inv.scheduledAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">{inv.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`font-medium px-2 py-1 rounded text-xs ${inv.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' : inv.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {inv.status === 'SCHEDULED' && (
                  <>
                    <button onClick={() => handleUpdateStatus(inv.id, 'COMPLETED')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2">
                      <Check className="w-4 h-4"/> Mark Completed
                    </button>
                    <button onClick={() => handleUpdateStatus(inv.id, 'CANCELLED')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                      <X className="w-4 h-4"/> Cancel
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(inv.id)} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4"/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviews;
