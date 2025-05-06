
import { useContext, useCallback } from 'react';
import { useAccessibility as useA11yContext } from '@/components/accessibility/A11yProvider';
import { toast } from 'sonner';

interface AccessibilityOptions {
  announceChanges?: boolean;
  respectReduceMotion?: boolean;
}

/**
 * Enhanced accessibility hook that provides additional functionality
 * beyond the basic context functionality
 */
export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const a11y = useA11yContext();
  const { announceChanges = true, respectReduceMotion = true } = options;
  
  // Announce a message to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceChanges || !a11y.screenReader) return;
    
    const announcer = document.getElementById('a11y-announcer');
    
    if (!announcer) {
      // Create an announcer element if it doesn't exist
      const newAnnouncer = document.createElement('div');
      newAnnouncer.id = 'a11y-announcer';
      newAnnouncer.setAttribute('aria-live', priority);
      newAnnouncer.setAttribute('aria-atomic', 'true');
      newAnnouncer.classList.add('sr-only'); // Screen reader only
      document.body.appendChild(newAnnouncer);
      
      // Set timeout to ensure screen readers pick up the change
      setTimeout(() => {
        newAnnouncer.textContent = message;
      }, 50);
    } else {
      // Use existing announcer
      announcer.setAttribute('aria-live', priority);
      
      // Clear and set content with a brief delay
      announcer.textContent = '';
      setTimeout(() => {
        if (announcer) announcer.textContent = message;
      }, 50);
    }
  }, [a11y.screenReader, announceChanges]);
  
  // Get appropriate animation settings based on user preferences
  const getAnimationPreference = useCallback(() => {
    if (!respectReduceMotion) return true;
    
    // Check browser's prefers-reduced-motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // App setting takes precedence over browser setting
    return !a11y.reduceMotion && !prefersReducedMotion;
  }, [a11y.reduceMotion, respectReduceMotion]);
  
  // Apply a focus style temporarily to an element
  const focusElement = useCallback((element: HTMLElement | null, duration = 1000) => {
    if (!element) return;
    
    const originalOutline = element.style.outline;
    const originalTransition = element.style.transition;
    
    // Apply focus style
    element.style.outline = '2px solid var(--focus-ring, #3b82f6)';
    element.style.outlineOffset = '2px';
    element.style.transition = 'outline-color 0.2s ease-out';
    
    // Reset after duration
    setTimeout(() => {
      if (element) {
        element.style.outline = originalOutline;
        element.style.transition = originalTransition;
      }
    }, duration);
    
    // Focus the element for screen readers
    element.focus();
    
  }, []);
  
  // Toggle high contrast mode with announcement
  const toggleHighContrast = useCallback(() => {
    a11y.setHighContrast(!a11y.highContrast);
    
    if (announceChanges) {
      const message = !a11y.highContrast
        ? 'High contrast mode enabled'
        : 'High contrast mode disabled';
        
      toast(message);
      announce(message);
    }
  }, [a11y, announce, announceChanges]);
  
  // Toggle large text mode with announcement
  const toggleLargeText = useCallback(() => {
    a11y.setLargeText(!a11y.largeText);
    
    if (announceChanges) {
      const message = !a11y.largeText
        ? 'Large text mode enabled'
        : 'Large text mode disabled';
        
      toast(message);
      announce(message);
    }
  }, [a11y, announce, announceChanges]);
  
  // Toggle reduce motion mode with announcement
  const toggleReduceMotion = useCallback(() => {
    a11y.setReduceMotion(!a11y.reduceMotion);
    
    if (announceChanges) {
      const message = !a11y.reduceMotion
        ? 'Reduced motion enabled'
        : 'Reduced motion disabled';
        
      toast(message);
      announce(message);
    }
  }, [a11y, announce, announceChanges]);
  
  // Toggle screen reader optimizations
  const toggleScreenReader = useCallback(() => {
    a11y.setScreenReader(!a11y.screenReader);
    
    if (announceChanges) {
      const message = !a11y.screenReader
        ? 'Screen reader optimizations enabled'
        : 'Screen reader optimizations disabled';
        
      toast(message);
      announce(message);
    }
  }, [a11y, announce, announceChanges]);
  
  return {
    ...a11y,
    announce,
    getAnimationPreference,
    focusElement,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleScreenReader
  };
};

export default useAccessibility;
