
import { useCallback, useEffect } from 'react';
import { useAccessibility } from '@/hooks/use-accessibility';

/**
 * A custom hook for managing screen reader announcements.
 * This creates and manages a hidden element that can be used to make
 * announcements to screen readers.
 */
export const useAnnouncement = () => {
  const { screenReader } = useAccessibility();
  
  // Set up the announcer element on mount
  useEffect(() => {
    if (!screenReader) return;
    
    // Check if announcer already exists
    let announcer = document.getElementById('a11y-announcer');
    
    if (!announcer) {
      // Create an announcer element
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.className = 'sr-only'; // Screen reader only
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    
    // Clean up on unmount
    return () => {
      if (announcer && !document.getElementById('keep-announcer')) {
        document.body.removeChild(announcer);
      }
    };
  }, [screenReader]);
  
  /**
   * Makes an announcement to screen readers
   * @param message The message to announce
   * @param assertive Whether the announcement should be assertive (interrupt the user)
   */
  const announce = useCallback((message: string, assertive = false) => {
    if (!screenReader) return;
    
    const announcer = document.getElementById('a11y-announcer');
    if (!announcer) return;
    
    // Set the appropriate aria-live setting
    announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    
    // Clear and set content with a brief delay to ensure it's announced
    announcer.textContent = '';
    setTimeout(() => {
      if (announcer) announcer.textContent = message;
    }, 50);
  }, [screenReader]);
  
  return { announce };
};

export default useAnnouncement;
