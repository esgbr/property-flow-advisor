
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { useMarketFilter } from '@/hooks/use-market-filter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample market data
const marketData = [
  { month: 'Jan', priceIndex: 100, salesVolume: 120, rentIndex: 100 },
  { month: 'Feb', priceIndex: 102, salesVolume: 118, rentIndex: 101 },
  { month: 'Mar', priceIndex: 103, salesVolume: 125, rentIndex: 102 },
  { month: 'Apr', priceIndex: 105, salesVolume: 130, rentIndex: 103 },
  { month: 'May', priceIndex: 107, salesVolume: 128, rentIndex: 104 },
  { month: 'Jun', priceIndex: 109, salesVolume: 135, rentIndex: 105 },
  { month: 'Jul', priceIndex: 112, salesVolume: 140, rentIndex: 106 },
  { month: 'Aug', priceIndex: 114, salesVolume: 138, rentIndex: 108 },
  { month: 'Sep', priceIndex: 116, salesVolume: 145, rentIndex: 110 },
  { month: 'Oct', priceIndex: 118, salesVolume: 150, rentIndex: 112 },
  { month: 'Nov', priceIndex: 120, salesVolume: 148, rentIndex: 113 },
  { month: 'Dec', priceIndex: 122, salesVolume: 155, rentIndex: 115 },
];

// Chart periods
const periodOptions = ['3M', '6M', '1Y', '3Y', '5Y', 'All'];

const MarketChart: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  const [period, setPeriod] = useState('1Y');
  const [visibleMetrics, setVisibleMetrics] = useState({
    priceIndex: true,
    rentIndex: true,
    salesVolume: true
  });

  // Get filtered data based on selected period
  const getFilteredData = () => {
    switch (period) {
      case '3M':
        return marketData.slice(-3);
      case '6M':
        return marketData.slice(-6);
      case '1Y':
        return marketData;
      default:
        return marketData; // For demo purposes all periods show same data
    }
  };

  // Toggle visibility of metrics
  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Custom tooltip component for better dark mode support
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded shadow-lg">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div 
              key={`tooltip-${index}`} 
              className="flex items-center text-sm mb-1" 
              style={{ color: entry.color }}
            >
              <div 
                className="h-2 w-2 rounded-full mr-1"
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-1">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format chart labels to make them more readable
  const formatLabel = (label: string): string => {
    switch(label) {
      case 'priceIndex': return t('price Index');
      case 'rentIndex': return t('rent Index');
      case 'salesVolume': return t('sales Volume');
      default: return label;
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>{t('market Trends')}</CardTitle>
            <CardDescription>
              {getMarketDisplayName()} {t('real Estate Market')}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              {Object.keys(visibleMetrics).map((metric) => (
                <button
                  key={metric}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    visibleMetrics[metric as keyof typeof visibleMetrics]
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  onClick={() => toggleMetric(metric as keyof typeof visibleMetrics)}
                >
                  {formatLabel(metric)}
                </button>
              ))}
            </div>
            <Select defaultValue={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getFilteredData()}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis 
                dataKey="month" 
                stroke="currentColor" 
                strokeOpacity={0.6}
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                yAxisId="left" 
                stroke="currentColor" 
                strokeOpacity={0.6}
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="currentColor" 
                strokeOpacity={0.6}
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => formatLabel(value)} />
              {visibleMetrics.priceIndex && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="priceIndex" 
                  name={t('price Index')} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                  dot={{ r: 3 }}
                />
              )}
              {visibleMetrics.rentIndex && (
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rentIndex" 
                  name={t('rent Index')} 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
              {visibleMetrics.salesVolume && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="salesVolume" 
                  name={t('sales Volume')} 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketChart;
