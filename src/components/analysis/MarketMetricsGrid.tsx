
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Building, 
  DollarSign, 
  Percent
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';

const MarketMetricsGrid: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  
  // Sample data - in a real app, this would come from an API
  const metrics = [
    {
      name: t('averageHomePrice'),
      value: '€385,000',
      trend: '+2.4%',
      isPositive: true,
      icon: <Home className="h-5 w-5 text-blue-500" />
    },
    {
      name: t('rentalYield'),
      value: '6.3%',
      trend: '+0.2%',
      isPositive: true,
      icon: <Percent className="h-5 w-5 text-green-500" />
    },
    {
      name: t('averageRentPrice'),
      value: '€1,850',
      trend: '+3.2%',
      isPositive: true,
      icon: <Building className="h-5 w-5 text-purple-500" />
    },
    {
      name: t('propertyAppreciation'),
      value: '4.7%',
      trend: '-0.3%',
      isPositive: false,
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />
    },
    {
      name: t('mortgageRate'),
      value: '3.4%',
      trend: '+0.1%',
      isPositive: false,
      icon: <DollarSign className="h-5 w-5 text-red-500" />
    },
    {
      name: t('investmentVolume'),
      value: '€9.5B',
      trend: '+8.3%',
      isPositive: true,
      icon: <Building className="h-5 w-5 text-teal-500" />
    }
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{metric.name}</p>
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
              <span className="text-xs text-muted-foreground ml-2">{t('yearly')}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MarketMetricsGrid;
