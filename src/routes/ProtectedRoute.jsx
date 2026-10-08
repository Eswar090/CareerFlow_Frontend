import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect based on user's actual role
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

