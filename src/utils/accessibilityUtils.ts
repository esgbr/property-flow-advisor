
import { useEffect, useRef, useState, useCallback } from 'react';

// Hook to trap focus within a component (e.g., for modals)
export const useFocusTrap = (active = true) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Find all focusable elements
    const getFocusableElements = () => container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

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
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Store the previously focused element to restore later
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Focus the first focusable element in the container
      focusableElements[0].focus();
      
      // Store the previously focused element to restore on unmount
      container.dataset.previouslyFocused = previouslyFocused?.id || '';
    }

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Restore focus when the trap is removed
      const previouslyFocusedId = container.dataset.previouslyFocused;
      if (previouslyFocusedId) {
        const previousElement = document.getElementById(previouslyFocusedId);
        previousElement?.focus();
      }
    };
  }, [active]);

  return containerRef;
};

// Hook to announce messages to screen readers
export const useAnnouncement = () => {
  const [announcer, setAnnouncer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById('a11y-announcer');
    
    if (!element) {
      element = document.createElement('div');
      element.id = 'a11y-announcer';
      element.style.position = 'absolute';
      element.style.width = '1px';
      element.style.height = '1px';
      element.style.padding = '0';
      element.style.overflow = 'hidden';
      element.style.clip = 'rect(0, 0, 0, 0)';
      element.style.whiteSpace = 'nowrap';
      element.style.border = '0';
      document.body.appendChild(element);
    }
    
    setAnnouncer(element);
    
    return () => {
      // Don't remove the announcer on component unmount
      // as it might be used by other components
    };
  }, []);

  const announce = useCallback((
    message: string, 
    politeness: 'assertive' | 'polite' = 'polite',
    timeout = 50
  ) => {
    if (!announcer) return;
    
    // Update ARIA live attribute to match politeness level
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    
    // Clear announcer to ensure it will announce the same message 
    // multiple times if needed
    announcer.textContent = '';
    
    // Slight delay to ensure the DOM update is processed
    setTimeout(() => {
      announcer!.textContent = message;
    }, timeout);
  }, [announcer]);
  
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
  }),
  // Additional ARIA helpers
  listbox: (label: string, expanded: boolean) => ({
    role: 'listbox',
    'aria-label': label,
    'aria-expanded': expanded,
  }),
  option: (selected: boolean, label: string) => ({
    role: 'option',
    'aria-selected': selected,
    'aria-label': label
  }),
  tablist: () => ({
    role: 'tablist'
  }),
  tab: (selected: boolean, controls: string) => ({
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1
  }),
  tabpanel: (id: string, labelledBy: string) => ({
    role: 'tabpanel',
    id,
    'aria-labelledby': labelledBy,
    tabIndex: 0
  }),
  modal: (labelledBy: string) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelledBy
  })
};

// Hook to detect mouse vs. keyboard navigation
export const useUserInteractionMode = () => {
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardMode(true);
        document.body.classList.add('keyboard-user');
      }
    };
    
    const handleMouseDown = () => {
      setIsKeyboardMode(false);
      document.body.classList.remove('keyboard-user');
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return { isKeyboardMode };
};

// Focus visible utility for keyboard accessibility
export const useFocusVisible = () => {
  const { isKeyboardMode } = useUserInteractionMode();
  
  return {
    focusVisibleClass: isKeyboardMode ? 'focus-visible' : '',
    isFocusVisible: isKeyboardMode
  };
};
