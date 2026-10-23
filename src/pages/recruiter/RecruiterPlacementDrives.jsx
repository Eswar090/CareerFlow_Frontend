import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Calendar, MapPin, Search, Users, 
  Award, Clock, AlertCircle, RefreshCw, PlusCircle, 
  Edit3, CheckCircle2, XCircle, ArrowUpRight, Sparkles, Filter
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';

const RecruiterPlacementDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PUBLISHED, DRAFT, CLOSED
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;
      const [drivesRes, statsRes] = await Promise.all([
        placementDriveService.getRecruiterDrives({
          search: search || undefined,
          status: statusParam
        }),
        placementDriveService.getRecruiterDriveStats().catch(() => ({ data: null }))
      ]);

      setDrives(drivesRes.data?.content || drivesRes.data || []);
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load recruiter drives', err);
      setError(err.response?.data?.message || 'Failed to load company placement drives.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleStatus = async (driveId, currentStatus) => {
    const newStatus = currentStatus === 'DRAFT' ? 'PUBLISHED' : 'CLOSED';
    const confirmMsg = currentStatus === 'DRAFT' 
      ? 'Publish this placement drive so eligible students can register?' 
      : 'Close registrations for this placement drive?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionId(driveId);
      await placementDriveService.updateRecruiterDriveStatus(driveId, newStatus);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update drive status.');
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Recruiter Placement Center
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Company Placement Drives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Author and orchestrate campus recruitment drives, review student registrations, and manage candidate pipelines.
          </p>
        </div>

        <Link
          to="/recruiter/placement-drives/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create Placement Drive
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Real-time KPI Stats Banner */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Drives</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalDrives}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Published</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.publishedDrives}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">Drafts</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.draftDrives}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Registered</span>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.totalRegistrations}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-500 dark:text-cyan-400">Shortlisted</span>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{stats.totalShortlisted}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-500 dark:text-purple-400">Selected</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.totalSelected}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: 'All Drives' },
            { key: 'PUBLISHED', label: 'Published' },
            { key: 'DRAFT', label: 'Drafts' },
            { key: 'CLOSED', label: 'Closed' },
            { key: 'COMPLETED', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
          />
        </form>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
              <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <Building2 className="w-16 h-16 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Placement Drives Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1 mb-6">
            {statusFilter !== 'ALL' || search 
              ? 'No drives match your current filter criteria.' 
              : 'You have not created any placement drives for your company yet.'}
          </p>
          <Link
            to="/recruiter/placement-drives/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Drive
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => {
            const isDraft = drive.status === 'DRAFT';
            const isPublished = drive.status === 'PUBLISHED';
            const isClosed = drive.status === 'CLOSED';
            const isCompleted = drive.status === 'COMPLETED';

            return (
              <div
                key={drive.id}
                className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Status & Title */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-snug">
                      {drive.title}
                    </h3>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 border ${
                      isPublished 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : isDraft
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {drive.status}
                    </span>
                  </div>

                  {drive.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                      {drive.description}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-[11px] font-bold border border-indigo-100 dark:border-indigo-800/60">
                      Min CGPA: {drive.minimumCgpa ? `${drive.minimumCgpa}+` : 'Open'}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold border border-slate-200/80 dark:border-slate-800/80">
                      {drive.eligibleBranches || 'All Branches'}
                    </span>
                    {drive.jobTitle && (
                      <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 rounded-xl text-[11px] font-bold border border-cyan-100 dark:border-cyan-800/60 truncate max-w-[200px]">
                        Role: {drive.jobTitle}
                      </span>
                    )}
                  </div>

                  {/* Dates & Location */}
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Drive Date: <strong className="text-slate-700 dark:text-slate-200 font-bold">{formatDate(drive.driveDate)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Deadline: <strong className="text-rose-600 dark:text-rose-400 font-bold">{formatDate(drive.registrationDeadline)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Venue: <strong className="text-slate-700 dark:text-slate-200 font-bold">{drive.location || 'Campus'}</strong></span>
                    </div>
                  </div>

                  {/* Funnel Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center border border-slate-200/80 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Registered</span>
                      <p className="text-base font-black text-indigo-600 dark:text-indigo-400">{drive.registeredCount || 0}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Shortlisted</span>
                      <p className="text-base font-black text-cyan-600 dark:text-cyan-400">{drive.shortlistedCount || 0}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Selected</span>
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{drive.selectedCount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recruiter/placement-drives/${drive.id}/candidates`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Candidates ({drive.registeredCount || 0})
                    </Link>

                    <Link
                      to={`/recruiter/placement-drives/${drive.id}/edit`}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Edit Drive Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Status Toggle Action */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    {isDraft && (
                      <button
                        onClick={() => handleToggleStatus(drive.id, 'DRAFT')}
                        disabled={actionId === drive.id}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Publish Drive Now
                      </button>
                    )}
                    {isPublished && (
                      <button
                        onClick={() => handleToggleStatus(drive.id, 'PUBLISHED')}
                        disabled={actionId === drive.id}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Close Registrations
                      </button>
                    )}
                    {(isClosed || isCompleted) && (
                      <span className="text-[11px] text-slate-400 font-semibold italic">Registrations concluded</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterPlacementDrives;
