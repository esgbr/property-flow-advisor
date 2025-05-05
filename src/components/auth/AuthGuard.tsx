
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if redirected from auth page and show welcome toast
    if (location.state?.from?.pathname === '/auth' && isAuthenticated) {
      toast({
        title: t('success'),
        description: t(preferences.role === 'admin' ? 'adminWelcomeBack' : 'welcomeBack'),
      });
    }
  }, [location, isAuthenticated, preferences.role, toast, t]);
  
  // Not authenticated at all
  if (!isAuthenticated) {
    // Save the current location for redirect after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Authenticated but not admin and admin is required
  if (requireAdmin && preferences.role !== 'admin') {
    toast({
      title: t('error'),
      description: t('adminAccessRequired'),
      variant: 'destructive',
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // Authenticated and meets role requirements
  return <>{children}</>;
};

export default AuthGuard;
