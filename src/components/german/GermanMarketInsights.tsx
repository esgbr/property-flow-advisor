
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, Building, Check, Euro, FileText, Info, MapPin, TrendingDown, TrendingUp } from 'lucide-react';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { GermanRealEstateTermTooltip } from '../language/GermanLanguageSupport';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface MarketMetric {
  name: string;
  germanName: string;
  value: string | number;
  change: number;
  interpretation: string;
  germanInterpretation: string;
}

interface MarketRegionData {
  region: string;
  pricePerSqm: number;
  yearlyChange: number;
  rentalYield: number;
  demandLevel: 'high' | 'medium' | 'low';
  supplyLevel: 'high' | 'medium' | 'low';
  investorInterest: 'rising' | 'stable' | 'declining';
}

const GermanMarketInsights: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentMarket, trackMarketVisit } = useEnhancedMarket();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isGerman = currentMarket === 'germany';
  
  // Track the visit to German market insights
  useEffect(() => {
    if (isGerman) {
      trackMarketVisit('germany');
    }
  }, [isGerman, trackMarketVisit]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Key German market metrics
  const marketMetrics: MarketMetric[] = [
    {
      name: 'Average Property Price (per sqm)',
      germanName: 'Durchschnittlicher Immobilienpreis (pro qm)',
      value: '€4,320',
      change: 3.2,
      interpretation: 'Prices continue to rise but at a slower pace than previous years',
      germanInterpretation: 'Preise steigen weiter, aber langsamer als in den Vorjahren'
    },
    {
      name: 'Rental Yield',
      germanName: 'Mietrendite',
      value: '3.8%',
      change: -0.4,
      interpretation: 'Yields are slightly decreasing due to rising purchase prices',
      germanInterpretation: 'Renditen sinken leicht aufgrund steigender Kaufpreise'
    },
    {
      name: 'Mortgage Interest Rate (10 Year Fixed)',
      germanName: 'Hypothekenzins (10 Jahre Festzins)',
      value: '3.42%',
      change: 0.15,
      interpretation: 'Interest rates are stabilizing after recent increases',
      germanInterpretation: 'Zinsen stabilisieren sich nach den jüngsten Anstiegen'
    },
    {
      name: 'New Construction (YoY)',
      germanName: 'Neubau (im Jahresvergleich)',
      value: '-9.8%',
      change: -9.8,
      interpretation: 'Construction activity has decreased significantly',
      germanInterpretation: 'Bautätigkeit ist deutlich zurückgegangen'
    },
    {
      name: 'Vacancy Rate',
      germanName: 'Leerstandsquote',
      value: '1.9%',
      change: -0.2,
      interpretation: 'Housing shortage continues in metropolitan areas',
      germanInterpretation: 'Wohnungsmangel in Ballungsgebieten dauert an'
    }
  ];
  
  // German regional market data
  const regionalData: MarketRegionData[] = [
    {
      region: 'Berlin',
      pricePerSqm: 5420,
      yearlyChange: 2.8,
      rentalYield: 3.2,
      demandLevel: 'high',
      supplyLevel: 'low',
      investorInterest: 'stable'
    },
    {
      region: 'Munich',
      pricePerSqm: 9750,
      yearlyChange: 1.5,
      rentalYield: 2.8,
      demandLevel: 'high',
      supplyLevel: 'low',
      investorInterest: 'stable'
    },
    {
      region: 'Frankfurt',
      pricePerSqm: 6180,
      yearlyChange: 2.2,
      rentalYield: 3.5,
      demandLevel: 'high',
      supplyLevel: 'medium',
      investorInterest: 'rising'
    },
    {
      region: 'Hamburg',
      pricePerSqm: 5850,
      yearlyChange: 3.1,
      rentalYield: 3.4,
      demandLevel: 'high',
      supplyLevel: 'low',
      investorInterest: 'rising'
    },
    {
      region: 'Cologne',
      pricePerSqm: 4980,
      yearlyChange: 3.4,
      rentalYield: 3.7,
      demandLevel: 'high',
      supplyLevel: 'low',
      investorInterest: 'rising'
    },
    {
      region: 'Dresden',
      pricePerSqm: 3450,
      yearlyChange: 4.2,
      rentalYield: 4.3,
      demandLevel: 'medium',
      supplyLevel: 'medium',
      investorInterest: 'rising'
    },
    {
      region: 'Leipzig',
      pricePerSqm: 3120,
      yearlyChange: 5.1,
      rentalYield: 4.5,
      demandLevel: 'medium',
      supplyLevel: 'medium',
      investorInterest: 'rising'
    }
  ];
  
  // German market regulations
  const regulations = [
    {
      name: language === 'de' ? 'Mietpreisbremse' : 'Rent Control',
      description: language === 'de' 
        ? 'Begrenzung von Mieterhöhungen in angespannten Wohnungsmärkten'
        : 'Limitation of rent increases in tight housing markets',
      impact: language === 'de' ? 'Mittel' : 'Medium',
      cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne']
    },
    {
      name: language === 'de' ? 'Grunderwerbsteuer' : 'Real Estate Transfer Tax',
      description: language === 'de' 
        ? 'Steuern beim Immobilienkauf, je nach Bundesland zwischen 3,5% und 6,5%'
        : 'Property purchase taxes ranging from 3.5% to 6.5% depending on the federal state',
      impact: language === 'de' ? 'Hoch' : 'High',
      cities: ['All regions']
    },
    {
      name: language === 'de' ? 'Modernisierungsumlage' : 'Modernization Allocation',
      description: language === 'de' 
        ? 'Vermieter können 8% der Modernisierungskosten auf die Jahresmiete umlegen'
        : 'Landlords can pass on 8% of modernization costs to annual rent',
      impact: language === 'de' ? 'Mittel' : 'Medium',
      cities: ['All regions']
    },
    {
      name: language === 'de' ? 'Milieuschutz' : 'Neighborhood Protection',
      description: language === 'de' 
        ? 'Einschränkungen für Luxussanierungen in bestimmten Gebieten'
        : 'Restrictions on luxury renovations in certain areas',
      impact: language === 'de' ? 'Mittel bis Hoch' : 'Medium to High',
      cities: ['Berlin', 'Munich', 'Hamburg']
    }
  ];
  
  // Handle export report
  const handleExportReport = () => {
    toast({
      title: language === 'de' ? 'Bericht wird exportiert' : 'Exporting report',
      description: language === 'de' 
        ? 'Der Marktbericht wird als PDF vorbereitet' 
        : 'The market report is being prepared as PDF'
    });
  };
  
  if (!isGerman) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('marketInsights')}</CardTitle>
          <CardDescription>{t('detailedMarketAnalysis')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {language === 'de' 
                ? 'Deutscher Marktbericht nicht verfügbar' 
                : 'German Market Report Not Available'}
            </AlertTitle>
            <AlertDescription>
              {language === 'de'
                ? `Bitte wählen Sie den deutschen Markt aus, um diesen Bericht zu sehen.`
                : `Please select the German market to view this report.`}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{language === 'de' ? 'Deutscher Marktbericht' : 'German Market Report'}</CardTitle>
          <CardDescription>{language === 'de' ? 'Wird geladen...' : 'Loading...'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{language === 'de' ? 'Deutscher Immobilienmarkt' : 'German Real Estate Market'}</CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Aktuelle Erkenntnisse und Trends im deutschen Immobilienmarkt' 
              : 'Current insights and trends in the German real estate market'}
          </CardDescription>
        </div>
        <Badge variant="outline" className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Q2 2025
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <Info className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="regions">
              <MapPin className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Regionen' : 'Regions'}
            </TabsTrigger>
            <TabsTrigger value="regulations">
              <FileText className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Vorschriften' : 'Regulations'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>
                {language === 'de' ? 'Marktübersicht' : 'Market Overview'}
              </AlertTitle>
              <AlertDescription>
                {language === 'de'
                  ? 'Der deutsche Immobilienmarkt zeigt Anzeichen einer Stabilisierung nach der Anpassungsphase der letzten 18 Monate. Höhere Zinssätze haben das Kaufvolumen gedämpft, aber die Nachfrage bleibt in Hauptballungsgebieten stark.'
                  : 'The German real estate market is showing signs of stabilization after the adjustment period of the last 18 months. Higher interest rates have dampened purchase volume, but demand remains strong in major metropolitan areas.'}
              </AlertDescription>
            </Alert>
          
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {language === 'de' ? 'Wichtige Kennzahlen' : 'Key Metrics'}
              </h3>
              
              {marketMetrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      {language === 'de' ? metric.germanName : metric.name}
                    </h4>
                    <span className="text-lg font-semibold">{metric.value}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className={`flex items-center text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change > 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {language === 'de' ? metric.germanInterpretation : metric.interpretation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleExportReport}>
                <FileText className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Bericht exportieren' : 'Export Report'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="regions" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {language === 'de' ? 'Regionale Märkte' : 'Regional Markets'}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Region' : 'Region'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Preis/m²' : 'Price/sqm'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Jährl. Änderung' : 'Yearly Change'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Mietrendite' : 'Rental Yield'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Nachfrage' : 'Demand'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {language === 'de' ? 'Angebot' : 'Supply'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {regionalData.map((region, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {region.region}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          €{region.pricePerSqm.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={region.yearlyChange > 0 ? 'text-green-500' : 'text-red-500'}>
                            {region.yearlyChange > 0 ? '+' : ''}{region.yearlyChange}%
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {region.rentalYield}%
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Badge variant={
                            region.demandLevel === 'high' ? 'default' : 
                            region.demandLevel === 'medium' ? 'secondary' : 'outline'
                          }>
                            {language === 'de' ? 
                              (region.demandLevel === 'high' ? 'Hoch' : 
                               region.demandLevel === 'medium' ? 'Mittel' : 'Niedrig') : 
                              region.demandLevel}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <Badge variant={
                            region.supplyLevel === 'high' ? 'default' : 
                            region.supplyLevel === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {language === 'de' ? 
                              (region.supplyLevel === 'high' ? 'Hoch' : 
                               region.supplyLevel === 'medium' ? 'Mittel' : 'Niedrig') : 
                              region.supplyLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <Alert className="bg-muted">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>
                {language === 'de' ? 'Markttrend beachten' : 'Market Trend Note'}
              </AlertTitle>
              <AlertDescription>
                {language === 'de'
                  ? 'Sekundärstädte wie Dresden und Leipzig zeigen höhere Wachstumsraten als etablierte Metropolen, was auf sich verschiebende Investmenttrends hindeutet.'
                  : 'Secondary cities like Dresden and Leipzig are showing higher growth rates than established metropolises, indicating shifting investment trends.'}
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="regulations" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {language === 'de' ? 'Wichtige Vorschriften' : 'Key Regulations'}
              </h3>
              
              <div className="space-y-4">
                {regulations.map((regulation, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">
                          {regulation.name === 'Real Estate Transfer Tax' ? (
                            <GermanRealEstateTermTooltip 
                              term="Grunderwerbsteuer" 
                              translation="Real Estate Transfer Tax"
                            />
                          ) : regulation.name}
                        </h4>
                        <Badge variant="outline">
                          {regulation.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {regulation.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {regulation.cities.map((city, cityIndex) => (
                          <Badge variant="secondary" key={cityIndex} className="text-xs">
                            {city}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <Alert className="bg-primary/10 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>
                {language === 'de' ? 'Regulatorischer Ausblick' : 'Regulatory Outlook'}
              </AlertTitle>
              <AlertDescription>
                {language === 'de'
                  ? 'Die Bundesregierung erwägt weitere Maßnahmen zur Förderung des Wohnungsbaus, darunter vereinfachte Genehmigungsverfahren und neue Steueranreize für erschwinglichen Wohnraum.'
                  : 'The federal government is considering additional measures to promote housing construction, including simplified approval procedures and new tax incentives for affordable housing.'}
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component for date display
const Calendar = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default GermanMarketInsights;
