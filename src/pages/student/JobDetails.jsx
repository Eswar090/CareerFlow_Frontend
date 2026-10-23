import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Briefcase, Calendar, DollarSign, Building2, Loader2, 
  ArrowLeft, FileText, CheckCircle, AlertTriangle, XCircle, 
  BookOpen, TrendingUp, Sparkles, Clock, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import * as studentService from '../../services/studentService';
import matchingService from '../../services/matchingService';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';

const PRIORITY_COLORS = {
  HIGH: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
  MEDIUM: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
  LOW: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Application State
  const [resumes, setResumes] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // Skill Match State
  const [matchData, setMatchData] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // AI Job Insights State
  const [aiJobInsight, setAiJobInsight] = useState(null);
  const [aiJobLoading, setAiJobLoading] = useState(false);
  const [aiJobError, setAiJobError] = useState('');

  // AI Skill Gap State
  const [aiGapAnalysis, setAiGapAnalysis] = useState(null);
  const [aiGapLoading, setAiGapLoading] = useState(false);
  const [aiGapError, setAiGapError] = useState('');

  // AI Learning Roadmap State
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [aiRoadmapLoading, setAiRoadmapLoading] = useState(false);
  const [aiRoadmapError, setAiRoadmapError] = useState('');

  useEffect(() => {
    fetchJobDetails();
    fetchResumes();
    fetchMatchData();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const data = await jobService.getPublicJobById(id);
      setJob(data);
    } catch (err) {
      setError('Failed to load job details. The job might not exist or is closed.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await studentService.getMyResumes();
      const list = res.data || res;
      setResumes(list);
      if (list && list.length > 0) {
        const active = list.find(r => r.active);
        setSelectedResume(active ? active.id : list[0].id);
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  const fetchMatchData = async () => {
    setMatchLoading(true);
    try {
      const res = await matchingService.getMatch(id);
      setMatchData(res.data || res);
    } catch (err) {
      console.error('Could not load match data:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleGenerateJobInsight = async () => {
    setAiJobLoading(true);
    setAiJobError('');
    try {
      const res = await aiService.analyzeJob(id);
      setAiJobInsight(res.data || res);
    } catch (err) {
      setAiJobError(err.response?.data?.message || 'AI analysis failed. Please try again later.');
    } finally {
      setAiJobLoading(false);
    }
  };

  const handleGenerateSkillGap = async () => {
    setAiGapLoading(true);
    setAiGapError('');
    try {
      const res = await aiService.getSkillGapAnalysis(id);
      setAiGapAnalysis(res.data || res);
    } catch (err) {
      setAiGapError(err.response?.data?.message || 'AI skill gap analysis failed. Please try again later.');
    } finally {
      setAiGapLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setAiRoadmapLoading(true);
    setAiRoadmapError('');
    try {
      const res = await aiService.getLearningRoadmap(id);
      setAiRoadmap(res.data || res);
    } catch (err) {
      setAiRoadmapError(err.response?.data?.message || 'AI roadmap generation failed. Please try again later.');
    } finally {
      setAiRoadmapLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedResume) {
      setApplyError('Please choose a resume to submit.');
      return;
    }

    setApplying(true);
    setApplyError('');
    try {
      await applicationService.applyForJob(parseInt(id), {
        resumeId: parseInt(selectedResume),
        coverLetter: coverLetter.trim() || undefined
      });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        navigate('/student/applications');
      }, 1500);
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      if (status === 409) {
        setApplyError('You have already applied for this position.');
      } else if (status === 401) {
        setApplyError('Your session has expired. Please log in again to submit your application.');
      } else if (status === 403) {
        setApplyError(serverMsg || 'You are not authorized to submit this application.');
      } else if (status === 404) {
        setApplyError(serverMsg || 'The requested job or selected resume could not be found.');
      } else if (status === 400) {
        setApplyError(serverMsg || 'Invalid application request. Please verify all fields.');
      } else if (!err.response) {
        setApplyError('Network failure. Please check your internet connection and try again.');
      } else {
        setApplyError(serverMsg || 'An unexpected server error occurred. Please try again later.');
      }
    } finally {
      setApplying(false);
    }
  };

  const formatEmploymentType = (type) => {
    if (!type) return '';
    return type.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Retrieving job specification...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Job Unavailable</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'Job not found'}</p>
          <Link 
            to="/student/jobs" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Back Button */}
      <Link 
        to="/student/jobs" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </Link>

      {/* Main Job Hero Card */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 md:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center shrink-0 shadow-xs text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full mb-2 border border-indigo-100 dark:border-indigo-800/40">
                <Briefcase className="w-3.5 h-3.5" /> {formatEmploymentType(job.employmentType)}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h1>
              <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {job.company?.name || 'Verified Partner'}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {job.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> Exp: {job.experienceRequired} yrs
                </span>
                {(job.salaryMin || job.salaryMax) && (
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 rounded-lg font-bold">
                    <DollarSign className="w-3.5 h-3.5" /> ₹{job.salaryMin || 0} - ₹{job.salaryMax || 'Open'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="shrink-0 flex flex-col gap-2.5 md:w-56 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            {job.status === 'OPEN' ? (
              <button 
                onClick={() => setShowApplyModal(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 px-6 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Apply Now
              </button>
            ) : (
              <button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 py-3.5 px-6 rounded-xl font-bold cursor-not-allowed text-sm">
                Position Closed
              </button>
            )}
            {job.applicationDeadline && (
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Job Description */}
        <section className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Role Overview & Requirements
          </h2>
          <div className="prose max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </section>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <section className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">
              Required Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {job.skills.map(skill => (
                <div key={skill.id} className="px-3.5 py-2 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-100 dark:border-indigo-800/50 flex items-center gap-2">
                  <span>{skill.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span className="text-[10px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-extrabold">{skill.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Your Skill Match ─────────────────────────────────── */}
        <section className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Skill Compatibility Analysis</h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Automated comparison against your profile skills</p>
            </div>
            {matchLoading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />}
          </div>

          {!matchLoading && !matchData && (
            <div className="p-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              Could not evaluate match data. Make sure you have added your skills in your profile.
            </div>
          )}

          {matchData && (
            <div className="p-6 md:p-8 space-y-6">
              {/* Score + eligibility banner */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border ${
                matchData.eligible ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60' : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`text-4xl font-black ${matchData.eligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {matchData.matchScore}%
                  </div>
                  <div>
                    <div className={`text-sm font-bold flex items-center gap-1.5 ${matchData.eligible ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'}`}>
                      {matchData.eligible ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Eligible & Well Matched
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          Below recommended eligibility threshold (60%)
                        </>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                      {matchData.matchedSkills} of {matchData.requiredSkills} required skills matched
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full sm:w-48 h-3 bg-slate-200/70 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      matchData.eligible ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${matchData.matchScore}%` }}
                  />
                </div>
              </div>

              {/* Skill-by-skill breakdown */}
              {matchData.skillMatches && matchData.skillMatches.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Breakdown</h3>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {matchData.skillMatches.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/50 text-xs">
                        {s.matched ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : s.studentLevel ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className={`font-bold ${s.matched ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                          {s.skillName}
                        </span>
                        {s.matched ? (
                          <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-bold">{s.studentLevel}</span>
                        ) : s.studentLevel ? (
                          <span className="ml-auto text-amber-700 dark:text-amber-300 font-semibold">
                            Yours: {s.studentLevel} · Req: {s.requiredLevel}
                          </span>
                        ) : (
                          <span className="ml-auto text-rose-500 dark:text-rose-400 font-semibold">Missing · Req: {s.requiredLevel}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── AI Job Insights ──────────────────────────────────── */}
        <AiInsightPanel
          title="AI Job Insights"
          loading={aiJobLoading}
          error={aiJobError}
          onGenerate={handleGenerateJobInsight}
          hasData={!!aiJobInsight}
        >
          {aiJobInsight && (
            <div className="space-y-4 text-sm text-slate-700">
              {aiJobInsight.summary && (
                <p className="leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-slate-800 font-medium">
                  {aiJobInsight.summary}
                </p>
              )}
              {aiJobInsight.careerLevel && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Career Level:</span>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">{aiJobInsight.careerLevel}</span>
                </div>
              )}
              {aiJobInsight.keyResponsibilities && aiJobInsight.keyResponsibilities.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-2">Key Responsibilities</p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs md:text-sm">
                    {aiJobInsight.keyResponsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {aiJobInsight.importantSkills && aiJobInsight.importantSkills.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-2">Important Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {aiJobInsight.importantSkills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {aiJobInsight.preparationSuggestions && aiJobInsight.preparationSuggestions.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-2">Preparation Tips</p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs md:text-sm">
                    {aiJobInsight.preparationSuggestions.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </AiInsightPanel>

        {/* ── AI Skill Gap Explanation ─────────────────────────── */}
        <AiInsightPanel
          title="AI Skill Gap Explanation"
          loading={aiGapLoading}
          error={aiGapError}
          onGenerate={handleGenerateSkillGap}
          hasData={!!aiGapAnalysis}
        >
          {aiGapAnalysis && (
            <div className="space-y-4 text-sm text-slate-700">
              {aiGapAnalysis.explanation && (
                <p className="leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-slate-800 font-medium">
                  {aiGapAnalysis.explanation}
                </p>
              )}
              {aiGapAnalysis.prioritySkills && aiGapAnalysis.prioritySkills.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-2">Priority Skills to Acquire</p>
                  <div className="space-y-2">
                    {aiGapAnalysis.prioritySkills.map((ps, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${PRIORITY_COLORS[ps.priority] || 'bg-slate-100 text-slate-600'}`}>
                          {ps.priority}
                        </span>
                        <span className="font-bold text-slate-800">{ps.skillName}</span>
                        {ps.reason && <span className="ml-auto text-xs text-slate-500 truncate max-w-[280px]">{ps.reason}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {aiGapAnalysis.recommendations && aiGapAnalysis.recommendations.length > 0 && (
                <div>
                  <p className="font-bold text-slate-900 mb-2">Recommendations</p>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs md:text-sm">
                    {aiGapAnalysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </AiInsightPanel>

        {/* ── AI Learning Roadmap ───────────────────────────────── */}
        <AiInsightPanel
          title="AI Learning Roadmap"
          loading={aiRoadmapLoading}
          error={aiRoadmapError}
          onGenerate={handleGenerateRoadmap}
          hasData={!!aiRoadmap}
        >
          {aiRoadmap && (
            <div className="space-y-4 text-sm text-slate-700">
              {aiRoadmap.overview && (
                <p className="leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-slate-800 font-medium">
                  {aiRoadmap.overview}
                </p>
              )}
              {aiRoadmap.estimatedDuration && (
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 bg-violet-50 px-3.5 py-1.5 rounded-full w-fit border border-violet-100">
                  <BookOpen className="w-3.5 h-3.5" />
                  Estimated Time: {aiRoadmap.estimatedDuration}
                </div>
              )}
              {aiRoadmap.phases && aiRoadmap.phases.length > 0 && (
                <div className="space-y-3.5 mt-2">
                  {aiRoadmap.phases.map((phase, i) => (
                    <div key={i} className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                          {i + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-base">{phase.title}</span>
                        {phase.duration && (
                          <span className="ml-auto text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">{phase.duration}</span>
                        )}
                      </div>
                      {phase.topics && phase.topics.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-bold text-slate-700 mb-1.5">Topics:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.topics.map((t, ti) => (
                              <span key={ti} className="px-2.5 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-lg border border-slate-200">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {phase.practiceTasks && phase.practiceTasks.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-bold text-slate-700 mb-1.5">Practice Tasks:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {phase.practiceTasks.map((task, ti) => (
                              <li key={ti} className="text-xs text-slate-600">{task}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {phase.projectSuggestion && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                          <TrendingUp className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span><span className="font-bold">Project Idea:</span> {phase.projectSuggestion}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AiInsightPanel>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Apply for Position</h2>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{job.title} • {job.company?.name}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleApply} className="p-6 space-y-5">
              {applySuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Your application has been submitted successfully.</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Redirecting you to your applications tracker...</p>
                </div>
              ) : (
                <>
                  {applyError && (
                    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl">
                      {applyError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Select Attached Resume *
                    </label>
                    {resumes.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {resumes.map(resume => (
                          <label 
                            key={resume.id} 
                            className={`flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                              selectedResume === resume.id 
                                ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-600 ring-2 ring-indigo-600/20' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="resume" 
                              value={resume.id}
                              checked={selectedResume === resume.id}
                              onChange={() => setSelectedResume(resume.id)}
                              className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {resume.fileName}
                            </span>
                            {resume.active && (
                              <span className="ml-auto text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 font-extrabold px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                        No resumes found. Please upload a resume in your profile first.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Cover Letter or Pitch (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl p-3.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition resize-none"
                      placeholder="Briefly state why your skills and background make you a standout candidate..."
                    />
                  </div>
                </>
              )}

              {!applySuccess && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    disabled={applying}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying || !selectedResume}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 disabled:opacity-50 transition shadow-md shadow-indigo-600/20"
                  >
                    {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Application
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
