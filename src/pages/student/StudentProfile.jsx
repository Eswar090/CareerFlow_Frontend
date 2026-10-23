import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentProfile } from '../../services/studentService';
import { 
  User, MapPin, Phone, GraduationCap, BookOpen, Pencil, X, Check, 
  Loader2, Mail, Award, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';

const Field = ({ label, value, placeholder = 'Not specified' }) => (
  <div className="p-3.5 bg-slate-50/70 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-words">{value || <span className="text-slate-400 dark:text-slate-500 font-normal italic">{placeholder}</span>}</p>
  </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', step, min, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      step={step}
      min={min}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
    />
  </div>
);

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getStudentProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        phone: form.phone || null,
        location: form.location || null,
        university: form.university || null,
        degree: form.degree || null,
        branch: form.branch || null,
        graduationYear: form.graduationYear ? parseInt(form.graduationYear) : null,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
        activeBacklogs: form.activeBacklogs !== undefined && form.activeBacklogs !== '' && form.activeBacklogs !== null ? parseInt(form.activeBacklogs) : 0,
        about: form.about || null,
      };
      const res = await updateStudentProfile(payload);
      setProfile(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.name?.charAt(0)?.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header with Title and Edit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Maintain your verified academic records, contact info, and career bio.
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => { setEditing(true); setSuccess(''); setError(''); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => { setEditing(false); setForm(profile); setError(''); }}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition disabled:opacity-60 active:scale-95 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {success}
        </div>
      )}

      {/* Profile Banner & Identity Card */}
      <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
        </div>
        <div className="px-6 md:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-1 shadow-lg shadow-indigo-600/20 ring-4 ring-white dark:ring-slate-900 shrink-0">
                <div className="w-full h-full rounded-[20px] bg-slate-900 flex items-center justify-center text-2xl font-black text-white">
                  {initials}
                </div>
              </div>
              <div className="pt-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {profile?.name || user?.name}
                </h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  {profile?.degree || 'Student'} {profile?.branch ? `• ${profile.branch}` : ''}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile?.email}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.location}
                    </span>
                  )}
                  {profile?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile?.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 self-center md:self-auto">
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CGPA</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{profile?.cgpa ? `${profile.cgpa}` : '—'}</p>
              </div>
              <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backlogs</p>
                <p className={`text-lg font-black ${profile?.activeBacklogs > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {profile?.activeBacklogs !== null && profile?.activeBacklogs !== undefined ? profile.activeBacklogs : 0}
                </p>
              </div>
              <div className="text-center px-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{profile?.graduationYear || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact & Personal Information */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Personal & Contact Info</h3>
              <p className="text-xs text-slate-400 font-medium">How recruiters and placement cells reach you</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4 pt-2">
              <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <InputField label="Location / City" name="location" value={form.location} onChange={handleChange} placeholder="Hyderabad, India" />
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Professional Bio</label>
                <textarea
                  name="about"
                  value={form.about ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition resize-none bg-white dark:bg-slate-900"
                  placeholder="Share your career aspirations, key specializations, and professional interests..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Field label="Phone" value={profile?.phone} />
              <Field label="Current Location" value={profile?.location} />
              <Field label="Professional Bio" value={profile?.about} placeholder="No bio added yet." />
            </div>
          )}
        </div>

        {/* Academic Details */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-black/40 p-6 md:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Academic Background</h3>
              <p className="text-xs text-slate-400 font-medium">College, graduation year, CGPA, and backlog record</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4 pt-2">
              <InputField label="University / College" name="university" value={form.university} onChange={handleChange} placeholder="Institute of Technology" />
              <InputField label="Degree" name="degree" value={form.degree} onChange={handleChange} placeholder="B.Tech, B.E., M.Tech" />
              <InputField label="Department / Branch" name="branch" value={form.branch} onChange={handleChange} placeholder="Computer Science & Engineering" />
              <div className="grid grid-cols-3 gap-3">
                <InputField label="Grad Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} type="number" placeholder="2026" />
                <InputField label="CGPA (0–10)" name="cgpa" value={form.cgpa} onChange={handleChange} type="number" step="0.01" placeholder="8.5" />
                <InputField label="Backlogs" name="activeBacklogs" value={form.activeBacklogs} onChange={handleChange} type="number" min="0" placeholder="0" />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Field label="University / College" value={profile?.university} />
              <Field label="Degree" value={profile?.degree} />
              <Field label="Branch / Specialization" value={profile?.branch} />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Graduation" value={profile?.graduationYear} />
                <Field label="CGPA" value={profile?.cgpa ? `${profile.cgpa} / 10` : null} />
                <Field label="Backlogs" value={profile?.activeBacklogs !== null && profile?.activeBacklogs !== undefined ? profile.activeBacklogs : 0} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
