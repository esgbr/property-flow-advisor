
import { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { announce as accessibilityAnnounce } from '@/utils/accessibilityUtils';

export function useAccessibility() {
  const { preferences, updatePreferences } = useUserPreferences();
  const [reduceMotion, setReduceMotion] = useState(preferences.reduceMotion || false);
  const [highContrast, setHighContrast] = useState(preferences.highContrast || false);
  const [largeText, setLargeText] = useState(preferences.largeText || false);
  const [screenReader, setScreenReader] = useState(preferences.screenReader || false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(preferences.dyslexiaFriendly || false);

  // Update state from preferences
  useEffect(() => {
    setReduceMotion(preferences.reduceMotion || false);
    setHighContrast(preferences.highContrast || false);
    setLargeText(preferences.largeText || false);
    setScreenReader(preferences.screenReader || false);
    setDyslexiaFriendly(preferences.dyslexiaFriendly || false);
  }, [preferences]);

  // Toggle functions with preference update
  const toggleReduceMotion = useCallback(() => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    updatePreferences({ reduceMotion: newValue });
  }, [reduceMotion, updatePreferences]);

  const toggleHighContrast = useCallback(() => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    updatePreferences({ highContrast: newValue });
  }, [highContrast, updatePreferences]);

  const toggleLargeText = useCallback(() => {
    const newValue = !largeText;
    setLargeText(newValue);
    updatePreferences({ largeText: newValue });
  }, [largeText, updatePreferences]);

  const toggleScreenReader = useCallback(() => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    updatePreferences({ screenReader: newValue });
  }, [screenReader, updatePreferences]);

  const toggleDyslexiaFriendly = useCallback(() => {
    const newValue = !dyslexiaFriendly;
    setDyslexiaFriendly(newValue);
    updatePreferences({ dyslexiaFriendly: newValue });
  }, [dyslexiaFriendly, updatePreferences]);

  // Convenience function for screen reader announcements
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    accessibilityAnnounce(message, politeness);
  }, []);

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
