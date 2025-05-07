
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Component that applies global accessibility styles based on user preferences
 */
const GlobalAccessibilityStyles: React.FC = () => {
  const { preferences } = useUserPreferences();
  
  const { 
    highContrast = false, 
    largeText = false,
    reduceMotion = false,
    dyslexiaFriendly = false,
    customCursor = false,
    focusIndicatorStyle = 'default'
  } = preferences.accessibility || {};

  // Apply accessibility classes to the document body
  React.useEffect(() => {
    const classList = document.body.classList;
    
    // Clear previous accessibility classes
    classList.remove(
      'high-contrast', 
      'dark', 
      'large-text', 
      'reduce-motion', 
      'dyslexia-friendly',
      'custom-cursor',
      'focus-default',
      'focus-enhanced',
      'focus-high'
    );
    
    // Apply selected accessibility features
    if (highContrast) {
      classList.add('high-contrast');
      if (preferences.theme === 'dark') classList.add('dark');
    }
    
    if (largeText) classList.add('large-text');
    if (reduceMotion) classList.add('reduce-motion');
    if (dyslexiaFriendly) classList.add('dyslexia-friendly');
    if (customCursor) classList.add('custom-cursor');
    
    // Apply focus indicator style
    classList.add(`focus-${focusIndicatorStyle}`);
    
    return () => {
      // Clean up classes when component unmounts
      classList.remove(
        'high-contrast', 
        'dark', 
        'large-text', 
        'reduce-motion', 
        'dyslexia-friendly',
        'custom-cursor',
        'focus-default',
        'focus-enhanced',
        'focus-high'
      );
    };
  }, [
    highContrast, 
    largeText, 
    reduceMotion, 
    dyslexiaFriendly, 
    customCursor, 
    focusIndicatorStyle, 
    preferences.theme
  ]);

  // This component doesn't render anything
  return null;
};

export default GlobalAccessibilityStyles;
