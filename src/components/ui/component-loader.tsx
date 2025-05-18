
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  inline?: boolean;
}

/**
 * Component loader for showing loading state within components
 */
export const ComponentLoader: React.FC<ComponentLoaderProps> = ({
  size = 'sm',
  label,
  className = '',
  inline = false
}) => {
  const sizeClasses = {
    xs: 'h-4 w-4 border-1',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3'
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        !inline && 'justify-center',
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
      {label && (
        <span className="text-muted-foreground text-sm">{label}</span>
      )}
      {(label || !inline) && <span className="sr-only">Loading</span>}
    </div>
  );
};

export default ComponentLoader;
