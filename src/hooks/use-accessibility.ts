
import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

export function useAccessibility() {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Derived state values
  const enabled = preferences.accessibility?.enabled || false;
  const highContrast = preferences.accessibility?.highContrast || false;
  const largeText = preferences.accessibility?.largeText || false;  
  const reduceMotion = preferences.accessibility?.reduceMotion || false;
  const dyslexiaFriendly = preferences.accessibility?.dyslexiaFriendly || false;
  const screenReader = preferences.accessibility?.screenReader || false;
  
  // Toggle accessibility settings
  const toggleAccessibility = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        enabled: !enabled
      }
    });
  };
  
  const toggleHighContrast = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        highContrast: !highContrast
      }
    });
  };
  
  const toggleLargeText = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        largeText: !largeText
      }
    });
  };
  
  const toggleReduceMotion = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        reduceMotion: !reduceMotion
      }
    });
  };
  
  const toggleDyslexiaFriendly = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        dyslexiaFriendly: !dyslexiaFriendly
      }
    });
  };
  
  const toggleScreenReader = () => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        screenReader: !screenReader
      }
    });
  };
  
  // Apply accessibility settings to document
  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply large text
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Apply reduced motion
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Apply dyslexia friendly font
    if (dyslexiaFriendly) {
      document.documentElement.classList.add('dyslexia-friendly');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
    }
    
    // Apply screen reader optimizations
    if (screenReader) {
      document.documentElement.setAttribute('role', 'application');
      document.documentElement.classList.add('screen-reader-optimized');
    } else {
      document.documentElement.removeAttribute('role');
      document.documentElement.classList.remove('screen-reader-optimized');
    }
  }, [highContrast, largeText, reduceMotion, dyslexiaFriendly, screenReader]);
  
  // Reset all accessibility settings
  const resetAccessibilitySettings = () => {
    updatePreferences({
      accessibility: {
        enabled: false,
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        dyslexiaFriendly: false,
        screenReader: false
      }
    });
    
    toast({
      title: 'Accessibility settings reset',
      description: 'All accessibility settings have been reset to default values.'
    });
  };
  
  // Enable all accessibility settings
  const enableAllAccessibilitySettings = () => {
    updatePreferences({
      accessibility: {
        enabled: true,
        highContrast: true,
        largeText: true,
        reduceMotion: true,
        dyslexiaFriendly: false, // Not enabling by default as it's a significant visual change
        screenReader: true
      }
    });
    
    toast({
      title: 'Maximum accessibility enabled',
      description: 'All accessibility settings have been enabled for maximum accessibility.'
    });
  };
  
  // Get current accessibility status as text
  const getAccessibilityStatus = (): string => {
    if (!enabled) return 'Disabled';
    
    const activeSettings = [];
    if (highContrast) activeSettings.push('High Contrast');
    if (largeText) activeSettings.push('Large Text');
    if (reduceMotion) activeSettings.push('Reduced Motion');
    if (dyslexiaFriendly) activeSettings.push('Dyslexia Friendly');
    if (screenReader) activeSettings.push('Screen Reader Optimized');
    
    return activeSettings.length > 0 
      ? `Enabled (${activeSettings.join(', ')})` 
      : 'Enabled (No specific settings)';
  };

  // Helper function to announce messages to screen readers
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    // Create or find the announcer element
    let announcer = document.getElementById('a11y-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', politeness);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    } else {
      announcer.setAttribute('aria-live', politeness);
    }
    
    // Set text content to trigger screen reader announcement
    announcer.textContent = '';
    setTimeout(() => {
      if (announcer) announcer.textContent = message;
    }, 50);
  };

  // For compatibility with components expecting setX instead of toggleX functions
  const setHighContrast = (value: boolean) => {
    if (value !== highContrast) {
      toggleHighContrast();
    }
  };

  const setLargeText = (value: boolean) => {
    if (value !== largeText) {
      toggleLargeText();
    }
  };

  const setReduceMotion = (value: boolean) => {
    if (value !== reduceMotion) {
      toggleReduceMotion();
    }
  };

  const setScreenReader = (value: boolean) => {
    if (value !== screenReader) {
      toggleScreenReader();
    }
  };
  
  // Add a placeholder focusElement function to satisfy components
  const focusElement = (element: HTMLElement) => {
    if (element) {
      element.focus();
      announce(`Focused ${element.getAttribute('aria-label') || 'element'}`);
    }
  };

  return {
    enabled,
    highContrast,
    largeText,
    reduceMotion,
    dyslexiaFriendly,
    screenReader,
    toggleAccessibility,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleDyslexiaFriendly,
    toggleScreenReader,
    resetAccessibilitySettings,
    enableAllAccessibilitySettings,
    getAccessibilityStatus,
    // Add the additional methods needed by other components
    setHighContrast,
    setLargeText,
    setReduceMotion,
    setScreenReader,
    focusElement,
    announce
  };
}

export default useAccessibility;
