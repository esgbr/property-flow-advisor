
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Enhanced hook for handling theme preferences with system detection and persistence
 */
export function useThemePreference() {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreferences } = useUserPreferences();
  const [isSystemDarkMode, setIsSystemDarkMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme === 'dark');
  
  // Check for system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDarkMode(mediaQuery.matches);
    
    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setIsSystemDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Update isDarkMode when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'light') {
      setIsDarkMode(false);
    } else {
      // System theme
      setIsDarkMode(isSystemDarkMode);
    }
  }, [theme, isSystemDarkMode]);
  
  // Load theme from preferences
  useEffect(() => {
    if (preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme]);
  
  // Change theme and update preferences
  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };
  
  return { 
    theme, 
    isDarkMode, 
    isSystemDarkMode,
    changeTheme,
  };
}
