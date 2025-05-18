
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PageLoader } from '@/components/ui/page-loader';

type ChartType = 'line' | 'bar' | 'area' | 'pie';

interface ChartProps {
  type: ChartType;
  data: any[];
  title?: string;
  description?: string;
  dataKey: string;
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  legendPosition?: 'top' | 'bottom' | 'right' | 'left';
}

/**
 * Versatile chart component supporting multiple chart types
 */
export const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  description,
  dataKey,
  xAxisKey = 'name',
  yAxisKey = 'value',
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  height = 300,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  legendPosition = 'bottom'
}) => {
  // Determine if data is empty
  const isEmpty = useMemo(() => {
    return !data || data.length === 0;
  }, [data]);
  
  // Generate legend props based on position
  const getLegendProps = () => {
    switch (legendPosition) {
      case 'top':
        return { verticalAlign: 'top', height: 36 };
      case 'bottom':
        return { verticalAlign: 'bottom', height: 36 };
      case 'left':
        return { layout: 'vertical', verticalAlign: 'middle', align: 'left' };
      case 'right':
        return { layout: 'vertical', verticalAlign: 'middle', align: 'right' };
      default:
        return { verticalAlign: 'bottom', height: 36 };
    }
  };
  
  // Render the appropriate chart based on type
  const renderChart = () => {
    if (loading) {
      return <PageLoader size="sm" label="Loading chart data..." />;
    }
    
    if (isEmpty) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }
    
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: 'var(--muted-foreground)' }}
                stroke="var(--border)" 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }} 
                stroke="var(--border)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)'
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend {...getLegendProps()} />
              {Array.isArray(dataKey) ? (
                dataKey.map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 6 }}
                  />
                ))
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={colors[0]}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: 'var(--muted-foreground)' }}
                stroke="var(--border)" 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }} 
                stroke="var(--border)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)'
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend {...getLegendProps()} />
              {Array.isArray(dataKey) ? (
                dataKey.map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={colors[index % colors.length]}
                  />
                ))
              ) : (
                <Bar 
                  dataKey={dataKey} 
                  fill={colors[0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: 'var(--muted-foreground)' }}
                stroke="var(--border)" 
              />
              <YAxis 
                tick={{ fill: 'var(--muted-foreground)' }} 
                stroke="var(--border)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)'
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend {...getLegendProps()} />
              {Array.isArray(dataKey) ? (
                dataKey.map((key, index) => (
                  <Area 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    fill={colors[index % colors.length]}
                    stroke={colors[index % colors.length]}
                    fillOpacity={0.3}
                  />
                ))
              ) : (
                <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  fill={colors[0]}
                  stroke={colors[0]}
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)'
                }} 
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend {...getLegendProps()} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={xAxisKey}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(
        'p-6',
        (!title && !description) && 'pt-6'
      )}>
        <div className="h-full min-h-[200px] w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
