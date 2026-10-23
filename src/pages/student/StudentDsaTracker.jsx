import React, { useState, useEffect } from 'react';
import { 
  Code2, CheckCircle2, AlertCircle, Clock, BookOpen, 
  RotateCcw, Sparkles, Plus, Minus, Save, ChevronDown, 
  ChevronUp, Bell, Filter, Award, BarChart3
} from 'lucide-react';
import dsaService from '../../services/dsaService';

const DIFFICULTY_CONFIG = {
  EASY: {
    label: 'Easy',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    barClass: 'bg-emerald-500'
  },
  MEDIUM: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    barClass: 'bg-amber-500'
  },
  HARD: {
    label: 'Hard',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    barClass: 'bg-rose-500'
  }
};

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', class: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  IN_PROGRESS: { label: 'In Progress', class: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60' },
  SOLVED: { label: 'Target Met', class: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' },
  REVISION_NEEDED: { label: 'Needs Revision', class: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60' }
};

const StudentDsaTracker = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState(null);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [editNotes, setEditNotes] = useState({});

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dsaService.getTopics();
      setTopics(res.data || []);
      // Initialize edit notes
      const notesMap = {};
      (res.data || []).forEach(t => {
        notesMap[t.topicKey] = t.notes || '';
      });
      setEditNotes(notesMap);
    } catch (err) {
      console.error('Failed to load DSA topics', err);
      setError('Unable to load DSA problem progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCount = async (topic, delta) => {
    const newCount = Math.max(0, (topic.solvedCount || 0) + delta);
    try {
      setSavingKey(topic.topicKey);
      const res = await dsaService.updateTopic(topic.topicKey, {
        solvedCount: newCount,
        notes: editNotes[topic.topicKey],
        revisionReminder: topic.revisionReminder
      });
      setTopics(prev => prev.map(t => t.topicKey === topic.topicKey ? res.data : t));
    } catch (err) {
      console.error('Failed to update solved count', err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleStatusChange = async (topic, newStatus) => {
    try {
      setSavingKey(topic.topicKey);
      const res = await dsaService.updateTopic(topic.topicKey, {
        status: newStatus,
        solvedCount: topic.solvedCount,
        notes: editNotes[topic.topicKey],
        revisionReminder: topic.revisionReminder
      });
      setTopics(prev => prev.map(t => t.topicKey === topic.topicKey ? res.data : t));
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleToggleReminder = async (topic) => {
    const newReminder = !topic.revisionReminder;
    try {
      setSavingKey(topic.topicKey);
      const res = await dsaService.updateTopic(topic.topicKey, {
        revisionReminder: newReminder,
        solvedCount: topic.solvedCount,
        notes: editNotes[topic.topicKey]
      });
      setTopics(prev => prev.map(t => t.topicKey === topic.topicKey ? res.data : t));
    } catch (err) {
      console.error('Failed to update reminder', err);
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveNotes = async (topic) => {
    try {
      setSavingKey(topic.topicKey);
      const res = await dsaService.updateTopic(topic.topicKey, {
        notes: editNotes[topic.topicKey],
        solvedCount: topic.solvedCount,
        revisionReminder: topic.revisionReminder
      });
      setTopics(prev => prev.map(t => t.topicKey === topic.topicKey ? res.data : t));
      alert('Notes saved successfully!');
    } catch (err) {
      console.error('Failed to save notes', err);
    } finally {
      setSavingKey(null);
    }
  };

  // Metrics
  const totalSolved = topics.reduce((acc, t) => acc + (t.solvedCount || 0), 0);
  const totalTarget = topics.reduce((acc, t) => acc + (t.targetCount || 15), 0);
  const overallPercent = totalTarget > 0 ? Math.round((totalSolved * 100) / totalTarget) : 0;
  const revisionCount = topics.filter(t => t.revisionReminder || t.status === 'REVISION_NEEDED').length;

  const filteredTopics = topics.filter(t => {
    if (difficultyFilter !== 'ALL' && t.difficulty !== difficultyFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Technical Prep
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">DSA Problem Practice Tracker</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Master data structures and algorithms topic by topic. Track problem volume, set revision reminders, and store key edge-case notes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Solved</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalSolved}</span>
            <span className="text-xs font-bold text-slate-400">/ {totalTarget} target</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Overall Completion</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{overallPercent}%</span>
            <span className="text-xs font-bold text-slate-400">across 12 core topics</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Topics Mastered</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {topics.filter(t => t.status === 'SOLVED').length}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {topics.length} topics</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Revision Flagged</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{revisionCount}</span>
            <span className="text-xs font-bold text-slate-400">flagged for review</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Difficulty:</span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SOLVED">Target Met</option>
            <option value="REVISION_NEEDED">Needs Revision</option>
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">Loading DSA curriculum & practice progress...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No topics match your current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map(topic => {
            const diffCfg = DIFFICULTY_CONFIG[topic.difficulty] || DIFFICULTY_CONFIG.MEDIUM;
            const statusCfg = STATUS_CONFIG[topic.status] || STATUS_CONFIG.NOT_STARTED;
            const isExpanded = expandedTopic === topic.topicKey;
            const isSaving = savingKey === topic.topicKey;

            return (
              <div
                key={topic.topicKey}
                className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition p-6 flex flex-col justify-between space-y-5"
              >
                {/* Card Top: Badges & Reminder */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${diffCfg.badgeClass}`}>
                      {diffCfg.label}
                    </span>
                    <button
                      onClick={() => handleToggleReminder(topic)}
                      title={topic.revisionReminder ? 'Revision Reminder Active' : 'Set Revision Reminder'}
                      className={`p-1.5 rounded-xl transition cursor-pointer ${
                        topic.revisionReminder
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    {topic.topicTitle}
                  </h3>
                </div>

                {/* Progress Bar & Counter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Solved: {topic.solvedCount} / {topic.targetCount}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{topic.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${diffCfg.barClass} transition-all duration-500`}
                      style={{ width: `${topic.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Counter Buttons & Status Select */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateCount(topic, -1)}
                      disabled={isSaving || topic.solvedCount <= 0}
                      className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs disabled:opacity-40 transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-black text-slate-900 dark:text-white min-w-[24px] text-center">
                      {topic.solvedCount}
                    </span>
                    <button
                      onClick={() => handleUpdateCount(topic, 1)}
                      disabled={isSaving}
                      className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <select
                    value={topic.status}
                    onChange={(e) => handleStatusChange(topic, e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="SOLVED">Target Met</option>
                    <option value="REVISION_NEEDED">Needs Revision</option>
                  </select>
                </div>

                {/* Collapsible Notes Area */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.topicKey)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      Topic Notes & Patterns {topic.notes ? '•' : ''}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                      <textarea
                        rows={3}
                        value={editNotes[topic.topicKey] || ''}
                        onChange={(e) => setEditNotes({ ...editNotes, [topic.topicKey]: e.target.value })}
                        placeholder="Save tricky edge cases, time/space complexity notes, or reference problem URLs..."
                        className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 resize-none"
                      />
                      <button
                        onClick={() => handleSaveNotes(topic)}
                        disabled={isSaving}
                        className="w-full py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Notes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentDsaTracker;

