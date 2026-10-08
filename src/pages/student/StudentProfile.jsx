import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentProfile, updateStudentProfile } from '../../services/studentService';
import { User, MapPin, Phone, GraduationCap, BookOpen, Pencil, X, Check, Loader2 } from 'lucide-react';

const Field = ({ label, value, placeholder = '—' }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm text-gray-800">{value || <span className="text-gray-400">{placeholder}</span>}</p>
  </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', step }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      step={step}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
      setError('Failed to load profile. Please try again.');
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
        about: form.about || null,
      };
      const res = await updateStudentProfile(payload);
      setProfile(res.data);
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.name?.charAt(0)?.toUpperCase() || '?';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing ? (
          <button
            onClick={() => { setEditing(true); setSuccess(''); setError(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm hover:bg-blue-700"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setForm(profile); setError(''); }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg text-sm hover:bg-green-700 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

      {/* Profile Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.name || user?.name}</h2>
            <p className="text-gray-500">{profile?.degree}{profile?.branch ? ` • ${profile.branch}` : ''}</p>
            <p className="text-gray-400 text-sm mt-1">
              {profile?.email}
              {profile?.phone && ` • ${profile.phone}`}
              {profile?.location && ` • ${profile.location}`}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form / View */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Personal Info
          </h3>
          {editing ? (
            <div className="space-y-3">
              <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <InputField label="Location" name="location" value={form.location} onChange={handleChange} />
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">About</label>
                <textarea
                  name="about"
                  value={form.about ?? ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Write a short bio..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="Phone" value={profile?.phone} />
              <Field label="Location" value={profile?.location} />
              <Field label="About" value={profile?.about} />
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" /> Education
          </h3>
          {editing ? (
            <div className="space-y-3">
              <InputField label="University" name="university" value={form.university} onChange={handleChange} />
              <InputField label="Degree" name="degree" value={form.degree} onChange={handleChange} />
              <InputField label="Branch / Specialization" name="branch" value={form.branch} onChange={handleChange} />
              <InputField label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} type="number" />
              <InputField label="CGPA (0–10)" name="cgpa" value={form.cgpa} onChange={handleChange} type="number" step="0.01" />
            </div>
          ) : (
            <div className="space-y-3">
              <Field label="University" value={profile?.university} />
              <Field label="Degree" value={profile?.degree} />
              <Field label="Branch" value={profile?.branch} />
              <Field label="Graduation Year" value={profile?.graduationYear} />
              <Field label="CGPA" value={profile?.cgpa ? `${profile.cgpa} / 10` : null} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
