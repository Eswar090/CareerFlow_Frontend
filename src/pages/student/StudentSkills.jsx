import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2, Sparkles, CheckCircle2, AlertCircle, Target, Award, BookOpen } from 'lucide-react';
import { getSkillLibrary, getMySkills, addSkill, removeSkill } from '../../services/studentService';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const LEVEL_STYLES = {
  BEGINNER: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  INTERMEDIATE: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
  ADVANCED: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60',
  EXPERT: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
};

const StudentSkills = () => {
  const [mySkills, setMySkills] = useState([]);
  const [library, setLibrary] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [skillsRes, libraryRes] = await Promise.all([getMySkills(), getSkillLibrary()]);
      setMySkills(skillsRes.data || []);
      setLibrary(libraryRes.data || []);
    } catch {
      setError('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      const res = await addSkill({ skillId: parseInt(selectedSkillId), level: selectedLevel });
      setMySkills(prev => [...prev, res.data]);
      setSelectedSkillId('');
      setSuccess('Skill successfully added to profile!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Failed to add skill.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (studentSkillId) => {
    try {
      await removeSkill(studentSkillId);
      setMySkills(prev => prev.filter(s => s.id !== studentSkillId));
    } catch {
      setError('Failed to remove skill.');
    }
  };

  const addedSkillIds = new Set(mySkills.map(s => s.skillId));
  const availableSkills = library.filter(s => !addedSkillIds.has(s.id));

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading your competencies...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Skill Matrix
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Manage Technical Skills
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Add programming languages, frameworks, and tools to power automated job and drive matching.
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Skills & Add Form */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-6 md:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">My Skills</h2>
              <p className="text-xs text-slate-400 font-medium">{mySkills.length} verified competencies recorded</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl text-xs border border-indigo-100 dark:border-indigo-800/60">
              {mySkills.length} total
            </span>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAdd} className="space-y-3 bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Add New Competency
            </label>
            <select
              value={selectedSkillId}
              onChange={e => setSelectedSkillId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
              required
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Select from skill repository...</option>
              {availableSkills.map(s => (
                <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{s.name} ({s.category})</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition"
              >
                {LEVELS.map(l => <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{l}</option>)}
              </select>
              <button
                type="submit"
                disabled={adding || !selectedSkillId}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-indigo-600/20 disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Skill
              </button>
            </div>
          </form>

          {/* Skills List */}
          {mySkills.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm font-medium">
              No skills added yet. Select a skill from the repository above.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {mySkills.map(skill => (
                <div 
                  key={skill.id} 
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 shadow-2xs transition group"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">{skill.name}</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${LEVEL_STYLES[skill.level] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                      {skill.level}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemove(skill.id)} 
                    className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/50 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center justify-center transition-colors"
                    title="Remove skill"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Gap Benchmark */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-6 md:p-7 space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Role Benchmark</h2>
              <p className="text-xs text-slate-400 font-medium">Readiness target for modern engineering roles</p>
            </div>
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-50/70 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-800/40">
            <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-300 uppercase tracking-wider">Benchmark Profile</p>
            <p className="text-base font-black text-indigo-900 dark:text-indigo-200 mt-0.5">Full Stack / Java Cloud Developer</p>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold mb-2.5 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Acquired Competencies
              </p>
              <div className="flex flex-wrap gap-2">
                {mySkills.filter(s => ['Java', 'Spring Boot', 'MySQL', 'REST API', 'JavaScript', 'React'].includes(s.name)).map(s => (
                  <span key={s.id} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                    {s.name}
                  </span>
                ))}
                {mySkills.filter(s => ['Java', 'Spring Boot', 'MySQL', 'REST API', 'JavaScript', 'React'].includes(s.name)).length === 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 italic">Add Java, Spring Boot, MySQL, or React to see matched progress</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold mb-2.5 text-rose-700 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" /> Recommended Additions
              </p>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Microservices', 'AWS', 'Kafka'].filter(
                  name => !mySkills.some(s => s.name === name)
                ).map(name => (
                  <span key={name} className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800/60">
                    + {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              💡 Tip: Every job listing runs dynamic AI compatibility against this skill matrix to evaluate qualification scores.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSkills;
