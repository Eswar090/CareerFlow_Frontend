import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Star, BookOpen, MessageSquare, CheckCircle2, 
  Clock, Save, Filter, ChevronDown, ChevronUp, AlertCircle, 
  Award, Compass, Video
} from 'lucide-react';
import mockInterviewService from '../../services/mockInterviewService';

const CATEGORY_CONFIG = {
  TECHNICAL: {
    label: 'Technical',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60'
  },
  SYSTEM_DESIGN: {
    label: 'System Design',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60'
  },
  CORE_CS: {
    label: 'Core CS (OS/DBMS/CN)',
    badgeClass: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60'
  },
  HR_BEHAVIORAL: {
    label: 'HR / Behavioral (STAR)',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
  }
};

const StudentMockInterviews = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [notesMap, setNotesMap] = useState({});
  const [ratingsMap, setRatingsMap] = useState({});
  const [savingId, setSavingId] = useState(null);

  const ROLES = [
    { key: 'ALL', label: 'All Question Sets' },
    { key: 'Frontend Developer', label: 'Frontend Developer' },
    { key: 'Backend Developer', label: 'Backend Developer' },
    { key: 'Java Developer', label: 'Java Developer' },
    { key: 'Software Engineer', label: 'Software Engineer (SDE)' },
    { key: 'Data Analyst', label: 'Data Analyst' },
    { key: 'Cloud / DevOps Engineer', label: 'Cloud / DevOps' },
    { key: 'HR & Behavioral', label: 'HR & Behavioral' }
  ];

  useEffect(() => {
    fetchQuestions(selectedRole);
  }, [selectedRole]);

  const fetchQuestions = async (role) => {
    try {
      setLoading(true);
      setError('');
      const res = await mockInterviewService.getQuestions(role);
      setQuestions(res.data || []);

      // Populate notes & ratings maps
      const newNotes = {};
      const newRatings = {};
      (res.data || []).forEach(q => {
        newNotes[q.questionId] = q.studentNotes || '';
        newRatings[q.questionId] = q.selfRating || 0;
      });
      setNotesMap(newNotes);
      setRatingsMap(newRatings);
    } catch (err) {
      console.error('Failed to load mock interview questions', err);
      setError('Unable to load mock interview questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (qId, rating) => {
    setRatingsMap(prev => ({ ...prev, [qId]: rating }));
  };

  const handleSavePractice = async (q) => {
    try {
      setSavingId(q.questionId);
      const res = await mockInterviewService.savePractice(q.questionId, {
        roleTrack: q.roleTrack,
        studentNotes: notesMap[q.questionId],
        selfRating: ratingsMap[q.questionId] || 3
      });

      setQuestions(prev => prev.map(item => item.questionId === q.questionId ? res.data : item));
      alert('Answer notes and practice assessment saved!');
    } catch (err) {
      console.error('Failed to save practice record', err);
    } finally {
      setSavingId(null);
    }
  };

  const practicedCount = questions.filter(q => q.practiced).length;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Interview Readiness
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mock Interview Preparation & Self-Assessment</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Role-calibrated placement questions with key talking points, sample answer blueprints, self-rating, and personal prep notes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Progress & Stat Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Available Questions</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{questions.length}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Questions Practiced</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{practicedCount}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Practice Completion</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {questions.length > 0 ? Math.round((practicedCount * 100) / questions.length) : 0}%
          </p>
        </div>
      </div>

      {/* Role Tracks Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {ROLES.map(role => {
          const isActive = selectedRole === role.key;
          return (
            <button
              key={role.key}
              onClick={() => setSelectedRole(role.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-400">Loading role-calibrated questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No questions found for this role track.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const catCfg = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG.TECHNICAL;
            const isExpanded = expandedQuestion === q.questionId;
            const currentRating = ratingsMap[q.questionId] || 0;
            const isSaving = savingId === q.questionId;

            return (
              <div
                key={q.questionId}
                className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-400">Q{idx + 1}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${catCfg.badgeClass}`}>
                      {catCfg.label}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {q.roleTrack}
                    </span>
                    {q.practiced && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" /> Practiced
                      </span>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-400 mr-1.5">Self-Confidence:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(q.questionId, star)}
                        className="p-1 hover:scale-110 transition cursor-pointer"
                        title={`Rate ${star} / 5`}
                      >
                        <Star className={`w-4 h-4 ${
                          star <= currentRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                  {q.questionText}
                </h3>

                {/* Key Talking Points */}
                {q.keyTalkingPoints && q.keyTalkingPoints.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Points to Mention:</span>
                    <div className="flex flex-wrap gap-2">
                      {q.keyTalkingPoints.map((pt, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300"
                        >
                          • {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toggle Blueprint & Notes */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.questionId)}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {isExpanded ? 'Hide Answer Blueprint & Practice Notes' : 'Open Answer Blueprint & Write My Response Notes'}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                      {/* Blueprint */}
                      {q.sampleAnswerStructure && (
                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Recommended Response Structure</span>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {q.sampleAnswerStructure}
                          </p>
                        </div>
                      )}

                      {/* Notes & Answer Practice Area */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          My Answer Draft & Personalized Talking Points:
                        </label>
                        <textarea
                          rows={4}
                          value={notesMap[q.questionId] || ''}
                          onChange={(e) => setNotesMap({ ...notesMap, [q.questionId]: e.target.value })}
                          placeholder="Draft your personal STAR response, project examples, or technical steps here..."
                          className="w-full p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 resize-none"
                        />
                      </div>

                      <button
                        onClick={() => handleSavePractice(q)}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {isSaving ? 'Saving Practice Record...' : 'Save Answer Notes & Assessment'}
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

export default StudentMockInterviews;

