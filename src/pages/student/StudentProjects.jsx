import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, GitBranch, Loader2 } from 'lucide-react';
import { getMyProjects, createProject, updateProject, deleteProject } from '../../services/studentService';

const emptyForm = { title: '', description: '', technologies: '', githubUrl: '', liveUrl: '', startDate: '', endDate: '' };

const ProjectModal = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState(project || emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold">{project ? 'Edit Project' : 'Add Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
          {[
            { label: 'Title *', name: 'title', required: true },
            { label: 'Technologies (e.g. React, Spring Boot)', name: 'technologies' },
            { label: 'GitHub URL', name: 'githubUrl' },
            { label: 'Live Demo URL', name: 'liveUrl' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                name={f.name}
                value={form[f.name] || ''}
                onChange={handleChange}
                required={f.required}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" name="startDate" value={form.startDate || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" name="endDate" value={form.endDate || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | project object
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getMyProjects();
      setProjects(res.data);
    } catch { setError('Failed to load projects.'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    if (modal && modal.id) {
      const res = await updateProject(modal.id, form);
      setProjects(prev => prev.map(p => p.id === modal.id ? res.data : p));
    } else {
      const res = await createProject(form);
      setProjects(prev => [res.data, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { setError('Failed to delete project.'); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-500">Loading projects...</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
          <p className="text-gray-400 mb-3">No projects added yet.</p>
          <button onClick={() => setModal('add')} className="text-blue-600 text-sm font-medium hover:underline">Add your first project →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                  {p.technologies && <p className="text-sm text-blue-600 font-medium mt-0.5">{p.technologies}</p>}
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{p.description}</p>
                  {(p.startDate || p.endDate) && (
                    <p className="text-xs text-gray-400 mt-2">{p.startDate || ''}{p.startDate && p.endDate ? ' → ' : ''}{p.endDate || ''}</p>
                  )}
                  <div className="flex gap-3 mt-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                        <GitBranch className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setModal(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default StudentProjects;
