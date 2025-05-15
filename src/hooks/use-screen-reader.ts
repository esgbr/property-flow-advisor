
import { useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useScreenReader = () => {
  const { preferences } = useUserPreferences();
  const screenReaderActive = preferences.screenReaderActive || false;
  
  // Announce navigation to screen readers
  const announceNavigation = useCallback((destination: string) => {
    if (!screenReaderActive) return;
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'assertive');
    announcer.setAttribute('role', 'status');
    announcer.className = 'sr-only';
    announcer.textContent = `Navigating to ${destination}`;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement is made
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, [screenReaderActive]);
  
  // Announce a message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReaderActive) return;
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement is made
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, [screenReaderActive]);
  
  return {
    announceNavigation,
    announce,
    screenReaderActive
  };
};
