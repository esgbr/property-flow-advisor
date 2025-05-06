
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Building, Calculator, FileText, TrendingUp } from 'lucide-react';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import PortfolioSummaryCards from '@/components/portfolio/PortfolioSummaryCards';
import PortfolioPropertyComparison from '@/components/portfolio/PortfolioPropertyComparison';
import { usePropertyPerformance } from '@/hooks/use-property-performance';

// Sample portfolio data
const portfolioSummary = {
  totalValue: 2500000,
  equity: 950000,
  cashFlow: 12500,
  roi: 7.2,
  appreciation: 5.4,
  debt: 1550000
};

const PortfolioAnalyticsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { performance, loading } = usePropertyPerformance('portfolio');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <BarChart3 className="inline-block mr-2 h-8 w-8" />
          {t('portfolioAnalytics')}
        </h1>
        <p className="text-muted-foreground">{t('analyzeYourInvestments')}</p>
      </div>

      <PortfolioSummaryCards portfolioSummary={portfolioSummary} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Building className="h-4 w-4 mr-2" />
            {t('propertyComparison')}
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <Calculator className="h-4 w-4 mr-2" />
            {t('cashFlowAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 mr-2" />
            {t('reports')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t('portfolioPerformance')}</CardTitle>
              <CardDescription>{t('trackYourInvestmentResults')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PortfolioAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <PortfolioPropertyComparison />
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>{t('cashFlowAnalysis')}</CardTitle>
              <CardDescription>{t('exploreYourMonthlyCashFlow')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Diese Funktion wird demnächst verfügbar sein.' 
                    : 'This feature will be available soon.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>{t('portfolioReports')}</CardTitle>
              <CardDescription>{t('generateCustomReports')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Diese Funktion wird demnächst verfügbar sein.' 
                    : 'This feature will be available soon.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioAnalyticsPage;
