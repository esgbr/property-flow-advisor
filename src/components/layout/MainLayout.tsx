
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useAppLock } from '@/contexts/AppLockContext';
import AppLockScreen from '@/components/AppLockScreen';

const MainLayout = () => {
  const { isLocked, pin } = useAppLock();

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
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
