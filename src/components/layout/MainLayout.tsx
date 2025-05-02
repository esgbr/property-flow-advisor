
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import FeedbackModal from '@/components/feedback/FeedbackModal';

const MainLayout = () => {
  const { isLocked, pin } = useAppLock();
  const isMobile = useIsMobile();
  const { preferences } = useUserPreferences();

  // Show the lock screen if the app is locked and a PIN is set
  if (isLocked && pin) {
    return <AppLockScreen />;
  }

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
          <div className="fixed bottom-4 right-4">
            <FeedbackModal variant="icon" size="md" />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
