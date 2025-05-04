
import { useCallback, useMemo, useRef, useEffect } from 'react';

// Custom hook for debouncing function calls
export const useDebounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback(
    (...args: Parameters<F>) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      
      timeout.current = setTimeout(() => {
        func(...args);
      }, waitFor);
    },
    [func, waitFor]
  );
};

// Custom hook that only updates reference when values change
export const useDeepCompareMemo = <T>(value: T): T => {
  const ref = useRef<T>(value);
  const stringifiedValue = JSON.stringify(value);
  const stringifiedRef = useRef(stringifiedValue);
  
  if (stringifiedRef.current !== stringifiedValue) {
    ref.current = value;
    stringifiedRef.current = stringifiedValue;
  }
  
  return ref.current;
};

// Custom hook to measure component performance
export const useComponentPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
    
    return () => {
      console.log(`${componentName} unmounted after ${renderCount.current} renders`);
    };
  });
};

// Utility for object memoization
export const memoizeObject = <T extends Record<string, any>>(obj: T): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};
