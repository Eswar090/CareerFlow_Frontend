import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, BookOpen, UserCheck, 
  Map, CheckSquare, GitCompare 
} from 'lucide-react';

const CareerPathNav = () => {
  const tabs = [
    { to: '/student/career-path', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/student/career-path/companies', label: 'Company Directory', icon: Building2 },
    { to: '/student/career-path/guide', label: 'Service vs Product Guide', icon: BookOpen },
    { to: '/student/career-path/roles', label: 'Tech Roles', icon: UserCheck },
    { to: '/student/career-path/roadmaps', label: 'My Roadmaps', icon: Map },
    { to: '/student/career-path/readiness', label: 'Readiness Tracker', icon: CheckSquare },
    { to: '/student/career-path/compare', label: 'Compare Companies', icon: GitCompare },
  ];

  return (
    <div className="bg-white/70 dark:bg-[#0d132b]/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-2 mb-6 shadow-sm overflow-x-auto">
      <nav className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25 scale-[1.01]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default CareerPathNav;

