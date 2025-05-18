
import React, { useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const EnhancedLayout: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [sidebarPrefs, setSidebarPrefs] = useState({
    collapsed: preferences?.sidebarPreferences?.collapsed || false,
    favorites: preferences?.sidebarPreferences?.favorites || []
  });

  useEffect(() => {
    // Sync state with preferences when they change
    if (preferences?.sidebarPreferences) {
      setSidebarPrefs({
        collapsed: preferences.sidebarPreferences.collapsed || false,
        favorites: preferences.sidebarPreferences.favorites || []
      });
    }
  }, [preferences]);

  const updateSidebarPreference = (collapsed: boolean) => {
    const updatedPrefs = {
      collapsed,
      favorites: sidebarPrefs.favorites
    };
    
    updatePreferences({
      sidebarPreferences: updatedPrefs
    });
    
    setSidebarPrefs(updatedPrefs);
  };

  return (
    <div className="enhanced-layout">
      {/* Layout content */}
    </div>
  );
};

export default EnhancedLayout;
