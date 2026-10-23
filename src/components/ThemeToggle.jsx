import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Modern, accessible 3-way Theme Toggle component.
 * Allows switching between Light, Dark, and System Default.
 */
const ThemeToggle = ({ className = '', dropUp = false }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { id: 'light', label: 'Light', icon: Sun, color: 'text-amber-500' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'text-indigo-400' },
    { id: 'system', label: 'System', icon: Monitor, color: 'text-cyan-400' },
  ];

  // Active Icon to show on trigger button
  const ActiveIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-white/10 transition-all flex items-center justify-center shadow-2xs group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to change)`}
        aria-label="Toggle Theme Menu"
        aria-expanded={isOpen}
      >
        <ActiveIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
          resolvedTheme === 'dark' ? 'text-indigo-400' : 'text-amber-500'
        }`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 ${
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
          } w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 py-1.5 z-50 animate-fade-in backdrop-blur-xl`}
          role="menu"
        >
          <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            Theme
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;

