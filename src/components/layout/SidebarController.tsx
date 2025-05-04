
import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import StreamlinedSidebar from './StreamlinedSidebar';
import { useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface SidebarControllerProps {
  children: React.ReactNode;
}

const SidebarController: React.FC<SidebarControllerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Get sidebar state from preferences or default to collapsed on mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (preferences.sidebarPreferences?.collapsed !== undefined) {
      return preferences.sidebarPreferences.collapsed;
    }
    return isMobile;
  });
  
  // Automatically collapse sidebar on mobile or route change
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, location.pathname]);
  
  const toggleSidebar = useCallback(() => {
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    
    // Save user preference
    updatePreferences({
      sidebarPreferences: {
        ...preferences.sidebarPreferences,
        collapsed: newCollapsedState
      }
    });
  }, [sidebarCollapsed, updatePreferences, preferences.sidebarPreferences]);

  // Double-tap detection for mobile sidebar swipe gesture
  const [lastTapTime, setLastTapTime] = useState(0);
  const handleSwipeArea = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapTime < DOUBLE_TAP_DELAY) {
      toggleSidebar();
    }
    setLastTapTime(now);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <StreamlinedSidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      <div className="flex flex-col flex-grow overflow-hidden relative">
        {/* Mobile swipe handle - only visible on mobile when sidebar is collapsed */}
        {isMobile && sidebarCollapsed && (
          <div 
            className="absolute left-0 top-0 w-6 h-full z-10 opacity-0"
            onClick={handleSwipeArea}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default SidebarController;
