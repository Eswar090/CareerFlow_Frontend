import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  GitCompare, Building2, ExternalLink, X, Plus, 
  CheckCircle2, ArrowRight, ShieldAlert, Award
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [comparedCompanies, setComparedCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const idsParam = searchParams.get('ids') || '';

  useEffect(() => {
    fetchInitialData();
  }, [idsParam]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all available companies for selector
      const allRes = await careerPathService.getCompanies({ page: 0, size: 50, sortBy: 'nameAsc' });
      const compList = allRes.content || [];
      setAllCompanies(compList);

      // Parse IDs from URL or default to first 2 if none specified
      let idsToFetch = [];
      if (idsParam.trim()) {
        idsToFetch = idsParam.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean);
      } else if (compList.length >= 2) {
        idsToFetch = [compList[0].id, compList[1].id];
      }

      if (idsToFetch.length > 0) {
        const compareRes = await careerPathService.compareCompanies(idsToFetch);
        setComparedCompanies(compareRes || []);
      }
    } catch (err) {
      console.error('Failed to load comparison data', err);
      setError('Unable to load company comparison.');
    } finally {
      setLoading(false);
    }
  };

  const updateIdsInUrl = (newIds) => {
    const newParams = new URLSearchParams(searchParams);
    if (newIds.length > 0) {
      newParams.set('ids', newIds.join(','));
    } else {
      newParams.delete('ids');
    }
    setSearchParams(newParams);
  };

  const handleAddCompany = async (companyId) => {
    if (!companyId) return;
    const idNum = parseInt(companyId, 10);
    if (comparedCompanies.some(c => c.id === idNum)) return;
    if (comparedCompanies.length >= 4) {
      alert('You can compare a maximum of 4 companies at once.');
      return;
    }

    const newIds = [...comparedCompanies.map(c => c.id), idNum];
    updateIdsInUrl(newIds);
  };

  const handleRemoveCompany = (companyId) => {
    const newIds = comparedCompanies.filter(c => c.id !== companyId).map(c => c.id);
    updateIdsInUrl(newIds);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CareerPathNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Side-by-Side Company Comparison
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluate 2 to 4 companies across verified recruitment parameters, fresher packages, selection stages, and skill expectations.
          </p>
        </div>

        {/* Add Company Selector */}
        {comparedCompanies.length < 4 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <select
              onChange={(e) => {
                handleAddCompany(e.target.value);
                e.target.value = '';
              }}
              defaultValue=""
              className="py-2 px-3 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#0d132b] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>+ Add Company to Compare...</option>
              {allCompanies
                .filter(c => !comparedCompanies.some(cc => cc.id === c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.category?.replace('_', ' ')})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      ) : comparedCompanies.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <GitCompare className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">No Companies Selected</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select 2 to 4 companies from the directory or dropdown above to see their detailed side-by-side comparison.
          </p>
          <Link
            to="/student/career-path/companies"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <span>Browse Company Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm min-w-[700px]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="py-4 px-3 font-bold text-slate-400 uppercase text-[11px] w-48 align-top">
                    Parameter
                  </th>
                  {comparedCompanies.map((c) => (
                    <th key={c.id} className="py-4 px-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 dark:bg-white/10 flex items-center justify-center font-black text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                            {c.companyName?.slice(0, 2).toUpperCase()}
                          </div>
                          <Link
                            to={`/student/career-path/companies/${c.id}`}
                            className="text-base font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block"
                          >
                            {c.companyName}
                          </Link>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            c.category === 'PRODUCT_ORIENTED'
                              ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            {c.category?.replace('_', ' ')}
                          </span>
                        </div>

                        {comparedCompanies.length > 1 && (
                          <button
                            onClick={() => handleRemoveCompany(c.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {/* Headquarters */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Headquarters</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {c.headquartersLocation}
                    </td>
                  ))}
                </tr>

                {/* Entry CTC */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Fresher CTC Package</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {c.fresherSalaryRange}
                    </td>
                  ))}
                </tr>

                {/* Typical Roles */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Typical Roles</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {c.typicalRoles || 'Software Engineer, Trainee'}
                    </td>
                  ))}
                </tr>

                {/* Required Skills */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Key Required Skills</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {c.requiredSkills && c.requiredSkills.split(',').map((s, idx) => (
                          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Selection Stages Count */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Recruitment Stages</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {c.stagesCount || 4} Rounds
                    </td>
                  ))}
                </tr>

                {/* Selection Process Details */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400 align-top">Interview Stages</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 align-top space-y-1.5">
                      {c.selectionStages && c.selectionStages.map((s) => (
                        <div key={s.id} className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                          <strong className="text-slate-800 dark:text-slate-200">R{s.roundNumber}:</strong> {s.roundName}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                {/* Eligibility */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                  <td className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Eligibility Standard</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      {c.eligibilityCriteria || '60%+ in 10th, 12th & Graduation'}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="py-4 px-3 font-bold text-slate-500 dark:text-slate-400">Preparation Action</td>
                  {comparedCompanies.map((c) => (
                    <td key={c.id} className="py-4 px-4">
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/student/career-path/roadmaps?companyId=${c.id}`}
                          className="w-full text-center py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Create Roadmap
                        </Link>
                        {c.officialCareersUrl && (
                          <a
                            href={c.officialCareersUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Careers Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-slate-700 dark:text-slate-300">Objective Comparison Standards:</strong> Metrics and stage breakdowns are compiled purely from publicly disclosed campus placement records and official recruitment notices. CareerFlow does not provide subjective rankings or endorsements.
        </p>
      </div>
    </div>
  );
};

export default CareerPathCompare;

