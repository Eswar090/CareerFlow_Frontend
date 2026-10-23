import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Users, ArrowLeft, Search, Filter, 
  CheckCircle2, Award, Clock, AlertCircle, RefreshCw, Edit
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';

const AdminDriveRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Status update modal / inline
  const [selectedReg, setSelectedReg] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDriveAndRegistrations();
  }, [id, statusFilter]);

  const fetchDriveAndRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dRes, rRes] = await Promise.all([
        placementDriveService.getAdminDriveDetails(id),
        placementDriveService.getAdminDriveRegistrations(id, {
          search: search || undefined,
          status: statusFilter || undefined
        })
      ]);
      setDrive(dRes.data);
      setRegistrations(rRes.data?.content || rRes.data || []);
    } catch (err) {
      console.error('Failed to load drive registrations', err);
      setError('Failed to fetch drive registrations.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReg) return;
    try {
      setUpdating(true);
      setError(null);
      await placementDriveService.updateRegistrationStatusByAdmin(selectedReg.registrationId, {
        status: newStatus,
        remarks: remarks || undefined
      });
      setSuccessMsg(`Status updated to ${newStatus} for ${selectedReg.studentName}`);
      setSelectedReg(null);
      setRemarks('');
      fetchDriveAndRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update registration status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Selected</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold">Shortlisted</span>;
      case 'REGISTERED':
        return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">Registered</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">Rejected</span>;
      case 'WITHDRAWN':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Withdrawn</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/admin/placement-drives')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Placement Drives
      </button>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Candidate Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{drive?.title}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Company: <strong className="text-slate-700">{drive?.companyName}</strong> | 
            Drive Date: <strong className="text-slate-700">{formatDate(drive?.driveDate)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
            <span className="text-[10px] uppercase font-bold text-indigo-400">Total Applied</span>
            <div className="text-xl font-black text-indigo-700">{registrations.length}</div>
          </div>
        </div>
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

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate by name, email, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Statuses</option>
          <option value="REGISTERED">REGISTERED</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="SELECTED">SELECTED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="WITHDRAWN">WITHDRAWN</option>
        </select>

        <button
          onClick={fetchDriveAndRegistrations}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Candidate</th>
                <th className="p-4">Branch & College</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Backlogs</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">Loading candidate registrations...</td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">No candidate registrations found.</td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.registrationId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.studentName}</div>
                      <div className="text-xs text-slate-400">{r.studentEmail}</div>
                      {r.phone && <div className="text-[11px] text-slate-400">{r.phone}</div>}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-semibold text-slate-800">{r.branch || 'N/A'}</div>
                      <div className="text-slate-400">{r.university || 'N/A'}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{r.cgpa ?? 'N/A'}</td>
                    <td className="p-4 font-bold text-slate-700">{r.activeBacklogs ?? 0}</td>
                    <td className="p-4 text-xs text-slate-500">{formatDate(r.registeredAt)}</td>
                    <td className="p-4">{getStatusBadge(r.status)}</td>
                    <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{r.remarks || '—'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReg(r);
                          setNewStatus(r.status);
                          setRemarks(r.remarks || '');
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Update Candidate Status
            </h3>
            <p className="text-xs text-slate-500">
              Candidate: <strong>{selectedReg.studentName}</strong> ({selectedReg.studentEmail})
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="REGISTERED">REGISTERED</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="SELECTED">SELECTED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="WITHDRAWN">WITHDRAWN</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Feedback</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Cleared technical interview round..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDriveRegistrations;

