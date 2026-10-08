import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [status]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getJobs(0, 50, search, status);
      setJobs(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const closeJob = async (id) => {
    if (!window.confirm('Are you sure you want to close this job? This action cannot be easily undone.')) return;
    try {
      await adminService.updateJobStatus(id, 'CLOSED');
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close job');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Management</h1>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[300px] flex gap-2">
          <input 
            type="text" placeholder="Search job title..." 
            className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Search className="w-5 h-5" />
          </button>
        </form>
        <select 
          className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={status} onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
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
                <th className="p-4">Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Applications</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{job.title}</td>
                  <td className="p-4 text-gray-600 text-sm">{job.company}</td>
                  <td className="p-4 text-gray-600 text-sm">{job.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${job.status === 'OPEN' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium">{job.applicationCount}</td>
                  <td className="p-4 text-right">
                    {job.status === 'OPEN' && (
                      <button 
                        onClick={() => closeJob(job.id)}
                        className="text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                      >
                        Close Job
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div className="p-8 text-center text-gray-500">No jobs found.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;

