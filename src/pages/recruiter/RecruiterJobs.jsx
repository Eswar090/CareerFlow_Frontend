import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Plus, Loader2, Trash2, Edit } from 'lucide-react';
import jobService from '../../services/jobService';

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getRecruiterJobs({ page: 0, size: 50 });
      setJobs(data.content || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await jobService.updateJobStatus(id, status);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        fetchJobs();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Jobs</h2>
          <p className="text-gray-500 text-sm mt-1">Create and manage your company's job postings.</p>
        </div>
        <Link
          to="/recruiter/jobs/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Post a Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {jobs.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first job posting.</p>
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                <th className="p-4">Job Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date Posted</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                        job.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                        job.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{job.employmentType}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="View Applicants"
                      >
                        <Briefcase className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/recruiter/jobs/${job.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;

