import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketComparison } from '@/hooks/use-market-comparison';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketComparisonTool: React.FC = () => {
  const { language, t } = useLanguage();
  const {
    comparisonMetrics,
    isLoading,
    selectedMarkets,
    addMarketToComparison,
    removeMarketFromComparison,
    getAvailableRecommendedMarkets
  } = useMarketComparison();
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'averagePrice', 'rentalYield', 'yearOverYearGrowth'
  ]);
  
  // Format value based on metric type
  const formatValue = (value: any, metric: string): string => {
    if (value === undefined) return '-';
    
    if (typeof value === 'number') {
      if (metric === 'averagePrice' || metric === 'constructionCosts' || metric === 'averageRent') {
        return `€${value.toLocaleString()}`;
      }
      if (metric === 'rentalYield' || metric === 'yearOverYearGrowth' || 
          metric === 'propertyTax' || metric === 'returnOnInvestment' || metric === 'vacancy') {
        return `${value}%`;
      }
    }
    
    return `${value}`;
  };
  
  // Get metric name localized
  const getMetricName = (metric: string): string => {
    const metricNames: Record<string, Record<string, string>> = {
      'averagePrice': { en: 'Average Price', de: 'Durchschnittspreis' },
      'rentalYield': { en: 'Rental Yield', de: 'Mietrendite' },
      'yearOverYearGrowth': { en: 'YoY Growth', de: 'Jährliches Wachstum' },
      'averageRent': { en: 'Average Rent', de: 'Durchschnittsmiete' },
      'vacancy': { en: 'Vacancy Rate', de: 'Leerstandsrate' },
      'constructionCosts': { en: 'Construction Costs', de: 'Baukosten' },
      'propertyTax': { en: 'Property Tax', de: 'Grundsteuer' },
      'investmentVolume': { en: 'Investment Volume', de: 'Investitionsvolumen' },
      'returnOnInvestment': { en: 'ROI', de: 'Kapitalrendite' },
      'marketLiquidity': { en: 'Market Liquidity', de: 'Marktliquidität' }
    };
    
    return metricNames[metric]?.[language === 'de' ? 'de' : 'en'] || metric;
  };
  
  // Handle metric selection
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };
  
  // Get value trend class
  const getTrendClass = (metric: string, value: number): string => {
    // For metrics where higher is better
    if (['rentalYield', 'yearOverYearGrowth', 'returnOnInvestment', 'marketLiquidity'].includes(metric)) {
      return value > 0 ? 'text-green-500' : 'text-red-500';
    }
    
    // For metrics where lower is better
    if (['vacancy', 'constructionCosts', 'propertyTax'].includes(metric)) {
      return value < 0 ? 'text-green-500' : 'text-red-500';
    }
    
    // Neutral metrics
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };
  
  // Available metrics for selection
  const availableMetrics = [
    'averagePrice', 'rentalYield', 'yearOverYearGrowth', 'averageRent', 
    'vacancy', 'constructionCosts', 'propertyTax', 'returnOnInvestment', 'marketLiquidity'
  ];
  
  // Recommended markets that can be added
  const recommendedMarkets = getAvailableRecommendedMarkets();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'de' ? 'Marktvergleich' : 'Market Comparison'}</CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Vergleichen Sie verschiedene Immobilienmärkte auf einen Blick'
            : 'Compare different real estate markets at a glance'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compare">
          <TabsList className="mb-4">
            <TabsTrigger value="compare">
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Vergleich' : 'Comparison'}
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Building className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Kennzahlen' : 'Metrics'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="compare">
            <div className="space-y-6">
              {/* Selected Markets */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Ausgewählte Märkte' : 'Selected Markets'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMarkets.map((market) => (
                    <Badge 
                      key={market}
                      className="flex items-center gap-1 cursor-pointer hover:bg-destructive/90"
                      onClick={() => removeMarketFromComparison(market)}
                    >
                      {market.charAt(0).toUpperCase() + market.slice(1)}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 ml-1"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Recommended Markets */}
              {recommendedMarkets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {language === 'de' ? 'Empfohlene Märkte hinzufügen' : 'Add Recommended Markets'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendedMarkets.map((market) => (
                      <Button 
                        key={market.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addMarketToComparison(market.id as InvestmentMarket)}
                        className="text-xs"
                      >
                        + {market.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Other Markets */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Markt hinzufügen' : 'Add Market'}
                </h3>
                <Select onValueChange={(value) => addMarketToComparison(value as InvestmentMarket)}>
                  <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="austria">Austria</SelectItem>
                    <SelectItem value="switzerland">Switzerland</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Kennzahl' : 'Metric'}
                      </th>
                      {selectedMarkets.map((market) => (
                        <th key={market} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {market.charAt(0).toUpperCase() + market.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {selectedMetrics.map((metric) => (
                      <tr key={metric} className="hover:bg-muted/50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {getMetricName(metric)}
                        </td>
                        {selectedMarkets.map((market) => (
                          <td key={`${market}-${metric}`} className="px-4 py-3 whitespace-nowrap text-sm">
                            {isLoading ? (
                              <Skeleton className="h-4 w-20" />
                            ) : comparisonMetrics[market] ? (
                              formatValue(comparisonMetrics[market][metric], metric)
                            ) : (
                              '-'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics">
            <div className="space-y-6">
              <h3 className="text-sm font-medium mb-2">
                {language === 'de' ? 'Kennzahlen auswählen' : 'Select Metrics'}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map((metric) => (
                  <Badge 
                    key={metric}
                    variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleMetric(metric)}
                  >
                    {getMetricName(metric)}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Kennzahlen-Erklärungen' : 'Metric Explanations'}
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded p-3">
                    <h4 className="font-medium mb-1">{getMetricName('rentalYield')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Jährliche Mieteinnahmen als Prozentsatz des Immobilienwerts'
                        : 'Annual rental income as a percentage of property value'}
                    </p>
                  </div>
                  
                  <div className="border rounded p-3">
                    <h4 className="font-medium mb-1">{getMetricName('yearOverYearGrowth')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Prozentuale Veränderung der Immobilienpreise im Vergleich zum Vorjahr'
                        : 'Percentage change in property prices compared to the previous year'}
                    </p>
                  </div>
                  
                  <div className="border rounded p-3">
                    <h4 className="font-medium mb-1">{getMetricName('vacancy')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Prozentsatz der leerstehenden Mietobjekte im Markt'
                        : 'Percentage of rental properties that are vacant in the market'}
                    </p>
                  </div>
                  
                  <div className="border rounded p-3">
                    <h4 className="font-medium mb-1">{getMetricName('marketLiquidity')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'de'
                        ? 'Bewertung der Leichtigkeit, mit der Immobilien gekauft und verkauft werden können'
                        : 'Rating of how easily properties can be bought and sold'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketComparisonTool;
