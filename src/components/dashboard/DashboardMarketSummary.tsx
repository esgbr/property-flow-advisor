
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import PortfolioAllocationChart from '@/components/charts/PortfolioAllocationChart';
import MarketTrendsChart from '@/components/charts/MarketTrendsChart';
import MarketProviderWrapper from '@/components/market/MarketProviderWrapper';

/**
 * Market summary — Unified design, visual polish, responsive layout.
 */
const DashboardMarketSummary: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
          <CardDescription>Track real estate market performance</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <MarketProviderWrapper>
            <MarketTrendsChart />
          </MarketProviderWrapper>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioAllocationChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMarketSummary;
