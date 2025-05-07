
import { useState, useEffect } from 'react';

interface UseLazyLoadingOptions {
  delay?: number;
  threshold?: number;
}

/**
 * Hook for lazy loading components based on visibility or delay
 */
export function useLazyLoading<T>(
  loader: () => Promise<T>,
  { delay = 0, threshold = 0.1 }: UseLazyLoadingOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      loader()
        .then((result) => {
          setData(result);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }, delay);

    return () => clearTimeout(timer);
  }, [loader, delay]);

  return { data, loading, error };
}

/**
 * Component for lazy loading based on viewport visibility
 */
export function LazyLoad({ children, height = '200px' }: { children: React.ReactNode; height?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div ref={setRef} style={{ minHeight: isVisible ? 'auto' : height }}>
      {isVisible && children}
    </div>
  );
}
