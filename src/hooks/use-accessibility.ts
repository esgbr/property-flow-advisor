
import { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import useAnnouncement from '@/utils/announcer';

/**
 * Custom hook for managing accessibility features
 * Provides functionality for various accessibility settings
 */
export const useAccessibility = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { announce } = useAnnouncement();

  // Extract accessibility preferences
  const {
    highContrast = false,
    largeText = false,
    reduceMotion = false,
    dyslexiaFriendly = false,
    screenReader = false,
  } = preferences.accessibility || {};

  // Setup media queries for user preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');

    // If user has system preferences, use those as defaults
    const updateFromMediaQueries = () => {
      const accessibilitySettings = {
        ...preferences.accessibility,
        reduceMotion: preferences.accessibility?.reducedMotionOverride
          ? preferences.accessibility.reduceMotion
          : prefersReducedMotion.matches,
        highContrast: preferences.accessibility?.highContrastOverride
          ? preferences.accessibility.highContrast
          : prefersHighContrast.matches
      };

      updatePreferences({ accessibility: accessibilitySettings });
    };

    // Apply once on mount
    updateFromMediaQueries();

    // Listen for changes in system preferences
    prefersReducedMotion.addEventListener('change', updateFromMediaQueries);
    prefersHighContrast.addEventListener('change', updateFromMediaQueries);

    return () => {
      prefersReducedMotion.removeEventListener('change', updateFromMediaQueries);
      prefersHighContrast.removeEventListener('change', updateFromMediaQueries);
    };
  }, [preferences.accessibility, updatePreferences]);

  // Apply accessibility classes to body
  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.body.classList.add('high-contrast');
      if (document.documentElement.classList.contains('dark')) {
        document.body.classList.add('dark');
      }
    } else {
      document.body.classList.remove('high-contrast');
      document.body.classList.remove('dark');
    }

    // Apply large text mode
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }

    // Apply dyslexia friendly mode
    if (dyslexiaFriendly) {
      document.body.classList.add('dyslexia-friendly');
    } else {
      document.body.classList.remove('dyslexia-friendly');
    }

    // Apply reduced motion mode
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Apply screen reader optimization
    if (screenReader) {
      document.body.classList.add('screen-reader-optimized');
      document.body.setAttribute('aria-live', 'polite');
    } else {
      document.body.classList.remove('screen-reader-optimized');
      document.body.removeAttribute('aria-live');
    }
  }, [highContrast, largeText, reduceMotion, dyslexiaFriendly, screenReader]);

  /**
   * Toggle high contrast mode
   */
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        highContrast: newValue,
        highContrastOverride: true
      }
    });

    announce(
      language === 'de'
        ? `Hoher Kontrast ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `High contrast ${newValue ? 'enabled' : 'disabled'}`,
      'polite'
    );
    
    toast({
      description: language === 'de'
        ? `Hoher Kontrast ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `High contrast ${newValue ? 'enabled' : 'disabled'}`
    });
  };

  /**
   * Toggle large text mode
   */
  const toggleLargeText = () => {
    const newValue = !largeText;
    updatePreferences({
      accessibility: { ...preferences.accessibility, largeText: newValue }
    });

    announce(
      language === 'de'
        ? `Große Schrift ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Large text ${newValue ? 'enabled' : 'disabled'}`,
      'polite'
    );
    
    toast({
      description: language === 'de'
        ? `Große Schrift ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Large text ${newValue ? 'enabled' : 'disabled'}`
    });
  };

  /**
   * Toggle reduced motion mode
   */
  const toggleReduceMotion = () => {
    const newValue = !reduceMotion;
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        reduceMotion: newValue,
        reducedMotionOverride: true
      }
    });

    announce(
      language === 'de'
        ? `Reduzierte Bewegung ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Reduced motion ${newValue ? 'enabled' : 'disabled'}`,
      'polite'
    );
    
    toast({
      description: language === 'de'
        ? `Reduzierte Bewegung ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Reduced motion ${newValue ? 'enabled' : 'disabled'}`
    });
  };

  /**
   * Toggle dyslexia friendly mode
   */
  const toggleDyslexiaFriendly = () => {
    const newValue = !dyslexiaFriendly;
    updatePreferences({
      accessibility: { ...preferences.accessibility, dyslexiaFriendly: newValue }
    });

    announce(
      language === 'de'
        ? `Legasthenie-freundlicher Modus ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Dyslexia friendly mode ${newValue ? 'enabled' : 'disabled'}`,
      'polite'
    );
    
    toast({
      description: language === 'de'
        ? `Legasthenie-freundlicher Modus ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Dyslexia friendly mode ${newValue ? 'enabled' : 'disabled'}`
    });
  };
  
  /**
  * Toggle screen reader optimizations
  */
  const toggleScreenReader = () => {
    const newValue = !screenReader;
    updatePreferences({
      accessibility: { ...preferences.accessibility, screenReader: newValue }
    });

    announce(
      language === 'de'
        ? `Bildschirmleser-Optimierungen ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Screen reader optimizations ${newValue ? 'enabled' : 'disabled'}`,
      'assertive'
    );
    
    toast({
      description: language === 'de'
        ? `Bildschirmleser-Optimierungen ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Screen reader optimizations ${newValue ? 'enabled' : 'disabled'}`
    });
  };

  // Helper function to announce messages to screen readers
  const announceSRMessage = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    announce(message, politeness);
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
      announce(`Focused ${element.getAttribute('aria-label') || 'element'}`, 'polite');
    }
  };

  return {
    highContrast,
    largeText,
    reduceMotion,
    dyslexiaFriendly,
    screenReader,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleDyslexiaFriendly,
    toggleScreenReader,
    announce: announceSRMessage,
    // Add these methods for compatibility
    setHighContrast,
    setLargeText,
    setReduceMotion,
    setScreenReader,
    focusElement
  };
};

export default useAccessibility;
