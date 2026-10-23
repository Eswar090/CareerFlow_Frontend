import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, Award, CheckCircle2, Lock, Mail, AlertCircle
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const getErrorMessage = (error) => {
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
      const data = await login({ email: formData.email.trim(), password: formData.password });
      const rawRole = (data.user?.role || data.role || '')?.toUpperCase();
      const role = rawRole.replace('ROLE_', '');
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
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#070b19] text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors relative">
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Brand Logo Header */}
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Career<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              Sign in to manage your campus drives, applications, and career insights.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 rounded-2xl text-sm font-medium flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 shadow-2xs"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 shadow-2xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Remember this device
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right Column - Premium SaaS Artwork Panel (Desktop) */}
      <div className="hidden lg:flex relative w-0 flex-1 overflow-hidden bg-gradient-to-br from-[#0c1329] via-[#091024] to-[#050814] items-center justify-center p-12 border-l border-slate-200 dark:border-white/10">
        
        {/* Ambient radial glow lights */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/15 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Placement Intelligence</span>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Your Gateway to Top Enterprise Careers
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            From automated campus placement eligibility to AI-powered skill gap recommendations, CareerFlow accelerates every step of your hiring journey.
          </p>

          {/* Floating Showcase Cards */}
          <div className="grid grid-cols-2 gap-4 text-left pt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
              <Award className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Campus Drives</div>
              <p className="text-[11px] text-slate-400 mt-1">Automated branch, CGPA, and backlog qualification screening.</p>
            </div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
              <Sparkles className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="font-bold text-white text-sm">AI Skill Match</div>
              <p className="text-[11px] text-slate-400 mt-1">Algorithmic qualification scoring against active recruiter job specs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
