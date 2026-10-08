import React from 'react';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';

/**
 * Generic AI insights panel.
 * Props:
 *   title       – panel heading
 *   loading     – show spinner
 *   error       – error message string
 *   children    – rendered content
 *   onGenerate  – callback when the "Generate" button is clicked
 *   hasData     – true when results are already loaded
 */
const AiInsightPanel = ({ title = 'AI Insight', loading, error, children, onGenerate, hasData }) => {
  return (
    <div className="border border-purple-100 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-5 py-4 flex items-center justify-between border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        </div>
        {onGenerate && !hasData && !loading && (
          <button
            onClick={onGenerate}
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Generate
          </button>
        )}
        {onGenerate && hasData && !loading && (
          <button
            onClick={onGenerate}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="p-5 bg-white">
        {loading && (
          <div className="flex items-center gap-3 text-sm text-gray-500 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            AI is analysing… this may take a few seconds.
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && children}

        {!loading && !error && !children && !hasData && (
          <p className="text-sm text-gray-400 py-2">
            Click "Generate" to get AI-powered insights.
          </p>
        )}
      </div>
    </div>
  );
};

export default AiInsightPanel;

