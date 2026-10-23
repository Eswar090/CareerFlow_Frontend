import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calendar, MapPin, Search, Award, CheckCircle2, 
  Clock, AlertCircle, ArrowRight, ShieldCheck, Filter, RefreshCw
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';

const StudentPlacementDrives = () => {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-drives'
  const [drives, setDrives] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrives();
    fetchMyRegistrations();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await placementDriveService.getPublishedDrives({ search: search || undefined });
      setDrives(res.data?.content || res.data || []);
    } catch (err) {
      console.error('Failed to load drives', err);
      setError('Failed to fetch placement drives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const res = await placementDriveService.getMyRegistrations();
      setMyRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to load my registrations', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDrives();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Selected</span>;
      case 'SHORTLISTED':
        return <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Shortlisted</span>;
      case 'REGISTERED':
        return <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Registered</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Not Shortlisted</span>;
      case 'WITHDRAWN':
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full text-xs font-semibold">Withdrawn</span>;
      default:
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-400 rounded-full text-xs">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Campus Placement Drives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover campus recruitment opportunities, verify eligibility, and track registration status.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start border border-slate-200/50 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explore Drives ({drives.length})
          </button>
          <button
            onClick={() => setActiveTab('my-drives')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'my-drives'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My Registrations ({myRegistrations.length})
          </button>
        </div>
      </div>

      {activeTab === 'explore' ? (
        <>
          {/* Search bar */}
          <div className="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search drives by company, title, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </form>
            <button
              onClick={fetchDrives}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Search
            </button>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Drives Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
                  <div className="h-20 bg-slate-50 dark:bg-slate-800/40 rounded"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          ) : drives.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Placement Drives Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                There are currently no active placement drives matching your criteria. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drives.map((drive) => {
                const isRegistered = myRegistrations.some(
                  (r) => r.driveId === drive.id && r.registrationStatus !== 'WITHDRAWN'
                );

                return (
                  <div
                    key={drive.id}
                    className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-indigo-300 dark:hover:border-indigo-700 relative overflow-hidden"
                  >
                    {isRegistered && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> REGISTERED
                      </div>
                    )}

                    <div>
                      {/* Company & Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-sm overflow-hidden">
                          {drive.companyLogoUrl ? (
                            <img src={drive.companyLogoUrl} alt={drive.companyName} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pr-12">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 text-base">
                            {drive.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{drive.companyName}</p>
                        </div>
                      </div>

                      {/* Criteria Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                          Min CGPA: {drive.minimumCgpa ? `${drive.minimumCgpa}` : 'Open'}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold border border-amber-100 dark:border-amber-800/60">
                          Max Backlogs: {drive.maxActiveBacklogs ?? 0}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold">
                          {drive.eligibleBranches || 'All Branches'}
                        </span>
                      </div>

                      {/* Schedule info */}
                      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>Drive Date: <strong className="text-slate-700 dark:text-slate-200">{formatDate(drive.driveDate)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-rose-400" />
                          <span>Deadline: <strong className="text-rose-600 dark:text-rose-400">{formatDate(drive.registrationDeadline)}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>Location: <strong className="text-slate-700 dark:text-slate-200">{drive.location || 'Campus'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        to={`/student/placement-drives/${drive.id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        Check Eligibility & View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Registrations Tab */
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Registrations Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                You haven't registered for any placement drives yet. Switch to the Explore tab to find open drives.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{reg.driveTitle}</h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{reg.companyName}</p>
                      </div>
                      <div>{getStatusBadge(reg.registrationStatus)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 my-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase">Registered On</span>
                        <strong className="text-slate-700 dark:text-slate-200">{formatDate(reg.registeredAt)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase">Drive Date</span>
                        <strong className="text-slate-700 dark:text-slate-200">{formatDate(reg.driveDate)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase">Location</span>
                        <strong className="text-slate-700 dark:text-slate-200">{reg.location || 'Campus'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase">Drive Status</span>
                        <strong className="text-slate-700 dark:text-slate-200">{reg.driveStatus}</strong>
                      </div>
                    </div>

                    {reg.remarks && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 p-2.5 rounded-lg mb-3">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">Remarks:</span> {reg.remarks}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      to={`/student/placement-drives/${reg.driveId}`}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      Drive Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPlacementDrives;

