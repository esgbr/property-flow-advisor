
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map, Compass, Building, LineChart, MapPin, Search, PlusCircle } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const RegionalAnalysis: React.FC = () => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();

  // Sample regions based on user market
  const getRegions = () => {
    switch(preferences.investmentMarket) {
      case 'germany':
        return [
          { id: 'berlin', name: 'Berlin' },
          { id: 'munich', name: 'München' },
          { id: 'hamburg', name: 'Hamburg' },
          { id: 'frankfurt', name: 'Frankfurt' },
          { id: 'cologne', name: 'Köln' },
          { id: 'stuttgart', name: 'Stuttgart' }
        ];
      case 'usa':
        return [
          { id: 'nyc', name: 'New York' },
          { id: 'la', name: 'Los Angeles' },
          { id: 'chicago', name: 'Chicago' },
          { id: 'miami', name: 'Miami' },
          { id: 'austin', name: 'Austin' },
          { id: 'seattle', name: 'Seattle' }
        ];
      default:
        return [
          { id: 'region1', name: 'Region 1' },
          { id: 'region2', name: 'Region 2' },
          { id: 'region3', name: 'Region 3' }
        ];
    }
  };

  const regions = getRegions();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Regionale Analyse' : 'Regional Analysis'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Detaillierte Daten und Trends für spezifische Regionen' 
              : 'Detailed data and trends for specific regions'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select defaultValue={regions[0].id}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={language === 'de' ? 'Region wählen' : 'Select region'} />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            {language === 'de' ? 'Suche' : 'Search'}
          </Button>
          
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {language === 'de' ? 'Region hinzufügen' : 'Add Region'}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-8 bg-muted/50">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-muted p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{regions[0].name}</h2>
            <p className="text-muted-foreground">
              {language === 'de'
                ? 'Aktuelle Daten und Analysetrends für diese Region'
                : 'Current data and analysis trends for this region'}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">
            <Map className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Übersicht' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="market">
            <LineChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Marktdaten' : 'Market Data'}
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Immobilien' : 'Properties'}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Compass className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Erkenntnisse' : 'Insights'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Regionsübersicht' : 'Region Overview'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Wichtige Kennzahlen und demografische Daten'
                    : 'Key metrics and demographic data'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <Map className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Marktindikatoren' : 'Market Indicators'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'de' ? 'Durchschnittspreis' : 'Average Price'}</span>
                  <span className="font-semibold">€425,000</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'de' ? 'Preiswachstum (YoY)' : 'Price Growth (YoY)'}</span>
                  <span className="font-semibold text-green-600">+5.2%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'de' ? 'Mietrendite' : 'Rental Yield'}</span>
                  <span className="font-semibold">3.8%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'de' ? 'Mietwachstum' : 'Rent Growth'}</span>
                  <span className="font-semibold text-green-600">+2.1%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{language === 'de' ? 'Leerstandsrate' : 'Vacancy Rate'}</span>
                  <span className="font-semibold">2.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{language === 'de' ? 'Bevölkerung' : 'Population'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.6M</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-600 mr-1">+1.2%</span> 
                  {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{language === 'de' ? 'Haushaltseinkommen' : 'Household Income'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€58,300</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-600 mr-1">+3.4%</span> 
                  {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{language === 'de' ? 'Transaktionsvolumen' : 'Transaction Volume'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€1.2B</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-red-600 mr-1">-2.5%</span> 
                  {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{language === 'de' ? 'Neue Baugenehmigungen' : 'New Building Permits'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,450</div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-600 mr-1">+5.7%</span> 
                  {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Preisentwicklung' : 'Price Development'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? '5-Jahres-Trend für Immobilienpreise'
                    : '5-year trend for property prices'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Mietpreisentwicklung' : 'Rental Price Development'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? '5-Jahres-Trend für Mietpreise'
                    : '5-year trend for rental prices'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Angebote nach Typ' : 'Listings by Type'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Verteilung der aktuellen Immobilienangebote'
                    : 'Distribution of current property listings'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <PieChart className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Marktliquidität' : 'Market Liquidity'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Durchschnittliche Vermarktungsdauer in Tagen'
                    : 'Average time on market in days'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties">
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 text-xl font-medium">
              {language === 'de' ? 'Immobiliendaten werden geladen' : 'Property data is loading'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === 'de' 
                ? 'Wählen Sie eine spezifische Region für detailliertere Immobiliendaten'
                : 'Select a specific region for more detailed property data'}
            </p>
            <Button className="mt-4">
              {language === 'de' ? 'Immobiliendaten laden' : 'Load Property Data'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Marktanalyse & Erkenntnisse' : 'Market Analysis & Insights'}</CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'KI-gestützte Analysen und Erkenntnisse für diese Region'
                  : 'AI-powered analysis and insights for this region'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">{language === 'de' ? 'Marktstärke' : 'Market Strength'}</h3>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full" style={{width: '72%'}}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Der Markt zeigt eine starke Wachstumsdynamik mit stabilen Preissteigerungen.'
                    : 'The market shows strong growth momentum with stable price increases.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">{language === 'de' ? 'Investitionspotenzial' : 'Investment Potential'}</h3>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{width: '85%'}}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Die Region bietet ausgezeichnetes Investitionspotenzial aufgrund starker wirtschaftlicher Indikatoren.'
                    : 'The region offers excellent investment potential due to strong economic indicators.'}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">{language === 'de' ? 'Risikobewertung' : 'Risk Assessment'}</h3>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{width: '35%'}}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Niedriges bis mittleres Risiko, hauptsächlich aufgrund von makroökonomischen Faktoren.'
                    : 'Low to medium risk, primarily due to macroeconomic factors.'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {language === 'de' ? 'Vollständigen Bericht herunterladen' : 'Download Full Report'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegionalAnalysis;
