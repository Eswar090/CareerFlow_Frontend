import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, Loader2, Award, Calendar, Sparkles } from 'lucide-react';
import { getMyCertifications, createCertification, updateCertification, deleteCertification } from '../../services/studentService';

const emptyForm = { name: '', issuer: '', issueDate: '', credentialUrl: '' };

const CertModal = ({ cert, onSave, onClose }) => {
  const [form, setForm] = useState(cert ? { ...cert, issueDate: cert.issueDate || '' } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, issueDate: form.issueDate || null };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save certification.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{cert ? 'Edit Certification' : 'Add Certification'}</h2>
            <p className="text-xs text-slate-400 font-medium">Add verified course completions & professional badges</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Certification Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" placeholder="e.g. AWS Certified Solutions Architect" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Issuing Organization *</label>
            <input name="issuer" value={form.issuer} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" placeholder="e.g. Amazon Web Services, Coursera, Oracle" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Issue Date</label>
            <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Credential Verification URL</label>
            <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" placeholder="https://www.credly.com/badges/..." />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-60 flex items-center gap-2 transition shadow-sm shadow-indigo-600/20 cursor-pointer">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentCertifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchCerts(); }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await getMyCertifications();
      setCerts(res.data || []);
    } catch { setError('Failed to load certifications.'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    if (modal && modal.id) {
      const res = await updateCertification(modal.id, form);
      setCerts(prev => prev.map(c => c.id === modal.id ? res.data : c));
    } else {
      const res = await createCertification(form);
      setCerts(prev => [res.data, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await deleteCertification(id);
      setCerts(prev => prev.filter(c => c.id !== id));
    } catch { setError('Failed to delete certification.'); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-80">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-semibold text-slate-500">Loading certifications...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Credentials & Badges
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Certifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Display your industry credentials, vendor certs, and specialized accreditations.
          </p>
        </div>
        <button 
          onClick={() => setModal('add')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20 active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {error && <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold">{error}</div>}

      {certs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No certifications recorded</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
            Add online certifications or test credentials to boost your profile readiness score.
          </p>
          <button 
            onClick={() => setModal('add')} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.map(c => (
            <div key={c.id} className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 hover:shadow-md transition-all p-6 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{c.issuer}</p>
                    {c.issueDate && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> Issued: {new Date(c.issueDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    {c.credentialUrl && (
                      <a 
                        href={c.credentialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mt-3 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-2.5 py-1 rounded-lg transition"
                      >
                        <ExternalLink className="w-3 h-3" /> View Credential
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setModal(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition cursor-pointer" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <CertModal
          cert={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default StudentCertifications;
