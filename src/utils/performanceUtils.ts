
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

// Improved deep comparison memo that also handles functions
export const useDeepCompareMemo = <T>(value: T): T => {
  const ref = useRef<T>(value);
  
  // Special handling for functions to avoid unnecessary stringification
  if (typeof value === 'function' && typeof ref.current === 'function') {
    return ref.current;
  }
  
  const stringifiedValue = JSON.stringify(value);
  const stringifiedRef = useRef(stringifiedValue);
  
  if (stringifiedRef.current !== stringifiedValue) {
    ref.current = value;
    stringifiedRef.current = stringifiedValue;
  }
  
  return ref.current;
};

// Enhanced component performance measurement with more metrics
export const useComponentPerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  const totalRenderTime = useRef(0);
  const slowestRender = useRef(0);
  const fastestRender = useRef(Number.MAX_SAFE_INTEGER);
  
  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;
    totalRenderTime.current += renderTime;
    
    slowestRender.current = Math.max(slowestRender.current, renderTime);
    fastestRender.current = Math.min(fastestRender.current, renderTime);
    
    const averageRenderTime = totalRenderTime.current / renderCount.current;
    
    console.log(
      `%c${componentName}%c rendered %c#${renderCount.current}%c (${renderTime.toFixed(2)}ms)`,
      'color: #4ade80; font-weight: bold',
      'color: inherit',
      'color: #60a5fa; font-weight: bold',
      'color: inherit'
    );
    
    if (renderCount.current > 5) {
      console.log(
        `%c${componentName}%c stats: Avg: %c${averageRenderTime.toFixed(2)}ms%c | Min: %c${fastestRender.current.toFixed(2)}ms%c | Max: %c${slowestRender.current.toFixed(2)}ms`,
        'color: #4ade80; font-weight: bold',
        'color: inherit',
        'color: #60a5fa',
        'color: inherit',
        'color: #60a5fa',
        'color: inherit', 
        'color: #60a5fa'
      );
    }
    
    startTime.current = performance.now(); // Reset for next render
    
    return () => {
      console.log(`%c${componentName}%c unmounted after %c${renderCount.current}%c renders`, 
        'color: #f87171; font-weight: bold',
        'color: inherit',
        'color: #60a5fa; font-weight: bold',
        'color: inherit'
      );
    };
  });
  
  // Return metrics that can be used in component
  return {
    renderCount: renderCount.current,
    averageRenderTime: totalRenderTime.current / Math.max(1, renderCount.current),
    slowestRender: slowestRender.current,
    fastestRender: fastestRender.current === Number.MAX_SAFE_INTEGER ? 0 : fastestRender.current
  };
};

// Utility for object memoization with proper equality check
export const memoizeObject = <T extends Record<string, any>>(obj: T): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

// Enhanced hook for throttling function calls with immediate option
export const useThrottle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = { leading: true, trailing: true }
): ((...args: Parameters<F>) => void) => {
  const inThrottle = useRef(false);
  const lastArgs = useRef<Parameters<F> | null>(null);
  const lastFunc = useRef<F>(func);
  
  // Update the function ref when it changes
  useEffect(() => {
    lastFunc.current = func;
  }, [func]);
  
  return useCallback(
    (...args: Parameters<F>) => {
      if (!inThrottle.current && options.leading) {
        lastFunc.current(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
          
          // Call with last args if trailing is enabled
          if (options.trailing && lastArgs.current) {
            lastFunc.current(...lastArgs.current);
            lastArgs.current = null;
          }
        }, limit);
      } else if (options.trailing) {
        lastArgs.current = args;
      }
    },
    [limit, options.leading, options.trailing]
  );
};

// Enhanced render timer with performance marks for profiling
export const useRenderTimer = (componentName: string) => {
  const [renderTime, setRenderTime] = useState(0);
  const startTimeRef = useRef(performance.now());
  
  useEffect(() => {
    const markName = `${componentName}-render-start`;
    const measureName = `${componentName}-render-duration`;
    
    // Add performance marks for profiling in DevTools
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(markName);
    }
    
    const endTime = performance.now();
    const timeTaken = endTime - startTimeRef.current;
    setRenderTime(timeTaken);
    
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(measureName, markName);
      } catch (e) {
        // Ignore errors if the mark doesn't exist
      }
    }
    
    console.log(`${componentName} render time: ${timeTaken.toFixed(2)}ms`);
    
    // For next render measurement
    startTimeRef.current = performance.now();
  });
  
  return renderTime;
};

// Improved virtualized list with support for variable heights
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number | ((index: number) => number),
  visibleCount: number,
  options: { overscan?: number } = { overscan: 3 }
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const overscan = options.overscan || 3;
  
  // Calculate position data for variable height items
  const itemPositions = useMemo(() => {
    const positions: { top: number; height: number; bottom: number }[] = [];
    let top = 0;
    
    for (let i = 0; i < items.length; i++) {
      const height = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight;
      positions.push({
        top,
        height,
        bottom: top + height
      });
      top += height;
    }
    
    return positions;
  }, [items, itemHeight]);
  
  // Calculate visible items based on scroll position
  const visibleItems = useMemo(() => {
    if (items.length === 0) return { items: [], startIndex: 0, endIndex: 0 };
    
    // Find the first visible item
    let startIndex = 0;
    while (startIndex < itemPositions.length - 1 && itemPositions[startIndex].bottom < scrollTop) {
      startIndex++;
    }
    
    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    
    // Find the last visible item
    let endIndex = startIndex;
    const viewportBottom = scrollTop + visibleCount * (typeof itemHeight === 'number' ? itemHeight : itemHeight(0));
    
    while (endIndex < itemPositions.length - 1 && itemPositions[endIndex].top < viewportBottom) {
      endIndex++;
    }
    
    // Apply overscan
    endIndex = Math.min(items.length - 1, endIndex + overscan);
    
    return {
      items: items.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    };
  }, [items, itemPositions, scrollTop, visibleCount, itemHeight, overscan]);
  
  // Calculate total list height and offsets
  const totalHeight = useMemo(() => {
    if (itemPositions.length === 0) return 0;
    return itemPositions[itemPositions.length - 1].bottom;
  }, [itemPositions]);
  
  const offsetY = useMemo(() => {
    if (visibleItems.startIndex === 0 || itemPositions.length === 0) return 0;
    return itemPositions[visibleItems.startIndex].top;
  }, [visibleItems.startIndex, itemPositions]);
  
  // Optimized scroll handler with throttling built in
  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);
  
  const throttledHandleScroll = useThrottle(handleScroll, 50);
  
  return {
    visibleItems: visibleItems.items,
    startIndex: visibleItems.startIndex,
    endIndex: visibleItems.endIndex,
    totalHeight,
    offsetY,
    handleScroll: throttledHandleScroll,
    itemPositions
  };
};

// Add new hook for lazy image loading with IntersectionObserver
export const useLazyLoad = (
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = { rootMargin: '200px', threshold: 0 }
) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, no need to observe anymore
        observer.disconnect();
      }
    }, options);
    
    observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return isVisible;
};
