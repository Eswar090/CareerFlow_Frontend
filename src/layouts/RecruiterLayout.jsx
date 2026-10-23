import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, User, Briefcase, PlusCircle, 
  Calendar, LogOut, Building, Bell, Award, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import recruiterService from '../services/recruiterService';
import ThemeToggle from '../components/ThemeToggle';

const RecruiterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [sidebarImgError, setSidebarImgError] = useState(false);
  const [headerImgError, setHeaderImgError] = useState(false);

  const backendBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (user) {
      notificationService.getUnreadCount()
        .then(res => setUnreadCount(res.data?.count || 0))
        .catch(() => {});

      recruiterService.getProfile()
        .then(profile => {
          if (profile?.profilePictureUrl) {
            setProfilePictureUrl(profile.profilePictureUrl);
            setSidebarImgError(false);
            setHeaderImgError(false);
          }
        })
        .catch(() => {});
    }
    setMobileDrawerOpen(false);

    const handleProfileUpdate = (e) => {
      const url = e.detail?.profilePictureUrl;
      setProfilePictureUrl(url || null);
      setSidebarImgError(false);
      setHeaderImgError(false);
    };

    window.addEventListener('recruiter-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('recruiter-profile-updated', handleProfileUpdate);
  }, [user, location.pathname]);

  const navItems = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/recruiter/profile', label: 'My Profile', icon: User },
    { path: '/recruiter/company', label: 'Company Profile', icon: Building },
    { path: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
    { path: '/recruiter/jobs/create', label: 'Post a Job', icon: PlusCircle },
    { path: '/recruiter/applicants', label: 'Applicants', icon: Users },
    { path: '/recruiter/placement-drives', label: 'Placement Drives', icon: Award },
    { path: '/recruiter/interviews', label: 'Interviews', icon: Calendar },
    { path: '/recruiter/notifications', label: 'Notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'R';

  const currentNav = navItems.find(item => location.pathname === item.path || (item.path !== '/recruiter/dashboard' && item.path !== '/recruiter/jobs' && location.pathname.startsWith(item.path)));
  const pageTitle = currentNav?.label || 'Recruiter Center';

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#070b19] text-slate-800 dark:text-slate-100 antialiased overflow-hidden transition-colors">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div 
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-[#0a0f24] text-slate-300 flex flex-col shadow-2xl border-r border-white/5
        transition-transform duration-300 ease-out
        ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-[#0b1020] rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-0.5">
                Career<span className="text-cyan-400">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400/80 block">Recruiter Portal</span>
            </div>
          </Link>

          <button 
            onClick={() => setMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/recruiter/dashboard' && item.path !== '/recruiter/jobs' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-600/20 to-indigo-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#070b19]/60">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md overflow-hidden">
              {profilePictureUrl && !sidebarImgError ? (
                <img 
                  src={`${backendBaseUrl}${profilePictureUrl}`} 
                  alt={user?.name || 'Recruiter'} 
                  onError={() => setSidebarImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Recruiter'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Employer'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between px-6 sm:px-8 shadow-xs z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            <Link 
              to="/recruiter/notifications" 
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl relative transition-all bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs border border-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link 
              to="/recruiter/profile" 
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-white/10 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                {profilePictureUrl && !headerImgError ? (
                  <img 
                    src={`${backendBaseUrl}${profilePictureUrl}`} 
                    alt={user?.name || 'Recruiter'} 
                    onError={() => setHeaderImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">{user?.name || 'Recruiter'}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Corporate Recruiter</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-cyan-50/15 to-slate-100 dark:from-[#0b1020] dark:via-[#081326] dark:to-[#070b19] custom-scrollbar transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
