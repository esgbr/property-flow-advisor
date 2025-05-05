
import React, { useEffect, useState } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageDetectionBanner from '@/components/language/LanguageDetectionBanner';
import MarketSpecificFeatures from '@/components/market/MarketSpecificFeatures';
import OnboardingTests from '@/tests/OnboardingTests';
import PropertyAnalyticsVisualizations from '@/components/analytics/PropertyAnalyticsVisualizations';
import MarketGrowthForecast from '@/components/analytics/MarketGrowthForecast';

const Dashboard: React.FC = () => {
  const { preferences } = useUserPreferences();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load user's last active tab if available
  useEffect(() => {
    const lastTab = localStorage.getItem('dashboardLastTab');
    if (lastTab) {
      setActiveTab(lastTab);
    }
  }, []);
  
  // Save active tab preference
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('dashboardLastTab', value);
  };
  
  return (
    <div className="space-y-6 p-6">
      {/* Language detection banner */}
      <LanguageDetectionBanner />
      
      {/* Welcome message */}
      <div className="flex flex-col md:flex-row md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {preferences.name ? `${t('welcome')}, ${preferences.name}!` : t('dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('completeInvestmentToolsuite')}
          </p>
        </div>
        {preferences.experienceLevel && (
          <div className="mt-2 md:mt-0">
            <p className="text-sm text-muted-foreground">
              {t('experienceLevel')}:{' '}
              <span className="font-medium text-foreground capitalize">
                {t(preferences.experienceLevel)}
              </span>
            </p>
          </div>
        )}
      </div>
      
      {/* Market-specific features */}
      <MarketSpecificFeatures />
      
      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('propertyAnalytics')}</TabsTrigger>
          <TabsTrigger value="forecast">{t('dataVisualization')}</TabsTrigger>
          <TabsTrigger value="tests">{t('testAutomation')}</TabsTrigger>
        </TabsList>
      
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick stats */}
            <Card>
              <CardHeader>
                <CardTitle>{t('portfolioOverview')}</CardTitle>
                <CardDescription>{t('yourRealEstatePortfolioAtAGlance')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('totalProperties')}</p>
                    <p className="text-2xl font-semibold">3</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('totalValue')}</p>
                    <p className="text-2xl font-semibold">€1.2M</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('monthlyCashFlow')}</p>
                    <p className="text-2xl font-semibold text-green-600">€2,450</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{t('annualCashFlow')}</p>
                    <p className="text-2xl font-semibold text-green-600">€29,400</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>{t('recentAlerts')}</CardTitle>
                <CardDescription>{t('importantNotificationsAboutYourProperties')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>{t('refinancingOpportunity')}</AlertTitle>
                    <AlertDescription className="text-sm">
                      {t('propertyEligibleRefinancing')}. 3.2% {t('potentialRate')}.
                    </AlertDescription>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      {t('viewDetails')}
                    </Button>
                  </Alert>
                  
                  <Alert>
                    <AlertTitle>{t('marketTrendAlert')}</AlertTitle>
                    <AlertDescription className="text-sm">
                      {t('interestRateChangeImpact')}. +0.25% {t('rateChange')}.
                    </AlertDescription>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      {t('analyzeImpact')}
                    </Button>
                  </Alert>
                </div>
              </CardContent>
            </Card>
            
            {/* Experience-based recommendations */}
            {preferences.experienceLevel === 'beginner' && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t('beginnerInvestorTips')}</CardTitle>
                  <CardDescription>{t('helpfulResourcesForBeginningInvestors')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('cashFlowCalculation')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('learnToCalculateRentalCashFlow')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('investmentBasics')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('understandFundamentalConcepts')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('mortgageCalculator')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('estimateYourMortgagePayments')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {preferences.experienceLevel === 'expert' && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>{t('advancedInvestorTools')}</CardTitle>
                  <CardDescription>{t('specializedToolsForExperiencedInvestors')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('taxOptimization')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('advancedTaxStrategies')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('investmentAnalysis')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('detailedInvestmentMetrics')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                      <span className="font-medium">{t('portfolioOptimization')}</span>
                      <span className="text-sm text-muted-foreground mt-1">{t('maximizeReturnsAcrossHoldings')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="space-y-6">
            <PropertyAnalyticsVisualizations />
          </div>
        </TabsContent>
        
        <TabsContent value="forecast">
          <div className="space-y-6">
            <MarketGrowthForecast />
          </div>
        </TabsContent>
        
        <TabsContent value="tests">
          <div className="space-y-6">
            <OnboardingTests />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
