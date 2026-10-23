import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calendar, MapPin, Search, PlusCircle, 
  Users, Edit, CheckCircle2, Clock, AlertCircle, RefreshCw, X
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';
import adminService from '../../services/adminService';

const AdminPlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    companyId: '',
    eligibleBranches: 'CSE, IT, ECE',
    minimumCgpa: '7.0',
    maxActiveBacklogs: '0',
    registrationDeadline: '',
    driveDate: '',
    location: 'Campus Auditorium',
    status: 'PUBLISHED'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchDrives();
    fetchCompanies();
  }, [statusFilter]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await placementDriveService.getAdminDrives({
        search: search || undefined,
        status: statusFilter || undefined
      });
      setDrives(res.data?.content || res.data || []);
    } catch (err) {
      console.error('Failed to load admin drives', err);
      setError('Failed to fetch placement drives.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await adminService.getCompanies(0, 100);
      setCompanies(res.data?.content || []);
    } catch (err) {
      console.error('Failed to load companies', err);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (drive) => {
    setIsEditing(true);
    setEditId(drive.id);
    setFormData({
      title: drive.title || '',
      description: drive.description || '',
      companyId: drive.companyId || '',
      eligibleBranches: drive.eligibleBranches || 'ALL',
      minimumCgpa: drive.minimumCgpa !== null ? String(drive.minimumCgpa) : '0.0',
      maxActiveBacklogs: drive.maxActiveBacklogs !== null ? String(drive.maxActiveBacklogs) : '0',
      registrationDeadline: drive.registrationDeadline ? drive.registrationDeadline.substring(0, 16) : '',
      driveDate: drive.driveDate ? drive.driveDate.substring(0, 16) : '',
      location: drive.location || 'Campus Auditorium',
      status: drive.status || 'PUBLISHED'
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: formData.title,
        description: formData.description,
        companyId: Number(formData.companyId),
        eligibleBranches: formData.eligibleBranches,
        minimumCgpa: parseFloat(formData.minimumCgpa),
        maxActiveBacklogs: parseInt(formData.maxActiveBacklogs, 10),
        registrationDeadline: formData.registrationDeadline,
        driveDate: formData.driveDate,
        location: formData.location,
        status: formData.status
      };

      if (isEditing) {
        await placementDriveService.updateDrive(editId, payload);
        setSuccessMsg('Placement drive updated successfully!');
      } else {
        await placementDriveService.createDrive(payload);
        setSuccessMsg('Placement drive created successfully!');
      }

      setIsModalOpen(false);
      fetchDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save placement drive.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (driveId, newStatus) => {
    try {
      setError(null);
      await placementDriveService.updateDriveStatus(driveId, newStatus);
      setSuccessMsg(`Drive status updated to ${newStatus}`);
      fetchDrives();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update drive status.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Placement Drive Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create, configure, publish campus placement drives and manage candidate registrations.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 self-start"
        >
          <PlusCircle className="w-4 h-4" />
          Create Placement Drive
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search drives by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="CLOSED">CLOSED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <button
          onClick={fetchDrives}
          className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Drive Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Eligibility</th>
                <th className="p-4">Drive Date</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Status</th>
                <th className="p-4">Candidates</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">Loading placement drives...</td>
                </tr>
              ) : drives.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">No placement drives found.</td>
                </tr>
              ) : (
                drives.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{d.title}</div>
                      <div className="text-xs text-slate-400">{d.location || 'Campus'}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{d.companyName}</td>
                    <td className="p-4 text-xs">
                      <div><strong className="text-slate-600">Min CGPA:</strong> {d.minimumCgpa ?? 'None'}</div>
                      <div className="text-slate-400">{d.eligibleBranches || 'All Branches'}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold">{formatDate(d.driveDate)}</td>
                    <td className="p-4 text-xs font-semibold text-rose-600">{formatDate(d.registrationDeadline)}</td>
                    <td className="p-4">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          d.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : d.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : d.status === 'CLOSED'
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/admin/placement-drives/${d.id}/registrations`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {d.registeredCount} Applied
                      </Link>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(d)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        title="Edit Drive"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing ? 'Edit Placement Drive' : 'Create New Placement Drive'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drive Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graduate Software Engineer Drive 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company *</label>
                  <select
                    required
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Eligible Branches</label>
                  <input
                    type="text"
                    placeholder="e.g. CSE, IT, ECE (or ALL)"
                    value={formData.eligibleBranches}
                    onChange={(e) => setFormData({ ...formData, eligibleBranches: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="7.0"
                    value={formData.minimumCgpa}
                    onChange={(e) => setFormData({ ...formData, minimumCgpa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.maxActiveBacklogs}
                    onChange={(e) => setFormData({ ...formData, maxActiveBacklogs: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Drive Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.driveDate}
                    onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Campus Auditorium / Virtual Meet"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Guidelines</label>
                <textarea
                  rows="3"
                  placeholder="Drive schedule, rounds, and requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update Drive' : 'Create Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlacementDrives;

