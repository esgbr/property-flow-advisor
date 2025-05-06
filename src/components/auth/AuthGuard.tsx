import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppLock } from '@/contexts/AppLockContext';
import { AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVerified?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAdmin = false,
  requireVerified = false 
}) => {
  const { isAuthenticated, preferences } = useUserPreferences();
  const { isLocked } = useAppLock();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);
  const [lastAccessCheck, setLastAccessCheck] = useState<Date>(new Date());
  
  // Enhanced security - session activity validation
  useEffect(() => {
    if (isAuthenticated) {
      // Check for session timeout (30 minutes of inactivity)
      const lastActivity = localStorage.getItem('lastUserActivity');
      const now = new Date();
      
      if (lastActivity) {
        const lastActiveTime = new Date(lastActivity);
        const inactiveTime = now.getTime() - lastActiveTime.getTime();
        
        // If inactive for more than 30 minutes, require re-authentication
        if (inactiveTime > 30 * 60 * 1000) {
          toast({
            title: t('sessionExpired'),
            description: t('pleaseLoginAgain'),
            variant: 'destructive',
          });
          navigate('/auth', { state: { from: location, reason: 'timeout' } });
          return;
        }
      }
      
      // Update last activity time
      localStorage.setItem('lastUserActivity', now.toISOString());
      
      // Check for security setup after login if not done
      const securityPromptShown = sessionStorage.getItem('securityPromptShown');
      if (!preferences.appLockEnabled && !securityPromptShown) {
        // Show security prompt with delay to avoid disrupting the user flow
        if (Date.now() - lastAccessCheck.getTime() > 60000) {
          setShowSecurityPrompt(true);
          sessionStorage.setItem('securityPromptShown', 'true');
        }
      }
      
      // Update last access check
      setLastAccessCheck(new Date());
    }
  }, [isAuthenticated, location.pathname, navigate, preferences.appLockEnabled, t, toast]);
  
  // Check for encrypted status
  useEffect(() => {
    if (isAuthenticated && isLocked) {
      navigate('/locked', { state: { from: location } });
    }
  }, [isAuthenticated, isLocked, navigate, location]);
  
  useEffect(() => {
    // Check if redirected from auth page and show welcome toast
    if (location.state?.from?.pathname === '/auth' && isAuthenticated) {
      toast({
        title: t('success'),
        description: t(preferences.role === 'admin' ? 'adminWelcomeBack' : 'welcomeBack'),
      });
    }
  }, [location, isAuthenticated, preferences.role, toast, t]);
  
  const handleSecuritySetup = () => {
    navigate('/settings?tab=security');
    setShowSecurityPrompt(false);
  };
  
  const dismissSecurityPrompt = () => {
    setShowSecurityPrompt(false);
    // Remember dismissal for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('securityPromptDismissed', expiryDate.toISOString());
  };
  
  // Not authenticated
  if (!isAuthenticated) {
    // Store current location for redirection after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Authenticated, but app is locked
  if (isLocked) {
    return <Navigate to="/locked" state={{ from: location }} replace />;
  }
  
  // Check for verified email if required
  if (requireVerified && preferences.emailVerified === false) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('verificationRequired')}</AlertTitle>
          <AlertDescription>
            {t('pleaseVerifyEmail')}
            <Button 
              variant="link" 
              className="pl-0 text-destructive-foreground"
              onClick={() => navigate('/profile?verify=true')}
            >
              {t('verifyNow')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Authenticated, but no admin and admin is required
  if (requireAdmin && preferences.role !== 'admin') {
    toast({
      title: t('error'),
      description: t('adminAccessRequired'),
      variant: 'destructive',
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <>
      {showSecurityPrompt && (
        <Alert className="mb-4 border-amber-500">
          <Shield className="h-4 w-4 text-amber-500" />
          <AlertTitle>{t('enhanceYourSecurity')}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{t('setupAppLockDescription')}</p>
            <div className="flex gap-2 mt-1">
              <Button variant="outline" size="sm" onClick={handleSecuritySetup}>
                {t('setupNow')}
              </Button>
              <Button variant="ghost" size="sm" onClick={dismissSecurityPrompt}>
                {t('remindLater')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
};

export default AuthGuard;
