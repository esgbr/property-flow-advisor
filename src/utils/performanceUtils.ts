
import { useEffect, useRef } from 'react';

/**
 * Hook to measure and log component performance
 * @param componentName Name of the component to measure
 */
export const useComponentPerformance = (componentName: string) => {
  const renderStart = useRef<number>(0);
  const mountedRef = useRef<boolean>(false);
  
  useEffect(() => {
    // First render - component is mounting
    if (!mountedRef.current) {
      const mountTime = performance.now() - renderStart.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
      }
      
      mountedRef.current = true;
    }
    
    // Return cleanup function
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} unmounted`);
      }
      mountedRef.current = false;
    };
  }, [componentName]);
  
  // Set render start time before any effects run
  if (!mountedRef.current) {
    renderStart.current = performance.now();
  }
};

/**
 * Measures the execution time of a function
 * @param fn Function to measure
 * @param fnName Name of the function (for logging)
 * @returns The same function, but with timing measurements
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  fnName: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (process.env.NODE_ENV !== 'development') {
      return fn(...args);
    }
    
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    console.log(`[Performance] ${fnName} executed in ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
}

/**
 * Checks if an element is visible in the viewport
 * @param element The element to check
 * @returns Boolean indicating if the element is visible
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Optimizes expensive calculations by caching the results
 * @param calculation Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(calculation: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = calculation(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
