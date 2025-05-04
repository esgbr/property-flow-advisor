
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

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
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    console.log(`${componentName} rendered ${renderCount.current} times (${renderTime.toFixed(2)}ms)`);
    
    startTime.current = performance.now(); // Reset for next render
    
    return () => {
      console.log(`${componentName} unmounted after ${renderCount.current} renders`);
    };
  });
};

// Utility for object memoization
export const memoizeObject = <T extends Record<string, any>>(obj: T): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

// Hook for throttling function calls (different from debounce)
export const useThrottle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  const inThrottle = useRef(false);
  
  return useCallback(
    (...args: Parameters<F>) => {
      if (!inThrottle.current) {
        func(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [func, limit]
  );
};

// Hook for measuring render times
export const useRenderTimer = (componentName: string) => {
  const [renderTime, setRenderTime] = useState(0);
  const startTimeRef = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const timeTaken = endTime - startTimeRef.current;
    setRenderTime(timeTaken);
    
    console.log(`${componentName} render time: ${timeTaken.toFixed(2)}ms`);
    
    // For next render measurement
    startTimeRef.current = performance.now();
  });
  
  return renderTime;
};

// Optimize list rendering
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  visibleCount: number
) => {
  const [startIndex, setStartIndex] = useState(0);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, startIndex + visibleCount);
  }, [items, startIndex, visibleCount]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = useThrottle((scrollTop: number) => {
    const newIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(Math.max(0, newIndex));
  }, 100);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};
