import React from 'react';
import { Sparkles, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Premium AI Insights Panel with Light and Dark mode styling.
 */
const AiInsightPanel = ({ title = 'AI Career Intelligence', loading, error, children, onGenerate, hasData }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-white/10 shadow-xl shadow-indigo-900/5 dark:shadow-black/40 overflow-hidden transition-colors">
      {/* Header with rich violet-indigo gradient */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm tracking-tight">{title}</h3>
            <span className="text-[10px] text-indigo-300/70 font-semibold uppercase tracking-wider">Gemini Intelligence</span>
          </div>
        </div>
        
        {onGenerate && !hasData && !loading && (
          <button
            onClick={onGenerate}
            className="text-xs bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Analyze Now
          </button>
        )}

        {onGenerate && hasData && !loading && (
          <button
            onClick={onGenerate}
            className="text-xs text-indigo-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 border border-white/10 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900/95 transition-colors">
        {loading && (
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400 py-8">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span>AI model is evaluating your profile credentials… please wait.</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-3 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!loading && !error && children}

        {!loading && !error && !children && !hasData && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-100 dark:border-indigo-800/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">No Career Analysis Generated Yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Click "Analyze Now" to receive personalized skill recommendations, resume gap evaluations, and career roadmaps.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsightPanel;
