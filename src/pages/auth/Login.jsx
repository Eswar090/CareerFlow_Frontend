import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Eye, EyeOff, ArrowRight } from 'lucide-react';

const getErrorMessage = (error) => {
  // Network error or backend unreachable
  if (!error.response || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to CareerFlow server. Please check whether the server is running.';
  }

  const status = error.response?.status;
  const data = error.response?.data;
  const message = data?.message || (typeof data === 'string' ? data : null);

  if (status === 401) {
    return 'Invalid email or password.';
  }
  if (status === 403) {
    return 'Access denied. Your account may be inactive or lack permissions.';
  }
  if (status === 400) {
    if (typeof message === 'string' && message.length < 200) {
      return message;
    }
    return 'Invalid request details. Please check your inputs.';
  }
  if (status === 404) {
    return 'Requested service not found. Please try again later.';
  }
  if (status >= 500) {
    return 'Something went wrong. Please try again later.';
  }
  if (typeof message === 'string' && message.length < 200) {
    return message;
  }
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tight">CareerFlow</span>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue building your career</p>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium flex items-start gap-2">
              <span className="block mt-0.5">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Logging in...' : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-sm font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Create one now</Link>
          </p>
        </div>
      </div>
      
      {/* Right Column - Image/Gradient */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-12">
            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">Your Career Journey<br/>Starts Here</h1>
            <p className="text-indigo-100 text-lg mx-auto max-w-lg">Connect with top employers, manage applications, and accelerate your growth with CareerFlow.</p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
