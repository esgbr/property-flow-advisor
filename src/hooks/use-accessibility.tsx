
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
    reducedMotion = false,
    dyslexiaFriendly = false,
  } = preferences.accessibility || {};

  // Setup media queries for user preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');

    // If user has system preferences, use those as defaults
    const updateFromMediaQueries = () => {
      const accessibilitySettings = {
        ...preferences.accessibility,
        reducedMotion: preferences.accessibility?.reducedMotionOverride
          ? preferences.accessibility.reducedMotion
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
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [highContrast, largeText, reducedMotion, dyslexiaFriendly]);

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
  };

  /**
   * Toggle reduced motion mode
   */
  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        reducedMotion: newValue,
        reducedMotionOverride: true
      }
    });

    announce(
      language === 'de'
        ? `Reduzierte Bewegung ${newValue ? 'aktiviert' : 'deaktiviert'}`
        : `Reduced motion ${newValue ? 'enabled' : 'disabled'}`,
      'polite'
    );
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
  };

  /**
   * Helper function to announce messages to screen readers
   * @param message Message to announce
   * @param politeness Politeness level of announcement
   */
  const announceSRMessage = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    announce(message, politeness);
  };

  return {
    highContrast,
    largeText,
    reducedMotion,
    dyslexiaFriendly,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleDyslexiaFriendly,
    announce: announceSRMessage
  };
};

export default useAccessibility;
