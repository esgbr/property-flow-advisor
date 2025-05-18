
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
}

/**
 * Protects routes that require authentication
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth',
  requiredRole
}) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the current location
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }
  
  // Check for role-based access if a role is required
  if (requiredRole && preferences?.role !== requiredRole) {
    // User doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated (and has required role if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
