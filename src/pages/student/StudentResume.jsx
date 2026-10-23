import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Download, FileText, Loader2, CheckCircle, Sparkles, CheckCircle2, AlertCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { getMyResumes, uploadResume, deleteResume } from '../../services/studentService';
import api from '../../services/api';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StudentResume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef();

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await getMyResumes();
      setResumes(res.data || []);
    } catch { 
      setError('Failed to load resumes.'); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      fileRef.current.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must not exceed 5 MB.');
      fileRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadResume(formData);
      setResumes(prev => [res.data, ...prev]);
      setSuccess('Resume uploaded successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume document?')) return;
    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch { 
      setError('Failed to delete resume.'); 
    }
  };

  const handleDownload = async (resume) => {
    try {
      const response = await api.get(`/students/me/resumes/${resume.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch { 
      setError('Failed to download resume.'); 
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-80">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-semibold text-slate-500">Retrieving resume documents...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Document Management
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Resume & AI Diagnostics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Upload PDF resumes for job applications and receive automated AI feedback on content and keyword coverage.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {success}
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 p-8 md:p-10 text-center transition-all bg-gradient-to-b from-indigo-50/20 dark:from-indigo-950/30 to-transparent">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Upload New Resume</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-5">PDF documents only • Maximum 5 MB</p>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-600/20 active:scale-95 ${
            uploading 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading Document...</>
          ) : (
            <><Upload className="w-4 h-4" /> Select PDF Document</>
          )}
        </label>
      </div>

      {/* Uploaded Resumes */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Uploaded Documents ({resumes.length})
        </h2>

        {resumes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            No resume uploaded yet. Select your latest resume file above.
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map(r => (
              <div key={r.id} className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-xs md:max-w-md">{r.fileName}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mt-1">
                      <span>Uploaded {formatDate(r.uploadedAt)}</span>
                      {r.active && (
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          Active Primary
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleDownload(r)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI Resume Analysis ─────────────────────────────────── */}
      <AiInsightPanel
        title="Gemini AI Resume Intelligence"
        loading={aiLoading}
        error={aiError}
        hasData={!!aiAnalysis}
        onGenerate={async () => {
          setAiLoading(true);
          setAiError('');
          try {
            const res = await aiService.analyzeResume();
            setAiAnalysis(res.data || res);
          } catch (err) {
            setAiError(err.response?.data?.detail || err.response?.data?.message || 'AI analysis failed. Please ensure a valid resume is active.');
          } finally {
            setAiLoading(false);
          }
        }}
      >
        {aiAnalysis && (
          <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
            {aiAnalysis.overallSummary && (
              <p className="leading-relaxed bg-indigo-50/50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 text-slate-800 dark:text-slate-200 font-medium">
                {aiAnalysis.overallSummary}
              </p>
            )}

            {aiAnalysis.strengths?.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Key Strengths
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                  {aiAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {aiAnalysis.weaknesses?.length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/50">
                <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Areas to Improve
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                  {aiAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {aiAnalysis.missingAreas?.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50">
                <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 text-xs uppercase tracking-wider">Missing Keywords / Sections</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysis.missingAreas.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiAnalysis.improvementSuggestions?.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wider">Actionable Recommendations</h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
                  {aiAnalysis.improvementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </AiInsightPanel>
    </div>
  );
};

export default StudentResume;
