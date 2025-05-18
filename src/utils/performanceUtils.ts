
import { useRef, useEffect } from 'react';

/**
 * Tracks component performance with console logging
 * @param componentName Name of the component being measured
 */
export const useComponentPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    
    console.log(
      `%c${componentName} rendered %c(${renderCount.current})%c in %c${renderTime.toFixed(2)}ms`,
      'color: #4caf50; font-weight: bold',
      'color: #ff9800',
      'color: #2196f3',
      'color: #f44336; font-weight: bold'
    );
    
    return () => {
      startTime.current = performance.now();
    };
  });
};

/**
 * Creates a debounced version of a function
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled version of a function
 * @param func The function to throttle
 * @param limit Limit time in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const currentArgs = lastArgs;
          lastArgs = null;
          func(...currentArgs);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Measures execution time of a function
 * @param fn Function to measure
 * @param label Label for the measurement
 * @returns The original function wrapped with timing logic
 */
export function measureTime<T extends (...args: any[]) => any>(
  fn: T,
  label: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
}

/**
 * HOC that measures component render time
 * @param Component React component to measure
 * @param componentName Name for logging
 * @returns Wrapped component with performance measuring
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    useComponentPerformance(componentName);
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `WithPerformance(${componentName})`;
  return WrappedComponent;
}
