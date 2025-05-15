
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import PortfolioAllocationChart from '@/components/charts/PortfolioAllocationChart';
import MarketTrendsChart from '@/components/charts/MarketTrendsChart';

const DashboardMarketSummary: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('marketTrends')}</CardTitle>
          <CardDescription>{t('marketTrendsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <MarketTrendsChart />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('portfolioAllocation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioAllocationChart />
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardMarketSummary;
