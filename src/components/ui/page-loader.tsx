
import React from 'react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  message?: string;
  className?: string;
  fullPage?: boolean;
}

/**
 * Page loader component for showing loading state
 */
export const PageLoader: React.FC<PageLoaderProps> = ({
  size = 'md',
  label = 'Loading...',
  message,
  className = '',
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullPage && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-primary border-r-transparent',
          sizeClasses[size]
        )}
      />
      {(label || message) && (
        <span className="mt-4 text-muted-foreground">{message || label}</span>
      )}
      <span className="sr-only">{message || label || 'Loading'}</span>
    </div>
  );
};

export default PageLoader;
