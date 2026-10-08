import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { getSkillLibrary, getMySkills, addSkill, removeSkill } from '../../services/studentService';

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const levelColor = {
  BEGINNER: 'bg-gray-100 text-gray-700',
  INTERMEDIATE: 'bg-blue-50 text-blue-700',
  ADVANCED: 'bg-purple-50 text-purple-700',
  EXPERT: 'bg-green-50 text-green-700',
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
      setMySkills(skillsRes.data);
      setLibrary(libraryRes.data);
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
      setSuccess('Skill added!');
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

  // Filter out already-added skills from library dropdown
  const addedSkillIds = new Set(mySkills.map(s => s.skillId));
  const availableSkills = library.filter(s => !addedSkillIds.has(s.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500">Loading skills...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Skills</h1>

      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Skills */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">My Skills ({mySkills.length})</h2>

          {/* Add Skill Form */}
          <form onSubmit={handleAdd} className="mb-6 space-y-3">
            <select
              value={selectedSkillId}
              onChange={e => setSelectedSkillId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select a skill to add...</option>
              {availableSkills.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
              ))}
            </select>
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <button
                type="submit"
                disabled={adding || !selectedSkillId}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </button>
            </div>
          </form>

          {/* Skills List */}
          {mySkills.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No skills added yet.</div>
          ) : (
            <div className="space-y-2">
              {mySkills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{skill.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${levelColor[skill.level] || 'bg-gray-100 text-gray-700'}`}>
                      {skill.level}
                    </span>
                  </div>
                  <button onClick={() => handleRemove(skill.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skill Gap (static placeholder for now) */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-bold mb-2">Skill Gap Analysis</h2>
          <p className="text-sm text-gray-500 mb-4">Compare your skills against your target role.</p>
          <div className="p-4 border rounded-lg mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase">Target Role</p>
            <p className="font-semibold text-blue-700">Java Backend Developer</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2 text-green-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {mySkills.filter(s => ['Java', 'Spring Boot', 'MySQL', 'REST API'].includes(s.name)).map(s => (
                  <span key={s.id} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">{s.name}</span>
                ))}
                {mySkills.filter(s => ['Java', 'Spring Boot', 'MySQL', 'REST API'].includes(s.name)).length === 0 && (
                  <span className="text-xs text-gray-400">Add Java, Spring Boot, MySQL, REST API skills</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2 text-red-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Microservices', 'AWS'].filter(
                  name => !mySkills.some(s => s.name === name)
                ).map(name => (
                  <span key={name} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSkills;
