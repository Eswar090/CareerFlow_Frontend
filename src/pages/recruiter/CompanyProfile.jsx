import React, { useState, useEffect, useRef } from 'react';
import { Building2, MapPin, Globe, Users, Calendar, Upload, Loader2, Check, Sparkles, Pencil, X, CheckCircle2, AlertCircle } from 'lucide-react';
import recruiterService from '../../services/recruiterService';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());
  const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    location: '',
    companySize: '',
    foundedYear: ''
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const data = await recruiterService.getCompany();
      if (!data) {
        setCompany(null);
        setIsEditing(true);
        return;
      }
      setCompany(data);
      setLogoError(false);
      fillFormData(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setCompany(null);
        setIsEditing(true);
      } else {
        setError('Failed to load company profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillFormData = (data) => {
    setFormData({
      name: data.name || '',
      industry: data.industry || '',
      description: data.description || '',
      website: data.website || '',
      location: data.location || '',
      companySize: data.companySize || '',
      foundedYear: data.foundedYear || ''
    });
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
      let updated;
      if (company) {
        updated = await recruiterService.updateCompany(formData);
      } else {
        updated = await recruiterService.createCompany(formData);
      }
      setCompany(updated);
      setIsEditing(false);
      setSuccessMessage(company ? 'Company profile updated successfully' : 'Company profile created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid image format. Please upload a PNG, JPG, or WEBP logo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo image exceeds the 5 MB limit. Please choose a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const updated = await recruiterService.uploadLogo(file);
      setCompany(updated);
      setLogoError(false);
      setLogoTimestamp(Date.now());
      setSuccessMessage('Company logo updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Retrieving company records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Employer Brand
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {company ? 'Company Profile' : 'Setup Employer Profile'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Build student trust with your verified corporate identity, locations, and mission.
          </p>
        </div>

        {company && !isEditing && (
          <button
            onClick={() => { setIsEditing(true); fillFormData(company); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-sm shadow-indigo-600/20 active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {company && !isEditing ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
          </div>

          <div className="px-6 md:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-12 mb-6">
              <div className="flex items-end gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-lg border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                    {company.logoUrl && !logoError ? (
                      <img 
                        src={`${backendBaseUrl}/api/companies/${company.id}/logo?t=${logoTimestamp}`} 
                        alt={`${company.name} Logo`} 
                        onError={() => setLogoError(true)}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-indigo-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-2 shadow-md transition"
                    title="Upload Company Logo"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                  />
                </div>

                <div className="pt-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{company.name}</h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{company.industry || 'Technology & Innovation'}</p>
                </div>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {company.location || 'Remote / Global'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Size</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {company.companySize || 'Growing Team'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Founded</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {company.foundedYear || 'Established'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web Presence</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-1 flex items-center gap-1 truncate">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : 'Not listed'}
                </p>
              </div>
            </div>

            {/* About Company */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-2">Company Overview</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {company.description || 'Add an overview of your organization to help prospective student candidates understand your mission and product line.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Edit or Create Form */
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                required
                placeholder="Acme Technologies Ltd."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Industry Sector</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Enterprise SaaS, FinTech, AI"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Headquarters / Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Company Size</label>
                <input
                  type="text"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  placeholder="50-200 employees"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Founded Year</label>
                <input
                  type="number"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  placeholder="2020"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Company Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition bg-white dark:bg-slate-900 resize-none"
                placeholder="Describe your organization's vision, culture, and core technology stack..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              {company && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {company ? 'Save Company Changes' : 'Create Company Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
