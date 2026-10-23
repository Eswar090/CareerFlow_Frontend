import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Phone, Briefcase, Mail, Loader2, Check, Sparkles, 
  CheckCircle2, AlertCircle, Camera, Trash2, Upload 
} from 'lucide-react';
import recruiterService from '../../services/recruiterService';

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designation: ''
  });

  const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await recruiterService.getProfile();
      setProfile(data);
      setImageError(false);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        designation: data.designation || ''
      });
    } catch (err) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    try {
      const updated = await recruiterService.updateProfile(formData);
      setProfile(prev => ({ ...prev, ...updated }));
      setSuccessMessage('Profile details updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      window.dispatchEvent(new CustomEvent('recruiter-profile-updated', { detail: updated }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recruiter profile');
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload a JPG, PNG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file size exceeds the 5 MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploadingPic(true);
      setError(null);
      const res = await recruiterService.uploadProfilePicture(file);
      const updated = res.data || res;
      setProfile(prev => ({ ...prev, profilePictureUrl: updated.profilePictureUrl }));
      setImageError(false);
      setCacheBuster(Date.now());
      setSuccessMessage('Profile picture updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      window.dispatchEvent(new CustomEvent('recruiter-profile-updated', { 
        detail: { profilePictureUrl: updated.profilePictureUrl } 
      }));
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      setUploadingPic(true);
      setError(null);
      await recruiterService.deleteProfilePicture();
      setProfile(prev => ({ ...prev, profilePictureUrl: null }));
      setImageError(false);
      setSuccessMessage('Profile picture removed');
      setTimeout(() => setSuccessMessage(''), 3000);
      window.dispatchEvent(new CustomEvent('recruiter-profile-updated', { 
        detail: { profilePictureUrl: null } 
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setUploadingPic(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading recruiter profile...</p>
      </div>
    );
  }

  const profileImageUrl = profile?.profilePictureUrl 
    ? `${backendBaseUrl}${profile.profilePictureUrl}?t=${cacheBuster}`
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Account Settings
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Recruiter Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Update your personal recruiter branding, official picture, and corporate designation.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xs p-6 md:p-8 space-y-6">
        {/* Profile Picture Card Header */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                {profileImageUrl && !imageError ? (
                  <img 
                    src={profileImageUrl} 
                    alt={profile?.name || 'Recruiter'} 
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{profile?.name?.charAt(0) || 'R'}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPic}
                className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-xl shadow-md transition cursor-pointer"
                title="Upload Profile Picture"
              >
                {uploadingPic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{profile?.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {profile?.email}
              </div>
              {profile?.designation && (
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-[10px] border border-indigo-100 dark:border-indigo-800/40">
                  {profile.designation}
                </span>
              )}
            </div>
          </div>

          {/* Picture Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPic}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{profile?.profilePictureUrl ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
            {profile?.profilePictureUrl && (
              <button
                type="button"
                onClick={handleDeleteProfilePicture}
                disabled={uploadingPic}
                className="px-3 py-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Remove Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-800/80"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={profile?.email || ''}
                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">Managed via corporate authentication.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-800/80 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Job Designation / Role</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Technical Recruiter, University Relations"
                className="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-800/80 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20 active:scale-95 text-sm cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterProfile;
