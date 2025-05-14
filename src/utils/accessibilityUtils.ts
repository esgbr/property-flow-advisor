
// Function to announce messages to screen readers
export const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
  // Find or create the announcer element
  let announcer = document.getElementById('a11y-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  } else {
    // Update the politeness setting
    announcer.setAttribute('aria-live', politeness);
  }
  
  // Clear and set the content
  announcer.textContent = '';
  
  // Use setTimeout to ensure the change is registered by screen readers
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 50);
};

// Make the announce function available globally
declare global {
  interface Window {
    announce: (message: string, politeness?: 'polite' | 'assertive') => void;
  }
}

// Add to window object
if (typeof window !== 'undefined') {
  window.announce = announce;
}
