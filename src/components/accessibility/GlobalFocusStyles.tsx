
import React, { useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Component that applies the user's focus style preference globally
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
    
    // Enable keyboard focus mode if enabled
    if (preferences.accessibility?.keyboardMode) {
      document.body.classList.add('keyboard-focus-visible');
    } else {
      document.body.classList.remove('keyboard-focus-visible');
    }
    
    // Add event listener to detect keyboard vs mouse navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
      }
    };
    
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-user');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [preferences.accessibility?.focusStyle, preferences.accessibility?.keyboardMode]);
  
  // This component doesn't render anything visually
  return null;
};

export default GlobalFocusStyles;
