import React, { useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import SidebarController from '@/components/layout/SidebarController';
import Navbar from '@/layouts/Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { AppThemeProvider, useAppTheme } from '@/components/theme-provider';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';

// Lazy load non-critical components
const FeedbackModal = lazy(() => import('@/components/feedback/FeedbackModal'));
const WelcomeModal = lazy(() => import('@/components/welcome/WelcomeModal'));

// Security alert component for better reusability
const SecurityAlert = ({ onSetupPIN, onDismiss }) => {
  const { t } = useLanguage();
  
  return (
    <Alert className="mb-6 border-amber-500 bg-amber-500/10" role="alert">
      <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
      <AlertTitle className="text-amber-500">{t('securityAlert')}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{t('securityAlertDescription')}</p>
        <div className="flex gap-2 mt-1">
          <button 
            onClick={onSetupPIN}
            className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground"
            aria-label={t('setupPIN')}
          >
            {t('setupPIN')}
          </button>
          <button 
            onClick={onDismiss}
            className="px-3 py-1 text-sm rounded-md bg-muted text-muted-foreground"
            aria-label={t('dismiss')}
          >
            {t('dismiss')}
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Security confirmation component
const SecurityConfirmation = () => {
  const { t } = useLanguage();
  
  return (
    <Alert className="mb-6 border-green-500 bg-green-500/10" role="status">
      <ShieldCheck className="h-4 w-4 text-green-500" aria-hidden="true" />
      <AlertTitle className="text-green-500">{t('securityEnabled')}</AlertTitle>
      <AlertDescription>{t('securityEnabledDescription')}</AlertDescription>
    </Alert>
  );
};

const MainLayout = () => {
  const { isLocked, pin, lockApp } = useAppLock();
  const isMobile = useIsMobile();
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useAppTheme();
  
  const [inactivityTimer, setInactivityTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [showSecurityAlert, setShowSecurityAlert] = React.useState(false);
  
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
        // Toast notification handled in the lockApp function
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    setInactivityTimer(timer);
    
    // User activity listeners using a single handler for better performance
    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(timer);
      }
    };
    
    // Reset timer on user activity - attaching to window for better mobile support
    const events = ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));
    
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [pin, isLocked, lockApp, inactivityTimer, t]);

  // Show the lock screen if the app is locked and a PIN is set
  if (isLocked && pin) {
    return <AppLockScreen />;
  }
  
  // Show security alert if no pin is set for advanced/expert users
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
        <div className={`min-h-screen flex w-full ${isDarkMode ? 'dark' : ''}`}>
          <SidebarController>
            <div className="flex flex-col flex-1">
              <Navbar />
              <ErrorBoundary>
                <main 
                  id="main-content" 
                  className={`flex-1 ${isMobile ? 'p-3 pb-20' : 'p-6'}`}
                  tabIndex={-1}
                >
                  {showSecurityAlert && (
                    <SecurityAlert onSetupPIN={setupPIN} onDismiss={dismissSecurityAlert} />
                  )}
                  
                  {pin && (
                    <SecurityConfirmation />
                  )}
                  
                  <Outlet />
                </main>
              </ErrorBoundary>
              {isMobile && <MobileNavigation />}
            </div>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
              <AccessibilitySettingsButton />
              <Suspense fallback={null}>
                <FeedbackModal variant="icon" size="md" />
              </Suspense>
            </div>
          </SidebarController>
        </div>
        <Suspense fallback={null}>
          <WelcomeModal />
        </Suspense>
      </SidebarProvider>
    </>
  );
};

// Wrap the MainLayout with the AppThemeProvider and A11yProvider
const ThemedMainLayout = () => {
  return (
    <AppThemeProvider>
      <A11yProvider>
        <MainLayout />
      </A11yProvider>
    </AppThemeProvider>
  );
};

export default ThemedMainLayout;
