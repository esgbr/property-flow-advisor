import React, { lazy, Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart2, 
  Activity, 
  TrendingUp, 
  PieChart, 
  ChevronsRight, 
  LineChart, 
  ArrowRight 
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import PortfolioDistributionChart from '@/components/charts/PortfolioDistributionChart';
import QuickActions from '@/components/dashboard/QuickActions';
import PageLayout from '@/components/layout/PageLayout';

// Lazy load components that aren't immediately visible
const InvestmentOpportunities = lazy(() => 
  import('@/components/investments/InvestmentOpportunities')
);

const InvestorDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {t('investorDashboard')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Überwachen und Optimieren Sie Ihre Immobilieninvestitionen'
              : 'Monitor and optimize your real estate investments'}
          </p>
        </div>
        <Button>
          {language === 'de' ? 'Neue Investition' : 'New Investment'}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('totalInvested')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€1,850,000</div>
              <p className="text-sm text-green-600 flex items-center">
                +8.3% <span className="text-muted-foreground ml-1">{t('fromLastYear')}</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('annualReturn')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">7.2%</div>
              <p className="text-sm text-green-600 flex items-center">
                +0.5% <span className="text-muted-foreground ml-1">{t('fromLastYear')}</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('propertyCount')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">7</div>
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Immobilien im Portfolio' : 'Properties in portfolio'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('portfolioPerformance')}</CardTitle>
                  <CardDescription>{t('last12Months')}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">YTD</Button>
                  <Button variant="outline" size="sm">1Y</Button>
                  <Button size="sm">5Y</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
                <LineChart className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('portfolioDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioDistributionChart />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" size="sm">
                {language === 'de' ? 'Detaillierte Aufteilung' : 'Detailed Breakdown'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="analysis">{t('analysis')}</TabsTrigger>
            <TabsTrigger value="opportunities">{t('opportunities')}</TabsTrigger>
            <TabsTrigger value="optimization">{t('optimization')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('keyMetrics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('cashOnCashReturn')}</p>
                        <p className="text-xl font-medium">5.8%</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{width: '58%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">{t('capRate')}</p>
                        <p className="text-xl font-medium">4.2%</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{width: '42%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">{t('debtCoverageRatio')}</p>
                        <p className="text-xl font-medium">1.85</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('grossRentalYield')}</p>
                        <p className="text-xl font-medium">6.9%</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{width: '69%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">{t('vacancyRate')}</p>
                        <p className="text-xl font-medium">2.1%</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full rounded-full" style={{width: '21%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">{t('roi')}</p>
                        <p className="text-xl font-medium">12.3%</p>
                        <div className="h-1 w-full bg-muted mt-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{width: '82%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">
                    {t('exportData')}
                  </Button>
                  <Button size="sm" className="ml-auto">
                    {t('detailedAnalysis')} <ChevronsRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'de' ? 'Schnellaktionen' : 'Quick Actions'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('marketInsights')}</CardTitle>
                  <CardDescription>
                    {language === 'de' 
                      ? `Trends im ${preferences.investmentMarket} Markt`
                      : `Trends in the ${preferences.investmentMarket} market`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <span>{language === 'de' ? 'Preiswachstum' : 'Price Growth'}</span>
                    </div>
                    <div className="text-green-600 font-medium">+3.2%</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <BarChart2 className="h-4 w-4 text-primary" />
                      </div>
                      <span>{language === 'de' ? 'Mietwachstum' : 'Rent Growth'}</span>
                    </div>
                    <div className="text-green-600 font-medium">+2.1%</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span>{language === 'de' ? 'Marktliquidität' : 'Market Liquidity'}</span>
                    </div>
                    <div className="font-medium">
                      {language === 'de' ? 'Mittel' : 'Medium'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="ml-auto">
                    {language === 'de' ? 'Mehr erfahren' : 'Learn more'} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'de' ? 'Portfolio-Gesundheit' : 'Portfolio Health'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="relative h-32 w-32">
                      <PieChart className="h-32 w-32 text-muted-foreground/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold">85</p>
                          <p className="text-sm text-muted-foreground">/ 100</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-green-600 font-medium">
                      {language === 'de' ? 'Sehr gut' : 'Very Good'}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {language === 'de' ? 'Verbesserungsmöglichkeiten anzeigen' : 'View Improvement Opportunities'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalysis')}</CardTitle>
                <CardDescription>{t('detailedMetricsForYourPortfolio')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
                  <BarChart2 className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  {language === 'de' ? 'Filter anpassen' : 'Adjust Filters'}
                </Button>
                <Button className="ml-auto">
                  {language === 'de' ? 'Vollständige Analyse' : 'Full Analysis'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="opportunities" className="mt-6">
            <Suspense fallback={<div className="p-4 text-center">Loading investment opportunities...</div>}>
              <InvestmentOpportunities />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="optimization" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Portfolio-Optimierung' : 'Portfolio Optimization'}</CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'KI-basierte Vorschläge zur Optimierung Ihres Immobilienportfolios'
                    : 'AI-powered suggestions to optimize your real estate portfolio'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center space-y-4">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">
                        {language === 'de' 
                          ? 'Optimierungsvorschläge werden generiert'
                          : 'Generating optimization suggestions'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'de'
                          ? 'Diese Funktion wird bald verfügbar sein'
                          : 'This feature will be available soon'}
                      </p>
                    </div>
                    <Button>
                      {language === 'de' ? 'Jetzt freischalten' : 'Unlock Now'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default InvestorDashboard;
