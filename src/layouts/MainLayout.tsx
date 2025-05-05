
import React, { useEffect, memo, useState, useCallback } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
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
import { useAnnouncement } from '@/utils/accessibilityUtils';
import { ArrowUp } from 'lucide-react';

const MainLayout: React.FC = () => {
  useComponentPerformance('MainLayout');
  const { preferences, updatePreferences } = useUserPreferences();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { reduceMotion, highContrast, largeText } = useAccessibility();
  const { announce } = useAnnouncement();
  const [pageTitle, setPageTitle] = useState('');
  
  // Announce page changes for screen readers
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentPageName = pathSegments.length ? pathSegments[pathSegments.length - 1] : 'home';
    const formattedPageName = currentPageName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    
    setPageTitle(formattedPageName);
    
    // Announce page change after a brief delay to ensure screen readers catch it
    const timer = setTimeout(() => {
      announce(`Navigated to ${formattedPageName} page`, 'assertive');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname, announce]);
  
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

  // Handle back-to-top functionality
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    announce('Scrolled back to top of page', 'polite');
  }, [reduceMotion, announce]);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set the document title based on current route
  useEffect(() => {
    document.title = `PropertyFlow - ${pageTitle}`;
  }, [pageTitle]);
  
  return (
    <div className={`min-h-screen flex w-full bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      <SkipToContent contentId="main-content" />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main 
            id="main-content" 
            className={`flex-1 p-6 focus:outline-none ${largeText ? 'p-4' : ''}`}
            tabIndex={-1}
            aria-label={`${pageTitle} page content`}
          >
            <Suspense fallback={<PageLoader message={`Loading ${pageTitle}...`} />}>
              <Outlet />
            </Suspense>
          </main>
          
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg 
                ${highContrast ? 'border-2 border-background' : ''} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                hover:bg-primary/90 transition-colors z-50`}
            >
              <ArrowUp size={20} />
            </button>
          )}
        </div>
      </SidebarProvider>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MainLayout);
