
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

type LazyComponentProps = {
  fallback?: React.ReactNode;
};

export function useLazyComponent(importFn: () => Promise<{ default: React.ComponentType<any> }>, props: LazyComponentProps = {}) {
  const LazyComponent = lazy(importFn);
  const { fallback = <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div> } = props;
  
  const Component = (componentProps: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...componentProps} />
    </Suspense>
  );
  
  return Component;
}

export default useLazyComponent;
