import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, GitBranch, Loader2, Sparkles, FolderGit2, Calendar } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
            <p className="text-xs text-slate-400 font-medium">Showcase hands-on engineering accomplishments</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold">{error}</div>}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Project Title *</label>
            <input
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              required
              placeholder="e.g. Distributed Task Scheduler"
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Tech Stack (comma-separated)</label>
            <input
              name="technologies"
              value={form.technologies || ''}
              onChange={handleChange}
              placeholder="React, Spring Boot, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">GitHub Repository</label>
              <input
                name="githubUrl"
                value={form.githubUrl || ''}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Live Demo URL</label>
              <input
                name="liveUrl"
                value={form.liveUrl || ''}
                onChange={handleChange}
                placeholder="https://app.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Project Overview *</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Key architectural highlights, challenges solved, and business/technical outcomes..."
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Start Date</label>
              <input type="date" name="startDate" value={form.startDate || ''} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">End Date</label>
              <input type="date" name="endDate" value={form.endDate || ''} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-60 flex items-center gap-2 transition shadow-sm shadow-indigo-600/20 cursor-pointer">
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
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getMyProjects();
      setProjects(res.data || []);
    } catch { 
      setError('Failed to load portfolio projects.'); 
    } finally { 
      setLoading(false); 
    }
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
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch { 
      setError('Failed to delete project.'); 
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-80">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
      <p className="text-sm font-semibold text-slate-500">Loading your project portfolio...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Showcase Portfolio
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Technical Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Display your architectural implementations, GitHub code repositories, and deployed prototypes.
          </p>
        </div>
        <button 
          onClick={() => setModal('add')} 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20 active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {error && <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold">{error}</div>}

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/60">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No portfolio projects listed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-5">
            Add your course capstone, hackathon builds, or side projects to attract recruiters.
          </p>
          <button 
            onClick={() => setModal('add')} 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 hover:shadow-md transition-all p-6 md:p-7 group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                  </div>

                  {p.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-100 dark:border-indigo-800/60">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{p.description}</p>

                  {(p.startDate || p.endDate) && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.startDate || ''}{p.startDate && p.endDate ? ' → ' : ''}{p.endDate || 'Present'}
                    </p>
                  )}

                  <div className="flex gap-4 pt-3">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-3 py-1.5 rounded-lg transition">
                        <GitBranch className="w-3.5 h-3.5" /> View Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Preview
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <button onClick={() => setModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition cursor-pointer" title="Edit Project">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer" title="Delete Project">
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
