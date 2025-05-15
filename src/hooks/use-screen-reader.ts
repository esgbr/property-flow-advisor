
import { useState, useEffect } from 'react';
import { useAccessibility } from '@/components/accessibility/A11yProvider';
import { announce } from '@/utils/announcer';

/**
 * Hook for better screen reader integration
 */
export function useScreenReader() {
  const { screenReader } = useAccessibility();
  const [isDetected, setIsDetected] = useState<boolean | null>(null);
  
  // Try to detect screen reader usage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Look for common indicators of screen reader usage
    const possibleIndicators = [
      // VoiceOver on macOS/iOS might add these roles
      document.querySelectorAll('[role="application"]').length > 0,
      document.querySelectorAll('[aria-roledescription="web area"]').length > 0,
      // Check if user has enabled reduce motion (often associated with assistive tech)
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      // Check user preference
      screenReader === true
    ];
    
    // If any indicators are true, assume screen reader might be present
    setIsDetected(possibleIndicators.some(Boolean));
    
  }, [screenReader]);
  
  const announceNavigation = (pageName: string) => {
    if (screenReader || isDetected) {
      announce(`Navigated to ${pageName}`, 'polite');
    }
  };
  
  const announceUpdate = (message: string) => {
    if (screenReader || isDetected) {
      announce(message, 'polite');
    }
  };
  
  const announceAlert = (message: string) => {
    if (screenReader || isDetected) {
      announce(message, 'assertive');
    }
  };
  
  const announceKeyEvent = (key: string, action: string) => {
    if (screenReader || isDetected) {
      announce(`Key ${key} pressed: ${action}`, 'polite');
    }
  };

  return {
    isScreenReaderLikely: screenReader || isDetected,
    announce,
    announceNavigation,
    announceUpdate,
    announceAlert,
    announceKeyEvent,
  };
}

export default useScreenReader;
