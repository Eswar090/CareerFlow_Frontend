import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Map, Plus, CheckCircle2, Circle, Clock, Building2, 
  Calendar, Award, Sparkles, ChevronDown, ChevronRight,
  Filter, CheckSquare, AlertCircle, ArrowRight
} from 'lucide-react';
import careerPathService from '../../../services/careerPathService';
import CareerPathNav from './CareerPathNav';

const CareerPathRoadmap = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';
  const initialCompanyId = searchParams.get('companyId') || '';

  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal / Creator State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTargetRole, setNewTargetRole] = useState(initialRole || 'Software Engineer');
  const [newCompanyId, setNewCompanyId] = useState(initialCompanyId);
  const [newDuration, setNewDuration] = useState(60);
  const [newTitle, setNewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active filter for weeks
  const [activeWeekFilter, setActiveWeekFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
    if (initialRole) {
      setNewTargetRole(initialRole);
      setShowCreateModal(true);
    }
  }, [initialRole, initialCompanyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [roadmapsData, compData] = await Promise.all([
        careerPathService.getRoadmaps(),
        careerPathService.getCompanies({ page: 0, size: 50, sortBy: 'nameAsc' })
      ]);

      setRoadmaps(roadmapsData || []);
      setCompanies(compData.content || []);

      if (roadmapsData && roadmapsData.length > 0) {
        setSelectedRoadmap(roadmapsData[0]);
      }
      if (initialRole || initialCompanyId) {
        setShowCreateModal(true);
      }
    } catch (err) {
      console.error('Failed to load roadmaps', err);
      setError('Unable to load preparation roadmaps.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!newTargetRole.trim()) {
      alert('Please enter a target role.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await careerPathService.createRoadmap({
        targetRole: newTargetRole.trim(),
        companyId: newCompanyId ? parseInt(newCompanyId, 10) : null,
        durationDays: parseInt(newDuration, 10),
        title: newTitle.trim() || undefined
      });

      setRoadmaps([res, ...roadmaps]);
      setSelectedRoadmap(res);
      setShowCreateModal(false);
      setNewTitle('');
    } catch (err) {
      console.error('Failed to create roadmap', err);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    if (!selectedRoadmap) return;
    try {
      const updatedTask = await careerPathService.updateTaskCompletion(
        selectedRoadmap.id,
        taskId,
        !currentStatus
      );

      // Update local state
      const updatedTasks = selectedRoadmap.tasks.map(t =>
        t.id === taskId ? { ...t, completed: updatedTask.completed } : t
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);

      const updatedRoadmap = {
        ...selectedRoadmap,
        tasks: updatedTasks,
        progressPercent: progress,
        completedTasksCount: completedCount,
        status: progress === 100 ? 'COMPLETED' : 'ACTIVE'
      };

      setSelectedRoadmap(updatedRoadmap);
      setRoadmaps(prev => prev.map(r => r.id === updatedRoadmap.id ? updatedRoadmap : r));
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  // Group tasks by week number
  const tasksByWeek = {};
  if (selectedRoadmap && selectedRoadmap.tasks) {
    selectedRoadmap.tasks.forEach(task => {
      const week = task.weekNumber || 1;
      if (!tasksByWeek[week]) {
        tasksByWeek[week] = [];
      }
      tasksByWeek[week].push(task);
    });
  }

  const weekKeys = Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <CareerPathNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Map className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Personalized Placement Roadmaps
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate 30, 60, or 90-day structured preparation roadmaps with milestone tasks for your target companies and roles.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:scale-[1.02] transition-transform self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Roadmap</span>
        </button>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-200 dark:bg-white/5 animate-pulse" />
      ) : error ? (
        <div className="p-8 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200/80 dark:border-white/10 space-y-4">
          <Map className="w-12 h-12 text-indigo-500 mx-auto opacity-70" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">No Roadmaps Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose your target career role and preferred company to generate a structured weekly placement preparation roadmap.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Generate First Roadmap</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Roadmap Selector Column */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Your Roadmaps ({roadmaps.length})
            </span>

            <div className="space-y-2">
              {roadmaps.map((r) => {
                const isSelected = selectedRoadmap?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoadmap(r)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all space-y-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25'
                        : 'bg-white dark:bg-[#0d132b] text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {r.title}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-500'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}>
                        {r.durationDays} Days &bull; {r.targetRole}
                      </span>
                      <span className="font-bold">{r.progressPercent}%</span>
                    </div>

                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-600'}`}
                        style={{ width: `${r.progressPercent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Roadmap Detailed Plan */}
          {selectedRoadmap && (
            <div className="lg:col-span-8 space-y-6">
              {/* Roadmap Header Summary Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {selectedRoadmap.durationDays}-Day Plan
                      </span>
                      {selectedRoadmap.companyName && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                          {selectedRoadmap.companyName}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedRoadmap.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Target Role: <strong className="text-slate-800 dark:text-slate-200">{selectedRoadmap.targetRole}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedRoadmap.progressPercent}%
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {selectedRoadmap.completedTasksCount || 0} of {selectedRoadmap.totalTasksCount || 0} completed
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
                    style={{ width: `${selectedRoadmap.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Weekly Milestones & Tasks */}
              <div className="space-y-4">
                {weekKeys.map((weekNum) => {
                  const tasks = tasksByWeek[weekNum];
                  const allDone = tasks.every(t => t.completed);
                  return (
                    <div
                      key={weekNum}
                      className="p-5 rounded-3xl bg-white dark:bg-[#0d132b] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                            allDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            W{weekNum}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Week {weekNum} Milestone
                          </h3>
                        </div>

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {tasks.filter(t => t.completed).length} / {tasks.length} done
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id, task.completed)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                              task.completed
                                ? 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 opacity-75'
                                : 'bg-white dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:border-indigo-400 hover:shadow-sm'
                            }`}
                          >
                            <button
                              type="button"
                              className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                                task.completed
                                  ? 'bg-emerald-500 text-white'
                                  : 'border-2 border-slate-300 dark:border-white/20 hover:border-indigo-500'
                              }`}
                            >
                              {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-xs font-bold ${
                                  task.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}>
                                  {task.title}
                                </h4>
                                {task.category && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                    {task.category.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Roadmap Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0d132b] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Generate Placement Roadmap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tailor your weekly milestone tasks to your preferred role and target company.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRoadmap} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Target Technical Role *
                </label>
                <select
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Software Development Engineer (SDE)">Software Development Engineer (SDE)</option>
                  <option value="QA Automation Engineer">QA Automation Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Application Support Engineer">Application Support Engineer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Target Company (Optional)
                </label>
                <select
                  value={newCompanyId}
                  onChange={(e) => setNewCompanyId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">General Preparation (No Specific Company)</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.category?.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Preparation Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 30, label: '30 Days', desc: 'Sprint' },
                    { days: 60, label: '60 Days', desc: 'Standard' },
                    { days: 90, label: '90 Days', desc: 'Deep Dive' },
                  ].map((d) => (
                    <button
                      key={d.days}
                      type="button"
                      onClick={() => setNewDuration(d.days)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        newDuration === d.days
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{d.label}</div>
                      <div className="text-[10px] opacity-80">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Roadmap Custom Title (Optional)
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. My Amazon SDE 60-Day Prep"
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Create Roadmap'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathRoadmap;

