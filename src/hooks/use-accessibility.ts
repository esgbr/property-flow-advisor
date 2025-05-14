
import { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { announce } from '@/utils/accessibilityUtils';

export function useAccessibility() {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Initialize with nested properties or with defaults if they don't exist
  const [reduceMotion, setReduceMotion] = useState(preferences.accessibility?.reduceMotion || false);
  const [highContrast, setHighContrast] = useState(preferences.accessibility?.highContrast || false);
  const [largeText, setLargeText] = useState(preferences.accessibility?.largeText || false);
  const [screenReader, setScreenReader] = useState(preferences.accessibility?.screenReader || false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(preferences.accessibility?.dyslexiaFriendly || false);

  // Update state from preferences when they change
  useEffect(() => {
    setReduceMotion(preferences.accessibility?.reduceMotion || false);
    setHighContrast(preferences.accessibility?.highContrast || false);
    setLargeText(preferences.accessibility?.largeText || false);
    setScreenReader(preferences.accessibility?.screenReader || false);
    setDyslexiaFriendly(preferences.accessibility?.dyslexiaFriendly || false);
  }, [preferences]);

  // Toggle functions with preference update
  const toggleReduceMotion = useCallback(() => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    updatePreferences({ 
      accessibility: { 
        ...preferences.accessibility,
        reduceMotion: newValue 
      } 
    });
  }, [reduceMotion, updatePreferences, preferences.accessibility]);

  const toggleHighContrast = useCallback(() => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    updatePreferences({ 
      accessibility: { 
        ...preferences.accessibility,
        highContrast: newValue 
      } 
    });
  }, [highContrast, updatePreferences, preferences.accessibility]);

  const toggleLargeText = useCallback(() => {
    const newValue = !largeText;
    setLargeText(newValue);
    updatePreferences({ 
      accessibility: { 
        ...preferences.accessibility,
        largeText: newValue 
      } 
    });
  }, [largeText, updatePreferences, preferences.accessibility]);

  const toggleScreenReader = useCallback(() => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    updatePreferences({ 
      accessibility: { 
        ...preferences.accessibility,
        screenReader: newValue 
      } 
    });
  }, [screenReader, updatePreferences, preferences.accessibility]);

  const toggleDyslexiaFriendly = useCallback(() => {
    const newValue = !dyslexiaFriendly;
    setDyslexiaFriendly(newValue);
    updatePreferences({ 
      accessibility: { 
        ...preferences.accessibility,
        dyslexiaFriendly: newValue 
      } 
    });
  }, [dyslexiaFriendly, updatePreferences, preferences.accessibility]);

  // Convenience function for screen reader announcements
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (screenReader) {
      window.announce(message, politeness);
    }
  }, [screenReader]);

  return {
    reduceMotion,
    highContrast,
    largeText,
    screenReader,
    dyslexiaFriendly,
    toggleReduceMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleScreenReader,
    toggleDyslexiaFriendly,
    announce
  };
}
