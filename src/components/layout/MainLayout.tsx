import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarController from '@/components/layout/SidebarController';
import Navbar from '@/layouts/Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import WelcomeModal from '@/components/welcome/WelcomeModal';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { useTheme } from '@/components/theme-provider';

const MainLayout = () => {
  const { isLocked, pin, lockApp } = useAppLock();
  const isMobile = useIsMobile();
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [inactivityTimer, setInactivityTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [showSecurityAlert, setShowSecurityAlert] = React.useState(false);
  
  // Synchronize theme preferences with theme provider
  React.useEffect(() => {
    if (preferences.theme && preferences.theme !== theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, theme, setTheme]);

  // Enhanced security - auto-lock on inactivity
  useEffect(() => {
    // Skip if no pin is set or already locked
    if (!pin || isLocked) return;
    
    // Clear existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    // Set new inactivity timer (15 minutes)
    const timer = setTimeout(() => {
      if (pin) {
        lockApp();
        toast.warning(t('sessionExpired'), {
          description: t('sessionExpiredDescription')
        });
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    setInactivityTimer(timer);
    
    // User activity listeners
    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(timer);
      }
    };
    
    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer); // Add touch event for mobile
    
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [pin, isLocked, lockApp, inactivityTimer, t]);

  // Show the lock screen if the app is locked and a PIN is set
  if (isLocked && pin) {
    return <AppLockScreen />;
  }
  
  // Show security alert if no pin is set
  useEffect(() => {
    if ((preferences.experienceLevel === 'expert' || preferences.experienceLevel === 'advanced') && 
        !pin && !preferences.dismissedSecurityAlert) {
      setShowSecurityAlert(true);
    }
  }, [preferences.experienceLevel, pin, preferences.dismissedSecurityAlert]);
  
  // Track page visits for analytics and personalization
  useEffect(() => {
    const currentPath = location.pathname;
    const visitedPages = preferences.visitedPages || [];
    
    if (visitedPages && !visitedPages.includes(currentPath)) {
      updatePreferences({ 
        visitedPages: [...visitedPages, currentPath],
        lastVisitedPage: currentPath,
        lastActive: new Date().toISOString()
      });
    }
  }, [location.pathname, preferences.visitedPages, updatePreferences]);

  // Welcome back notification for returning users
  useEffect(() => {
    if (preferences.name && preferences.todayWelcomed === undefined) {
      const now = new Date();
      toast.success(`${t('welcomeBack')}, ${preferences.name}!`, {
        description: t('welcomeBackMessage')
      });
      
      // Mark as welcomed today
      updatePreferences({ 
        todayWelcomed: now.toDateString() 
      });
    }
  }, [preferences.name, preferences.todayWelcomed, t, updatePreferences]);

  const dismissSecurityAlert = () => {
    setShowSecurityAlert(false);
    updatePreferences({ dismissedSecurityAlert: true });
  };

  const setupPIN = () => {
    navigate('/settings');
    setShowSecurityAlert(false);
  };

  return (
    <>
      <SkipToContent contentId="main-content" />
      <SidebarProvider>
        <div className={`min-h-screen flex w-full ${theme === 'dark' ? 'dark' : ''}`}>
          <SidebarController>
            <div className="flex flex-col flex-1">
              <Navbar />
              <ErrorBoundary>
                <main id="main-content" className={`flex-1 ${isMobile ? 'p-3 pb-20' : 'p-6'}`}>
                  {showSecurityAlert && (
                    <Alert className="mb-6 border-amber-500 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertTitle className="text-amber-500">{t('securityAlert')}</AlertTitle>
                      <AlertDescription className="flex flex-col gap-2">
                        <p>{t('securityAlertDescription')}</p>
                        <div className="flex gap-2 mt-1">
                          <button 
                            onClick={setupPIN}
                            className="px-3 py-1 text-sm rounded-md bg-primary text-white"
                          >
                            {t('setupPIN')}
                          </button>
                          <button 
                            onClick={dismissSecurityAlert}
                            className="px-3 py-1 text-sm rounded-md bg-muted text-muted-foreground"
                          >
                            {t('dismiss')}
                          </button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {pin && (
                    <Alert className="mb-6 border-green-500 bg-green-500/10">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-500">{t('securityEnabled')}</AlertTitle>
                      <AlertDescription>{t('securityEnabledDescription')}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Outlet />
                </main>
              </ErrorBoundary>
              {isMobile && <MobileNavigation />}
            </div>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <FeedbackModal variant="icon" size="md" />
            </div>
          </SidebarController>
        </div>
        <WelcomeModal />
      </SidebarProvider>
    </>
  );
};

export default MainLayout;
