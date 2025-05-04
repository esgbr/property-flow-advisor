
import React from 'react';
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
  domain = ['auto', 'auto']
}: ChartProps) => {
  const renderChart = () => {
    if (type === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey={xAxisKey} />
          <YAxis 
            tickFormatter={formatYAxisTick} 
            domain={domain as [any, any]} 
            label={yAxisLabel ? { 
              value: yAxisLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            } : undefined} 
          />
          <RechartsTooltip 
            formatter={formatTooltip}
            labelFormatter={formatTooltipLabel}
          />
          <Legend />
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
            />
          ))}
        </LineChart>
      );
    }
    
    return (
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey={xAxisKey} />
        <YAxis 
          tickFormatter={formatYAxisTick} 
          domain={domain as [any, any]} 
          label={yAxisLabel ? { 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          } : undefined} 
        />
        <RechartsTooltip 
          formatter={formatTooltip}
          labelFormatter={formatTooltipLabel}
        />
        <Legend />
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
          />
        ))}
      </AreaChart>
    );
  };
  
  return (
    <div style={{ height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;
