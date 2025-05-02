
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, BarChart3, Building, Calculator, Lightbulb, PieChart, TrendingUp } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

const PortfolioDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('portfolioValue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{portfolioSummary.totalValue.toLocaleString()}</div>
            <div className="flex justify-between mt-2">
              <div className="text-sm text-muted-foreground">{t('equity')}: €{portfolioSummary.equity.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('debt')}: €{portfolioSummary.debt.toLocaleString()}</div>
            </div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(portfolioSummary.equity / portfolioSummary.totalValue) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('cashFlow')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{portfolioSummary.cashFlow.toLocaleString()}<span className="text-base text-muted-foreground">/mo</span></div>
            <div className="text-sm text-green-500 font-medium mt-2">
              <TrendingUp className="inline-block mr-1 h-4 w-4" />
              {t('positive')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('returnsAndGrowth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-sm text-muted-foreground">{t('cashOnCashROI')}</div>
                <div className="text-xl font-semibold">{portfolioSummary.roi}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('appreciation')}</div>
                <div className="text-xl font-semibold">{portfolioSummary.appreciation}%</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">{t('totalReturn')}</div>
              <div className="font-medium">{(portfolioSummary.roi + portfolioSummary.appreciation).toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('propertyPerformance')}</CardTitle>
          <CardDescription>{t('compareYourInvestments')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cashflow">
            <TabsList className="mb-4">
              <TabsTrigger value="cashflow">
                <Calculator className="mr-1 h-4 w-4" />
                {t('cashFlow')}
              </TabsTrigger>
              <TabsTrigger value="roi">
                <PieChart className="mr-1 h-4 w-4" />
                {t('roi')}
              </TabsTrigger>
              <TabsTrigger value="appreciation">
                <BarChart3 className="mr-1 h-4 w-4" />
                {t('appreciation')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="cashflow" className="h-80">
              <PortfolioAnalytics />
            </TabsContent>
            
            <TabsContent value="roi" className="h-80">
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
            
            <TabsContent value="appreciation" className="h-80">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <AlertCircle className="h-12 w-12 mx-auto text-blue-500" />
                  <h3 className="font-semibold text-lg">{t('marketInsights')}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t('marketInsightsDescription')}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleActionClick(t('connectMarketData'))}>
                    {t('connectMarketData')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('investmentGoals')}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleActionClick(t('editGoals'))}>{t('edit')}</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('cashflowGoal')}</div>
                <div className="text-sm">€15,000 / €25,000</div>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('equityTarget')}</div>
                <div className="text-sm">€950,000 / €1,500,000</div>
              </div>
              <Progress value={63} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium">{t('totalPropertiesGoal')}</div>
                <div className="text-sm">6 / 10</div>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('portfolioAlerts')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{t('refinancingOpportunity')}</div>
                <p className="text-sm text-muted-foreground">
                  {t('propertyEligibleRefinancing')}
                </p>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1" onClick={() => handleActionClick(t('viewDetails'))}>{t('viewDetails')}</Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{t('marketOpportunity')}</div>
                <p className="text-sm text-muted-foreground">
                  {t('newPropertyMatchingCriteria')}
                </p>
                <Badge className="mt-2" variant="outline">{t('northDistrict')}</Badge>
                <Button size="sm" variant="link" className="p-0 h-auto mt-1 block" onClick={() => handleActionClick(t('viewProperty'))}>{t('viewProperty')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
