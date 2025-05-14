
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  className?: string;
}

const StatCard = ({
  title,
  value,
  prefix,
  suffix,
  change,
  icon,
  description,
  loading = false,
  className,
}: StatCardProps) => {
  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-9 w-1/2 mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          {icon && (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold">
          {prefix}{value}{suffix}
        </div>
        {(change !== undefined || description) && (
          <div className="mt-1 flex items-center text-xs">
            {change !== undefined && (
              <span 
                className={cn(
                  "font-medium",
                  change > 0 ? "text-green-600" : 
                  change < 0 ? "text-red-600" : 
                  "text-gray-500"
                )}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
            {description && (
              <span className="text-muted-foreground ml-1">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
