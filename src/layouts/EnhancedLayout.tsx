
import React, { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { debounce } from '@/utils/performanceUtils';
import { useMediaQuery } from '@/hooks/use-media-query';

/**
 * Enhanced layout component with responsive design and preference management
 */
const EnhancedLayout: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [sidebarPrefs, setSidebarPrefs] = useState({
    collapsed: preferences?.sidebarPreferences?.collapsed || false,
    favorites: preferences?.sidebarPreferences?.favorites || []
  });
  
  // Check if mobile screen
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Update sidebar preferences when they change in the context
  useEffect(() => {
    if (preferences?.sidebarPreferences) {
      setSidebarPrefs({
        collapsed: preferences.sidebarPreferences.collapsed || false,
        favorites: preferences.sidebarPreferences.favorites || []
      });
    }
  }, [preferences]);
  
  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    if (isMobile !== undefined) {
      updateSidebarPreference(isMobile);
    }
  }, [isMobile]);

  // Debounced update function to prevent too many writes to storage
  const debouncedUpdatePreferences = useCallback(
    debounce((updatedPrefs) => {
      updatePreferences({
        sidebarPreferences: updatedPrefs
      });
    }, 300),
    [updatePreferences]
  );

  const updateSidebarPreference = (collapsed: boolean) => {
    const updatedPrefs = {
      collapsed,
      favorites: sidebarPrefs.favorites
    };
    
    // Update local state immediately for responsive UI
    setSidebarPrefs(updatedPrefs);
    
    // Debounce the preference update to storage
    debouncedUpdatePreferences(updatedPrefs);
  };
  
  // Update favorite items in sidebar
  const toggleFavorite = (itemId: string) => {
    const currentFavorites = [...sidebarPrefs.favorites];
    const updatedFavorites = currentFavorites.includes(itemId)
      ? currentFavorites.filter(id => id !== itemId)
      : [...currentFavorites, itemId];
    
    const updatedPrefs = {
      collapsed: sidebarPrefs.collapsed,
      favorites: updatedFavorites
    };
    
    setSidebarPrefs(updatedPrefs);
    debouncedUpdatePreferences(updatedPrefs);
  };

  return (
    <div className={`enhanced-layout w-full flex flex-col ${className}`}>
      {/* Main layout content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default EnhancedLayout;
