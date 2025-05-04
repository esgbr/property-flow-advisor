
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] w-full">
      <Loader2 className={`animate-spin text-primary mb-4 ${sizeClasses[size]}`} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

export default PageLoader;
