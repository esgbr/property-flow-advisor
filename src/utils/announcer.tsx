
import { useCallback } from 'react';
import { useAccessibility } from '@/hooks/use-accessibility';

/**
 * A custom hook for managing screen reader announcements.
 * This creates and manages a hidden element that can be used to make
 * announcements to screen readers.
 */
export const useAnnouncement = () => {
  const { announce: accessibilityAnnounce } = useAccessibility();
  
  /**
   * Makes an announcement to screen readers
   * @param message The message to announce
   * @param assertive Whether the announcement should be assertive (interrupt the user)
   */
  const announce = useCallback((message: string, assertive = false) => {
    accessibilityAnnounce(message, assertive ? 'assertive' : 'polite');
  }, [accessibilityAnnounce]);
  
  return { announce };
};

export default useAnnouncement;
