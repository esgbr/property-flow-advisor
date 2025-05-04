
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  Building, 
  Calculator, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Search, 
  LineChart,
  Home,
  BarChart,
  Clock,
  Percent,
  AlertCircle
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Separator } from '@/components/ui/separator';
import MarketMetricsGrid from '@/components/analysis/MarketMetricsGrid';
import MarketChart from '@/components/analysis/MarketChart';
import RentalYieldMap from '@/components/analysis/RentalYieldMap';
import MarketTrends from '@/components/analysis/MarketTrends';
import MacroEconomicIndicators from '@/components/analysis/MacroEconomicIndicators';
import NeighborhoodScorecard from '@/components/analysis/NeighborhoodScorecard';
import MarketOpportunitiesTable from '@/components/analysis/MarketOpportunitiesTable';

const MarketAnalysisDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleDataRequest = (dataType: string) => {
    toast({
      title: t('dataRequestSent'),
      description: `${t('requestingData')} ${dataType}`,
    });
  };

  const marketName = getMarketDisplayName();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <BarChart3 className="inline-block mr-2 h-8 w-8" />
            {marketName} {t('marketAnalysis')}
          </h1>
          <p className="text-muted-foreground">{t('comprehensiveMarketDataAnalytics')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDataRequest(t('latestData'))}>
            <Clock className="mr-2 h-4 w-4" />
            {t('refreshData')}
          </Button>
          <Button>
            <BarChart className="mr-2 h-4 w-4" />
            {t('exportReport')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('trends')}
          </TabsTrigger>
          <TabsTrigger value="locations">
            <MapPin className="mr-2 h-4 w-4" />
            {t('locations')}
          </TabsTrigger>
          <TabsTrigger value="macro">
            <DollarSign className="mr-2 h-4 w-4" />
            {t('macroEconomics')}
          </TabsTrigger>
          <TabsTrigger value="opportunities">
            <Building className="mr-2 h-4 w-4" />
            {t('opportunities')}
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <LineChart className="mr-2 h-4 w-4" />
            {t('forecast')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MarketMetricsGrid />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('keyMarketTrends')}</CardTitle>
              <CardDescription>{t('marketPerformanceOverTime')}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <MarketChart />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Home className="inline-block mr-2 h-5 w-5" />
                  {t('housingMarket')}
                </CardTitle>
                <CardDescription>{t('housingMarketMetrics')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">{t('medianHomePrice')}</p>
                    <p className="text-2xl font-bold">€395,000</p>
                    <p className="text-xs text-green-500">+3.2% {t('yearOverYear')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('averageDOM')}</p>
                    <p className="text-2xl font-bold">42 {t('days')}</p>
                    <p className="text-xs text-red-500">+5 {t('daysFromLastMonth')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('marketInventory')}</p>
                    <p className="text-2xl font-bold">1,243</p>
                    <p className="text-xs text-green-500">+8.3% {t('monthOverMonth')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('salesVolumeIndex')}</p>
                    <p className="text-2xl font-bold">86.2</p>
                    <p className="text-xs text-red-500">-2.1% {t('yearOverYear')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Building className="inline-block mr-2 h-5 w-5" />
                  {t('investmentMetrics')}
                </CardTitle>
                <CardDescription>{t('rentalAndInvestmentIndicators')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">{t('averageCapRate')}</p>
                    <p className="text-2xl font-bold">5.8%</p>
                    <p className="text-xs text-amber-500">-0.3% {t('yearOverYear')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('rentalYield')}</p>
                    <p className="text-2xl font-bold">6.2%</p>
                    <p className="text-xs text-green-500">+0.1% {t('yearOverYear')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('priceToRentRatio')}</p>
                    <p className="text-2xl font-bold">17.5</p>
                    <p className="text-xs text-amber-500">{t('moderate')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('occupancyRate')}</p>
                    <p className="text-2xl font-bold">96.3%</p>
                    <p className="text-xs text-green-500">+1.4% {t('yearOverYear')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('alertsAndNotifications')}</CardTitle>
              <CardDescription>{t('importantMarketChanges')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">{t('interestRateAlert')}</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>{t('interestRateChangeWarning')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">{t('developmentOpportunity')}</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{t('newDevelopmentZoneApproved')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {t('viewAllAlerts')} (6)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <MarketTrends />
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{t('rentalYieldHeatmap')}</CardTitle>
              <CardDescription>{t('rentalYieldsAcrossNeighborhoods')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] relative">
              <RentalYieldMap />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <NeighborhoodScorecard />
          </div>
        </TabsContent>

        {/* Macro Tab */}
        <TabsContent value="macro" className="space-y-6">
          <MacroEconomicIndicators />
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <MarketOpportunitiesTable />
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('marketForecast')}</CardTitle>
              <CardDescription>{t('predictedMarketChanges')}</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <LineChart className="h-12 w-12 mx-auto text-blue-500" />
                  <h3 className="font-semibold text-lg">{t('forecastModels')}</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {t('forecastModelsDescription')}
                  </p>
                  <Button>
                    {t('loadForecastData')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysisDashboard;
