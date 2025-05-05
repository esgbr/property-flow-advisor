
import { useState, useCallback } from 'react';

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

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const id = announcementId++;
    
    // Add the announcement to state
    setAnnouncements(prev => [...prev, { message, politeness, id }]);
    
    // Remove the announcement after a delay to prevent stacking
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 3000);
    
    // Create and remove a live region for immediate announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('sr-only');
    document.body.appendChild(liveRegion);
    
    // Wait a small delay to ensure the live region is registered
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 50);
    
    // Remove the live region after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
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
