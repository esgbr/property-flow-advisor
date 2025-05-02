
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout = () => {
  const { isLocked, pin } = useAppLock();
  const isMobile = useIsMobile();

  // Zeige die Sperrbildschirm-Komponente, wenn die App gesperrt ist und eine PIN eingerichtet wurde
  if (isLocked && pin) {
    return <AppLockScreen />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className={`flex-1 ${isMobile ? 'p-3' : 'p-6'}`}>
            <div className={isMobile ? 'mb-16' : ''}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
