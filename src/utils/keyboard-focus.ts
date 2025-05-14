
/**
 * Keyboard focus management utilities
 * These functions help manage focus transitions, traps, and navigation
 */

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="switch"], [role="combobox"], [role="menuitem"], [contenteditable="true"]'
    )
  ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden') === 'true');
}

/**
 * Trap focus within a container
 */
export function trapFocus(container: HTMLElement | null, event: KeyboardEvent) {
  if (!container) return;
  
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Handle tab key
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Save the currently focused element and focus a new container
 * Returns a function to restore focus to the original element
 */
export function focusContainer(container: HTMLElement | null): () => void {
  const previousFocus = document.activeElement as HTMLElement;
  
  if (container) {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }
  }
  
  return () => {
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  };
}

/**
 * Set up programmatic tab index order for a series of elements
 */
export function setupTabOrder(
  elements: HTMLElement[],
  containerSelector: string
) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // Reset existing tabindex values
  const existingElements = container.querySelectorAll('[tabindex]');
  existingElements.forEach(el => {
    if (el.getAttribute('tabindex') !== '-1') {
      el.removeAttribute('tabindex');
    }
  });
  
  // Set new tab order
  elements.forEach((el, index) => {
    el.setAttribute('tabindex', (index + 1).toString());
    el.setAttribute('data-focus-order', (index + 1).toString());
  });
}

/**
 * Handle arrow key navigation within a component with multiple focusable elements
 */
export function handleArrowKeyNavigation(
  event: React.KeyboardEvent,
  elements: HTMLElement[],
  orientation: 'horizontal' | 'vertical' | 'both' = 'horizontal'
): void {
  const currentIndex = elements.findIndex(el => el === document.activeElement);
  if (currentIndex === -1) return;
  
  let nextIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowRight':
      if (orientation !== 'vertical') {
        nextIndex = (currentIndex + 1) % elements.length;
        event.preventDefault();
      }
      break;
    case 'ArrowLeft':
      if (orientation !== 'vertical') {
        nextIndex = (currentIndex - 1 + elements.length) % elements.length;
        event.preventDefault();
      }
      break;
    case 'ArrowDown':
      if (orientation !== 'horizontal') {
        nextIndex = (currentIndex + 1) % elements.length;
        event.preventDefault();
      }
      break;
    case 'ArrowUp':
      if (orientation !== 'horizontal') {
        nextIndex = (currentIndex - 1 + elements.length) % elements.length;
        event.preventDefault();
      }
      break;
    case 'Home':
      nextIndex = 0;
      event.preventDefault();
      break;
    case 'End':
      nextIndex = elements.length - 1;
      event.preventDefault();
      break;
    default:
      return;
  }
  
  if (nextIndex !== currentIndex && elements[nextIndex]) {
    elements[nextIndex].focus();
  }
}

/**
 * Create and announce an accessible notification for screen readers
 */
export function announceForScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  // Find existing announcer or create a new one
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  
  // Create a unique region for this announcement
  const uniqueId = `announcement-${Date.now()}`;
  const announcement = document.createElement('div');
  announcement.id = uniqueId;
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  
  // Add to DOM, but empty
  announcer.appendChild(announcement);
  
  // Set text content in next tick to ensure announcement
  setTimeout(() => {
    announcement.textContent = message;
    
    // Clean up after announcement is processed
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 3000);
  }, 50);
}
