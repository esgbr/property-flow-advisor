
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  Info, 
  Filter,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MarketTrendsAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const { getMarketDisplayName, userMarket } = useMarketFilter();
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | 'max'>('1y');
  const [selectedMetric, setSelectedMetric] = useState<'price' | 'rent' | 'yield'>('price');
  const [comparisonMarket, setComparisonMarket] = useState<string | null>(null);

  // Sample data
  const priceData = [
    { month: 'Jan', current: 380000, previous: 355000, comparison: 420000 },
    { month: 'Feb', current: 382000, previous: 360000, comparison: 425000 },
    { month: 'Mar', current: 385000, previous: 365000, comparison: 430000 },
    { month: 'Apr', current: 390000, previous: 368000, comparison: 435000 },
    { month: 'May', current: 395000, previous: 370000, comparison: 437000 },
    { month: 'Jun', current: 400000, previous: 373000, comparison: 440000 },
    { month: 'Jul', current: 405000, previous: 377000, comparison: 442000 },
    { month: 'Aug', current: 408000, previous: 380000, comparison: 445000 },
    { month: 'Sep', current: 407000, previous: 382000, comparison: 446000 },
    { month: 'Oct', current: 410000, previous: 384000, comparison: 448000 },
    { month: 'Nov', current: 415000, previous: 386000, comparison: 450000 },
    { month: 'Dec', current: 420000, previous: 390000, comparison: 455000 },
  ];

  const rentData = [
    { month: 'Jan', current: 1800, previous: 1650, comparison: 2100 },
    { month: 'Feb', current: 1820, previous: 1670, comparison: 2120 },
    { month: 'Mar', current: 1850, previous: 1690, comparison: 2150 },
    { month: 'Apr', current: 1870, previous: 1710, comparison: 2170 },
    { month: 'May', current: 1900, previous: 1730, comparison: 2200 },
    { month: 'Jun', current: 1920, previous: 1750, comparison: 2220 },
    { month: 'Jul', current: 1950, previous: 1770, comparison: 2240 },
    { month: 'Aug', current: 1970, previous: 1790, comparison: 2260 },
    { month: 'Sep', current: 1980, previous: 1800, comparison: 2270 },
    { month: 'Oct', current: 2000, previous: 1820, comparison: 2290 },
    { month: 'Nov', current: 2020, previous: 1840, comparison: 2300 },
    { month: 'Dec', current: 2040, previous: 1860, comparison: 2320 },
  ];

  const yieldData = [
    { month: 'Jan', current: 5.7, previous: 5.6, comparison: 6.0 },
    { month: 'Feb', current: 5.7, previous: 5.6, comparison: 6.0 },
    { month: 'Mar', current: 5.8, previous: 5.6, comparison: 6.0 },
    { month: 'Apr', current: 5.8, previous: 5.6, comparison: 6.0 },
    { month: 'May', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Jun', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Jul', current: 5.8, previous: 5.6, comparison: 6.1 },
    { month: 'Aug', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Sep', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Oct', current: 5.9, previous: 5.7, comparison: 6.1 },
    { month: 'Nov', current: 5.9, previous: 5.7, comparison: 6.2 },
    { month: 'Dec', current: 6.0, previous: 5.7, comparison: 6.2 },
  ];

  const getActiveData = () => {
    switch(selectedMetric) {
      case 'rent':
        return rentData;
      case 'yield':
        return yieldData;
      case 'price':
      default:
        return priceData;
    }
  };

  const getMetricTitle = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Rental Price Trends');
      case 'yield':
        return t('Rental Yield Trends');
      case 'price':
      default:
        return t('Property Price Trends');
    }
  };

  const getMetricDescription = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Average monthly rental prices');
      case 'yield':
        return t('Average rental yield percentages');
      case 'price':
      default:
        return t('Average property purchase prices');
    }
  };

  const getYAxisLabel = () => {
    switch(selectedMetric) {
      case 'rent':
        return t('Rent (€)');
      case 'yield':
        return t('Yield (%)');
      case 'price':
      default:
        return t('Price (€)');
    }
  };

  const formatYAxisTick = (value: number) => {
    switch(selectedMetric) {
      case 'rent':
        return `€${value}`;
      case 'yield':
        return `${value}%`;
      case 'price':
      default:
        return value >= 1000000 
          ? `€${(value / 1000000).toFixed(1)}M` 
          : `€${(value / 1000).toFixed(0)}K`;
    }
  };

  const markets = [
    { id: 'germany', name: 'Germany' },
    { id: 'usa', name: 'USA' },
    { id: 'france', name: 'France' },
    { id: 'spain', name: 'Spain' },
  ];

  // Filter out current market from comparison options
  const comparisonOptions = markets.filter(market => market.id !== userMarket);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              {getMetricTitle()}
            </CardTitle>
            <CardDescription>{getMetricDescription()}</CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
              <TabsList>
                <TabsTrigger value="price">{t('Prices')}</TabsTrigger>
                <TabsTrigger value="rent">{t('Rents')}</TabsTrigger>
                <TabsTrigger value="yield">{t('Yields')}</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {timeRange === '1y' ? t('1 Year') :
                   timeRange === '3y' ? t('3 Years') :
                   timeRange === '5y' ? t('5 Years') :
                   t('Max')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Time Range')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTimeRange('1y')}>{t('1 Year')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('3y')}>{t('3 Years')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('5y')}>{t('5 Years')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange('max')}>{t('Max')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {t('Compare')}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Compare Markets')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setComparisonMarket(null)}>
                  {t('No Comparison')}
                </DropdownMenuItem>
                {comparisonOptions.map(market => (
                  <DropdownMenuItem 
                    key={market.id}
                    onClick={() => setComparisonMarket(market.id)}
                  >
                    {market.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('Export')}
            </Button>
          </div>
        </div>
        
        {userMarket && (
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2 bg-primary/10">
              {getMarketDisplayName()} {t('Market')}
            </Badge>
            
            {comparisonMarket && (
              <>
                <Badge variant="outline" className="bg-secondary/10">
                  {t('Comparing with')}: {markets.find(m => m.id === comparisonMarket)?.name}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => setComparisonMarket(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === 'yield' ? (
              <LineChart data={getActiveData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={formatYAxisTick} 
                  domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                  label={{ 
                    value: getYAxisLabel(), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <RechartsTooltip 
                  formatter={(value) => [`${value}%`, '']}
                  labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="var(--primary)" 
                  name={`${getMarketDisplayName()} ${new Date().getFullYear()}`} 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="var(--primary)" 
                  strokeOpacity={0.5} 
                  name={`${getMarketDisplayName()} ${new Date().getFullYear() - 1}`} 
                  strokeDasharray="5 5" 
                />
                {comparisonMarket && (
                  <Line 
                    type="monotone" 
                    dataKey="comparison" 
                    stroke="var(--secondary)" 
                    name={`${markets.find(m => m.id === comparisonMarket)?.name} ${new Date().getFullYear()}`} 
                    strokeWidth={2} 
                  />
                )}
              </LineChart>
            ) : (
              <AreaChart data={getActiveData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={formatYAxisTick} 
                  domain={['auto', 'auto']} 
                  label={{ 
                    value: getYAxisLabel(), 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <RechartsTooltip 
                  formatter={(value) => [formatYAxisTick(value as number), '']}
                  labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="var(--primary)" 
                  fill="var(--primary)" 
                  fillOpacity={0.2}
                  name={`${getMarketDisplayName()} ${new Date().getFullYear()}`} 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="var(--primary)" 
                  fill="var(--primary)"
                  fillOpacity={0.1}
                  strokeOpacity={0.5} 
                  name={`${getMarketDisplayName()} ${new Date().getFullYear() - 1}`} 
                  strokeDasharray="5 5" 
                />
                {comparisonMarket && (
                  <Area 
                    type="monotone" 
                    dataKey="comparison" 
                    stroke="var(--secondary)" 
                    fill="var(--secondary)"
                    fillOpacity={0.1}
                    name={`${markets.find(m => m.id === comparisonMarket)?.name} ${new Date().getFullYear()}`} 
                    strokeWidth={2} 
                  />
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span>
              {selectedMetric === 'price' 
                ? t('Data represents average property values') 
                : selectedMetric === 'rent'
                  ? t('Data represents average monthly rental prices')
                  : t('Data represents gross rental yields')}
            </span>
          </div>
          <div>
            {t('Last updated')}: {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTrendsAnalysis;
