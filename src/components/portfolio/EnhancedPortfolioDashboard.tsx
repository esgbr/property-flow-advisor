
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Building, Calculator, Lightbulb, PieChart, TrendingUp } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import PortfolioSummaryCards from './PortfolioSummaryCards';
import PortfolioGoals from './PortfolioGoals';
import PortfolioAlerts from './PortfolioAlerts';
import PortfolioSimulator from './PortfolioSimulator';
import PropertyComparison from './PropertyComparison';

// Enhanced version of PortfolioDashboard
const EnhancedPortfolioDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();

  // Dummy data for visualizations
  const portfolioSummary = {
    totalValue: 2500000,
    equity: 950000,
    totalProperties: 6,
    cashFlow: 12500,
    roi: 7.2,
    appreciation: 5.4,
    debt: 1550000
  };

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
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-6 w-6" />
            {t('investmentPortfolio')}
          </h1>
          <p className="text-muted-foreground">{t('trackYourRealEstateInvestments')}</p>
        </div>
      </div>

      <PortfolioSummaryCards portfolioSummary={portfolioSummary} />

      <Tabs defaultValue="analytics">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
          <TabsTrigger value="projections">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('projections')}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Building className="mr-2 h-4 w-4" />
            {t('propertyComparison')}
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <Calculator className="mr-1 h-4 w-4" />
            {t('cashFlow')}
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <PieChart className="mr-1 h-4 w-4" />
            {t('allocation')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t('propertyPerformance')}</CardTitle>
              <CardDescription>{t('compareYourInvestments')}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PortfolioAnalytics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('portfolioProjections')}</CardTitle>
                <CardDescription>{t('simulateYourPortfolioGrowth')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioSimulator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <PropertyComparison />
        </TabsContent>

        <TabsContent value="cashflow">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-2">
              <Calculator className="h-12 w-12 mx-auto text-primary/60" />
              <h3 className="font-semibold text-lg">{t('cashFlowAnalysis')}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('cashFlowAnalysisDescription')}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleActionClick(t('cashFlowAnalysis'))}>
                {t('unlockCashFlowAnalysis')}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-2">
              <PieChart className="h-12 w-12 mx-auto text-primary/60" />
              <h3 className="font-semibold text-lg">{t('assetAllocation')}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('assetAllocationDescription')}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleActionClick(t('assetAllocation'))}>
                {t('unlockAssetAllocation')}
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

export default EnhancedPortfolioDashboard;
