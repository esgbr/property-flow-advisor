
/**
 * Custom hook for announcing messages to screen readers
 * This is used to provide important updates via screen readers
 */

let announcer: HTMLElement | null = null;

// Function to create or get the announcer element
function getAnnouncer(): HTMLElement {
  if (!announcer) {
    announcer = document.getElementById('screen-reader-announcer');

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
  }
  
  return announcer;
}

// Function to announce a message with configurable politeness (optional parameter)
export function announce(message: string, assertive?: boolean): void {
  if (!message) return;
  
  const announcer = getAnnouncer();
  
  // Set the appropriate aria-live attribute if assertive parameter is provided
  if (assertive !== undefined) {
    announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  }
  
  // Clear current content first to ensure re-announcement even if text is the same
  announcer.textContent = '';
  
  // Schedule announcement for the next tick to ensure it's announced
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

// Custom hook to use the announcer
export default function useAnnouncement() {
  return { announce };
}
