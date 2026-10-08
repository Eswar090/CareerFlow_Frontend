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
  if (status === 401) return 'Invalid email or password. Please try again.';
  if (status === 403) return 'Access denied.';
  if (typeof message === 'string' && message.length < 200) return message;
  return 'Login failed. Please try again.';
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login({ email: formData.email, password: formData.password });
      const role = data.user?.role;
      if (role === 'STUDENT') navigate('/student/dashboard', { replace: true });
      else if (role === 'RECRUITER') navigate('/recruiter/dashboard', { replace: true });
      else if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Briefcase className="w-7 h-7 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">CareerFlow</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
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
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="••••••••"
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
