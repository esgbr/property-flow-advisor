
import { useCallback } from 'react';
import { useAccessibility } from '@/hooks/use-accessibility';
import { useAnnouncement as useAccessibilityAnnouncement } from './accessibilityUtils';

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
   * @param politeness Whether the announcement should be assertive or polite
   */
  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    accessibilityAnnounce(message, politeness);
  }, [accessibilityAnnounce]);
  
  return { announce };
};

export default useAnnouncement;
