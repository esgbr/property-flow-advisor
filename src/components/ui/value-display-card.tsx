
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const valueDisplayVariants = cva(
  "font-semibold",
  {
    variants: {
      size: {
        default: "text-2xl",
        sm: "text-xl",
        lg: "text-3xl",
        xl: "text-4xl",
      },
      trend: {
        none: "",
        positive: "text-emerald-500 dark:text-emerald-400",
        negative: "text-red-500 dark:text-red-400",
        neutral: "text-amber-500 dark:text-amber-400",
      },
    },
    defaultVariants: {
      size: "default",
      trend: "none",
    },
  }
);

export interface ValueDisplayCardProps extends VariantProps<typeof valueDisplayVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  change?: {
    value: string | number;
    trend: "positive" | "negative" | "neutral";
  };
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * A versatile card component for displaying values with optional trends
 */
const ValueDisplayCard = ({
  title,
  value,
  description,
  icon,
  change,
  footer,
  className,
  size,
  trend,
  onClick,
}: ValueDisplayCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {icon && (
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn(valueDisplayVariants({ size, trend: trend || (change?.trend || "none") }))}>
            {value}
          </div>
          
          {change && (
            <span className={cn(
              "text-xs font-medium",
              change.trend === "positive" && "text-emerald-500 dark:text-emerald-400",
              change.trend === "negative" && "text-red-500 dark:text-red-400",
              change.trend === "neutral" && "text-amber-500 dark:text-amber-400",
            )}>
              {change.trend === "positive" && "+"}
              {change.value}
            </span>
          )}
        </div>
        
        {footer && (
          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { ValueDisplayCard, valueDisplayVariants };
