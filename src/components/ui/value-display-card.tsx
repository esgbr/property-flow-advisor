
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface ValueDisplayCardProps {
  title: string;
  value: number | string;
  previousValue?: number | string;
  description?: string;
  format?: 'currency' | 'percentage' | 'number' | 'custom';
  currency?: string;
  showTrend?: boolean;
  trendPeriod?: string;
  className?: string;
  customFormatter?: (value: number | string) => string;
  colorCode?: boolean;
  compact?: boolean;
}

export const ValueDisplayCard: React.FC<ValueDisplayCardProps> = ({
  title,
  value,
  previousValue,
  description,
  format = 'number',
  currency = '€',
  showTrend = true,
  trendPeriod = 'vs. previous period',
  className,
  customFormatter,
  colorCode = true,
  compact = false,
}) => {
  // Format the value based on the specified format
  const formatValue = (val: number | string): string => {
    if (customFormatter) {
      return customFormatter(val);
    }
    
    if (typeof val === 'string') {
      return val;
    }
    
    switch (format) {
      case 'currency':
        return `${currency}${val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${val.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      default:
        return val.toLocaleString('de-DE');
    }
  };

  // Calculate trend and format it
  const calculateTrend = (): { value: number; formatted: string; direction: 'up' | 'down' | 'neutral' } => {
    if (previousValue === undefined || previousValue === null || value === previousValue) {
      return { value: 0, formatted: '0%', direction: 'neutral' };
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const numPrevValue = typeof previousValue === 'string' ? parseFloat(previousValue) : previousValue;
    
    if (isNaN(numValue) || isNaN(numPrevValue) || numPrevValue === 0) {
      return { value: 0, formatted: '0%', direction: 'neutral' };
    }
    
    const trendValue = ((numValue - numPrevValue) / numPrevValue) * 100;
    const direction = trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'neutral';
    
    return {
      value: trendValue,
      formatted: `${Math.abs(trendValue).toFixed(1)}%`,
      direction
    };
  };
  
  const trend = calculateTrend();
  
  const getTrendColor = (): string => {
    if (!colorCode) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", compact && "p-4")}>
        <CardTitle className={cn("text-sm font-medium", compact && "text-xs")}>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn(compact && "p-4 pt-0")}>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        
        {showTrend && previousValue !== undefined && (
          <div className="flex items-center mt-2 text-sm">
            <span className={cn("flex items-center", getTrendColor())}>
              {trend.direction === 'up' && <ArrowUp size={16} className="mr-1" />}
              {trend.direction === 'down' && <ArrowDown size={16} className="mr-1" />}
              {trend.direction === 'neutral' && <Minus size={16} className="mr-1" />}
              {trend.formatted}
            </span>
            <span className="text-muted-foreground ml-1">{trendPeriod}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
