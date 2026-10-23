import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserCheck, Search, Award, CheckCircle2, AlertCircle, 
  ArrowRight, Sparkles, Code, Cpu, Database, Cloud, Shield, 
  Terminal, Layers, BookOpen, X, Filter, RefreshCw, Briefcase,
  GitPullRequest, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CATEGORIES = [
  'ALL',
  'Frontend and UI',
  'Backend and Full Stack',
  'Software Engineering',
  'Data and AI',
  'Cloud and Infrastructure',
  'Security and Networking',
  'Testing and Quality Assurance',
  'Mobile and Embedded Systems'
];

const PREP_LEVELS = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

const CareerPathRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('titleAsc');

  // Detail Modal State
  const [detailModalRole, setDetailModalRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careerPathService.getRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Failed to load roles from backend API', err);
      setError('Unable to fetch career role guides from backend. Please click Retry.');
    } finally {
      setLoading(false);
    }
  };

  // Safe accessor helpers
  const getRoleTitle = (r) => r?.roleTitle || r?.title || 'Tech Role';
  const getRoleSummary = (r) => r?.summary || r?.description || '';
  const getCoreSkills = (r) => r?.coreSkills || [];
  const getSecondarySkills = (r) => r?.secondarySkills || r?.secondaryTools || [];
  const getTools = (r) => r?.toolsAndFrameworks || [];
  const getDsaTopics = (r) => r?.dsaPreparationTopics || r?.dsaTopics || [];
  const getCsSubjects = (r) => r?.coreCsSubjects || ['Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks'];
  const getProjects = (r) => r?.suggestedProjects || [];
  const getInterviewTopics = (r) => r?.interviewTopics || [];
  const getCompanies = (r) => r?.relevantCompanyNames || [];
  const getCategory = (r) => r?.category || 'Software Engineering';
  const getLevel = (r) => r?.preparationLevel || 'Intermediate';

  // Filtering & Sorting logic
  const filteredRoles = roles.filter((r) => {
    const title = getRoleTitle(r).toLowerCase();
    const summary = getRoleSummary(r).toLowerCase();
    const core = getCoreSkills(r).map((s) => s.toLowerCase());
    const secondary = getSecondarySkills(r).map((s) => s.toLowerCase());
    const tools = getTools(r).map((s) => s.toLowerCase());
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || (
      title.includes(q) ||
      summary.includes(q) ||
      core.some((s) => s.includes(q)) ||
      secondary.some((s) => s.includes(q)) ||
      tools.some((s) => s.includes(q))
    );

    const roleCat = getCategory(r).toLowerCase();
    const matchesCategory = selectedCategory === 'ALL' || roleCat.includes(selectedCategory.toLowerCase());

    const roleLvl = getLevel(r).toLowerCase();
    const matchesLevel = selectedLevel === 'ALL' || roleLvl === selectedLevel.toLowerCase();

    return matchesSearch && matchesCategory && matchesLevel;
  }).sort((a, b) => {
    if (sortBy === 'titleAsc') return getRoleTitle(a).localeCompare(getRoleTitle(b));
    if (sortBy === 'titleDesc') return getRoleTitle(b).localeCompare(getRoleTitle(a));
    if (sortBy === 'category') return getCategory(a).localeCompare(getCategory(b));
    return 0;
  });

  const handleLaunchRoadmap = (roleTitle) => {
    navigate(`/student/career-path/roadmaps?role=${encodeURIComponent(roleTitle)}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSortBy('titleAsc');
  };

  const hasActiveFilters = search || selectedCategory !== 'ALL' || selectedLevel !== 'ALL' || sortBy !== 'titleAsc';

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
      <CareerPathNav />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Career Navigation & Skills Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Technical Career Roles Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Explore 20 foundational tech engineering roles. Review required technical stacks, relevant DSA focus areas, core CS topics, portfolio projects, and inspect your live profile skill alignment.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
            Total Roles: <strong className="text-indigo-600 dark:text-indigo-400">{roles.length || 20}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role title, core skills, frameworks, or tools..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 font-medium"
            >
              {PREP_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl === 'ALL' ? 'All Prep Levels' : lvl}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="titleAsc">Role Title (A &rarr; Z)</option>
              <option value="titleDesc">Role Title (Z &rarr; A)</option>
              <option value="category">Category (A &rarr; Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar pt-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-white/5'
                }`}
              >
                {cat === 'ALL' ? 'All Specializations' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <span>Showing <strong className="text-slate-800 dark:text-slate-200">{filteredRoles.length}</strong> role blueprint{filteredRoles.length === 1 ? '' : 's'}</span>
        <span className="italic text-[11px]">General career guides for reference &bull; Not active job postings</span>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-white/10 p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4 max-w-lg mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Unable to Load Roles</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={fetchRoles}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3 max-w-md mx-auto shadow-sm">
          <UserCheck className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Matching Roles Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No technical career roles matched your current search and filter criteria. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => {
            const title = getRoleTitle(role);
            const summary = getRoleSummary(role);
            const coreSkills = getCoreSkills(role);
            const secondarySkills = getSecondarySkills(role);
            const tools = getTools(role);
            const dsaTopics = getDsaTopics(role);
            const csSubjects = getCsSubjects(role);
            const projects = getProjects(role);
            const companies = getCompanies(role);
            const level = getLevel(role);
            const category = getCategory(role);
            const matchCount = role.matchingSkillsCount || 0;

            return (
              <div
                key={role.id || title}
                className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                        {category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        level === 'Beginner'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                          : level === 'Intermediate'
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40'
                          : 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40'
                      }`}>
                        {level}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {/* Profile Match Banner if skills matched */}
                  {matchCount > 0 && (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Profile Alignment
                      </span>
                      <span>{matchCount} skill{matchCount > 1 ? 's' : ''} recorded</span>
                    </div>
                  )}

                  {/* Core Technical Skills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1.5">
                      Core Technical Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {coreSkills.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/40"
                        >
                          {s}
                        </span>
                      ))}
                      {coreSkills.length > 4 && (
                        <span className="text-[10px] font-bold px-2 py-1 text-slate-400 dark:text-slate-500 self-center">
                          +{coreSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tools & Frameworks Preview */}
                  {tools.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                        Common Tools & Frameworks
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                        {tools.slice(0, 4).join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Core CS Subjects & DSA Preview */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-white/5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Core CS Focus</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px] truncate block">
                        {csSubjects.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Key DSA Focus</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px] truncate block">
                        {dsaTopics.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Related Directory Companies */}
                  {companies.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                        Related Directory Companies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {companies.slice(0, 4).map((c, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDetailModalRole(role)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleLaunchRoadmap(title)}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Role Details Modal View */}
      {detailModalRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0d132b] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 p-6 sm:p-8 custom-scrollbar relative animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                    {getCategory(detailModalRole)}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {getLevel(detailModalRole)} Preparation Level
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {getRoleTitle(detailModalRole)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Career Guide Blueprint & Engineering Competency Roadmap
                </p>
              </div>

              <button
                onClick={() => setDetailModalRole(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview Section */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                1. Role Overview & Industry Scope
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                {getRoleSummary(detailModalRole)}
              </p>
            </div>

            {/* Personalized Profile Skills Comparison */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-indigo-700 dark:text-indigo-300 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Profile Skills Alignment Diagnostic
                </h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {detailModalRole.matchingSkillsCount || 0} / {getCoreSkills(detailModalRole).length} Core Skills Recorded
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Matched skills */}
                {detailModalRole.studentMatchedSkills && detailModalRole.studentMatchedSkills.length > 0 ? (
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Skills Already Recorded in Your Profile:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailModalRole.studentMatchedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Missing / target skills */}
                {detailModalRole.studentMissingSkills && detailModalRole.studentMissingSkills.length > 0 ? (
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block mb-1">
                      Skills Not Yet Recorded in Profile:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailModalRole.studentMissingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Note: You can confirm proficiency by updating your skills list on the <Link to="/student/skills" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Skills Page</Link>.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Core & Secondary Technical Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  2. Required Core Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {getCoreSkills(detailModalRole).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  3. Useful Secondary Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {getSecondarySkills(detailModalRole).concat(getTools(detailModalRole)).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Core CS Subjects & DSA Preparation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  4. Core CS Subjects to Master
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 space-y-1">
                  {getCsSubjects(detailModalRole).map((subj, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{subj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  5. Relevant DSA Topics
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 space-y-1">
                  {getDsaTopics(detailModalRole).map((topic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Projects */}
            {getProjects(detailModalRole).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  6. Suggested Benchmark Portfolio Projects
                </h3>
                <div className="space-y-2">
                  {getProjects(detailModalRole).map((proj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-start gap-3">
                      <Layers className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {proj}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Interview Preparation Topics */}
            {getInterviewTopics(detailModalRole).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  7. Core Technical Interview Focus Areas
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {getInterviewTopics(detailModalRole).map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">&bull;</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Related Companies from Existing Directory */}
            {getCompanies(detailModalRole).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  8. Related Companies from Directory
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getCompanies(detailModalRole).map((comp, idx) => (
                    <Link
                      key={idx}
                      to={`/student/career-path/companies?q=${encodeURIComponent(comp)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold border border-slate-200 dark:border-white/10 transition"
                    >
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{comp}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                    </Link>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Career guide reference association based on typical organizational role patterns.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDetailModalRole(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                Close Blueprint
              </button>

              <button
                type="button"
                onClick={() => {
                  const rName = getRoleTitle(detailModalRole);
                  setDetailModalRole(null);
                  handleLaunchRoadmap(rName);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Create Preparation Roadmap for this Role</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathRoles;
