
// Create a proper utility for screen reader announcements

// Function to create or get the screen reader announcer element
const getAnnouncer = (): HTMLElement => {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  return announcer;
};

// Function to announce a message to screen readers with configurable politeness
// Modifying to support the API used by various components (message and politeness level)
export const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
  if (!message) return;
  
  const announcer = getAnnouncer();
  
  // Set the appropriate aria-live attribute
  announcer.setAttribute('aria-live', politeness);
  
  // Clear current content first to ensure re-announcement even if text is the same
  announcer.textContent = '';
  
  // Use setTimeout to ensure the DOM update happens
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
};

// Announcement hook for reusability in components
export const useAnnouncement = () => {
  return { announce };
};
