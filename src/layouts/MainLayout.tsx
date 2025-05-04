
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useTheme } from '@/components/theme-provider';

const MainLayout = () => {
  const { preferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  
  // Synchronize theme preferences with theme provider
  React.useEffect(() => {
    if (preferences.theme && preferences.theme !== theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, theme, setTheme]);
  
  return (
    <div className={`min-h-screen flex w-full ${theme === 'dark' ? 'dark' : ''}`}>
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
