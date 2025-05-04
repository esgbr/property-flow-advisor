
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Building, Calculator, Lightbulb, PieChart, TrendingUp, Info, DollarSign } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import PortfolioSummaryCards from './PortfolioSummaryCards';
import PortfolioGoals from './PortfolioGoals';
import PortfolioAlerts from './PortfolioAlerts';
import PortfolioSimulator from './PortfolioSimulator';
import PropertyComparison from './PropertyComparison';

// Enhanced dummy data for visualizations with additional investor metrics
const portfolioSummary = {
  totalValue: 2500000,
  equity: 950000,
  totalProperties: 6,
  cashFlow: 12500,
  roi: 7.2,
  appreciation: 5.4,
  debt: 1550000,
  // Investor-focused metrics
  capRate: 6.8,
  cashOnCash: 8.5,
  netOperatingIncome: 170000,
  debtServiceCoverageRatio: 1.75,
  vacancyRate: 3.2
};

/**
 * UnifiedPortfolioDashboard combines the best features of PortfolioDashboard
 * and EnhancedPortfolioDashboard into a single, comprehensive component
 */
const UnifiedPortfolioDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();

  // Calculate key investor metrics
  const investorMetrics = useMemo(() => {
    const leverageRatio = portfolioSummary.debt / portfolioSummary.totalValue;
    const annualCashFlow = portfolioSummary.cashFlow * 12;
    const annualROI = (annualCashFlow / portfolioSummary.equity) * 100;
    
    return {
      leverageRatio: leverageRatio.toFixed(2),
      annualCashFlow: annualCashFlow,
      annualROI: annualROI.toFixed(1),
      breakEvenOccupancy: ((portfolioSummary.debt * 0.06) / (portfolioSummary.totalValue * 0.08) * 100).toFixed(1)
    };
  }, []);

  const handleActionClick = (action: string) => {
    toast({
      title: t('featureNotification'),
      description: `${action} ${t('featureComingSoon')}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Building className="inline-block mr-2 h-8 w-8" />
            {t('investmentPortfolio')}
          </h1>
          <p className="text-muted-foreground">{t('trackYourRealEstateInvestments')}</p>
        </div>
      </div>

      <PortfolioSummaryCards portfolioSummary={portfolioSummary} />

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{t('investorMetrics')}</CardTitle>
              <CardDescription>{t('keyPerformanceIndicators')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleActionClick(t('exportMetrics'))}>
              {t('exportData')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <DollarSign className="h-4 w-4 mr-1" />
                {t('capRate')}
              </div>
              <p className="text-2xl font-bold">{portfolioSummary.capRate}%</p>
              <p className="text-xs text-muted-foreground">{t('netIncomeDividedByValue')}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Calculator className="h-4 w-4 mr-1" />
                {t('cashOnCash')}
              </div>
              <p className="text-2xl font-bold">{portfolioSummary.cashOnCash}%</p>
              <p className="text-xs text-muted-foreground">{t('annualCashFlowDividedByInvestment')}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                {t('debtServiceCoverage')}
              </div>
              <p className="text-2xl font-bold">{portfolioSummary.debtServiceCoverageRatio}</p>
              <p className="text-xs text-muted-foreground">{t('netOperatingIncomeToDebtRatio')}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-muted-foreground text-sm">
                <Info className="h-4 w-4 mr-1" />
                {t('breakEvenOccupancy')}
              </div>
              <p className="text-2xl font-bold">{investorMetrics.breakEvenOccupancy}%</p>
              <p className="text-xs text-muted-foreground">{t('minimumOccupancyToBreakEven')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cashflow">
        <TabsList className="mb-4">
          <TabsTrigger value="cashflow">
            <Calculator className="mr-2 h-4 w-4" />
            {t('cashFlow')}
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('performance')}
          </TabsTrigger>
          <TabsTrigger value="projections">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('projections')}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Building className="mr-2 h-4 w-4" />
            {t('propertyComparison')}
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <PieChart className="mr-1 h-4 w-4" />
            {t('allocation')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cashflow" className="h-80">
          <PortfolioAnalytics />
        </TabsContent>
        
        <TabsContent value="performance" className="h-80">
          <Card>
            <CardHeader>
              <CardTitle>{t('propertyPerformance')}</CardTitle>
              <CardDescription>{t('compareYourInvestments')}</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <PortfolioAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projections">
          <Card>
            <CardHeader>
              <CardTitle>{t('portfolioProjections')}</CardTitle>
              <CardDescription>{t('simulateYourPortfolioGrowth')}</CardDescription>
            </CardHeader>
            <CardContent>
              <PortfolioSimulator />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <PropertyComparison />
        </TabsContent>
        
        <TabsContent value="allocation">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Lightbulb className="h-12 w-12 mx-auto text-amber-500" />
              <h3 className="font-semibold text-lg">{t('enhancedAnalytics')}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('enhancedAnalyticsDescription')}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleActionClick(t('unlockAnalytics'))}>
                {t('viewDetailed')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioGoals onEditGoals={handleActionClick} />
        </div>
        <div>
          <PortfolioAlerts onActionClick={handleActionClick} />
        </div>
      </div>
    </div>
  );
};

export default UnifiedPortfolioDashboard;
