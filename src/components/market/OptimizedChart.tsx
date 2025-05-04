
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

interface ChartDataPoint {
  month?: string;
  year?: string;
  [key: string]: any;
}

interface ChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'area';
  dataKeys: {
    id: string;
    name: string;
    color?: string;
    strokeDasharray?: string;
    opacities?: {
      stroke?: number;
      fill?: number;
    };
  }[];
  xAxisKey: string;
  yAxisLabel?: string;
  formatYAxisTick?: (value: number) => string;
  formatTooltip?: (value: any) => [string, string];
  formatTooltipLabel?: (label: string) => string;
  height?: number | string;
  domain?: [string | number, string | number];
  isLoading?: boolean;
}

const OptimizedChart = React.memo(({
  data,
  type,
  dataKeys,
  xAxisKey,
  yAxisLabel,
  formatYAxisTick,
  formatTooltip,
  formatTooltipLabel,
  height = 400,
  domain = ['auto', 'auto'],
  isLoading = false
}: ChartProps) => {
  const [isRendered, setIsRendered] = useState(false);
  
  // Add animation effect when chart data changes
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      setIsRendered(false);
      const timer = setTimeout(() => {
        setIsRendered(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-primary/70" />
          <p className="mt-2 text-sm text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <p className="text-muted-foreground">No data available to display</p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data} className={`transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fill: 'var(--muted-foreground)' }}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis 
            tickFormatter={formatYAxisTick} 
            domain={domain as [any, any]} 
            tick={{ fill: 'var(--muted-foreground)' }}
            axisLine={{ stroke: 'var(--border)' }}
            label={yAxisLabel ? { 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: 'var(--muted-foreground)' }
            } : undefined} 
          />
          <RechartsTooltip 
            formatter={formatTooltip}
            labelFormatter={formatTooltipLabel}
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          />
          <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
          {dataKeys.map((key) => (
            <Line 
              key={key.id}
              type="monotone" 
              dataKey={key.id} 
              stroke={key.color || `var(--primary)`} 
              name={key.name} 
              strokeWidth={2} 
              activeDot={{ r: 6 }} 
              strokeDasharray={key.strokeDasharray}
              strokeOpacity={key.opacities?.stroke}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      );
    }
    
    return (
      <AreaChart data={data} className={`transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fill: 'var(--muted-foreground)' }}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis 
          tickFormatter={formatYAxisTick} 
          domain={domain as [any, any]} 
          tick={{ fill: 'var(--muted-foreground)' }}
          axisLine={{ stroke: 'var(--border)' }}
          label={yAxisLabel ? { 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: 'var(--muted-foreground)' }
          } : undefined} 
        />
        <RechartsTooltip 
          formatter={formatTooltip}
          labelFormatter={formatTooltipLabel}
          contentStyle={{ 
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--foreground)'
          }}
        />
        <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
        {dataKeys.map((key) => (
          <Area 
            key={key.id}
            type="monotone" 
            dataKey={key.id} 
            stroke={key.color || `var(--primary)`} 
            fill={key.color || `var(--primary)`} 
            fillOpacity={key.opacities?.fill || 0.2}
            name={key.name} 
            strokeWidth={2} 
            activeDot={{ r: 6 }} 
            strokeDasharray={key.strokeDasharray}
            strokeOpacity={key.opacities?.stroke}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        ))}
      </AreaChart>
    );
  };
  
  return (
    <div style={{ height: height }} className="transition-all duration-300">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;
