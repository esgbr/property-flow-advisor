
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

/**
 * Stat card component for displaying metrics with optional trends
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  footer,
  className,
  onClick,
  loading = false
}) => {
  // Determine trend color
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-500';
      case 'down':
        return 'text-red-500';
      case 'neutral':
        return 'text-amber-500';
      default:
        return '';
    }
  };
  
  // Get trend prefix
  const getTrendPrefix = () => {
    switch (trend) {
      case 'up':
        return '+';
      case 'down':
        return '-';
      default:
        return '';
    }
  };
  
  return (
    <Card
      className={cn(
        onClick && 'cursor-pointer hover:border-primary/50 transition-colors',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-7 w-1/2 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {value}
            </div>
            
            {trend && trendValue && (
              <div className={cn('text-xs font-medium', getTrendColor())}>
                {getTrendPrefix()}
                {trendValue}
              </div>
            )}
          </div>
        )}
        
        {footer && (
          <div className="mt-4 text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
