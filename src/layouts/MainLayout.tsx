
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import SkipToContent from '@/components/accessibility/SkipToContent';
import AccessibilitySettingsButton from '@/components/accessibility/AccessibilitySettingsButton';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { highContrast, largeText } = useAccessibility();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Skip to content link for keyboard users */}
      <SkipToContent contentId="main-content" />
      
      {/* Desktop navigation */}
      {!isMobile && (
        <UnifiedNavigation 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar} 
          className="hidden md:flex"
        />
      )}
      
      {/* Mobile navigation overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Mobile navigation sidebar */}
      {isMobile && (
        <div 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <UnifiedNavigation onToggleCollapse={() => setMobileSidebarOpen(false)} />
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header for mobile */}
        <div className={`md:hidden flex items-center p-4 ${highContrast ? 'border-b-2' : 'border-b'}`}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            aria-label={mobileSidebarOpen ? 'Close navigation' : 'Open navigation'}
            className="mr-2"
          >
            {mobileSidebarOpen ? <X /> : <Menu />}
          </Button>
          <div className="flex-1 flex justify-center">
            <h1 className={`font-bold ${largeText ? 'text-xl' : 'text-lg'}`}>PropertyFlow</h1>
          </div>
          <AccessibilitySettingsButton />
        </div>
        
        {/* Header for desktop */}
        <div className={`hidden md:flex items-center justify-between p-4 ${highContrast ? 'border-b-2' : 'border-b'}`}>
          <h1 className={`font-bold ${largeText ? 'text-xl' : 'text-lg'}`}>PropertyFlow</h1>
          <AccessibilitySettingsButton />
        </div>
        
        {/* Page content */}
        <main 
          id="main-content" 
          className={`flex-1 p-4 md:p-6 overflow-auto`}
          tabIndex={-1} // Makes it focusable for skip link
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
