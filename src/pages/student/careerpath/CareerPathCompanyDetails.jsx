import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, Bookmark, ExternalLink, ArrowLeft, CheckCircle2, 
  Clock, MapPin, Calendar, Award, ShieldAlert, Sparkles, 
  Compass, HelpCircle, Layers, ChevronRight, FileText, Briefcase
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathCompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapCreating, setRoadmapCreating] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careerPathService.getCompanyById(id);
      setCompany(data);
    } catch (err) {
      console.error('Failed to load company guide', err);
      setError('Unable to load company details. It may not exist or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!company) return;
    try {
      if (company.saved) {
        await careerPathService.removeSavedCompany(company.id);
        setCompany({ ...company, saved: false });
      } else {
        await careerPathService.saveCompany(company.id);
        setCompany({ ...company, saved: true });
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleCreateTargetedRoadmap = async () => {
    if (!company) return;
    try {
      setRoadmapCreating(true);
      const targetRole = company.typicalRoles ? company.typicalRoles.split(',')[0].trim() : 'Software Engineer';
      await careerPathService.createRoadmap({
        companyId: company.id,
        targetRole,
        durationDays: 60,
        title: `${company.companyName} - ${targetRole} Preparation Plan`
      });
      navigate('/student/career-path/roadmaps');
    } catch (err) {
      console.error('Failed to create roadmap', err);
      alert('Unable to generate roadmap. Please try again.');
    } finally {
      setRoadmapCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <CareerPathNav />
        <div className="animate-pulse space-y-6">
          <div className="h-64 rounded-3xl bg-slate-200 dark:bg-white/5" />
          <div className="h-96 rounded-3xl bg-slate-200 dark:bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <CareerPathNav />
        <div className="p-12 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <Building2 className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{error || 'Company Not Found'}</h2>
          <Link
            to="/student/career-path/companies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <CareerPathNav />

      {/* Back button */}
      <div>
        <Link
          to="/student/career-path/companies"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Company Directory</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/20">
              {company.companyName?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {company.companyName}
                </h1>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  company.category === 'PRODUCT_ORIENTED'
                    ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                }`}>
                  {company.category?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.headquartersLocation}
                </span>
                {company.foundedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Est. {company.foundedYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                company.saved
                  ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/30'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={company.saved ? 'currentColor' : 'none'} />
              <span>{company.saved ? 'Saved in Targets' : 'Save as Target'}</span>
            </button>

            {company.officialCareersUrl && (
              <a
                href={company.officialCareersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-transform"
              >
                <span>Careers Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Fresher Package (CTC)</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{company.fresherSalaryRange}</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Hiring Model / Frequency</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{company.hiringCadence || 'Annual Campus & National NQT'}</p>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Eligibility Criteria</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{company.eligibilityCriteria || '60%+ in 10th, 12th & B.Tech'}</p>
          </div>
        </div>

        {/* Overview Description */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400">Company Overview</h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {company.overview}
          </p>
        </div>

        {/* Typical Roles */}
        {company.typicalRoles && (
          <div className="space-y-2">
            <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400">Typical Fresher & Early Career Roles</h2>
            <div className="flex flex-wrap gap-2">
              {company.typicalRoles.split(',').map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20"
                >
                  {role.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Required Skills */}
        {company.requiredSkills && (
          <div className="space-y-2">
            <h2 className="text-sm uppercase font-bold tracking-wider text-slate-400">Key Required & Valued Skills</h2>
            <div className="flex flex-wrap gap-2">
              {company.requiredSkills.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recruitment Process & Selection Rounds */}
      {(() => {
        const stageList = typeof company.selectionStages === 'string'
          ? company.selectionStages.split('->').map((s, idx) => ({
              id: idx + 1,
              roundNumber: idx + 1,
              roundName: s.trim(),
              description: `Comprehensive evaluation round assessing candidate skills for ${s.trim().toLowerCase()}.`,
              preparationTips: `Review core requirements and practice past placement questions aligned with ${s.trim()}.`
            }))
          : (Array.isArray(company.selectionStages) ? company.selectionStages : []);

        return (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  Recruitment Process & Selection Rounds
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Breakdown of typical selection stages observed in campus drives and off-campus assessments.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500">
                {stageList.length} Stages
              </span>
            </div>

            <div className="space-y-4">
              {stageList.length > 0 ? (
                stageList.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {stage.roundNumber}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {stage.roundName}
                        </h3>
                      </div>
                      {stage.durationMinutes && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {stage.durationMinutes} mins
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-10">
                      {stage.description}
                    </p>

                    {stage.preparationTips && (
                      <div className="ml-10 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-700 dark:text-indigo-300">
                        <strong className="font-bold">Preparation Tip:</strong> {stage.preparationTips}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Selection round details will be updated shortly.</p>
              )}
            </div>

            {/* Aptitude & Interview Topics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              {company.aptitudeTopics && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Aptitude & Written Exam Topics</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {company.aptitudeTopics}
                  </p>
                </div>
              )}
              {company.interviewTopics && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Technical Interview Focus Areas</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {company.interviewTopics}
                  </p>
                </div>
              )}
            </div>

            {/* India Locations & Notes */}
            {(company.indiaLocations || company.additionalNotes) && (
              <div className="space-y-3 pt-2">
                {company.indiaLocations && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300 font-semibold">Major India Office Locations:</strong> {company.indiaLocations}
                  </div>
                )}
                {company.additionalNotes && (
                  <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-xs text-cyan-700 dark:text-cyan-300">
                    <strong className="font-bold">Recruiter Insight:</strong> {company.additionalNotes}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Target Roadmap CTA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-[#0a0f24] text-white border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Targeted Placement Preparation
          </div>
          <h2 className="text-xl font-black">
            Ready to Prepare for {company.companyName}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Generate a personalized 60-day roadmap with weekly milestones covering aptitude, DSA, core subjects, and technical interview scenarios tailored for {company.companyName}.
          </p>
        </div>

        <button
          onClick={handleCreateTargetedRoadmap}
          disabled={roadmapCreating}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          {roadmapCreating ? 'Generating Roadmap...' : `Generate ${company.companyName} Roadmap`}
        </button>
      </div>

      {/* Educational Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-slate-700 dark:text-slate-300">Notice of Attribution:</strong> Company recruitment patterns, salary bands, and evaluation stages are compiled from official corporate career announcements, public university placement records, and historical student experiences for educational preparation. CareerFlow is independent and not officially affiliated with {company.companyName}.
        </p>
      </div>
    </div>
  );
};

export default CareerPathCompanyDetails;
