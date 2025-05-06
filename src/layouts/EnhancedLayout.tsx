import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { A11yProvider } from '@/components/accessibility/A11yProvider';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { AppLockProvider } from '@/contexts/AppLockContext';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedToaster from '@/components/ui/enhanced-toaster';
import { ButtonScrollToTop } from '@/components/ui/scroll-to-top';
import { UserPreferences } from '@/contexts/UserPreferencesContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const EnhancedLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [pageTitle, setPageTitle] = useState('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  
  // Load sidebar preferences from localStorage
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('userPreferences');
      if (storedPreferences) {
        const parsedPrefs = JSON.parse(storedPreferences);
        setUserPreferences(parsedPrefs);
        
        // Set sidebar collapsed state from preferences if available
        if (parsedPrefs.sidebarPreferences?.collapsed !== undefined) {
          setSidebarCollapsed(parsedPrefs.sidebarPreferences.collapsed);
        } else {
          // Default to collapsed on mobile
          setSidebarCollapsed(isMobile);
        }
      }
    } catch (error) {
      console.error('Failed to load sidebar preferences', error);
      setSidebarCollapsed(isMobile);
    }
  }, [isMobile]);
  
  // Update document title based on route
  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean)[0] || 'home';
    let title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    
    setPageTitle(title);
    document.title = `${title} | PropertyFlow`;
    
    // Add structured data for better SEO if needed
  }, [location]);
  
  // Handle toggling the sidebar collapse state
  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
    
    // Save preference if we have loaded user preferences
    if (userPreferences) {
      const updatedPreferences = {
        ...userPreferences,
        sidebarPreferences: {
          ...(userPreferences.sidebarPreferences || {}),
          collapsed: !sidebarCollapsed
        }
      };
      
      localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      setUserPreferences(updatedPreferences);
    }
  };
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="real-estate-theme">
      <UserPreferencesProvider>
        <AppLockProvider>
          <A11yProvider>
            <TooltipProvider>
              <div className="flex h-screen overflow-hidden">
                <SkipToContent contentId="main-content" />
                
                <EnhancedNavigation 
                  collapsed={sidebarCollapsed}
                  onToggleCollapse={handleToggleSidebar}
                />
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <main 
                    id="main-content"
                    className="flex-1 overflow-y-auto p-4 md:p-6"
                    tabIndex={-1}
                  >
                    <Outlet />
                  </main>
                  
                  <ButtonScrollToTop />
                </div>
                
                <EnhancedToaster />
              </div>
            </TooltipProvider>
          </A11yProvider>
        </AppLockProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default EnhancedLayout;
