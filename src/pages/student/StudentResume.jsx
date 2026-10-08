import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Download, FileText, Loader2, CheckCircle, CheckSquare } from 'lucide-react';
import { getMyResumes, uploadResume, deleteResume, getResumeDownloadUrl } from '../../services/studentService';
import api from '../../services/api';
import aiService from '../../services/aiService';
import AiInsightPanel from '../../components/AiInsightPanel';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
      setResumes(res.data);
    } catch { setError('Failed to load resumes.'); }
    finally { setLoading(false); }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
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
    if (!window.confirm('Delete this resume?')) return;
    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch { setError('Failed to delete resume.'); }
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
    } catch { setError('Failed to download resume.'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-500">Loading resumes...</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Resume</h1>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</div>}

      {/* Upload Zone */}
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">Upload your resume</p>
        <p className="text-xs text-gray-400 mb-4">PDF only • Max 5 MB</p>
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
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4" /> Choose PDF File</>
          )}
        </label>
      </div>

      {/* Resumes List */}
      {resumes.length === 0 ? (
        <div className="text-center py-6 text-gray-400 text-sm">No resumes uploaded yet.</div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-700">Uploaded Resumes ({resumes.length})</h2>
          {resumes.map(r => (
            <div key={r.id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{r.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(r.uploadedAt)}</p>
                {r.active && <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">Active</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(r)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── AI Resume Analysis ─────────────────────────────────── */}
      <AiInsightPanel
        title="AI Resume Analysis"
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
            setAiError(err.response?.data?.detail || err.response?.data?.message || 'AI analysis failed. Please try again.');
          } finally {
            setAiLoading(false);
          }
        }}
      >
        {aiAnalysis && (
          <div className="space-y-4 text-sm">
            <p className="text-gray-700 leading-relaxed">{aiAnalysis.overallSummary}</p>

            {aiAnalysis.strengths?.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-1">✓ Strengths</h4>
                <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                  {aiAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {aiAnalysis.weaknesses?.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-1">⚠ Areas to Improve</h4>
                <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                  {aiAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            {aiAnalysis.missingAreas?.length > 0 && (
              <div>
                <h4 className="font-semibold text-orange-600 mb-1">Missing Areas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysis.missingAreas.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {aiAnalysis.improvementSuggestions?.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-1">Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
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

