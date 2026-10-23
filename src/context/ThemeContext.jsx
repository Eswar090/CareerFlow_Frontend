import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'careerflow-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    } catch {
      return 'system';
    }
  });

  const getSystemTheme = useCallback(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const initialTheme = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY) || 'system';
      } catch {
        return 'system';
      }
    })();
    return initialTheme === 'system' ? getSystemTheme() : initialTheme;
  });

  const applyTheme = useCallback((activeResolvedTheme) => {
    const root = document.documentElement;
    if (activeResolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }

    const nextResolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    setResolvedTheme(nextResolved);
    applyTheme(nextResolved);
  }, [getSystemTheme, applyTheme]);

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const nextResolved = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(nextResolved);
        applyTheme(nextResolved);
      }
    };

    // Apply current theme on mount
    const currentResolved = theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
    setResolvedTheme(currentResolved);
    applyTheme(currentResolved);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;

