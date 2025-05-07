
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ComponentLoaderProps {
  height?: string;
  width?: string;
  children: React.ReactNode;
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ 
  height = "200px", 
  width = "100%", 
  children 
}) => {
  return (
    <Suspense fallback={<Skeleton style={{ height, width }} />}>
      {children}
    </Suspense>
  );
};

export default ComponentLoader;
