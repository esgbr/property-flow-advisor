
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const location = useLocation();
  
  // Not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Authenticated but not admin and admin is required
  if (requireAdmin && preferences.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Authenticated and meets role requirements
  return <>{children}</>;
};

export default AuthGuard;
