
import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useMarketData } from '@/contexts/MarketDataContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import OptimizedChart from '@/components/market/OptimizedChart';
import { useComponentPerformance } from '@/utils/performanceUtils';

interface MarketTrendsChartProps {
  className?: string;
}

// Extract chart data key creation to avoid recreating on each render
const createChartDataKey = (name: string, currentYear: number, color: string, isDashed = false, opacities?: { stroke?: number, fill?: number }) => {
  return {
    id: isDashed ? 'previous' : 'current',
    name: `${name} ${isDashed ? currentYear - 1 : currentYear}`,
    color,
    strokeDasharray: isDashed ? '5 5' : '',
    opacities: {
      stroke: opacities?.stroke ?? (isDashed ? 0.5 : 1),
      fill: opacities?.fill ?? (isDashed ? 0.1 : 0.2)
    }
  };
};

const MarketTrendsChart: React.FC<MarketTrendsChartProps> = ({ className = '' }) => {
  useComponentPerformance('MarketTrendsChart');
  const { getMarketDisplayName } = useMarketFilter();
  const { 
    selectedMetric, 
    comparisonMarket, 
    marketOptions,
    getActiveData, 
    getMetricTitle, 
    getMetricDescription, 
    getYAxisLabel, 
    formatYAxisTick 
  } = useMarketData();

  const currentYear = new Date().getFullYear();
  const marketDisplayName = useMemo(() => getMarketDisplayName(), [getMarketDisplayName]);
  
  const chartDataKeys = useMemo(() => {
    // Create base data keys
    const dataKeys = [
      // Current market, current year
      createChartDataKey(
        marketDisplayName, 
        currentYear, 
        'var(--primary)'
      ),
      
      // Current market, previous year (dashed)
      createChartDataKey(
        marketDisplayName, 
        currentYear, 
        'var(--primary)', 
        true, 
        { stroke: 0.5, fill: 0.1 }
      )
    ];
    
    // Add comparison market if selected
    if (comparisonMarket) {
      const marketName = marketOptions.find(m => m.id === comparisonMarket)?.name || comparisonMarket;
      dataKeys.push({
        id: 'comparison',
        name: `${marketName} ${currentYear}`,
        color: 'var(--secondary)',
        strokeDasharray: '', 
        opacities: {
          stroke: 1,
          fill: 0.1
        }
      });
    }
    
    return dataKeys;
  }, [comparisonMarket, marketOptions, marketDisplayName, currentYear]);

  // Memoize the chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => getActiveData(), [getActiveData]);
  
  // Determine chart type based on metric
  const chartType = useMemo(() => 
    selectedMetric === 'yield' ? 'line' : 'area',
    [selectedMetric]
  );
  
  // Memoize the y-axis domain
  const yAxisDomain = useMemo(() => 
    selectedMetric === 'yield' ? ['dataMin - 0.5', 'dataMax + 0.5'] : ['auto', 'auto'],
    [selectedMetric]
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{getMetricTitle()}</CardTitle>
        <CardDescription>{getMetricDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <OptimizedChart
          data={chartData}
          type={chartType}
          dataKeys={chartDataKeys}
          xAxisKey="month"
          yAxisLabel={getYAxisLabel()}
          formatYAxisTick={formatYAxisTick}
          formatTooltip={(value) => [formatYAxisTick(value as number), '']}
          formatTooltipLabel={(label) => `${label} ${currentYear}`}
          height={400}
          domain={yAxisDomain}
        />
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1" aria-hidden="true" />
            {selectedMetric === 'price' 
              ? 'Data represents average property values' 
              : selectedMetric === 'rent'
                ? 'Data represents average monthly rental prices'
                : 'Data represents gross rental yields'}
          </div>
          <div aria-live="polite" aria-atomic="true">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(MarketTrendsChart);
