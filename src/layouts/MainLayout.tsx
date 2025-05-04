
import React, { useEffect, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import Navbar from './Navbar';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useTheme } from '@/components/theme-provider';
import { useComponentPerformance } from '@/utils/performanceUtils';
import SkipToContent from '@/components/accessibility/SkipToContent';
import PageLoader from '@/components/ui/page-loader';
import { Suspense } from 'react';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

const MainLayout: React.FC = () => {
  useComponentPerformance('MainLayout');
  const { preferences, updatePreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { reduceMotion, highContrast, largeText } = useAccessibility();
  
  // Track page visits
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
  }, [location.pathname, preferences.visitedPages, updatePreferences]);
  
  // Synchronize theme preferences with theme provider
  useEffect(() => {
    if (preferences.theme && preferences.theme !== theme) {
      setTheme(preferences.theme);
      // Add data attribute to help with styling
      document.documentElement.setAttribute('data-theme', preferences.theme);
    }
  }, [preferences.theme, theme, setTheme]);

  // Apply accessibility classes to root element
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('large-text', largeText);
  }, [reduceMotion, highContrast, largeText]);
  
  return (
    <div className={`min-h-screen flex w-full bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
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
