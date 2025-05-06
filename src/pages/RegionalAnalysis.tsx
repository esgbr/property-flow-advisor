import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Map, LineChart, ArrowRight, Building, TrendingUp, ChevronRight, ArrowRightLeft } from 'lucide-react';

const RegionalAnalysis: React.FC = () => {
  const { language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('berlin');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for regions
  const regions = [
    { id: 'berlin', name: 'Berlin' },
    { id: 'munich', name: 'Munich' },
    { id: 'hamburg', name: 'Hamburg' },
    { id: 'frankfurt', name: 'Frankfurt' },
    { id: 'cologne', name: 'Cologne' }
  ];

  // Sample data for metrics
  const metrics = {
    berlin: {
      population: 3.7,
      growth: 4.2,
      avgPrice: 4800,
      avgRent: 13.5,
      transactions: 28500,
      yield: 4.2,
      trend: 'rising',
      demandScore: 82,
      developmentIndex: 76,
      marketHeat: 89
    },
    munich: {
      population: 1.5,
      growth: 3.8,
      avgPrice: 8200,
      avgRent: 19.8,
      transactions: 18900,
      yield: 3.8,
      trend: 'rising',
      demandScore: 88,
      developmentIndex: 84,
      marketHeat: 92
    },
    hamburg: {
      population: 1.9,
      growth: 3.2,
      avgPrice: 5300,
      avgRent: 14.3,
      transactions: 21500,
      yield: 4.0,
      trend: 'stable',
      demandScore: 77,
      developmentIndex: 70,
      marketHeat: 75
    },
    frankfurt: {
      population: 0.75,
      growth: 3.9,
      avgPrice: 5900,
      avgRent: 16.1,
      transactions: 14300,
      yield: 3.9,
      trend: 'rising',
      demandScore: 80,
      developmentIndex: 72,
      marketHeat: 86
    },
    cologne: {
      population: 1.1,
      growth: 3.0,
      avgPrice: 4200,
      avgRent: 12.4,
      transactions: 16800,
      yield: 4.1,
      trend: 'stable',
      demandScore: 75,
      developmentIndex: 68,
      marketHeat: 72
    }
  };

  // Get current region data
  const currentRegion = metrics[selectedRegion as keyof typeof metrics];

  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
  };

  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Regionale Analyse' : 'Regional Analysis'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Analysieren Sie Immobilienmarktdaten nach Region'
              : 'Analyze real estate market data by region'}
          </p>
        </div>

        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language === 'de' ? 'Region wählen' : 'Select region'} />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{regions.find(r => r.id === selectedRegion)?.name}</CardTitle>
          <CardDescription>
            {language === 'de'
              ? `Bevölkerung: ${currentRegion.population} Million | Wachstum: ${currentRegion.growth}%`
              : `Population: ${currentRegion.population} million | Growth: ${currentRegion.growth}%`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Durchschnittlicher Preis' : 'Average Price'}
              </p>
              <p className="text-2xl font-bold">€{currentRegion.avgPrice}/m²</p>
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+{currentRegion.growth}% {language === 'de' ? 'im Jahr' : 'yearly'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Durchschnittliche Miete' : 'Average Rent'}
              </p>
              <p className="text-2xl font-bold">€{currentRegion.avgRent}/m²</p>
              <div className="flex items-center text-sm">
                <span>{language === 'de' ? 'Rendite' : 'Yield'}: {currentRegion.yield}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Transaktionen' : 'Transactions'}
              </p>
              <p className="text-2xl font-bold">{currentRegion.transactions.toLocaleString()}</p>
              <div className="flex items-center text-sm">
                <span>
                  {language === 'de' ? 'Trend' : 'Trend'}:&nbsp;
                  {currentRegion.trend === 'rising'
                    ? language === 'de' ? 'Steigend' : 'Rising'
                    : language === 'de' ? 'Stabil' : 'Stable'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">
            {language === 'de' ? 'Übersicht' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            {language === 'de' ? 'Trends' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            {language === 'de' ? 'Vergleich' : 'Comparison'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Marktnachfrage' : 'Market Demand'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Nachfragescore' : 'Demand Score'}
                      </span>
                      <span className="font-medium">{currentRegion.demandScore}/100</span>
                    </div>
                    <Progress value={currentRegion.demandScore} className={getScoreColor(currentRegion.demandScore)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Entwicklungsindex' : 'Development Index'}
                      </span>
                      <span className="font-medium">{currentRegion.developmentIndex}/100</span>
                    </div>
                    <Progress value={currentRegion.developmentIndex} className={getScoreColor(currentRegion.developmentIndex)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Markttemperatur' : 'Market Heat'}
                      </span>
                      <span className="font-medium">{currentRegion.marketHeat}/100</span>
                    </div>
                    <Progress value={currentRegion.marketHeat} className={getScoreColor(currentRegion.marketHeat)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {language === 'de' ? 'Vollständige Analyse anzeigen' : 'View Full Analysis'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Regionale Karte' : 'Regional Map'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[250px] bg-muted/20 rounded-md">
                <Map className="h-12 w-12 text-muted-foreground" />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">
                  {language === 'de' ? 'Interaktive Karte öffnen' : 'Open Interactive Map'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Immobilienangebote in dieser Region' : 'Property Listings in This Region'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <Card key={item}>
                    <CardContent className="p-4">
                      <div className="h-40 bg-muted/30 rounded-md mb-3 flex items-center justify-center">
                        <Building className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium">
                        {language === 'de' ? 'Immobilienangebot' : 'Property Listing'} {item}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        €{(Math.floor(Math.random() * 5) + 3) * 100},000
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        {language === 'de' ? 'Details anzeigen' : 'View Details'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'de' ? 'Alle Angebote anzeigen' : 'View All Listings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Preistrends' : 'Price Trends'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Historische und prognostizierte Preisentwicklung'
                  : 'Historical and forecasted price development'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <LineChart className="h-12 w-12 text-muted-foreground" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Miettrends' : 'Rental Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <LineChart className="h-10 w-10 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Marktaktivität' : 'Market Activity'}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center">
                <LineChart className="h-10 w-10 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Regionen vergleichen' : 'Compare Regions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Select defaultValue="berlin">
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'de' ? 'Region 1' : 'Region 1'} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <Select defaultValue="munich">
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'de' ? 'Region 2' : 'Region 2'} />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button className="ml-auto">
                    {language === 'de' ? 'Vergleichen' : 'Compare'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Berlin</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Durchschnittlicher Preis' : 'Average Price'}
                        </span>
                        <span>€4,800/m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Mietrendite' : 'Rental Yield'}
                        </span>
                        <span>4.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Preiswachstum' : 'Price Growth'}
                        </span>
                        <span className="text-green-500">+4.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Munich</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Durchschnittlicher Preis' : 'Average Price'}
                        </span>
                        <span>€8,200/m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Mietrendite' : 'Rental Yield'}
                        </span>
                        <span>3.8%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Preiswachstum' : 'Price Growth'}
                        </span>
                        <span className="text-green-500">+3.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'de' ? 'Detaillierten Vergleich exportieren' : 'Export Detailed Comparison'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegionalAnalysis;
