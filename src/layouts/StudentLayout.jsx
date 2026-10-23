import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Briefcase, FileText, Calendar, 
  Bell, LogOut, Award, FolderOpen, BookOpen, FileCheck, 
  Menu, X, Sparkles, ChevronRight, Compass, Code2, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import ThemeToggle from '../components/ThemeToggle';


const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      notificationService.getUnreadCount()
        .then(res => setUnreadCount(res.data?.count || 0))
        .catch(() => {});
    }
    setMobileDrawerOpen(false);
  }, [user, location.pathname]);

  const navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/profile', label: 'My Profile', icon: User },
    { path: '/student/skills', label: 'Skills', icon: Award },
    { path: '/student/projects', label: 'Projects', icon: FolderOpen },
    { path: '/student/certifications', label: 'Certifications', icon: BookOpen },
    { path: '/student/resume', label: 'Resume', icon: FileCheck },
    { path: '/student/jobs', label: 'Job Search', icon: Briefcase },
    { path: '/student/placement-drives', label: 'Placement Drives', icon: Award },
    { path: '/student/career-path', label: 'CareerPath Guide', icon: Compass },
    { path: '/student/applications', label: 'Applications', icon: FileText },
    { path: '/student/interviews', label: 'Interviews', icon: Calendar },
    { path: '/student/calendar', label: 'Placement Calendar', icon: Calendar },
    { path: '/student/dsa-tracker', label: 'DSA Tracker', icon: Code2 },
    { path: '/student/mock-interviews', label: 'Mock Interviews', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  const currentNav = navItems.find(item => location.pathname === item.path || (item.path !== '/student/dashboard' && location.pathname.startsWith(item.path)));
  const pageTitle = currentNav?.label || 'Student Portal';

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
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-600/30">
              <div className="w-full h-full bg-[#0b1020] rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-0.5">
                Career<span className="text-indigo-400">Flow</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400/80 block">Student Space</span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/student/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-indigo-300 border border-indigo-500/30 shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#070b19]/60">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'Candidate'}</p>
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

      {/* Main Content Area */}
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
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <Link 
              to="/student/notifications" 
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl relative transition-all bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs border border-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Quick Profile Link */}
            <Link 
              to="/student/profile" 
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-white/10 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-slate-400 font-semibold">Verified Candidate</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-indigo-50/15 to-slate-100 dark:from-[#0b1020] dark:via-[#090e1f] dark:to-[#070b19] custom-scrollbar transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
