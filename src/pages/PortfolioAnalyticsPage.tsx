
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  PieChart, 
  LineChart,
  TrendingUp,
  Download,
  Filter,
  Building,
  Calendar
} from 'lucide-react';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import { useMarketFilter } from '@/hooks/use-market-filter';

// Fehlende MarketExplorerPage erstellen
const PortfolioAnalyticsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '1y' | 'all'>('1y');
  
  // Hier ist die Korrektur - Nur ein Argument übergeben
  const { userMarket } = useMarketFilter();
  const marketName = userMarket ? useMarketFilter().getMarketDisplayName() : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6" />
            {language === 'de' ? 'Portfolio-Analyse' : 'Portfolio Analytics'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Detaillierte Einblicke in Ihr Immobilienportfolio' 
              : 'Detailed insights into your real estate portfolio'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Filter' : 'Filter'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Exportieren' : 'Export'}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Button
          variant={timeframe === '3m' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('3m')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'de' ? '3 Monate' : '3 Months'}
        </Button>
        <Button
          variant={timeframe === '6m' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('6m')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'de' ? '6 Monate' : '6 Months'}
        </Button>
        <Button
          variant={timeframe === '1y' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('1y')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'de' ? '1 Jahr' : '1 Year'}
        </Button>
        <Button
          variant={timeframe === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeframe('all')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Alle' : 'All'}
        </Button>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Performance' : 'Performance'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Trends' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <PieChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Allokation' : 'Allocation'}
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Prognose' : 'Forecast'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Immobilienperformance' : 'Property Performance'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Vergleichen Sie die Performance Ihrer Immobilien' 
                    : 'Compare the performance of your properties'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PortfolioAnalytics />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Regionale Verteilung' : 'Regional Distribution'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Verteilung Ihres Portfolios nach Regionen' 
                    : 'Distribution of your portfolio by region'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Building className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Regionale Analyse' : 'Regional Analysis'}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-md mb-4">
                    {language === 'de' 
                      ? 'Detaillierte regionale Daten werden geladen...' 
                      : 'Detailed regional data is loading...'}
                  </p>
                  <Button variant="outline">
                    {language === 'de' ? 'Daten aktualisieren' : 'Update Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Wertentwicklung im Zeitverlauf' : 'Value Development Over Time'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Entwicklung Ihres Portfoliowerts im Zeitverlauf' 
                  : 'Development of your portfolio value over time'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Trendanalyse' : 'Trend Analysis'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  {language === 'de' 
                    ? 'Detaillierte Trend-Daten werden geladen...' 
                    : 'Detailed trend data is loading...'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Daten aktualisieren' : 'Update Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Asset-Allokation' : 'Asset Allocation'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Verteilung Ihres Portfolios nach Immobilientypen' 
                  : 'Distribution of your portfolio by property types'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Allokationsanalyse' : 'Allocation Analysis'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  {language === 'de' 
                    ? 'Detaillierte Allokations-Daten werden geladen...' 
                    : 'Detailed allocation data is loading...'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Daten aktualisieren' : 'Update Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Portfolio-Prognose' : 'Portfolio Forecast'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Prognose der zukünftigen Wertentwicklung' 
                  : 'Forecast of future value development'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Zukunftsprognose' : 'Future Forecast'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  {language === 'de' 
                    ? 'Detaillierte Prognose-Daten werden geladen...' 
                    : 'Detailed forecast data is loading...'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Daten aktualisieren' : 'Update Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioAnalyticsPage;
