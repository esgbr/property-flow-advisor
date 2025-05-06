
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppLock } from '@/contexts/AppLockContext';
import { AlertCircle, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const { toast: toastHook } = useToast();
  const { t, language } = useLanguage();
  
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);
  const [lastAccessCheck, setLastAccessCheck] = useState<Date>(new Date());
  const [sessionActive, setSessionActive] = useState(true);
  
  // Enhanced security - session activity validation with better timing
  useEffect(() => {
    if (isAuthenticated) {
      const checkSessionActivity = () => {
        // Check for session timeout (30 minutes of inactivity)
        const lastActivity = localStorage.getItem('lastUserActivity');
        const now = new Date();
        
        if (lastActivity) {
          const lastActiveTime = new Date(lastActivity);
          const inactiveTime = now.getTime() - lastActiveTime.getTime();
          
          // If inactive for more than 30 minutes, require re-authentication
          if (inactiveTime > 30 * 60 * 1000) {
            setSessionActive(false);
            toastHook({
              title: t('sessionExpired'),
              description: t('pleaseLoginAgain'),
              variant: 'destructive',
            });
            navigate('/auth', { state: { from: location, reason: 'timeout' } });
            return false;
          }
        }
        
        // Update last activity time
        localStorage.setItem('lastUserActivity', now.toISOString());
        return true;
      };
      
      // Initial check
      const isActive = checkSessionActivity();
      
      // Set up interval for periodic checks (every 5 minutes)
      const intervalId = setInterval(() => {
        checkSessionActivity();
      }, 5 * 60 * 1000);
      
      // Set up security prompt with delay
      if (isActive && !preferences.appLockEnabled) {
        const securityPromptShown = sessionStorage.getItem('securityPromptShown');
        if (!securityPromptShown && Date.now() - lastAccessCheck.getTime() > 60000) {
          setShowSecurityPrompt(true);
          sessionStorage.setItem('securityPromptShown', 'true');
        }
      }
      
      // Update last access check
      setLastAccessCheck(new Date());
      
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, location.pathname, navigate, preferences.appLockEnabled, t, toastHook, lastAccessCheck]);
  
  // Check for encrypted status
  useEffect(() => {
    if (isAuthenticated && isLocked) {
      navigate('/locked', { state: { from: location } });
    }
  }, [isAuthenticated, isLocked, navigate, location]);
  
  // Welcome toast with improved handling
  useEffect(() => {
    // Check if redirected from auth page and show welcome toast
    if (location.state?.from?.pathname === '/auth' && isAuthenticated) {
      // Check if we've already shown this toast today
      const today = new Date().toDateString();
      const lastWelcome = localStorage.getItem('lastWelcomeShown');
      
      if (lastWelcome !== today) {
        toastHook({
          title: t('success'),
          description: t(preferences.role === 'admin' ? 'adminWelcomeBack' : 'welcomeBack'),
        });
        localStorage.setItem('lastWelcomeShown', today);
      }
    }
  }, [location, isAuthenticated, preferences.role, toastHook, t]);
  
  // Improved security setup handling
  const handleSecuritySetup = () => {
    // Tracking the security setup attempt for analytics
    localStorage.setItem('securitySetupAttempted', 'true');
    navigate('/settings?tab=security&setup=true');
    setShowSecurityPrompt(false);
  };
  
  const dismissSecurityPrompt = () => {
    setShowSecurityPrompt(false);
    // Remember dismissal for 7 days with exact expiry time
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('securityPromptDismissed', expiryDate.toISOString());
    
    // Show a gentle reminder toast using sonner toast
    toast(
      language === 'de' 
        ? 'Sie können die Sicherheitseinstellungen jederzeit in den Einstellungen aktivieren'
        : 'You can enable security settings anytime from your preferences',
      { duration: 5000 }
    );
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
  
  // Enhanced security - session expired
  if (!sessionActive) {
    return <Navigate to="/auth" state={{ from: location, reason: 'timeout' }} replace />;
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
    toastHook({
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
      
      {/* Session activity indicator for better user awareness */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-40 hidden md:flex items-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm p-1 px-2 rounded-full border border-border">
          <Clock className="h-3 w-3 mr-1 text-primary" />
          <span>Session aktiv</span>
        </div>
      )}
      
      {children}
    </>
  );
};

export default AuthGuard;
