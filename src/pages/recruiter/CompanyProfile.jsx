import React, { useState, useEffect, useRef } from 'react';
import { Building, MapPin, Globe, Users, Calendar, Upload, Loader2, Check } from 'lucide-react';
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
      setCompany(data);
      fillFormData(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setCompany(null);
        setIsEditing(true); // Auto-open form if no company exists
      } else {
        setError('Failed to load company profile');
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
      setSuccessMessage(company ? 'Company updated successfully' : 'Company created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const updated = await recruiterService.uploadLogo(file);
      setCompany(updated);
      setSuccessMessage('Logo uploaded successfully');
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {company ? 'Company Profile' : 'Create Company Profile'}
        </h2>
        {company && !isEditing && (
          <button
            onClick={() => { setIsEditing(true); fillFormData(company); }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {company && !isEditing && (
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                {company.logoUrl ? (
                  <img 
                    src={`http://localhost:8080/api/recruiters/me/company/logo`} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 bg-white border border-gray-200 rounded-full p-2 text-gray-600 hover:text-blue-600 shadow-sm"
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
            
            <div>
              <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
              <p className="text-gray-500">{company.industry}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {company.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {company.location}
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    {company.companySize} employees
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Founded {company.foundedYear}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-800 mb-2">About Company</h4>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {company.description || 'No description provided.'}
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <input
                type="text"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                placeholder="e.g., 51-200"
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                placeholder="YYYY"
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-3">
            {company && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Company'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyProfile;

