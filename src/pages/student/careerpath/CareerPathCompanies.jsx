import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Search, Filter, Bookmark, ExternalLink, 
  ArrowRight, Check, GitCompare, Sparkles, AlertCircle, X
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathCompanies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'ALL';
  const page = parseInt(searchParams.get('page') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'nameAsc';
  const savedOnly = searchParams.get('savedOnly') === 'true';

  // Compare selection (up to 4)
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [query, category, page, sortBy, savedOnly]);

  const fetchStats = async () => {
    try {
      const data = await careerPathService.getCategoryStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      if (savedOnly) {
        const savedList = await careerPathService.getSavedCompanies();
        let filtered = savedList;
        if (query.trim()) {
          const q = query.toLowerCase();
          filtered = filtered.filter(c => 
            c.companyName.toLowerCase().includes(q) || 
            (c.overview && c.overview.toLowerCase().includes(q))
          );
        }
        setCompanies(filtered);
        setTotalElements(filtered.length);
        setTotalPages(1);
      } else {
        const res = await careerPathService.getCompanies({
          query: query || undefined,
          category: category !== 'ALL' ? category : undefined,
          page,
          size: 12,
          sortBy
        });
        setCompanies(res.content || []);
        setTotalElements(res.totalElements || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load companies', err);
      setError('Unable to fetch companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCat) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('savedOnly');
    if (newCat === 'ALL') {
      newParams.delete('category');
    } else {
      newParams.set('category', newCat);
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleSavedOnlyClick = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.set('savedOnly', 'true');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', val);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = async (company) => {
    try {
      if (company.saved) {
        await careerPathService.removeSavedCompany(company.id);
        setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, saved: false } : c));
        if (savedOnly) {
          setCompanies(prev => prev.filter(c => c.id !== company.id));
        }
      } else {
        await careerPathService.saveCompany(company.id);
        setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, saved: true } : c));
      }
      fetchStats();
    } catch (err) {
      console.error('Failed to toggle save company', err);
    }
  };

  const toggleCompare = (companyId) => {
    if (selectedForCompare.includes(companyId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== companyId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 companies at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, companyId]);
    }
  };

  const launchCompare = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 companies to compare.');
      return;
    }
    navigate(`/student/career-path/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CareerPathNav />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Company & Placement Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse verified hiring patterns, selection stages, compensation bands, and official links for 45+ premier recruiters.
          </p>
        </div>

        {selectedForCompare.length > 0 && (
          <button
            onClick={launchCompare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-transform"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Selected ({selectedForCompare.length}/4)</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white dark:bg-[#0d132b] p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by company name, skills, or tech stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
          {query && (
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="py-2 px-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          >
            <option value="nameAsc">Name (A &rarr; Z)</option>
            <option value="nameDesc">Name (Z &rarr; A)</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleCategoryChange('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            category === 'ALL' && !savedOnly
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-[#0d132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50'
          }`}
        >
          All Companies ({stats?.totalCompanies || 45})
        </button>

        <button
          onClick={() => handleCategoryChange('SERVICE_ORIENTED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            category === 'SERVICE_ORIENTED' && !savedOnly
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
              : 'bg-white dark:bg-[#0d132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50'
          }`}
        >
          IT Services & Consulting ({stats?.serviceOrientedCount || 30})
        </button>

        <button
          onClick={() => handleCategoryChange('PRODUCT_ORIENTED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            category === 'PRODUCT_ORIENTED' && !savedOnly
              ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30'
              : 'bg-white dark:bg-[#0d132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50'
          }`}
        >
          Product & Tech ({stats?.productOrientedCount || 15})
        </button>

        <button
          onClick={handleSavedOnlyClick}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            savedOnly
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
              : 'bg-white dark:bg-[#0d132b] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>My Target List ({stats?.savedCount || 0})</span>
        </button>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{error}</p>
          <button
            onClick={fetchCompanies}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : companies.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Companies Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {savedOnly ? "You haven't saved any companies yet. Click the bookmark icon on any company to save it here." : "Try adjusting your search query or switching category filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const isCompared = selectedForCompare.includes(company.id);
            return (
              <div
                key={company.id}
                className={`p-5 rounded-2xl bg-white dark:bg-[#0d132b] border transition-all flex flex-col justify-between group hover:shadow-lg ${
                  isCompared
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-white/10 hover:border-indigo-500/30'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Logo, Name, Bookmark, Compare */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:bg-white/10 flex items-center justify-center font-black text-sm text-indigo-600 dark:text-indigo-400">
                        {company.companyName?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {company.companyName}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {company.headquartersLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSave(company)}
                        className={`p-2 rounded-xl transition-colors ${
                          company.saved
                            ? 'text-cyan-500 bg-cyan-500/10'
                            : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                        title={company.saved ? 'Remove from Target List' : 'Save as Target Company'}
                      >
                        <Bookmark className="w-4 h-4" fill={company.saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      company.category === 'PRODUCT_ORIENTED'
                        ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {company.category?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                      {company.stagesCount || 4} Rounds
                    </span>
                  </div>

                  {/* Overview snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {company.overview}
                  </p>

                  {/* Skills tags */}
                  {company.requiredSkills && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {company.requiredSkills.split(',').slice(0, 4).map((s, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Compensation & Roles */}
                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Fresher CTC:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{company.fresherSalaryRange}</span>
                    </div>
                    {company.typicalRoles && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Roles: <span className="text-slate-700 dark:text-slate-300">{company.typicalRoles}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(company.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Compare</span>
                  </label>

                  <div className="flex items-center gap-1">
                    {company.officialCareersUrl && (
                      <a
                        href={company.officialCareersUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        title="Official Careers Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <Link
                      to={`/student/career-path/companies/${company.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-white/5 dark:hover:bg-indigo-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <span>Full Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!savedOnly && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-slate-500 px-3">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerPathCompanies;

