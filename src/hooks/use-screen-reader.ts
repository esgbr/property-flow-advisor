
import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { announce } from '@/utils/accessibilityUtils';

export const useScreenReader = () => {
  const { preferences } = useUserPreferences();
  const [isActive, setIsActive] = useState(preferences.screenReaderActive || false);

  useEffect(() => {
    setIsActive(preferences.screenReaderActive || false);
  }, [preferences.screenReaderActive]);

  const announceNavigation = (destination: string) => {
    if (isActive) {
      // In a real implementation, this would use the Web Speech API
      console.log(`Screen reader announcement: Navigating to ${destination}`);
      
      // Create a live region for screen reader announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('role', 'alert');
      announcement.style.position = 'absolute';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = `Navigating to ${destination}`;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement is made
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };
  
  // Add the announceKeyEvent function
  const announceKeyEvent = (key: string, action: string) => {
    if (isActive) {
      // Use the standard announce utility
      announce(`Shortcut ${key} activated: ${action}`, true);
    }
  };

  return {
    isActive,
    announceNavigation,
    announceKeyEvent
  };
};

export default useScreenReader;
