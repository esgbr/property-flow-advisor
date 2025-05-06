
import { useCallback } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * Custom hook for managing accessibility features
 */
export const useAccessibility = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Get the current accessibility settings from preferences
  const highContrast = preferences.accessibility?.highContrast || false;
  const largeText = preferences.accessibility?.largeText || false;
  const reducedMotion = preferences.accessibility?.reducedMotion || false;
  const dyslexiaFriendly = preferences.accessibility?.dyslexiaFriendly || false;
  const screenReader = preferences.accessibility?.screenReader || false;
  
  // Toggle functions for each accessibility feature
  const toggleHighContrast = useCallback(() => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        highContrast: !highContrast
      }
    });
  }, [highContrast, preferences.accessibility, updatePreferences]);
  
  const toggleLargeText = useCallback(() => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        largeText: !largeText
      }
    });
    
    // Apply large text CSS class to body
    if (!largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText, preferences.accessibility, updatePreferences]);
  
  const toggleReducedMotion = useCallback(() => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        reducedMotion: !reducedMotion
      }
    });
  }, [reducedMotion, preferences.accessibility, updatePreferences]);

  const toggleDyslexiaFriendly = useCallback(() => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        dyslexiaFriendly: !dyslexiaFriendly
      }
    });
    
    // Apply dyslexic font CSS class to body
    if (!dyslexiaFriendly) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
  }, [dyslexiaFriendly, preferences.accessibility, updatePreferences]);
  
  const toggleScreenReader = useCallback(() => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        screenReader: !screenReader
      }
    });
  }, [screenReader, preferences.accessibility, updatePreferences]);
  
  // Helper function to check if animations should be enabled
  const getAnimationPreference = useCallback(() => {
    return !reducedMotion;
  }, [reducedMotion]);
  
  // Function to announce a message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    let announcer = document.getElementById('screen-reader-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', priority);
      document.body.appendChild(announcer);
    } else {
      announcer.setAttribute('aria-live', priority);
    }
    
    // Clear and set the announcer text
    announcer.textContent = '';
    setTimeout(() => {
      if (announcer) announcer.textContent = message;
    }, 50);
  }, []);
  
  // Helper function to focus an element with optional animation
  const focusElement = useCallback((element: HTMLElement, duration = 300) => {
    if (!element) return;
    
    element.focus();
    
    // If reduced motion is enabled, skip the animation
    if (reducedMotion) return;
    
    element.style.outline = '2px solid var(--color-primary)';
    element.style.outlineOffset = '4px';
    element.style.transition = `outline ${duration}ms ease-in-out`;
    
    setTimeout(() => {
      element.style.outline = '';
      element.style.outlineOffset = '';
      element.style.transition = '';
    }, duration);
  }, [reducedMotion]);
  
  // Set up CSS class for high contrast on mount
  const setupHighContrast = useCallback(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);
  
  // Set up CSS class for dyslexic font on mount
  const setupDyslexicFont = useCallback(() => {
    if (dyslexiaFriendly) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
  }, [dyslexiaFriendly]);
  
  // Set up CSS class for large text on mount
  const setupLargeText = useCallback(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  // Apply all accessibility settings
  const applyAllSettings = useCallback(() => {
    setupHighContrast();
    setupDyslexicFont();
    setupLargeText();
  }, [setupHighContrast, setupDyslexicFont, setupLargeText]);

  // Set the current setters
  const setHighContrast = useCallback((value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        highContrast: value
      }
    });
  }, [preferences.accessibility, updatePreferences]);
  
  const setLargeText = useCallback((value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        largeText: value
      }
    });
  }, [preferences.accessibility, updatePreferences]);
  
  const setReducedMotion = useCallback((value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        reducedMotion: value
      }
    });
  }, [preferences.accessibility, updatePreferences]);
  
  const setDyslexiaFriendly = useCallback((value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        dyslexiaFriendly: value
      }
    });
  }, [preferences.accessibility, updatePreferences]);
  
  const setScreenReader = useCallback((value: boolean) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        screenReader: value
      }
    });
  }, [preferences.accessibility, updatePreferences]);
  
  return {
    // Current state
    highContrast,
    largeText,
    reducedMotion,
    dyslexiaFriendly,
    screenReader,
    
    // Toggle functions
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleDyslexiaFriendly,
    toggleScreenReader,
    
    // Setters
    setHighContrast,
    setLargeText,
    setReducedMotion,
    setDyslexiaFriendly,
    setScreenReader,
    
    // Utility functions
    announce,
    getAnimationPreference,
    focusElement,
    applyAllSettings
  };
};

export default useAccessibility;
