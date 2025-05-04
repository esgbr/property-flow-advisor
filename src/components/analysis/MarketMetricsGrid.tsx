
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Building, 
  DollarSign, 
  Percent,
  HelpCircle,
  Filter,
  Calendar
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketMetricsGrid: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  const [timeframe, setTimeframe] = useState<'yearly' | 'quarterly' | 'monthly'>('yearly');
  const [metricView, setMetricView] = useState<'all' | 'residential' | 'commercial'>('all');
  
  // Sample data - in a real app, this would come from an API
  const allMetrics = [
    {
      id: 'avgHomePrice',
      name: t('Average Home Price'),
      value: '€385,000',
      trend: '+2.4%',
      isPositive: true,
      icon: <Home className="h-5 w-5 text-blue-500" />,
      tooltip: t('Average Sales Price Explanation'),
      type: 'residential'
    },
    {
      id: 'rentalYield',
      name: t('Rental Yield'),
      value: '6.3%',
      trend: '+0.2%',
      isPositive: true,
      icon: <Percent className="h-5 w-5 text-green-500" />,
      tooltip: t('Rental Yield Explanation'),
      type: 'residential'
    },
    {
      id: 'avgRentPrice',
      name: t('Average Rent Price'),
      value: '€1,850',
      trend: '+3.2%',
      isPositive: true,
      icon: <Building className="h-5 w-5 text-purple-500" />,
      tooltip: t('Average Rent Explanation'),
      type: 'residential'
    },
    {
      id: 'propertyAppreciation',
      name: t('Property Appreciation'),
      value: '4.7%',
      trend: '-0.3%',
      isPositive: false,
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      tooltip: t('Property Appreciation Explanation'),
      type: 'residential'
    },
    {
      id: 'mortgageRate',
      name: t('Mortgage Rate'),
      value: '3.4%',
      trend: '+0.1%',
      isPositive: false,
      icon: <DollarSign className="h-5 w-5 text-red-500" />,
      tooltip: t('Mortgage Rate Explanation'),
      type: 'residential'
    },
    {
      id: 'investmentVolume',
      name: t('Investment Volume'),
      value: '€9.5B',
      trend: '+8.3%',
      isPositive: true,
      icon: <Building className="h-5 w-5 text-teal-500" />,
      tooltip: t('Investment Volume Explanation'),
      type: 'commercial'
    },
    {
      id: 'vacancyRate',
      name: t('Vacancy Rate'),
      value: '5.8%',
      trend: '-0.5%',
      isPositive: true,
      icon: <Building className="h-5 w-5 text-blue-500" />,
      tooltip: t('Vacancy Rate Explanation'),
      type: 'commercial'
    },
    {
      id: 'capRate',
      name: t('Capitalization Rate'),
      value: '5.2%',
      trend: '+0.1%',
      isPositive: true,
      icon: <Percent className="h-5 w-5 text-green-500" />,
      tooltip: t('Capitalization Rate Explanation'),
      type: 'commercial'
    }
  ];

  // Filter metrics based on selected view
  const filteredMetrics = metricView === 'all' 
    ? allMetrics 
    : allMetrics.filter(metric => metric.type === metricView);

  // Get timeframe-specific data
  const getTimeframeData = (metric: string) => {
    // This would typically come from an API based on the timeframe
    switch(timeframe) {
      case 'monthly':
        return { 
          modifier: '0.3x',
          label: t('Monthly')
        };
      case 'quarterly':
        return { 
          modifier: '0.7x',
          label: t('Quarterly')
        };
      default:
        return { 
          modifier: '1x',
          label: t('Yearly')
        };
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={(value) => setMetricView(value as 'all' | 'residential' | 'commercial')}>
          <TabsList>
            <TabsTrigger value="all">{t('All')}</TabsTrigger>
            <TabsTrigger value="residential">{t('Residential')}</TabsTrigger>
            <TabsTrigger value="commercial">{t('Commercial')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant={timeframe === 'yearly' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('yearly')}
            className="text-xs"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {t('Yearly')}
          </Button>
          <Button
            variant={timeframe === 'quarterly' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('quarterly')}
            className="text-xs"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {t('Quarterly')}
          </Button>
          <Button
            variant={timeframe === 'monthly' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('monthly')}
            className="text-xs"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {t('Monthly')}
          </Button>
        </div>
      </div>

      {userMarket && (
        <div className="mb-4">
          <Badge variant="outline" className="bg-primary/10">
            <Filter className="h-3.5 w-3.5 mr-1" />
            {getMarketDisplayName()} {t('Market')}
          </Badge>
        </div>
      )}

      {filteredMetrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  {metric.name}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help opacity-70 hover:opacity-100">
                        <HelpCircle className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>{metric.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className="rounded-full p-2 bg-muted">
                {metric.icon}
              </div>
            </div>
            <div className="flex items-center mt-2">
              {metric.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={metric.isPositive ? 'text-green-500' : 'text-red-500'}>
                {metric.trend}
              </span>
              <span className="text-xs text-muted-foreground ml-2">
                {getTimeframeData(metric.id).label}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MarketMetricsGrid;
