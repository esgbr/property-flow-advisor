
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { ArrowLeftRight, BarChart3, Map, LineChart, Building, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import ImprovedMarketSelector from './ImprovedMarketSelector';
import { useMarketComparison } from '@/hooks/use-market-comparison';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { getLocalizedMarketName } from '@/utils/marketHelpers';
import { toast } from 'sonner';

/**
 * Advanced market comparison dashboard with side-by-side visualizations
 */
const MarketComparisonDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const [primaryMarket, setPrimaryMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'germany'
  );
  const [comparisonMarket, setComparisonMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket === 'germany' ? 'austria' : 'germany'
  );
  const [comparisonView, setComparisonView] = useState<'data' | 'charts' | 'map' | 'trends'>('data');
  
  const {
    comparisonMetrics,
    isLoading,
    getMetricDifference,
    getMetricPercentageDifference
  } = useMarketComparison();

  // Handle market change
  const handleMarketChange = (market: InvestmentMarket, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryMarket(market);
      // If both markets would be the same, change the comparison market
      if (market === comparisonMarket) {
        const newComparisonMarket = market === 'germany' ? 'austria' : 'germany';
        setComparisonMarket(newComparisonMarket);
      }
    } else {
      setComparisonMarket(market);
    }

    toast.success(
      language === 'de' 
        ? 'Marktvergleich aktualisiert' 
        : 'Market comparison updated',
      {
        description: language === 'de'
          ? `Vergleiche ${getLocalizedMarketName(primaryMarket, language)} mit ${getLocalizedMarketName(market, language)}`
          : `Comparing ${getLocalizedMarketName(primaryMarket, language)} with ${getLocalizedMarketName(market, language)}`
      }
    );
  };

  // Export comparison data
  const exportComparisonData = () => {
    const data = {
      date: new Date().toISOString(),
      primaryMarket,
      comparisonMarket,
      metrics: {
        primary: comparisonMetrics[primaryMarket] || {},
        comparison: comparisonMetrics[comparisonMarket] || {}
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `market-comparison-${primaryMarket}-vs-${comparisonMarket}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success(
      language === 'de'
        ? 'Vergleichsdaten exportiert'
        : 'Comparison data exported'
    );
  };

  // Format currency for display
  const formatCurrency = (value: number | string, currencySymbol: string = '€') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return `${currencySymbol}0`;
    
    if (numValue >= 1000000) {
      return `${currencySymbol}${(numValue / 1000000).toFixed(2)}M`;
    } else if (numValue >= 1000) {
      return `${currencySymbol}${(numValue / 1000).toFixed(1)}K`;
    }
    
    return `${currencySymbol}${numValue.toFixed(0)}`;
  };

  // Get trend indicator based on difference value
  const getTrendIndicator = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (diff < 0) return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    return null;
  };

  // Determine trend color class based on value and metric type
  const getTrendColorClass = (diff: number, isPositiveBetter: boolean = true) => {
    if (diff === 0) return 'text-gray-500';
    
    const isPositive = diff > 0;
    const isGood = (isPositiveBetter && isPositive) || (!isPositiveBetter && !isPositive);
    
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const isDataAvailable = comparisonMetrics[primaryMarket] && comparisonMetrics[comparisonMarket];

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          {language === 'de' ? 'Marktvergleichsassistent' : 'Market Comparison Assistant'}
        </CardTitle>
        <CardDescription>
          {language === 'de'
            ? 'Vergleichen Sie Immobilienmärkte anhand wichtiger Metriken'
            : 'Compare real estate markets using key metrics'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Primärer Markt' : 'Primary Market'}
            </label>
            <ImprovedMarketSelector 
              onMarketChange={(market) => handleMarketChange(market, true)} 
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Vergleichsmarkt' : 'Comparison Market'}
            </label>
            <ImprovedMarketSelector 
              onMarketChange={(market) => handleMarketChange(market, false)} 
              className="w-full"
            />
          </div>
        </div>

        <Tabs value={comparisonView} onValueChange={(v) => setComparisonView(v as any)} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="data">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Daten' : 'Data'}
            </TabsTrigger>
            <TabsTrigger value="charts">
              <LineChart className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Diagramme' : 'Charts'}
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Karte' : 'Map'}
            </TabsTrigger>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Trends' : 'Trends'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-full max-w-md">
                  <Progress value={75} className="w-full h-2" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {language === 'de' ? 'Lade Marktdaten...' : 'Loading market data...'}
                </p>
              </div>
            ) : !isDataAvailable ? (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
                <p className="text-center">
                  {language === 'de'
                    ? 'Keine Daten verfügbar. Bitte wählen Sie einen anderen Markt.'
                    : 'No data available. Please select different markets.'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {language === 'de' ? 'Marktmetriken' : 'Market Metrics'}
                  </h3>
                  <Button size="sm" onClick={exportComparisonData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Exportieren' : 'Export'}
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'de' ? 'Metrik' : 'Metric'}</TableHead>
                      <TableHead>{getLocalizedMarketName(primaryMarket, language)}</TableHead>
                      <TableHead>{getLocalizedMarketName(comparisonMarket, language)}</TableHead>
                      <TableHead>{language === 'de' ? 'Unterschied' : 'Difference'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Durchschnittspreis' : 'Average Price'}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[primaryMarket]?.averagePrice || 0)}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[comparisonMarket]?.averagePrice || 0)}</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'averagePrice'),
                        false
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'averagePrice')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'averagePrice'))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Mietrendite' : 'Rental Yield'}</TableCell>
                      <TableCell>{comparisonMetrics[primaryMarket]?.rentalYield || 0}%</TableCell>
                      <TableCell>{comparisonMetrics[comparisonMarket]?.rentalYield || 0}%</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'rentalYield')
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'rentalYield')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'rentalYield'))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Jährliches Wachstum' : 'Year-over-Year Growth'}</TableCell>
                      <TableCell>{comparisonMetrics[primaryMarket]?.yearOverYearGrowth || 0}%</TableCell>
                      <TableCell>{comparisonMetrics[comparisonMarket]?.yearOverYearGrowth || 0}%</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth')
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth'))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Durchschnittliche Miete' : 'Average Rent'}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[primaryMarket]?.averageRent || 0)}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[comparisonMarket]?.averageRent || 0)}</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'averageRent')
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'averageRent')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'averageRent'))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Leerstand' : 'Vacancy'}</TableCell>
                      <TableCell>{comparisonMetrics[primaryMarket]?.vacancy || 0}%</TableCell>
                      <TableCell>{comparisonMetrics[comparisonMarket]?.vacancy || 0}%</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'vacancy'),
                        false
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'vacancy')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'vacancy'))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{language === 'de' ? 'Investitionsvolumen' : 'Investment Volume'}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[primaryMarket]?.investmentVolume || 0)}</TableCell>
                      <TableCell>{formatCurrency(comparisonMetrics[comparisonMarket]?.investmentVolume || 0)}</TableCell>
                      <TableCell className={getTrendColorClass(
                        getMetricDifference(primaryMarket, comparisonMarket, 'investmentVolume')
                      )}>
                        {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'investmentVolume')}
                        {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'investmentVolume'))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </>
            )}
          </TabsContent>

          <TabsContent value="charts">
            <div className="flex flex-col items-center justify-center py-10">
              <Building className="h-10 w-10 text-primary mb-2" />
              <p className="text-center">
                {language === 'de'
                  ? 'Marktvergleichsdiagramme werden geladen...'
                  : 'Market comparison charts are loading...'}
              </p>
              <Button className="mt-4" variant="outline" onClick={() => setComparisonView('data')}>
                {language === 'de' ? 'Daten anzeigen' : 'View Data'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <div className="flex flex-col items-center justify-center py-10">
              <Map className="h-10 w-10 text-primary mb-2" />
              <p className="text-center">
                {language === 'de'
                  ? 'Kartenansicht wird vorbereitet...'
                  : 'Map view is being prepared...'}
              </p>
              <Button className="mt-4" variant="outline" onClick={() => setComparisonView('data')}>
                {language === 'de' ? 'Daten anzeigen' : 'View Data'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="flex flex-col items-center justify-center py-10">
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <p className="text-center">
                {language === 'de'
                  ? 'Markttrends werden analysiert...'
                  : 'Market trends are being analyzed...'}
              </p>
              <Button className="mt-4" variant="outline" onClick={() => setComparisonView('data')}>
                {language === 'de' ? 'Daten anzeigen' : 'View Data'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketComparisonDashboard;
