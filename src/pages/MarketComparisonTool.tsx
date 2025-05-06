import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, BarChart3, Map, Building, TrendingUp, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { InvestmentMarket, useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type MarketMetric = {
  averagePrice: number;
  rentalYield: number;
  yearOverYearGrowth: number;
  averageRent: number;
  vacancy: number;
  investmentVolume: number;
  populationGrowth: number;
  constructionActivity: number;
};

const MarketComparisonTool: React.FC = () => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  
  const [primaryMarket, setPrimaryMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'germany'
  );
  const [comparisonMarket, setComparisonMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket === 'germany' ? 'austria' : 'germany'
  );
  const [comparisonView, setComparisonView] = useState<'data' | 'charts' | 'map' | 'trends'>('data');
  const [isLoading, setIsLoading] = useState(false);
  
  // Update the marketData to include uk and europe:
  const marketData: Record<InvestmentMarket, MarketMetric> = {
    germany: {
      averagePrice: 350000,
      rentalYield: 3.8,
      yearOverYearGrowth: 5.2,
      averageRent: 12.5,
      vacancy: 2.1,
      investmentVolume: 78000000000,
      populationGrowth: 0.3,
      constructionActivity: 306000
    },
    austria: {
      averagePrice: 320000,
      rentalYield: 3.5,
      yearOverYearGrowth: 4.8,
      averageRent: 10.2,
      vacancy: 3.2,
      investmentVolume: 12000000000,
      populationGrowth: 0.2,
      constructionActivity: 65000
    },
    switzerland: {
      averagePrice: 685000,
      rentalYield: 3.2,
      yearOverYearGrowth: 3.5,
      averageRent: 18.6,
      vacancy: 1.8,
      investmentVolume: 24000000000,
      populationGrowth: 0.7,
      constructionActivity: 53000
    },
    usa: {
      averagePrice: 428000,
      rentalYield: 4.2,
      yearOverYearGrowth: 6.5,
      averageRent: 16.8,
      vacancy: 5.6,
      investmentVolume: 632000000000,
      populationGrowth: 0.5,
      constructionActivity: 1450000
    },
    canada: {
      averagePrice: 520000,
      rentalYield: 3.9,
      yearOverYearGrowth: 5.8,
      averageRent: 14.5,
      vacancy: 3.0,
      investmentVolume: 95000000000,
      populationGrowth: 1.1,
      constructionActivity: 235000
    },
    global: {
      averagePrice: 380000,
      rentalYield: 4.0,
      yearOverYearGrowth: 5.5,
      averageRent: 14.0,
      vacancy: 4.0,
      investmentVolume: 970000000000,
      populationGrowth: 0.8,
      constructionActivity: 2000000
    },
    uk: {
      averagePrice: 310000,
      rentalYield: 4.1,
      yearOverYearGrowth: 2.8,
      averageRent: 15.3,
      vacancy: 2.3,
      investmentVolume: 55000000000,
      populationGrowth: 0.6,
      constructionActivity: 180000
    },
    europe: {
      averagePrice: 295000,
      rentalYield: 3.7,
      yearOverYearGrowth: 3.2,
      averageRent: 13.1,
      vacancy: 2.7,
      investmentVolume: 342000000000,
      populationGrowth: 0.4,
      constructionActivity: 1250000
    }
  };
  
  // Update the getLocalizedMarketName function to include uk and europe:
  const getLocalizedMarketName = (market: InvestmentMarket, lang: string): string => {
    const marketNames: Record<InvestmentMarket, Record<string, string>> = {
      germany: { de: 'Deutschland', en: 'Germany' },
      austria: { de: 'Österreich', en: 'Austria' },
      switzerland: { de: 'Schweiz', en: 'Switzerland' },
      usa: { de: 'USA', en: 'USA' },
      canada: { de: 'Kanada', en: 'Canada' },
      global: { de: 'Global', en: 'Global' },
      uk: { de: 'Vereinigtes Königreich', en: 'United Kingdom' },
      europe: { de: 'Europa', en: 'Europe' }
    };
    
    return marketNames[market]?.[lang] || market;
  };

  // Set loading state whenever market selection changes
  const handleMarketChange = (market: string, isPrimary: boolean) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (isPrimary) {
        setPrimaryMarket(market as InvestmentMarket);
        // If both markets would be the same, change the comparison market
        if (market === comparisonMarket) {
          const newComparisonMarket = market === 'germany' ? 'austria' : 'germany';
          setComparisonMarket(newComparisonMarket as InvestmentMarket);
        }
      } else {
        setComparisonMarket(market as InvestmentMarket);
      }
      setIsLoading(false);
      
      toast({
        title: language === 'de' 
          ? 'Marktvergleich aktualisiert' 
          : 'Market comparison updated',
        description: language === 'de'
          ? `Vergleiche ${getLocalizedMarketName(primaryMarket, language)} mit ${getLocalizedMarketName(market as InvestmentMarket, language)}`
          : `Comparing ${getLocalizedMarketName(primaryMarket, language)} with ${getLocalizedMarketName(market as InvestmentMarket, language)}`
      });
    }, 800);
  };

  // Calculate the difference between two metrics
  const getMetricDifference = (marketA: InvestmentMarket, marketB: InvestmentMarket, metric: keyof MarketMetric): number => {
    return (marketData[marketA]?.[metric] || 0) - (marketData[marketB]?.[metric] || 0);
  };

  // Calculate the percentage difference for display
  const getMetricPercentageDifference = (marketA: InvestmentMarket, marketB: InvestmentMarket, metric: keyof MarketMetric): string => {
    const valueA = marketData[marketA]?.[metric] || 0;
    const valueB = marketData[marketB]?.[metric] || 0;
    
    if (valueB === 0) return '0%';
    
    const diff = ((valueA - valueB) / valueB) * 100;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}%`;
  };

  // Format currency for display
  const formatCurrency = (value: number | string, currencySymbol: string = '€') => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return `${currencySymbol}0`;
    
    if (numValue >= 1000000000) {
      return `${currencySymbol}${(numValue / 1000000000).toFixed(1)}B`;
    } else if (numValue >= 1000000) {
      return `${currencySymbol}${(numValue / 1000000).toFixed(1)}M`;
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

  // Export comparison data
  const exportComparisonData = () => {
    const data = {
      date: new Date().toISOString(),
      primaryMarket,
      comparisonMarket,
      metrics: {
        primary: marketData[primaryMarket] || {},
        comparison: marketData[comparisonMarket] || {}
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `market-comparison-${primaryMarket}-vs-${comparisonMarket}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: language === 'de'
        ? 'Vergleichsdaten exportiert'
        : 'Comparison data exported'
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ArrowLeftRight className="h-6 w-6" />
        {language === 'de' ? 'Marktvergleichsassistent' : 'Market Comparison Assistant'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {language === 'de'
          ? 'Vergleichen Sie Immobilienmärkte anhand wichtiger Metriken mit Side-by-Side-Visualisierungen'
          : 'Compare real estate markets using key metrics with side-by-side visualizations'}
      </p>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
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
              <Select 
                value={primaryMarket} 
                onValueChange={(value) => handleMarketChange(value, true)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="germany">{getLocalizedMarketName('germany', language)}</SelectItem>
                  <SelectItem value="austria">{getLocalizedMarketName('austria', language)}</SelectItem>
                  <SelectItem value="switzerland">{getLocalizedMarketName('switzerland', language)}</SelectItem>
                  <SelectItem value="usa">{getLocalizedMarketName('usa', language)}</SelectItem>
                  <SelectItem value="canada">{getLocalizedMarketName('canada', language)}</SelectItem>
                  <SelectItem value="global">{getLocalizedMarketName('global', language)}</SelectItem>
                  <SelectItem value="uk">{getLocalizedMarketName('uk', language)}</SelectItem>
                  <SelectItem value="europe">{getLocalizedMarketName('europe', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'de' ? 'Vergleichsmarkt' : 'Comparison Market'}
              </label>
              <Select 
                value={comparisonMarket} 
                onValueChange={(value) => handleMarketChange(value, false)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="germany">{getLocalizedMarketName('germany', language)}</SelectItem>
                  <SelectItem value="austria">{getLocalizedMarketName('austria', language)}</SelectItem>
                  <SelectItem value="switzerland">{getLocalizedMarketName('switzerland', language)}</SelectItem>
                  <SelectItem value="usa">{getLocalizedMarketName('usa', language)}</SelectItem>
                  <SelectItem value="canada">{getLocalizedMarketName('canada', language)}</SelectItem>
                  <SelectItem value="global">{getLocalizedMarketName('global', language)}</SelectItem>
                  <SelectItem value="uk">{getLocalizedMarketName('uk', language)}</SelectItem>
                  <SelectItem value="europe">{getLocalizedMarketName('europe', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={comparisonView} onValueChange={(v) => setComparisonView(v as any)} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="data">
                <BarChart3 className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Daten' : 'Data'}
              </TabsTrigger>
              <TabsTrigger value="charts">
                <BarChart3 className="h-4 w-4 mr-2" />
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
                        <TableCell>{formatCurrency(marketData[primaryMarket]?.averagePrice || 0)}</TableCell>
                        <TableCell>{formatCurrency(marketData[comparisonMarket]?.averagePrice || 0)}</TableCell>
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
                        <TableCell>{marketData[primaryMarket]?.rentalYield || 0}%</TableCell>
                        <TableCell>{marketData[comparisonMarket]?.rentalYield || 0}%</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'rentalYield')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'rentalYield')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'rentalYield'))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{language === 'de' ? 'Jährliches Wachstum' : 'Year-over-Year Growth'}</TableCell>
                        <TableCell>{marketData[primaryMarket]?.yearOverYearGrowth || 0}%</TableCell>
                        <TableCell>{marketData[comparisonMarket]?.yearOverYearGrowth || 0}%</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'yearOverYearGrowth'))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{language === 'de' ? 'Durchschnittliche Miete' : 'Average Rent'}</TableCell>
                        <TableCell>{formatCurrency(marketData[primaryMarket]?.averageRent || 0)}/m²</TableCell>
                        <TableCell>{formatCurrency(marketData[comparisonMarket]?.averageRent || 0)}/m²</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'averageRent')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'averageRent')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'averageRent'))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{language === 'de' ? 'Leerstand' : 'Vacancy'}</TableCell>
                        <TableCell>{marketData[primaryMarket]?.vacancy || 0}%</TableCell>
                        <TableCell>{marketData[comparisonMarket]?.vacancy || 0}%</TableCell>
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
                        <TableCell>{formatCurrency(marketData[primaryMarket]?.investmentVolume || 0)}</TableCell>
                        <TableCell>{formatCurrency(marketData[comparisonMarket]?.investmentVolume || 0)}</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'investmentVolume')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'investmentVolume')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'investmentVolume'))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{language === 'de' ? 'Bevölkerungswachstum' : 'Population Growth'}</TableCell>
                        <TableCell>{marketData[primaryMarket]?.populationGrowth || 0}%</TableCell>
                        <TableCell>{marketData[comparisonMarket]?.populationGrowth || 0}%</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'populationGrowth')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'populationGrowth')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'populationGrowth'))}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{language === 'de' ? 'Bauaktivität' : 'Construction Activity'}</TableCell>
                        <TableCell>{marketData[primaryMarket]?.constructionActivity?.toLocaleString() || 0}</TableCell>
                        <TableCell>{marketData[comparisonMarket]?.constructionActivity?.toLocaleString() || 0}</TableCell>
                        <TableCell className={getTrendColorClass(
                          getMetricDifference(primaryMarket, comparisonMarket, 'constructionActivity')
                        )}>
                          {getMetricPercentageDifference(primaryMarket, comparisonMarket, 'constructionActivity')}
                          {getTrendIndicator(getMetricDifference(primaryMarket, comparisonMarket, 'constructionActivity'))}
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
    </div>
  );
};

export default MarketComparisonTool;
