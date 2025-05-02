
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import WelcomeModal from '@/components/welcome/WelcomeModal';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const MainLayout = () => {
  const { isLocked, pin } = useAppLock();
  const isMobile = useIsMobile();
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const location = useLocation();
  const { toast } = useToast();

  // Show the lock screen if the app is locked and a PIN is set
  if (isLocked && pin) {
    return <AppLockScreen />;
  }
  
  // Track page visits for analytics and personalization
  useEffect(() => {
    const currentPath = location.pathname;
    const visitedPages = preferences.visitedPages || [];
    
    if (!visitedPages.includes(currentPath)) {
      updatePreferences({ 
        visitedPages: [...visitedPages, currentPath],
        lastVisitedPage: currentPath,
        lastActive: new Date().toISOString()
      });
    }
  }, [location.pathname]);

  // Welcome back notification for returning users
  useEffect(() => {
    if (preferences.name && !preferences.isFirstVisit && !preferences.todayWelcomed) {
      const now = new Date();
      toast({
        title: t('welcomeBack'),
        description: `${t('welcomeBackMessage')}, ${preferences.name}!`,
      });
      
      // Mark as welcomed today
      updatePreferences({ 
        todayWelcomed: now.toDateString() 
      });
    }
  }, []);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${preferences.darkMode ? 'dark' : ''}`}>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className={`flex-1 ${isMobile ? 'p-3' : 'p-6'}`}>
            <div className={isMobile ? 'mb-16' : ''}>
              <Outlet />
            </div>
          </main>
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <FeedbackModal variant="icon" size="md" />
          </div>
        </div>
        <WelcomeModal />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
