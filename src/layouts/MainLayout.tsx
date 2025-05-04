
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const MainLayout = () => {
  const { preferences } = useUserPreferences();
  const theme = preferences.theme || 'light';
  
  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
