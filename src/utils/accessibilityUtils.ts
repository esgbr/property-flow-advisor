
import { useEffect, useRef } from 'react';

// Hook to trap focus within a component (e.g., for modals)
export const useFocusTrap = (active = true) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element on mount
    if (firstElement) {
      firstElement.focus();
    }

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleTabKey);
    
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return containerRef;
};

// Hook to announce messages to screen readers
export const useAnnouncement = () => {
  const announce = (message: string, politeness: 'assertive' | 'polite' = 'polite') => {
    // Create or use existing announcer element
    let announcer = document.getElementById('a11y-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', politeness);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.padding = '0';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      announcer.style.whiteSpace = 'nowrap';
      announcer.style.border = '0';
      document.body.appendChild(announcer);
    }
    
    // Update the content to trigger announcement
    announcer.textContent = '';
    // Slight delay to ensure the DOM update is processed
    setTimeout(() => {
      announcer!.textContent = message;
    }, 50);
  };
  
  return { announce };
};

// Helper to add proper ARIA attributes to interactive elements
export const ariaAttributes = {
  button: (label: string) => ({
    role: 'button',
    'aria-label': label,
    tabIndex: 0
  }),
  toggle: (label: string, expanded: boolean) => ({
    'aria-label': label,
    'aria-expanded': expanded,
    'aria-controls': label.toLowerCase().replace(/\s+/g, '-')
  }),
  tooltip: (content: string) => ({
    'aria-label': content,
    'data-tooltip': content
  })
};
