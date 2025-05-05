
/**
 * Enhanced screen reader announcement utility
 * Provides a more robust way to make announcements to screen readers
 */

// Maintain a singleton instance of the announcer element
let announcer: HTMLElement | null = null;

// Create a singleton polite announcer element
const getAnnouncer = (assertive = false): HTMLElement => {
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.padding = '0';
    announcer.style.margin = '-1px';
    announcer.style.overflow = 'hidden';
    announcer.style.clip = 'rect(0, 0, 0, 0)';
    announcer.style.whiteSpace = 'nowrap';
    announcer.style.border = '0';
    document.body.appendChild(announcer);
  }
  
  // Update the politeness setting if needed
  announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  
  return announcer;
};

// Clear the announcer after a delay to prevent multiple rapid announcements
const clearAnnouncer = (delay = 3000): void => {
  if (!announcer) return;
  
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = '';
    }
  }, delay);
};

/**
 * Announce a message to screen readers
 * @param message - The message to be announced
 * @param assertive - Whether to use assertive (true) or polite (false) priority
 * @param delay - How long to wait before clearing the announcement
 */
export const announce = (
  message: string,
  assertive: boolean = false,
  delay = 3000
): void => {
  if (!message) return;
  
  // Get or create the announcer element
  const element = getAnnouncer(assertive);
  
  // Set message text
  element.textContent = message;
  
  // Clear after delay
  clearAnnouncer(delay);
};

export const useAnnouncement = () => {
  return { announce };
};
