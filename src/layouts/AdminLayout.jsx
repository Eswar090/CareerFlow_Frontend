import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Briefcase, FileText, Calendar, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/companies', label: 'Companies', icon: Building },
    { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/admin/applications', label: 'Applications', icon: FileText },
    { path: '/admin/interviews', label: 'Interviews', icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" /> CareerFlow
          </div>
          <div className="text-xs text-indigo-300 mt-1">Admin Portal</div>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="md:hidden text-xl font-bold text-indigo-600">CareerFlow</div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-gray-500 text-xs">Administrator</p>
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

export default AdminLayout;
