
import React, { useEffect, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useTheme } from '@/components/theme-provider';
import { useComponentPerformance } from '@/utils/performanceUtils';
import SkipToContent from '@/components/accessibility/SkipToContent';
import PageLoader from '@/components/ui/page-loader';
import { Suspense } from 'react';

const MainLayout = () => {
  useComponentPerformance('MainLayout');
  const { preferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  
  // Synchronize theme preferences with theme provider
  useEffect(() => {
    if (preferences.theme && preferences.theme !== theme) {
      setTheme(preferences.theme);
      // Add data attribute to help with styling
      document.documentElement.setAttribute('data-theme', preferences.theme);
    }
  }, [preferences.theme, theme, setTheme]);
  
  return (
    <div className={`min-h-screen flex w-full bg-background text-foreground`}>
      <SkipToContent contentId="main-content" />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main id="main-content" className="flex-1 p-6 focus:outline-none" tabIndex={-1}>
            <Suspense fallback={<PageLoader message="Loading content..." />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MainLayout);
