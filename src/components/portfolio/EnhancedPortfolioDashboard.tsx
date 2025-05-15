
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, Building, Calculator, Lightbulb, PieChart, TrendingUp, DollarSign, Info } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import PortfolioSummaryCards from './PortfolioSummaryCards';
import PortfolioGoals from './PortfolioGoals';
import PortfolioAlerts from './PortfolioAlerts';
import PortfolioSimulator from './PortfolioSimulator';
import PropertyComparison from './PropertyComparison';
import ConnectFeaturesCard from '../workflow/ConnectFeaturesCard';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';

// Enhanced version of PortfolioDashboard with better workflow integration
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
    debt: 1550000,
    // Additional investor metrics
    capRate: 6.8,
    cashOnCash: 8.5,
    netOperatingIncome: 170000,
    debtServiceCoverageRatio: 1.75,
    vacancyRate: 3.2
  };

  // Calculate key investor metrics
  const investorMetrics = React.useMemo(() => {
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

  // Connected features for better workflow integration
  const connectedFeatures = [
    {
      id: 'market',
      title: { en: 'Market Explorer', de: 'Marktexplorer' },
      description: { 
        en: 'Explore market trends and opportunities', 
        de: 'Markttrends und -chancen erkunden' 
      },
      path: '/market-explorer',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 'calculators',
      title: { en: 'Financial Calculators', de: 'Finanzrechner' },
      description: { 
        en: 'ROI, mortgage, and cash flow calculators', 
        de: 'ROI-, Hypotheken- und Cashflow-Rechner' 
      },
      path: '/calculators',
      icon: <Calculator className="h-5 w-5" />
    },
    {
      id: 'properties',
      title: { en: 'Property Management', de: 'Immobilienverwaltung' },
      description: { 
        en: 'View and manage your investment properties', 
        de: 'Ihre Anlageobjekte anzeigen und verwalten' 
      },
      path: '/properties',
      icon: <Building className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Building className="mr-2 h-6 w-6" />
            {t('investmentPortfolio')}
          </h1>
          <p className="text-muted-foreground">{t('trackYourRealEstateInvestments')}</p>
        </div>
        <Button variant="outline" onClick={() => handleActionClick(t('exportPortfolio'))}>
          {t('exportData')}
        </Button>
      </div>

      <PortfolioSummaryCards portfolioSummary={portfolioSummary} />

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{t('investorMetrics')}</CardTitle>
              <CardDescription>{t('keyPerformanceIndicators')}</CardDescription>
            </div>
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
              <Button variant="outline" onClick={() => handleActionClick(t('viewCashFlowDetails'))}>
                {t('viewDetails')}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center space-y-2">
              <PieChart className="h-12 w-12 mx-auto text-primary/60" />
              <h3 className="font-semibold text-lg">{t('portfolioAllocation')}</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {t('portfolioAllocationDescription')}
              </p>
              <Button variant="outline" onClick={() => handleActionClick(t('viewAllocationDetails'))}>
                {t('viewDetails')}
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

      <WorkflowSuggestions
        currentTool="portfolio"
        workflowType="analyse"
        maxSuggestions={3}
        className="mb-6"
      />

      <ConnectFeaturesCard
        title={{ en: 'Related Tools', de: 'Verwandte Tools' }}
        description={{ 
          en: 'Enhance your portfolio management with these tools',
          de: 'Verbessern Sie Ihr Portfolio-Management mit diesen Tools'
        }}
        features={connectedFeatures}
        className="mt-6"
      />
    </div>
  );
};

export default EnhancedPortfolioDashboard;
