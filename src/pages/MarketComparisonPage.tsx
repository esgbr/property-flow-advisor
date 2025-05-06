
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeftRight, BarChart3, ChartBar, Building, MapPin, LineChart, TrendingUp } from 'lucide-react';
import MarketComparisonAssistant from '@/components/market/MarketComparisonAssistant';
import MarketComparisonDashboard from '@/components/market/MarketComparisonDashboard';
import MarketTrendsComparison from '@/components/market/MarketTrendsComparison';
import RegionalRentalTrendForecast from '@/components/market/RegionalRentalTrendForecast';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { Button } from '@/components/ui/button';

const MarketComparisonPage: React.FC = () => {
  const { language } = useLanguage();
  const { currentMarket, getCurrentMarketLocalizedName } = useEnhancedMarket();
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {language === 'de' ? 'Marktvergleich & Analyse' : 'Market Comparison & Analysis'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de'
            ? `Vergleichen und analysieren Sie Immobilienmärkte, um bessere Investitionsentscheidungen zu treffen. Aktueller Markt: ${getCurrentMarketLocalizedName()}`
            : `Compare and analyze real estate markets to make better investment decisions. Current market: ${getCurrentMarketLocalizedName()}`}
        </p>
      </div>
      
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="comparison">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
          </TabsTrigger>
          <TabsTrigger value="assistant">
            <BarChart3 className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Vergleichsassistent' : 'Comparison Assistant'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Trendanalyse' : 'Trend Analysis'}
          </TabsTrigger>
          <TabsTrigger value="rental">
            <TrendingUp className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Mietpreisentwicklung' : 'Rental Trends'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison">
          <div className="grid gap-6">
            <MarketComparisonDashboard />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {language === 'de' ? 'Regionale Marktstärke' : 'Regional Market Strength'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Heatmap der relativen Marktstärke nach Region'
                    : 'Heatmap of relative market strength by region'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="text-center">
                  <Building className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Regionale Marktdaten' : 'Regional Market Data'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {language === 'de'
                      ? 'Detaillierte regionale Marktdaten werden hier visualisiert'
                      : 'Detailed regional market data will be visualized here'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="assistant">
          <MarketComparisonAssistant />
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="grid gap-6">
            <MarketTrendsComparison />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === 'de' ? 'Miettrendprognose' : 'Rental Trend Forecast'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Prognose der Mietpreisentwicklung für die kommenden Jahre'
                    : 'Forecast of rental price development for the coming years'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="text-center">
                  <ChartBar className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Prognosedaten' : 'Forecast Data'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {language === 'de'
                      ? 'Detaillierte Mietpreisentwicklungsprognosen werden hier angezeigt'
                      : 'Detailed rental price development forecasts will be displayed here'}
                  </p>
                  <Button variant="secondary">
                    {language === 'de' ? 'Weitere Analysen anfordern' : 'Request More Analysis'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="rental">
          <div className="grid gap-6">
            <RegionalRentalTrendForecast />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketComparisonPage;
