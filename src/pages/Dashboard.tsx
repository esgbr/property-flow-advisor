
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, ChartBar, Globe, Home, Info, Plus } from 'lucide-react';
import { PropertyScanner } from '@/components/property/PropertyScanner';
import InvestmentOpportunityFeed from '@/components/property/InvestmentOpportunityFeed';
import EnhancedPortfolioDashboard from '@/components/portfolio/EnhancedPortfolioDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import MarketAwareDashboard from '@/components/market/MarketAwareDashboard';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <Button onClick={() => navigate('/property/add')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addProperty')}
        </Button>
      </div>

      {/* Welcome card with personalized greeting */}
      {preferences.name && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{t('welcomeBack')}, {preferences.name}!</CardTitle>
            <CardDescription>{t('dashboardGreeting')}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Market aware content */}
      <MarketAwareDashboard />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <Home className="mr-2 h-4 w-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <Building className="mr-2 h-4 w-4" />
            {t('portfolio')}
          </TabsTrigger>
          <TabsTrigger value="market">
            <Globe className="mr-2 h-4 w-4" />
            {t('market')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <ChartBar className="mr-2 h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('propertySummary')}</CardTitle>
                <CardDescription>{t('yourPortfolioAtaGlance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalProperties')}</p>
                      <p className="text-3xl font-bold">6</p>
                    </div>
                    <Building className="h-8 w-8 text-primary opacity-80" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('residential')}</span>
                      <span className="text-sm">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('commercial')}</span>
                      <span className="text-sm">2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/properties')}>
                  {t('viewAllProperties')}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('financialOverview')}</CardTitle>
                <CardDescription>{t('keyFinancialMetrics')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalValue')}</p>
                      <p className="text-3xl font-bold">€2.5M</p>
                    </div>
                    <Calculator className="h-8 w-8 text-primary opacity-80" />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('monthlyIncome')}</span>
                      <span className="text-sm text-green-600">€12,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('averageROI')}</span>
                      <span className="text-sm">7.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/portfolio-analytics')}>
                  {t('viewFinancialDetails')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('recentActivity')}</CardTitle>
                <CardDescription>{t('latestUpdatesAndNotifications')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <p className="font-medium">{t('rentCollected')}</p>
                    <p className="text-sm text-muted-foreground">€1,200 - Berlin Apartment</p>
                    <p className="text-xs text-muted-foreground">3 {t('daysAgo')}</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-3 py-1">
                    <p className="font-medium">{t('maintenanceScheduled')}</p>
                    <p className="text-sm text-muted-foreground">Munich Property</p>
                    <p className="text-xs text-muted-foreground">1 {t('weekAgo')}</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3 py-1">
                    <p className="font-medium">{t('propertyViewsIncreased')}</p>
                    <p className="text-sm text-muted-foreground">+15% {t('lastMonth')}</p>
                    <p className="text-xs text-muted-foreground">2 {t('weeksAgo')}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {t('viewAllActivity')}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <PropertyScanner />
            <InvestmentOpportunityFeed />
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('quickActions')}</CardTitle>
                  <CardDescription>{t('commonTasksAndCalculators')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="hover:border-primary/50 cursor-pointer transition-all" 
                        onClick={() => navigate('/advanced-calculators')}>
                    <CardContent className="p-4 text-center">
                      <Calculator className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{t('investmentCalculator')}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-all"
                        onClick={() => navigate('/property-comparator')}>
                    <CardContent className="p-4 text-center">
                      <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{t('compareProperties')}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-all"
                        onClick={() => navigate('/market-explorer')}>
                    <CardContent className="p-4 text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{t('exploreMarkets')}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-all"
                        onClick={() => navigate('/portfolio-analytics')}>
                    <CardContent className="p-4 text-center">
                      <ChartBar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{t('portfolioAnalytics')}</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className="mt-6">
            <EnhancedPortfolioDashboard />
          </div>
        </TabsContent>
        
        <TabsContent value="market">
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('marketTrends')}</CardTitle>
                <CardDescription>{t('realEstateMarketUpdates')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <Globe className="h-12 w-12 mx-auto text-primary/60" />
                    <h3 className="font-semibold text-lg">{t('marketExplorer')}</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {t('marketExplorerDescription')}
                    </p>
                    <Button onClick={() => navigate('/market-explorer')}>
                      {t('exploreMarkets')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <InvestmentOpportunityFeed />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('portfolioAnalytics')}</CardTitle>
                <CardDescription>{t('insightfulDataAboutYourPortfolio')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-2">
                    <ChartBar className="h-12 w-12 mx-auto text-primary/60" />
                    <h3 className="font-semibold text-lg">{t('advancedAnalytics')}</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {t('advancedAnalyticsDescription')}
                    </p>
                    <Button onClick={() => navigate('/portfolio-analytics')}>
                      {t('viewAdvancedAnalytics')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('proTips')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{t('dashboardProTip')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
