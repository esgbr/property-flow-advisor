
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, TrendingUp, PieChart, DollarSign, Calendar, Users, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { AreaChart, BarChart, PieChart as RechartsChart } from 'recharts';

const InvestorDashboard = () => {
  const { language } = useLanguage();

  // Sample portfolio data
  const portfolioData = [
    { name: language === 'de' ? 'Wohnung' : 'Apartment', value: 35 },
    { name: language === 'de' ? 'Haus' : 'House', value: 30 },
    { name: language === 'de' ? 'Gewerbe' : 'Commercial', value: 20 },
    { name: language === 'de' ? 'Land' : 'Land', value: 15 }
  ];
  
  // Sample performance data
  const performanceData = [
    { month: 'Jan', roi: 5.2 },
    { month: 'Feb', roi: 5.4 },
    { month: 'Mar', roi: 5.6 },
    { month: 'Apr', roi: 5.5 },
    { month: 'May', roi: 5.8 },
    { month: 'Jun', roi: 6.1 },
    { month: 'Jul', roi: 6.3 },
    { month: 'Aug', roi: 6.2 },
  ];
  
  // Sample properties data
  const propertiesData = [
    {
      id: 1,
      name: language === 'de' ? 'Zentrum Apartment' : 'City Center Apartment',
      location: language === 'de' ? 'Berlin, DE' : 'Berlin, DE',
      roi: 6.2,
      value: 375000,
      occupancy: 98
    },
    {
      id: 2,
      name: language === 'de' ? 'Vorstadtvilla' : 'Suburban Villa',
      location: language === 'de' ? 'München, DE' : 'Munich, DE',
      roi: 5.8,
      value: 520000,
      occupancy: 100
    },
    {
      id: 3,
      name: language === 'de' ? 'Geschäftsbüro' : 'Business Office',
      location: language === 'de' ? 'Frankfurt, DE' : 'Frankfurt, DE',
      roi: 7.4,
      value: 890000,
      occupancy: 95
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex gap-2 items-center">
            <Building2 className="h-8 w-8" />
            {language === 'de' ? 'Investoren-Dashboard' : 'Investor Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Übersicht Ihrer Immobilieninvestitionen und Performance'
              : 'Overview of your real estate investments and performance'}
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Berichte' : 'Reports'}
          </Button>
          
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Portfolio erweitern' : 'Expand Portfolio'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Portfoliowert' : 'Portfolio Value'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€1,785,000</div>
            <p className="text-xs text-muted-foreground">
              +12.5% {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Durchschnittlicher ROI' : 'Average ROI'}
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5%</div>
            <p className="text-xs text-muted-foreground">
              +0.8% {language === 'de' ? 'seit letztem Jahr' : 'since last year'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Nächste Prüfung' : 'Next Review'}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 {language === 'de' ? 'Oktober' : 'October'}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'de' ? 'Quartalsportfoliobewertung' : 'Quarterly portfolio assessment'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{language === 'de' ? 'Übersicht' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="properties">{language === 'de' ? 'Immobilien' : 'Properties'}</TabsTrigger>
          <TabsTrigger value="portfolio">{language === 'de' ? 'Portfolio-Optimierung' : 'Portfolio Optimization'}</TabsTrigger>
          <TabsTrigger value="partners">{language === 'de' ? 'Partner' : 'Partners'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Portfoliozusammensetzung' : 'Portfolio Composition'}</CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Aufschlüsselung nach Immobilientyp' : 'Breakdown by property type'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-60">
                  <RechartsChart 
                    width={300} 
                    height={200} 
                    data={portfolioData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </RechartsChart>
                </div>
                
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 bg-primary-${index * 200 + 200}`}></div>
                      <span>{item.name}</span>
                    </div>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Performance-Trend' : 'Performance Trend'}</CardTitle>
                <CardDescription>
                  {language === 'de' ? 'ROI-Entwicklung über die Zeit' : 'ROI development over time'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <AreaChart
                    width={300}
                    height={200}
                    data={performanceData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-6">
            {propertiesData.map((property) => (
              <Card key={property.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{property.name}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Wert' : 'Value'}
                      </div>
                      <div className="text-xl font-bold">€{property.value.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl font-bold text-green-600">{property.roi}%</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Belegung' : 'Occupancy'}
                      </div>
                      <div className="text-xl font-bold">{property.occupancy}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{language === 'de' ? 'Auslastung' : 'Occupancy'}</span>
                      <span>{property.occupancy}%</span>
                    </div>
                    <Progress value={property.occupancy} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline">
                      {language === 'de' ? 'Details anzeigen' : 'View Details'}
                    </Button>
                    <Button variant="outline">
                      {language === 'de' ? 'Berichte' : 'Reports'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center">
              <Button>
                <Building2 className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Alle Immobilien anzeigen' : 'View All Properties'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Portfolio-Optimierung' : 'Portfolio Optimization'}</CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Automatisierte Empfehlungen zur Optimierung Ihres Immobilienportfolios'
                  : 'Automated recommendations to optimize your real estate portfolio'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/30">
                <div className="font-medium mb-2">
                  {language === 'de' ? 'Diversifikationsempfehlung' : 'Diversification Recommendation'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de'
                    ? 'Ihr Portfolio könnte von einer breiteren Verteilung über verschiedene Standorte profitieren.'
                    : 'Your portfolio could benefit from a wider distribution across different locations.'}
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  {language === 'de' ? 'Möglichkeiten erkunden' : 'Explore Options'}
                </Button>
              </div>
              
              <div className="border rounded-md p-4 bg-muted/30">
                <div className="font-medium mb-2">
                  {language === 'de' ? 'Renditeoptimierung' : 'Yield Optimization'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de'
                    ? 'Die Anpassung der Mietpreise für Ihr Zentrum Apartment könnte die Gesamtrendite um 0,3% steigern.'
                    : 'Adjusting rental prices for your City Center Apartment could increase overall yield by 0.3%.'}
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  {language === 'de' ? 'Analyse anzeigen' : 'View Analysis'}
                </Button>
              </div>
              
              <Button className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Vollständige Portfolio-Analyse' : 'Complete Portfolio Analysis'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Investitionspartner' : 'Investment Partners'}</CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Verbinden Sie sich mit kompatiblen Investoren für gemeinsame Möglichkeiten'
                  : 'Connect with compatible investors for joint opportunities'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Alexander Schmidt</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Gewerbliche Immobilien, München' : 'Commercial Properties, Munich'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'de' ? 'Verbinden' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Julia Weber</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Wohnimmobilien, Berlin' : 'Residential Properties, Berlin'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'de' ? 'Verbinden' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Michael Becker</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'de' ? 'Internationale Investments' : 'International Investments'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'de' ? 'Verbinden' : 'Connect'}
                  </Button>
                </div>
              </div>
              
              <Button variant="link" className="mt-4 w-full">
                {language === 'de' ? 'Alle potenziellen Partner anzeigen' : 'View all potential partners'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestorDashboard;
