import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, Loader2, Award } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold">{cert ? 'Edit Certification' : 'Add Certification'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="AWS Certified Solutions Architect" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization *</label>
            <input name="issuer" value={form.issuer} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Amazon Web Services" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
            <input name="credentialUrl" value={form.credentialUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
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
      setCerts(res.data);
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
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-500">Loading certifications...</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Certifications</h1>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      {certs.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-3">No certifications added yet.</p>
          <button onClick={() => setModal('add')} className="text-blue-600 text-sm font-medium hover:underline">Add your first certification →</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.map(c => (
            <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{c.issuer}</p>
                    {c.issueDate && <p className="text-xs text-gray-400 mt-0.5">Issued: {c.issueDate}</p>}
                    {c.credentialUrl && (
                      <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                        <ExternalLink className="w-3 h-3" /> View Credential
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setModal(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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

