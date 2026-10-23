import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Calendar, MapPin, Award, CheckCircle2, 
  ArrowLeft, Save, AlertCircle, Briefcase, GraduationCap
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';
import jobService from '../../services/jobService';

const RecruiterCreatePlacementDrive = () => {
  const { id } = useParams(); // If id exists, it's Edit mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [companyJobs, setCompanyJobs] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobId: '',
    eligibleBranches: 'CSE, IT, ECE',
    minimumCgpa: 7.0,
    maxActiveBacklogs: 0,
    registrationDeadline: '',
    driveDate: '',
    location: 'Campus Auditorium',
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchRecruiterJobs();
    if (isEditMode) {
      fetchDriveToEdit();
    }
  }, [id]);

  const fetchRecruiterJobs = async () => {
    try {
      const res = await jobService.getRecruiterJobs();
      setCompanyJobs(res.data?.content || res.data || []);
    } catch (err) {
      console.warn('Could not load company jobs for picker', err);
    }
  };

  const fetchDriveToEdit = async () => {
    try {
      setFetching(true);
      setError('');
      const res = await placementDriveService.getRecruiterDriveDetails(id);
      const d = res.data;
      setFormData({
        title: d.title || '',
        description: d.description || '',
        jobId: d.jobId ? String(d.jobId) : '',
        eligibleBranches: d.eligibleBranches || 'ALL',
        minimumCgpa: d.minimumCgpa ?? 0,
        maxActiveBacklogs: d.maxActiveBacklogs ?? 0,
        registrationDeadline: d.registrationDeadline ? d.registrationDeadline.substring(0, 16) : '',
        driveDate: d.driveDate ? d.driveDate.substring(0, 16) : '',
        location: d.location || '',
        status: d.status || 'DRAFT'
      });
    } catch (err) {
      console.error('Failed to load drive details for edit', err);
      setError('Unable to load placement drive details.');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Drive title is required.');
      return;
    }
    if (!formData.registrationDeadline) {
      setError('Registration deadline is required.');
      return;
    }
    if (!formData.driveDate) {
      setError('Drive date is required.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        jobId: formData.jobId ? parseInt(formData.jobId) : undefined,
        eligibleBranches: formData.eligibleBranches.trim() || 'ALL',
        minimumCgpa: parseFloat(formData.minimumCgpa) || 0.0,
        maxActiveBacklogs: parseInt(formData.maxActiveBacklogs) || 0,
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
        driveDate: new Date(formData.driveDate).toISOString(),
        location: formData.location.trim() || 'Campus',
        status: formData.status
      };

      if (isEditMode) {
        await placementDriveService.updateRecruiterDrive(id, payload);
      } else {
        await placementDriveService.createRecruiterDrive(payload);
      }

      navigate('/recruiter/placement-drives');
    } catch (err) {
      console.error('Failed to save placement drive', err);
      setError(err.response?.data?.message || 'Failed to save placement drive. Please verify all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-400">Loading drive specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Navigation and Title */}
      <div>
        <Link
          to="/recruiter/placement-drives"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Company Placement Drives
        </Link>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEditMode ? 'Edit Placement Drive' : 'Author Campus Placement Drive'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          {isEditMode 
            ? 'Update drive parameters, modify academic criteria, or adjust schedule dates.' 
            : 'Configure recruitment specifications, candidate eligibility rules, and registration deadlines.'}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-xs space-y-6">
        {/* Drive Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Drive Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. 2026 Campus Graduate Engineer Trainee Drive"
            className="w-full px-4 py-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Drive Description & Process Overview
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context regarding roles, selection rounds, CTC band, and expectations..."
            className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Associated Job (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            Attach Job Posting (Optional)
          </label>
          <select
            name="jobId"
            value={formData.jobId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
          >
            <option value="">-- No specific job attached (General Campus Drive) --</option>
            {companyJobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.location || 'Remote'})
              </option>
            ))}
          </select>
        </div>

        {/* Eligibility Criteria Grid */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" /> Academic Eligibility Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="minimumCgpa"
                value={formData.minimumCgpa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Active Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="10"
                name="maxActiveBacklogs"
                value={formData.maxActiveBacklogs}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Eligible Branches
              </label>
              <input
                type="text"
                name="eligibleBranches"
                value={formData.eligibleBranches}
                onChange={handleChange}
                placeholder="e.g. CSE, IT, ECE (or ALL)"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Logistics Grid */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Schedule & Logistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Drive Date & Time *
              </label>
              <input
                type="datetime-local"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Location / Venue
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Campus Seminar Hall or Virtual"
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Publication Status */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
            Drive Status
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { val: 'DRAFT', label: 'Save as Draft', desc: 'Hidden from students until you are ready' },
              { val: 'PUBLISHED', label: 'Publish Immediately', desc: 'Visible to students and open for registrations' }
            ].map(opt => (
              <label
                key={opt.val}
                className={`flex-1 p-3.5 rounded-2xl border cursor-pointer transition ${
                  formData.status === opt.val
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    value={opt.val}
                    checked={formData.status === opt.val}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pl-5">{opt.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
          <Link
            to="/recruiter/placement-drives"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 shadow-md shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            {loading ? 'Saving Drive...' : isEditMode ? 'Update Drive Details' : 'Create Placement Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecruiterCreatePlacementDrive;

