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
    <div className="flex h-screen bg-transparent">
      {/* Sidebar - Dark Navy */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col hidden md:flex shadow-xl z-20">
        <div className="p-6 border-b border-slate-700/50">
          <div className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            CareerFlow
          </div>
          <div className="text-xs font-semibold text-indigo-400 mt-2 uppercase tracking-wider">Admin Portal</div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-indigo-500/10 text-indigo-400 shadow-sm' : 'hover:bg-slate-800/50 hover:text-white'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Topbar - Clean White */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="md:hidden text-xl font-black text-indigo-600">CareerFlow</div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white">
                {initials}
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-bold text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-slate-500 text-xs font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
