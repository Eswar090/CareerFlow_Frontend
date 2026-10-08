import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, FileText, Calendar, Bell, LogOut, Award, FolderOpen, BookOpen, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { useState, useEffect } from 'react';

const StudentLayout = () => {
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
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/profile', label: 'My Profile', icon: User },
    { path: '/student/skills', label: 'Skills', icon: Award },
    { path: '/student/projects', label: 'Projects', icon: FolderOpen },
    { path: '/student/certifications', label: 'Certifications', icon: BookOpen },
    { path: '/student/resume', label: 'Resume', icon: FileCheck },
    { path: '/student/jobs', label: 'Job Search', icon: Briefcase },
    { path: '/student/applications', label: 'Applications', icon: FileText },
    { path: '/student/interviews', label: 'Interviews', icon: Calendar },
    { path: '/student/notifications', label: 'Notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Briefcase className="w-6 h-6" /> CareerFlow
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <Link to="/student/notifications" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-700">{user?.name || 'Student'}</p>
                <p className="text-gray-500 text-xs">Student</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
