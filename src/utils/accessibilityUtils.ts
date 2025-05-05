
import { useState, useCallback, useRef, useEffect } from 'react';

interface Announcement {
  message: string;
  politeness: 'polite' | 'assertive';
  id: number;
}

// Counter for unique IDs
let announcementId = 0;

/**
 * Hook for making announcements to screen readers
 * @returns Object with announce function
 */
export function useAnnouncement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const liveRegionsRef = useRef<{[key: number]: HTMLDivElement}>({});
  
  // Cleanup function to remove old announcements
  useEffect(() => {
    return () => {
      // Remove any remaining live regions when component unmounts
      Object.values(liveRegionsRef.current).forEach(element => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      });
    };
  }, []);

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const id = announcementId++;
    
    // Add the announcement to state
    setAnnouncements(prev => [...prev, { message, politeness, id }]);
    
    // Create and manage a live region for immediate announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
    liveRegion.classList.add('sr-only');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
    
    // Store reference for cleanup
    liveRegionsRef.current[id] = liveRegion;
    
    // Wait a small delay to ensure the live region is registered
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
    
    // Remove the announcement from state after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      
      // Remove the live region element
      if (document.body.contains(liveRegion)) {
        document.body.removeChild(liveRegion);
        delete liveRegionsRef.current[id];
      }
    }, 3000);
    
    return id;
  }, []);

  return {
    announce,
    announcements
  };
}

/**
 * Get a descriptive label for a route from its path
 * @param path The route path
 * @returns A formatted readable label
 */
export function getRouteLabel(path: string): string {
  // Handle root path
  if (path === '/') return 'Home';
  
  // Remove leading slash and query parameters
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  cleanPath = cleanPath.split('?')[0];
  
  // Handle route parameters
  cleanPath = cleanPath.replace(/:[^/]+/g, 'item');
  
  // Format into readable text
  return cleanPath
    .split('/')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '))
    .join(' - ');
}

/**
 * Formats a number for screen readers
 * @param value The number to format
 * @param options Formatting options
 * @returns A screen reader friendly string
 */
export function formatNumberForScreenReader(
  value: number, 
  options: { 
    currency?: string;
    percentage?: boolean;
    decimal?: boolean;
  } = {}
): string {
  if (options.currency) {
    return `${value} ${options.currency}`;
  }
  
  if (options.percentage) {
    return `${value} percent`;
  }
  
  if (options.decimal && !Number.isInteger(value)) {
    const parts = value.toString().split('.');
    return `${parts[0]} point ${parts[1]}`;
  }
  
  return value.toString();
}

/**
 * Check if reduced motion should be enabled
 * @returns Boolean indicating if reduced motion should be used
 */
export function shouldUseReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check user preference in localStorage
  const userPreference = localStorage.getItem('a11y-preferences');
  if (userPreference) {
    try {
      const { reduceMotion } = JSON.parse(userPreference);
      if (typeof reduceMotion === 'boolean') return reduceMotion;
    } catch (e) {
      // Continue checking system preference if parsing fails
    }
  }
  
  // Check system preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Handler for focus management and keyboard navigation
 */
export function useFocusTrap(rootRef: React.RefObject<HTMLElement>, enabled = true) {
  useEffect(() => {
    if (!enabled || !rootRef.current) return;
    
    const rootElement = rootRef.current;
    const focusableElements = rootElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // If shift+tab and on first element, go to last element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // If tab and on last element, go to first element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    rootElement.addEventListener('keydown', handleKeyDown);
    return () => {
      rootElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [rootRef, enabled]);
  
  return {
    activateTrap: () => {
      if (rootRef.current) {
        const focusableElements = rootRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    }
  };
}
