
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { logSecurityEvent } from '@/utils/securityUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requiredRole?: string;
  requiresAuth?: boolean;
}

/**
 * Protects routes that require authentication
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth',
  requiredRole,
  requiresAuth = true
}) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const { user } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  // Skip protection if authentication is not required
  if (!requiresAuth) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Log security event for audit
    logSecurityEvent('login_failure', {
      path: location.pathname,
      reason: 'Unauthenticated access attempt'
    });
    
    // Redirect to login page, but save the current location
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }
  
  // Check for role-based access if a role is required
  if (requiredRole && preferences?.role !== requiredRole) {
    // Log security event for unauthorized access
    logSecurityEvent('login_failure', {
      path: location.pathname,
      userId: user?.id,
      reason: 'Insufficient permissions',
      requiredRole,
      userRole: preferences?.role
    }, { severity: 'warning' });
    
    // Notify user about access restriction
    toast({
      title: t ? t('accessDenied') : 'Access Denied',
      description: t ? t('insufficientPermissions') : 'You do not have permission to access this resource',
      variant: 'destructive',
    });
    
    // User doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated (and has required role if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
