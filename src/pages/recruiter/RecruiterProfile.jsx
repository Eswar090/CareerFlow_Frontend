import React, { useState, useEffect } from 'react';
import { User, Phone, Briefcase, Mail, Loader2, Check } from 'lucide-react';
import recruiterService from '../../services/recruiterService';

const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designation: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await recruiterService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        designation: data.designation || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
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
      setProfile(updated);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recruiter Profile</h2>

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

      <div className="mb-6 bg-gray-50 p-4 rounded-lg flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
          {profile?.name?.charAt(0) || 'R'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{profile?.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            {profile?.email}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={profile?.email || ''}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 bg-gray-50 text-gray-500"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecruiterProfile;

