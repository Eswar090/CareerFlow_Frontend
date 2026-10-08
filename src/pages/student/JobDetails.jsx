import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, DollarSign, Building, Loader2, ArrowLeft, FileText, CheckCircle, AlertTriangle, XCircle, BookOpen, TrendingUp } from 'lucide-react';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import * as studentService from '../../services/studentService';
import matchingService from '../../services/matchingService';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700 border border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border border-green-200',
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
      setResumes(res.data || res);
      if (res && res.length > 0) {
        const active = res.find(r => r.active);
        setSelectedResume(active ? active.id : res[0].id);
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
      setAiRoadmapError(err.response?.data?.message || 'Could not generate learning roadmap. Please try again later.');
    } finally {
      setAiRoadmapLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedResume) {
      setApplyError('Please select a resume to apply.');
      return;
    }

    setApplying(true);
    setApplyError('');
    try {
      await applicationService.applyForJob(id, {
        resumeId: selectedResume,
        coverLetter: coverLetter
      });
      setApplySuccess(true);
      setTimeout(() => {
        setShowApplyModal(false);
        navigate('/student/applications');
      }, 2000);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply. You might have already applied.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-6">
        <Link to="/student/jobs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to="/student/jobs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between border-b pb-6 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-50 border flex items-center justify-center shrink-0">
              <Building className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="text-lg text-blue-600 font-medium mb-2">{job.company?.name}</div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {job.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> {job.employmentType}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Exp: {job.experienceRequired} yrs</span>
                {(job.salaryMin || job.salaryMax) && (
                  <span className="flex items-center gap-1 font-medium text-green-600">
                    <DollarSign className="w-4 h-4"/> ₹{job.salaryMin} - ₹{job.salaryMax}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-2 min-w-[200px]">
            {job.status === 'OPEN' ? (
              <button 
                onClick={() => setShowApplyModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Apply Now
              </button>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed">
                Job Closed
              </button>
            )}
            {job.applicationDeadline && (
              <p className="text-xs text-center text-gray-500">
                Apply before {new Date(job.applicationDeadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Job Description</h2>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </section>

          {job.skills && job.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <div key={skill.id} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 flex items-center gap-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                    <span className="text-xs uppercase">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About {job.company?.name}</h2>
            <p className="text-sm text-gray-600">Company details will be integrated in future phases.</p>
          </section>

          {/* ── Your Skill Match ─────────────────────────────────── */}
          <section className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-white p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Your Skill Match</h2>
              {matchLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            </div>

            {!matchLoading && !matchData && (
              <div className="p-5 text-sm text-gray-500">
                Could not load match data. Make sure you have added your skills to your profile.
              </div>
            )}

            {matchData && (
              <div className="p-5 space-y-5">
                {/* Score + eligibility banner */}
                <div className={`flex items-center gap-4 p-4 rounded-lg ${matchData.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`text-3xl font-extrabold ${matchData.eligible ? 'text-green-700' : 'text-red-600'}`}>
                    {matchData.matchScore}%
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${matchData.eligible ? 'text-green-800' : 'text-red-700'}`}>
                      {matchData.eligible ? '✓ Eligible' : '✗ Below recommended eligibility (60%)'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {matchData.matchedSkills}/{matchData.requiredSkills} required skills matched
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-auto max-w-[160px]">
                    <div
                      className={`h-full rounded-full ${matchData.eligible ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${matchData.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Skill-by-skill breakdown */}
                {matchData.skillMatches && matchData.skillMatches.length > 0 && (
                  <div className="space-y-2">
                    {matchData.skillMatches.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {s.matched ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        ) : s.studentLevel ? (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span className={`font-medium ${s.matched ? 'text-gray-800' : 'text-gray-600'}`}>
                          {s.skillName}
                        </span>
                        {s.matched ? (
                          <span className="ml-auto text-xs text-green-600">{s.studentLevel}</span>
                        ) : s.studentLevel ? (
                          <span className="ml-auto text-xs text-yellow-700">
                            Yours: {s.studentLevel} · Req: {s.requiredLevel}
                          </span>
                        ) : (
                          <span className="ml-auto text-xs text-red-500">Missing · Req: {s.requiredLevel}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {matchData.requiredSkills === 0 && (
                  <p className="text-sm text-gray-500">This job has no skill requirements listed.</p>
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
              <div className="space-y-4 text-sm text-gray-700">
                {aiJobInsight.summary && (
                  <p className="leading-relaxed">{aiJobInsight.summary}</p>
                )}
                {aiJobInsight.careerLevel && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Career Level:</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{aiJobInsight.careerLevel}</span>
                  </div>
                )}
                {aiJobInsight.keyResponsibilities && aiJobInsight.keyResponsibilities.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Key Responsibilities</p>
                    <ul className="list-disc list-inside space-y-1">
                      {aiJobInsight.keyResponsibilities.map((r, i) => (
                        <li key={i} className="text-gray-600">{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiJobInsight.importantSkills && aiJobInsight.importantSkills.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Important Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {aiJobInsight.importantSkills.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {aiJobInsight.preparationSuggestions && aiJobInsight.preparationSuggestions.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Preparation Tips</p>
                    <ul className="list-disc list-inside space-y-1">
                      {aiJobInsight.preparationSuggestions.map((tip, i) => (
                        <li key={i} className="text-gray-600">{tip}</li>
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
              <div className="space-y-4 text-sm text-gray-700">
                {aiGapAnalysis.explanation && (
                  <p className="leading-relaxed">{aiGapAnalysis.explanation}</p>
                )}
                {aiGapAnalysis.prioritySkills && aiGapAnalysis.prioritySkills.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Priority Skills to Acquire</p>
                    <div className="space-y-2">
                      {aiGapAnalysis.prioritySkills.map((ps, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[ps.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {ps.priority}
                          </span>
                          <span className="font-medium text-gray-800">{ps.skillName}</span>
                          {ps.reason && <span className="ml-auto text-xs text-gray-500 truncate max-w-[200px]">{ps.reason}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {aiGapAnalysis.recommendations && aiGapAnalysis.recommendations.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Recommendations</p>
                    <ul className="list-disc list-inside space-y-1">
                      {aiGapAnalysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-gray-600">{rec}</li>
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
              <div className="space-y-4 text-sm text-gray-700">
                {aiRoadmap.overview && (
                  <p className="leading-relaxed">{aiRoadmap.overview}</p>
                )}
                {aiRoadmap.estimatedDuration && (
                  <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full w-fit">
                    <BookOpen className="w-3 h-3" />
                    Estimated: {aiRoadmap.estimatedDuration}
                  </div>
                )}
                {aiRoadmap.phases && aiRoadmap.phases.length > 0 && (
                  <div className="space-y-4 mt-2">
                    {aiRoadmap.phases.map((phase, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-gray-900">{phase.title}</span>
                          {phase.duration && (
                            <span className="ml-auto text-xs text-gray-500">{phase.duration}</span>
                          )}
                        </div>
                        {phase.topics && phase.topics.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {phase.topics.map((t, ti) => (
                                <span key={ti} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">{t}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {phase.practiceTasks && phase.practiceTasks.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Practice Tasks:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {phase.practiceTasks.map((task, ti) => (
                                <li key={ti} className="text-xs text-gray-600">{task}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {phase.projectSuggestion && (
                          <div className="mt-2 flex items-start gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                            <TrendingUp className="w-3 h-3 shrink-0 mt-0.5" />
                            <span><span className="font-medium">Project Idea:</span> {phase.projectSuggestion}</span>
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
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Apply for {job.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{job.company?.name}</p>
            </div>
            
            <form onSubmit={handleApply} className="p-6 space-y-4">
              {applySuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Application Submitted!</h3>
                  <p className="text-sm text-gray-500">Redirecting to your applications...</p>
                </div>
              ) : (
                <>
                  {applyError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                      {applyError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Resume *</label>
                    {resumes.length > 0 ? (
                      <div className="space-y-2">
                        {resumes.map(resume => (
                          <label key={resume.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input 
                              type="radio" 
                              name="resume" 
                              value={resume.id}
                              checked={selectedResume === resume.id}
                              onChange={() => setSelectedResume(resume.id)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {resume.fileName}
                            </span>
                            {resume.active && (
                              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg border">
                        No resumes found. Please upload one in your profile first.
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Why are you a great fit for this role?"
                    />
                  </div>
                </>
              )}
            </form>

            {!applySuccess && (
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg"
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying || !selectedResume}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Application
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
