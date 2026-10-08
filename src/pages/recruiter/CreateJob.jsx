import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import jobService from '../../services/jobService';

const CreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: 'FULL_TIME',
    experienceRequired: 0,
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    if (isEditing) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const data = await jobService.getRecruiterJobById(id);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        location: data.location || '',
        employmentType: data.employmentType || 'FULL_TIME',
        experienceRequired: data.experienceRequired || 0,
        salaryMin: data.salaryMin || '',
        salaryMax: data.salaryMax || '',
        applicationDeadline: data.applicationDeadline ? data.applicationDeadline.split('T')[0] : '',
        status: data.status || 'DRAFT'
      });
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experienceRequired' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Prepare data
    const payload = { ...formData };
    if (!payload.salaryMin) delete payload.salaryMin;
    if (!payload.salaryMax) delete payload.salaryMax;
    if (!payload.applicationDeadline) delete payload.applicationDeadline;

    try {
      if (isEditing) {
        await jobService.updateJob(id, payload);
      } else {
        await jobService.createJob(payload);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
      setSaving(false);
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
    <div className="max-w-3xl mx-auto p-6">
      <button 
        onClick={() => navigate('/recruiter/jobs')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Job Posting' : 'Create New Job'}
          </h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Remote, New York, NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required (Years) *</label>
                <input
                  type="number"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary (Optional)</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary (Optional)</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the role, responsibilities, and requirements..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;

