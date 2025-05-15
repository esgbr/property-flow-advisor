// Import our centralized announce function
import { announce as accessibilityAnnounce, useAnnouncement as useAccessibilityAnnouncement } from './accessibilityUtils';

/**
 * Utility for making screen reader announcements
 */

// Create and get the announcement element
const getAnnouncerElement = () => {
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    
    // Add styles that hide it visually but keep it available to screen readers
    Object.assign(announcer.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0'
    });
    
    document.body.appendChild(announcer);
  }
  
  return announcer;
};

/**
 * Announces a message to screen readers
 * @param message The message to announce
 * @param priority The priority of the announcement ('polite' or 'assertive')
 */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = getAnnouncerElement();
  
  // Set the appropriate aria-live attribute
  announcer.setAttribute('aria-live', priority);
  
  // Clear the announcer first to ensure the message is read again
  // even if it's the same as the previous one
  announcer.textContent = '';
  
  // Use a small timeout to ensure the clearing takes effect
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
};

/**
 * Hook for making screen reader announcements
 */
export function useAnnouncement() {
  return {
    announce,
    announceKeyEvent: (key: string, action: string) => {
      announce(`Key ${key} pressed: ${action}`, 'polite');
    }
  };
}

export default useAnnouncement;
