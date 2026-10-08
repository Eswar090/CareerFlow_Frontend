import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, User, Briefcase, PlusCircle, Calendar, LogOut, Building, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { useState, useEffect } from 'react';

const RecruiterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if(user) {
      notificationService.getUnreadCount().then(res => setUnreadCount(res.data?.count || 0)).catch(() => {});
    }
  }, [user, location.pathname]);

  const navItems = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/recruiter/profile', label: 'My Profile', icon: User },
    { path: '/recruiter/company', label: 'Company Profile', icon: Building },
    { path: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
    { path: '/recruiter/jobs/create', label: 'Post a Job', icon: PlusCircle },
    { path: '/recruiter/applicants', label: 'Applicants', icon: Users },
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" /> CareerFlow
          </div>
          <div className="text-xs text-slate-400 mt-1">Recruiter Portal</div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/recruiter/jobs' && location.pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="md:hidden text-xl font-bold text-blue-600">CareerFlow</div>
          <div className="flex items-center gap-4 ml-auto">
            
            <Link to="/recruiter/notifications" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-700">{user?.name || 'Recruiter'}</p>
                <p className="text-gray-500 text-xs">Recruiter</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
