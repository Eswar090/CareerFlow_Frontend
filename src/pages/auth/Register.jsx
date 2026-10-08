import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Eye, EyeOff } from 'lucide-react';

const getErrorMessage = (error) => {
  if (!error.response) {
    return 'Unable to connect to CareerFlow server. Please try again.';
  }
  const status = error.response?.status;
  const message = error.response?.data?.message || error.response?.data;
  if (status === 409) return 'An account with this email already exists. Please login.';
  if (status === 400) {
    if (typeof message === 'string' && message.length < 200) return message;
    return 'Invalid registration details. Please check your input.';
  }
  if (typeof message === 'string' && message.length < 200) return message;
  return 'Registration failed. Please try again.';
};

const validateForm = ({ name, email, password, confirmPassword, role }) => {
  if (!name.trim()) return 'Full name is required.';
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  if (!role) return 'Please select a role.';
  return null;
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const role = data.user?.role;
      if (role === 'STUDENT') navigate('/student/dashboard', { replace: true });
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Briefcase className="w-7 h-7 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">CareerFlow</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Create an Account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Join CareerFlow to get started</p>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
            >
              <option value="STUDENT">Student / Job Seeker</option>
              <option value="RECRUITER">Recruiter / Company</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-4"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
