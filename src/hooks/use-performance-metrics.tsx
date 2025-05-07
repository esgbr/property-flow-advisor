
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface ExtendedPerformanceEntry extends PerformanceEntry {
  processingStart?: number;
  hadRecentInput?: boolean;
  value?: number;
}

export function usePerformanceMetrics(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  useEffect(() => {
    // Skip if the Performance API isn't available
    if (typeof window === 'undefined' || !('performance' in window) || !window.PerformanceObserver) {
      return;
    }

    // Time to First Byte
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart }));
    }

    // First Contentful Paint
    let fcpObserver: PerformanceObserver;
    try {
      fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0].startTime;
          setMetrics(prev => ({ ...prev, fcp }));
        }
      });
      
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('Error observing FCP:', e);
    }

    // Largest Contentful Paint
    let lcpObserver: PerformanceObserver;
    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          const lcp = lastEntry.startTime;
          setMetrics(prev => ({ ...prev, lcp }));
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('Error observing LCP:', e);
    }

    // First Input Delay
    let fidObserver: PerformanceObserver;
    try {
      fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0] as ExtendedPerformanceEntry;
          if (firstInput.processingStart) {
            const fid = firstInput.processingStart - firstInput.startTime;
            setMetrics(prev => ({ ...prev, fid }));
          }
        }
      });
      
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Error observing FID:', e);
    }

    // Cumulative Layout Shift
    let clsObserver: PerformanceObserver;
    try {
      clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          const layoutShiftEntry = entry as ExtendedPerformanceEntry;
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Error observing CLS:', e);
    }

    return () => {
      if (fcpObserver) fcpObserver.disconnect();
      if (lcpObserver) lcpObserver.disconnect();
      if (fidObserver) fidObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
    };
  }, []);

  return metrics;
}
