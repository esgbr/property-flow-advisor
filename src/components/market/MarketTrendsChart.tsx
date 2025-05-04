
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useMarketData } from '@/contexts/MarketDataContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import OptimizedChart from '@/components/market/OptimizedChart';
import { useComponentPerformance } from '@/utils/performanceUtils';

interface MarketTrendsChartProps {
  className?: string;
}

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

  const chartDataKeys = [
    {
      id: 'current',
      name: `${getMarketDisplayName()} ${currentYear}`,
      color: 'var(--primary)'
    },
    {
      id: 'previous',
      name: `${getMarketDisplayName()} ${currentYear - 1}`,
      color: 'var(--primary)',
      strokeDasharray: '5 5',
      opacities: {
        stroke: 0.5,
        fill: 0.1
      }
    }
  ];

  // Add comparison market if selected
  if (comparisonMarket) {
    const marketName = marketOptions.find(m => m.id === comparisonMarket)?.name || comparisonMarket;
    chartDataKeys.push({
      id: 'comparison',
      name: `${marketName} ${currentYear}`,
      color: 'var(--secondary)',
      strokeDasharray: '', // Adding the missing property
      opacities: {
        stroke: 1,
        fill: 0.1
      }
    });
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{getMetricTitle()}</CardTitle>
        <CardDescription>{getMetricDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <OptimizedChart
          data={getActiveData()}
          type={selectedMetric === 'yield' ? 'line' : 'area'}
          dataKeys={chartDataKeys}
          xAxisKey="month"
          yAxisLabel={getYAxisLabel()}
          formatYAxisTick={formatYAxisTick}
          formatTooltip={(value) => [formatYAxisTick(value as number), '']}
          formatTooltipLabel={(label) => `${label} ${currentYear}`}
          height={400}
          domain={selectedMetric === 'yield' ? ['dataMin - 0.5', 'dataMax + 0.5'] : ['auto', 'auto']}
        />
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            {selectedMetric === 'price' 
              ? 'Data represents average property values' 
              : selectedMetric === 'rent'
                ? 'Data represents average monthly rental prices'
                : 'Data represents gross rental yields'}
          </div>
          <div>
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(MarketTrendsChart);
