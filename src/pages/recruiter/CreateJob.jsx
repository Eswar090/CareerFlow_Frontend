import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Briefcase, DollarSign, Calendar, MapPin, Sparkles, Check } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Failed to save job details');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading position details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Link 
        to="/recruiter/jobs"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Listings
      </Link>

      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="px-6 md:px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-violet-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Requisition Editor
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {isEditing ? 'Update Job Posting' : 'Post New Opportunity'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Specify technical prerequisites, compensation range, and employment parameters.
          </p>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 p-4 rounded-2xl mb-6 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basics */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Role Basics</h2>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                  placeholder="e.g. Full Stack Software Engineer"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Location / Work Model *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                    placeholder="e.g. Remote / Hyderabad, India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Compensation & Requirements */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Experience & Compensation</h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Exp Required (Years) *
                  </label>
                  <input
                    type="number"
                    name="experienceRequired"
                    value={formData.experienceRequired}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Minimum Salary (₹)
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 600000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Maximum Salary (₹)
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 1200000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Publishing Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <option value="DRAFT">Draft (Unpublished)</option>
                    <option value="OPEN">Open (Accepting Applicants)</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Role Description & Expectations</h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Overview *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900 resize-none"
                  placeholder="Detail primary tasks, core stack, engineering values, and required qualifications..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isEditing ? 'Update Opportunity' : 'Publish Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
