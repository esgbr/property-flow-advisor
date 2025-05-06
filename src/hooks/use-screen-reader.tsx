
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useAnnouncement from '@/utils/announcer';

/**
 * Hook for improved screen reader support
 * Provides functions to check screen reader status and make announcements
 */
export const useScreenReader = () => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState<boolean>(false);
  const { announce } = useAnnouncement();
  const { language } = useLanguage();

  // Try to detect screen reader
  useEffect(() => {
    // This is a limited approach to detecting screen readers, but can help
    // for some common screen readers like VoiceOver on macOS/iOS
    const checkScreenReader = () => {
      // Check for focused elements changes in quick succession
      // as that's a common behavior when using screen readers
      let focusCount = 0;
      let lastFocusTime = 0;
      
      const handleFocus = () => {
        const now = Date.now();
        if (now - lastFocusTime < 50) {
          focusCount++;
          if (focusCount > 3) {
            setIsScreenReaderActive(true);
          }
        } else {
          focusCount = 1;
        }
        lastFocusTime = now;
      };
      
      document.addEventListener('focus', handleFocus, true);
      
      // Check for aria-live changes
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes') {
            const element = mutation.target as HTMLElement;
            if (element.getAttribute('aria-live')) {
              setIsScreenReaderActive(true);
              break;
            }
          }
        }
      });
      
      // Observe aria-live regions
      document.querySelectorAll('[aria-live]').forEach(el => {
        observer.observe(el, { attributes: true, childList: true });
      });
      
      return () => {
        document.removeEventListener('focus', handleFocus, true);
        observer.disconnect();
      };
    };
    
    // Check for prefered reduced motion as an accessibility signal
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsScreenReaderActive(true);
    }
    
    // Also check for 'sr-only' class usages as a sign of accessibility focus
    if (document.querySelectorAll('.sr-only').length > 3) {
      setIsScreenReaderActive(true);
    }
    
    return checkScreenReader();
  }, []);

  /**
   * Announce a key event to screen readers
   */
  const announceKeyEvent = (
    key: string,
    eventType: 'press' | 'navigation' = 'press'
  ) => {
    const keyName = key.length === 1 ? key : key.charAt(0).toUpperCase() + key.slice(1);
    
    if (eventType === 'press') {
      announce(
        language === 'de'
          ? `Taste ${keyName} gedrückt`
          : `Key ${keyName} pressed`,
        'polite'
      );
    } else {
      announce(
        language === 'de'
          ? `Navigation mit ${keyName}`
          : `Navigation with ${keyName}`,
        'polite'
      );
    }
  };

  /**
   * Announce a selection to screen readers
   */
  const announceSelection = (item: string) => {
    announce(
      language === 'de'
        ? `${item} ausgewählt`
        : `${item} selected`,
      'polite'
    );
  };

  /**
   * Announce a status change to screen readers
   */
  const announceStatusChange = (status: string, priority: 'polite' | 'assertive' = 'polite') => {
    announce(
      language === 'de'
        ? `Status: ${status}`
        : `Status: ${status}`,
      priority
    );
  };

  /**
   * Announce a navigation event to screen readers
   */
  const announceNavigation = (destination: string) => {
    announce(
      language === 'de'
        ? `Navigation zu ${destination}`
        : `Navigating to ${destination}`,
      'polite'
    );
  };

  return {
    isScreenReaderActive,
    announce,
    announceKeyEvent,
    announceSelection,
    announceStatusChange,
    announceNavigation
  };
};

export default useScreenReader;
