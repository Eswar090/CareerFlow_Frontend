import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Sparkles, Award, CheckCircle2, Lock, Mail, User, 
  Building2, AlertCircle
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

const getErrorMessage = (error) => {
  if (!error.response || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to CareerFlow server. Please check whether the server is running.';
  }
  const status = error.response?.status;
  const data = error.response?.data;
  const message = data?.message || (typeof data === 'string' ? data : null);
  if (status === 409) return 'An account with this email already exists. Please login.';
  if (status === 400) {
    if (typeof message === 'string' && message.length < 200) return message;
    return 'Invalid registration details. Please check your input.';
  }
  if (status >= 500) return 'Something went wrong. Please try again later.';
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

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
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
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
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

      {/* Left Column - Premium Artwork Panel (Desktop) */}
      <div className="hidden lg:flex relative w-0 flex-1 overflow-hidden bg-gradient-to-br from-[#0c1329] via-[#091024] to-[#050814] items-center justify-center p-12 border-r border-slate-200 dark:border-white/10">
        
        {/* Ambient radial glow lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Campus Recruitment SaaS</span>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Join the Network of Future Tech Leaders
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            Build your comprehensive academic profile, participate in verified placement drives, and unlock AI-powered career roadmaps.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left pt-4">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Smart Screening</div>
              <p className="text-[11px] text-slate-400 mt-1">Direct eligibility calculation for campus recruitment drives.</p>
            </div>

            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl">
              <Sparkles className="w-6 h-6 text-cyan-400 mb-2" />
              <div className="font-bold text-white text-sm">Real-Time Pipeline</div>
              <p className="text-[11px] text-slate-400 mt-1">Instant updates on shortlisting, interviews, and offers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-24 py-12 relative z-10 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Logo Header */}
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
          
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an Account</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              Choose your role and start your recruitment journey today.
            </p>
          </div>

          {/* Role Switcher Pills */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-[#0d1527] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleRoleSelect('STUDENT')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formData.role === 'STUDENT'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                Student / Graduate
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('RECRUITER')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  formData.role === 'RECRUITER'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Recruiter / Company
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 rounded-2xl text-sm font-medium flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 shadow-2xs"
                  placeholder="e.g. Alex Morgan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
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
                  placeholder="Minimum 8 characters"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all disabled:opacity-50 shadow-2xs"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4 cursor-pointer"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
