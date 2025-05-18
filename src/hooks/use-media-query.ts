
import { useState, useEffect } from 'react';

/**
 * Hook to check if a media query matches
 * @param query CSS media query string
 * @returns Boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Define handler function
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for changes with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // For older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // For older browsers
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Check if device is a mobile device
 * @returns Boolean indicating if device is mobile
 */
export function useMobileDevice(): boolean {
  return useMediaQuery('(max-width: 640px)') || false;
}

/**
 * Check if device is a tablet device
 * @returns Boolean indicating if device is tablet
 */
export function useTabletDevice(): boolean {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)') || false;
}

/**
 * Check if device is a desktop device
 * @returns Boolean indicating if device is desktop
 */
export function useDesktopDevice(): boolean {
  return useMediaQuery('(min-width: 1025px)') || false;
}

/**
 * Check if user has enabled reduced motion preference
 * @returns Boolean indicating if reduced motion is preferred
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)') || false;
}

/**
 * Check if device has a high-contrast display preference
 * @returns Boolean indicating if high contrast is preferred
 */
export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: more)') || false;
}

/**
 * Check if device has a dark color scheme preference
 * @returns Boolean indicating if dark mode is preferred
 */
export function usePrefersDarkColorScheme(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)') || false;
}

export default useMediaQuery;
