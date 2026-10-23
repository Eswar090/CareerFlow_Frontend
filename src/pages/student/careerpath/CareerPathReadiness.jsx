import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, CheckCircle2, Clock, AlertCircle, TrendingUp, 
  Sparkles, Save, ShieldAlert, Award, Star, BookOpen, Layers
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathReadiness = () => {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCategory, setSavingCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReadiness();
  }, []);

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careerPathService.getReadiness();
      setReadiness(data);
    } catch (err) {
      console.error('Failed to load readiness tracker', err);
      setError('Unable to load readiness data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryKey, field, value) => {
    if (!readiness) return;
    const cat = readiness.categories.find(c => c.category === categoryKey);
    if (!cat) return;

    const payload = {
      category: categoryKey,
      status: field === 'status' ? value : cat.status,
      confidenceLevel: field === 'confidenceLevel' ? value : cat.confidenceLevel,
      tasksCompleted: field === 'tasksCompleted' ? value : cat.tasksCompleted,
      tasksTotal: field === 'tasksTotal' ? value : cat.tasksTotal,
      notes: field === 'notes' ? value : cat.notes
    };

    try {
      setSavingCategory(categoryKey);
      await careerPathService.updateReadiness(payload);
      // Refresh overall overview score
      const updated = await careerPathService.getReadiness();
      setReadiness(updated);
    } catch (err) {
      console.error('Failed to update readiness category', err);
    } finally {
      setSavingCategory(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 from-emerald-500 to-teal-500';
    if (score >= 60) return 'text-indigo-500 from-indigo-500 to-violet-500';
    if (score >= 35) return 'text-amber-500 from-amber-500 to-orange-500';
    return 'text-rose-500 from-rose-500 to-pink-500';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <CareerPathNav />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          10-Category Placement Readiness Tracker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Self-audit your preparation status across all ten recruitment pillars, log confidence levels, and monitor your overall readiness index.
        </p>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      ) : error ? (
        <div className="p-8 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{error}</p>
          <button
            onClick={fetchReadiness}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : readiness && (
        <>
          {/* Overview Score Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Overall Readiness Indicator</span>
                <div className="flex items-baseline gap-3">
                  <span className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${getScoreColor(readiness.overallReadinessScore)} bg-clip-text text-transparent`}>
                    {readiness.overallReadinessScore}%
                  </span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    &bull; {readiness.preparationLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Calculated transparently using weighted evaluation: Prepared/Expert (100%), In Progress (40-70% based on confidence), and Not Started (0%).
                </p>
              </div>

              {/* Category Counts Breakdown */}
              <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {readiness.preparedCategories}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Prepared</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block">
                    {readiness.inProgressCategories}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">In Progress</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                  <span className="text-xl font-black text-slate-700 dark:text-slate-300 block">
                    {readiness.notStartedCategories}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Not Started</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(readiness.overallReadinessScore)} transition-all duration-500`}
                style={{ width: `${Math.max(5, readiness.overallReadinessScore)}%` }}
              />
            </div>
          </div>

          {/* 10 Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readiness.categories.map((cat) => {
              const isSaving = savingCategory === cat.category;
              return (
                <div
                  key={cat.category}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cat.categoryDisplayName}
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Confidence: {cat.confidenceLevel} / 5
                      </span>
                    </div>

                    <select
                      value={cat.status}
                      onChange={(e) => handleUpdateCategory(cat.category, 'status', e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        cat.status === 'PREPARED' || cat.status === 'EXPERT'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : cat.status === 'IN_PROGRESS'
                          ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="PREPARED">Prepared</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>

                  {/* Confidence Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Self Confidence:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{cat.confidenceLevel} of 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={cat.confidenceLevel}
                      onChange={(e) => handleUpdateCategory(cat.category, 'confidenceLevel', parseInt(e.target.value, 10))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Notes & Tasks */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                    <textarea
                      defaultValue={cat.notes || ''}
                      onBlur={(e) => handleUpdateCategory(cat.category, 'notes', e.target.value)}
                      placeholder="Add preparation notes (e.g. solved 40 Leetcode tree problems, revised OS concurrency)..."
                      rows="2"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="font-semibold text-slate-700 dark:text-slate-300">Self-Tracking Notice:</strong> {readiness.disclaimer}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CareerPathReadiness;

