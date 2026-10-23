import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, Calendar, MapPin, Award, CheckCircle2, 
  Clock, AlertCircle, ArrowLeft, ShieldCheck, XCircle, 
  ExternalLink, UserCheck, AlertTriangle
} from 'lucide-react';
import placementDriveService from '../../services/placementDriveService';

const StudentPlacementDriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchDriveAndEligibility();
  }, [id]);

  const fetchDriveAndEligibility = async () => {
    try {
      setLoading(true);
      setError(null);
      const [driveRes, eligRes] = await Promise.all([
        placementDriveService.getDriveDetails(id),
        placementDriveService.checkEligibility(id)
      ]);
      setDrive(driveRes.data);
      setEligibility(eligRes.data);
    } catch (err) {
      console.error('Failed to load drive details', err);
      setError(err.response?.data?.message || 'Failed to load placement drive details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!window.confirm('Are you sure you want to register for this placement drive?')) return;
    try {
      setActionLoading(true);
      setError(null);
      await placementDriveService.registerForDrive(id);
      setSuccessMsg('Successfully registered for this placement drive!');
      await fetchDriveAndEligibility();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your eligibility.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw your registration?')) return;
    try {
      setActionLoading(true);
      setError(null);
      await placementDriveService.withdrawRegistration(id);
      setSuccessMsg('Registration withdrawn.');
      await fetchDriveAndEligibility();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw registration.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Placement Drive Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">The placement drive you are looking for does not exist or has been removed.</p>
        <Link to="/student/placement-drives" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition">
          Back to Drives
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/student/placement-drives')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Placement Drives
      </button>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Main Drive Banner */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0 shadow-sm overflow-hidden">
              {drive.companyLogoUrl ? (
                <img src={drive.companyLogoUrl} alt={drive.companyName} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-indigo-500" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/40">
                Campus Drive
              </span>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{drive.title}</h1>
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{drive.companyName}</span>
                {drive.companyWebsite && (
                  <a
                    href={drive.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-xs"
                  >
                    Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-400">Drive Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              drive.status === 'PUBLISHED' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
              {drive.status}
            </span>
          </div>
        </div>

        {/* Schedule & Location Quick Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800/60">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Drive Date</div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">{formatDate(drive.driveDate)}</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800/60">
            <Clock className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Registration Deadline</div>
              <div className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatDate(drive.registrationDeadline)}</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800/60">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Drive Venue</div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">{drive.location || 'Campus Auditorium'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Eligibility Status Card */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Automated Eligibility Verification
        </h2>

        {eligibility?.alreadyRegistered ? (
          <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-200 text-base">You are registered for this drive!</h3>
                  <p className="text-indigo-700 dark:text-indigo-300 text-xs mt-0.5">
                    Registration Status: <strong className="uppercase">{eligibility.registrationStatus}</strong>
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold">
                {eligibility.registrationStatus}
              </span>
            </div>

            <div className="pt-3 border-t border-indigo-100 dark:border-indigo-800/50 flex items-center justify-between">
              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                Registered on: {formatDate(eligibility.registeredAt)}
              </span>
              <button
                onClick={handleWithdraw}
                disabled={actionLoading || drive.status !== 'PUBLISHED'}
                className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-850 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Withdraw Registration
              </button>
            </div>
          </div>
        ) : eligibility?.eligibilityStatus === 'PROFILE_INCOMPLETE' ? (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200">Student Profile Incomplete</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  Your academic profile must be completed to verify eligibility for campus placement drives.
                </p>
              </div>
            </div>

            <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1 pl-9 list-disc">
              {eligibility.reasons?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <div className="pt-2 pl-9">
              <Link
                to="/student/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Complete Profile Now
              </Link>
            </div>
          </div>
        ) : eligibility?.eligible ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">You are Eligible for this Placement Drive!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Your branch, CGPA, and backlog record satisfy all criteria defined by the recruiter.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
              <span className="text-xs text-emerald-800 dark:text-emerald-300">
                Ensure you register before the deadline: <strong>{formatDate(drive.registrationDeadline)}</strong>
              </span>
              <button
                onClick={handleRegister}
                disabled={actionLoading || drive.status !== 'PUBLISHED'}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Registering...' : 'Register for Drive Now'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3 text-rose-800 dark:text-rose-200">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-rose-900 dark:text-rose-200">Not Eligible for this Drive</h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  You do not meet one or more criteria set for this placement drive.
                </p>
              </div>
            </div>

            <ul className="text-xs text-rose-800 dark:text-rose-300 space-y-1 pl-9 list-disc">
              {eligibility?.reasons?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <div className="pt-3 pl-9 border-t border-rose-100 dark:border-rose-800/50">
              <button
                disabled
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
              >
                Registration Disabled (Ineligible)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drive Details & Criteria Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility Parameters */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Eligibility Criteria
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Minimum CGPA Required</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {drive.minimumCgpa ? `${drive.minimumCgpa} / 10.0` : 'No Minimum CGPA'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Max Active Backlogs</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {drive.maxActiveBacklogs ?? 0} allowed
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Eligible Branches</span>
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/40">
                {drive.eligibleBranches || 'All Branches'}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Role */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            About the Drive & Company
          </h3>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {drive.description || 'No detailed description provided for this placement drive.'}
          </div>

          {drive.jobTitle && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Job Role</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{drive.jobTitle}</p>
              </div>
              <Link
                to={`/student/jobs/${drive.jobId}`}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementDriveDetails;

