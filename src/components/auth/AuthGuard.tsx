
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppLock } from '@/contexts/AppLockContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const { isLocked, unlockApp } = useAppLock();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Prüfe auf verschlüsselten Status
  useEffect(() => {
    if (isAuthenticated && isLocked) {
      navigate('/locked', { state: { from: location } });
    }
  }, [isAuthenticated, isLocked, navigate, location]);
  
  useEffect(() => {
    // Prüfe, ob von der Auth-Seite umgeleitet und zeige Willkommens-Toast
    if (location.state?.from?.pathname === '/auth' && isAuthenticated) {
      toast({
        title: t('success'),
        description: t(preferences.role === 'admin' ? 'adminWelcomeBack' : 'welcomeBack'),
      });
    }
  }, [location, isAuthenticated, preferences.role, toast, t]);
  
  // Nicht authentifiziert
  if (!isAuthenticated) {
    // Speichere den aktuellen Standort für Umleitung nach dem Login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Authentifiziert, aber App ist gesperrt
  if (isLocked) {
    return <Navigate to="/locked" state={{ from: location }} replace />;
  }
  
  // Authentifiziert, aber kein Admin und Admin ist erforderlich
  if (requireAdmin && preferences.role !== 'admin') {
    toast({
      title: t('error'),
      description: t('adminAccessRequired'),
      variant: 'destructive',
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // Authentifiziert und erfüllt Rollenanforderungen
  return <>{children}</>;
};

export default AuthGuard;
