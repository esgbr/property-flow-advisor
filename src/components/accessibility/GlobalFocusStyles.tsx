
import React, { useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Component that applies the user's focus style preference globally
 * and handles keyboard vs mouse navigation detection
 */
const GlobalFocusStyles: React.FC = () => {
  const { preferences } = useUserPreferences();
  
  useEffect(() => {
    // Get the user's focus style preference or default to 'default'
    const focusStyle = preferences.accessibility?.focusStyle || 'default';
    
    // Remove existing focus style classes
    document.body.classList.remove('focus-default', 'focus-enhanced', 'focus-high');
    
    // Apply the selected focus style
    document.body.classList.add(`focus-${focusStyle}`);
    
    // Enable keyboard focus mode if enabled in settings
    if (preferences.accessibility?.keyboardMode) {
      document.body.classList.add('keyboard-focus-visible');
    } else {
      document.body.classList.remove('keyboard-focus-visible');
    }
    
    // Add event listeners to detect keyboard vs mouse navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only mark as keyboard user when using Tab key for navigation
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    };
    
    const handleMouseDown = () => {
      // Remove keyboard user class when mouse is used
      document.body.classList.remove('keyboard-user');
    };
    
    // Add event listeners with passive option for better performance
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    
    // Apply ARIA live region for screen reader announcements if needed
    if (preferences.accessibility?.screenReader) {
      const existingAnnouncer = document.getElementById('a11y-announcer');
      if (!existingAnnouncer) {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
      }
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      
      // Clean up the announcer if it was created
      const announcer = document.getElementById('a11y-announcer');
      if (announcer && preferences.accessibility?.screenReader === false) {
        announcer.remove();
      }
    };
  }, [
    preferences.accessibility?.focusStyle, 
    preferences.accessibility?.keyboardMode,
    preferences.accessibility?.screenReader
  ]);
  
  // This component doesn't render anything visually
  return null;
};

export default GlobalFocusStyles;
