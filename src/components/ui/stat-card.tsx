
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  prefix = '',
  suffix = '',
  className,
  variant = 'default',
  size = 'md',
}) => {
  const getTrendIcon = () => {
    if (!change) return null;
    
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };
  
  const getTrendText = () => {
    if (!change) return null;
    
    const formattedChange = Math.abs(change).toFixed(1);
    const changeText = `${change > 0 ? '+' : ''}${formattedChange}%`;
    
    if (change > 0) {
      return <span className="text-green-500">{changeText}</span>;
    } else if (change < 0) {
      return <span className="text-red-500">{changeText}</span>;
    }
    
    return <span className="text-muted-foreground">0%</span>;
  };
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };
  
  const valueClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };
  
  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      variant === 'outline' ? 'border shadow-sm' : 'border shadow',
      className
    )}>
      <CardHeader className={cn('pb-2', sizeClasses[size])}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn('pt-0', sizeClasses[size])}>
        <div className={cn('font-bold', valueClasses[size])}>
          {prefix}{value}{suffix}
        </div>
        
        {(description || change !== undefined) && (
          <div className="mt-1 flex items-center text-sm">
            {change !== undefined && (
              <div className="flex items-center mr-2">
                {getTrendIcon()}
                <span className="ml-1">{getTrendText()}</span>
              </div>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
