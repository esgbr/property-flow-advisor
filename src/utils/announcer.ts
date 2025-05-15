
/**
 * Screen reader announcement utility
 */

// Create a singleton announcer element
const getAnnouncer = (assertive = false): HTMLElement => {
  let announcer = document.getElementById('a11y-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
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
  } else {
    announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  }
  
  return announcer;
};

/**
 * Announce a message to screen readers
 * @param message - The message to be announced
 * @param politeness - Whether to use assertive (interrupt) or polite priority
 */
export const announce = (
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void => {
  const element = getAnnouncer(politeness === 'assertive');
  
  // Clear previous content to ensure announcement
  element.textContent = '';
  
  // Add new content after a brief delay
  setTimeout(() => {
    if (element) element.textContent = message;
  }, 50);
};

export const useAnnouncement = () => {
  return { announce };
};

export default useAnnouncement;
