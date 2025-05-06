
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Euro, 
  Building, 
  ArrowRightLeft, 
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Dummy data for different markets
const marketData = {
  berlin: {
    name: "Berlin",
    averagePrice: 4800,
    averageRent: 13.2,
    priceChange: 5.2,
    rentChange: 3.8,
    yieldAverage: 3.3,
    population: 3.8,
    growthRate: 1.1,
    vacancyRate: 0.9,
    historyData: [
      { year: 2018, price: 3800, rent: 11.2 },
      { year: 2019, price: 4100, rent: 11.8 },
      { year: 2020, price: 4300, rent: 12.2 },
      { year: 2021, price: 4500, rent: 12.6 },
      { year: 2022, price: 4650, rent: 12.9 },
      { year: 2023, price: 4800, rent: 13.2 },
    ]
  },
  munich: {
    name: "München",
    averagePrice: 8900,
    averageRent: 19.1,
    priceChange: 4.1,
    rentChange: 2.9,
    yieldAverage: 2.5,
    population: 1.5,
    growthRate: 0.9,
    vacancyRate: 0.7,
    historyData: [
      { year: 2018, price: 7500, rent: 17.1 },
      { year: 2019, price: 7900, rent: 17.6 },
      { year: 2020, price: 8200, rent: 18.0 },
      { year: 2021, price: 8500, rent: 18.4 },
      { year: 2022, price: 8700, rent: 18.8 },
      { year: 2023, price: 8900, rent: 19.1 },
    ]
  },
  hamburg: {
    name: "Hamburg",
    averagePrice: 5100,
    averageRent: 14.5,
    priceChange: 3.8,
    rentChange: 2.5,
    yieldAverage: 3.4,
    population: 1.9,
    growthRate: 0.7,
    vacancyRate: 1.1,
    historyData: [
      { year: 2018, price: 4500, rent: 13.0 },
      { year: 2019, price: 4650, rent: 13.4 },
      { year: 2020, price: 4750, rent: 13.7 },
      { year: 2021, price: 4850, rent: 14.0 },
      { year: 2022, price: 5000, rent: 14.2 },
      { year: 2023, price: 5100, rent: 14.5 },
    ]
  },
  frankfurt: {
    name: "Frankfurt",
    averagePrice: 5800,
    averageRent: 15.8,
    priceChange: 4.0,
    rentChange: 3.1,
    yieldAverage: 3.2,
    population: 0.75,
    growthRate: 0.8,
    vacancyRate: 1.0,
    historyData: [
      { year: 2018, price: 5000, rent: 14.0 },
      { year: 2019, price: 5200, rent: 14.5 },
      { year: 2020, price: 5400, rent: 14.9 },
      { year: 2021, price: 5550, rent: 15.2 },
      { year: 2022, price: 5700, rent: 15.5 },
      { year: 2023, price: 5800, rent: 15.8 },
    ]
  }
};

const MarketComparisonAssistant: React.FC = () => {
  const { language } = useLanguage();
  const [leftMarket, setLeftMarket] = useState('berlin');
  const [rightMarket, setRightMarket] = useState('munich');
  const [comparisonMetric, setComparisonMetric] = useState('price');
  
  // Combine historical data for both markets
  const combinedHistoricalData = marketData[leftMarket as keyof typeof marketData].historyData.map((item, index) => {
    const rightData = marketData[rightMarket as keyof typeof marketData].historyData[index];
    return {
      year: item.year,
      [`${marketData[leftMarket as keyof typeof marketData].name} ${comparisonMetric === 'price' ? 'Preis' : 'Miete'}`]: 
        comparisonMetric === 'price' ? item.price : item.rent,
      [`${marketData[rightMarket as keyof typeof marketData].name} ${comparisonMetric === 'price' ? 'Preis' : 'Miete'}`]: 
        comparisonMetric === 'price' ? rightData.price : rightData.rent,
    };
  });

  // Generate market comparison metrics
  const createComparisonData = () => {
    const leftData = marketData[leftMarket as keyof typeof marketData];
    const rightData = marketData[rightMarket as keyof typeof marketData];
    
    return [
      { 
        name: language === 'de' ? 'Durchschnittspreis (€/m²)' : 'Average Price (€/m²)',
        [leftData.name]: leftData.averagePrice, 
        [rightData.name]: rightData.averagePrice
      },
      { 
        name: language === 'de' ? 'Durchschnittsmiete (€/m²)' : 'Average Rent (€/m²)', 
        [leftData.name]: leftData.averageRent, 
        [rightData.name]: rightData.averageRent
      },
      { 
        name: language === 'de' ? 'Preisänderung (%)' : 'Price Change (%)',
        [leftData.name]: leftData.priceChange, 
        [rightData.name]: rightData.priceChange
      },
      { 
        name: language === 'de' ? 'Mietänderung (%)' : 'Rent Change (%)', 
        [leftData.name]: leftData.rentChange, 
        [rightData.name]: rightData.rentChange
      },
      { 
        name: language === 'de' ? 'Rendite (%)' : 'Yield (%)', 
        [leftData.name]: leftData.yieldAverage, 
        [rightData.name]: rightData.yieldAverage
      },
      { 
        name: language === 'de' ? 'Leerstandsrate (%)' : 'Vacancy Rate (%)',
        [leftData.name]: leftData.vacancyRate, 
        [rightData.name]: rightData.vacancyRate
      }
    ];
  };

  // Swap markets
  const handleSwapMarkets = () => {
    const temp = leftMarket;
    setLeftMarket(rightMarket);
    setRightMarket(temp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {language === 'de' ? 'Marktvergleichsassistent' : 'Market Comparison Assistant'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Vergleiche Immobilienmärkte Seite an Seite' 
                : 'Compare real estate markets side by side'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-2/5">
                <label className="text-sm font-medium">
                  {language === 'de' ? 'Linker Markt' : 'Left Market'}
                </label>
                <Select 
                  value={leftMarket} 
                  onValueChange={setLeftMarket}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="berlin">Berlin</SelectItem>
                    <SelectItem value="munich">München</SelectItem>
                    <SelectItem value="hamburg">Hamburg</SelectItem>
                    <SelectItem value="frankfurt">Frankfurt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSwapMarkets} 
                  title={language === 'de' ? 'Märkte tauschen' : 'Swap markets'}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="w-full md:w-2/5">
                <label className="text-sm font-medium">
                  {language === 'de' ? 'Rechter Markt' : 'Right Market'}
                </label>
                <Select 
                  value={rightMarket} 
                  onValueChange={setRightMarket}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="berlin">Berlin</SelectItem>
                    <SelectItem value="munich">München</SelectItem>
                    <SelectItem value="hamburg">Hamburg</SelectItem>
                    <SelectItem value="frankfurt">Frankfurt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">
                {language === 'de' ? 'Vergleichsmetrik' : 'Comparison Metric'}
              </label>
              <Select 
                value={comparisonMetric} 
                onValueChange={setComparisonMetric}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === 'de' ? 'Metrik wählen' : 'Select metric'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">{language === 'de' ? 'Kaufpreisentwicklung' : 'Purchase Price Trend'}</SelectItem>
                  <SelectItem value="rent">{language === 'de' ? 'Mietpreisentwicklung' : 'Rental Price Trend'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Statistischer Vergleich' : 'Statistical Comparison'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Preisentwicklung' : 'Price Trends'}
          </TabsTrigger>
          <TabsTrigger value="details">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Marktdetails' : 'Market Details'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? `Vergleich zwischen ${marketData[leftMarket as keyof typeof marketData].name} und ${marketData[rightMarket as keyof typeof marketData].name}`
                  : `Comparison between ${marketData[leftMarket as keyof typeof marketData].name} and ${marketData[rightMarket as keyof typeof marketData].name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={createComparisonData()}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey={marketData[leftMarket as keyof typeof marketData].name} 
                      fill="#8884d8" 
                    />
                    <Bar 
                      dataKey={marketData[rightMarket as keyof typeof marketData].name} 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {comparisonMetric === 'price' 
                  ? (language === 'de' ? 'Kaufpreisentwicklung' : 'Purchase Price Development')
                  : (language === 'de' ? 'Mietpreisentwicklung' : 'Rental Price Development')}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? `Historische Entwicklung von 2018 bis 2023`
                  : `Historical development from 2018 to 2023`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={combinedHistoricalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey={`${marketData[leftMarket as keyof typeof marketData].name} ${comparisonMetric === 'price' ? 'Preis' : 'Miete'}`} 
                      fill="#8884d8" 
                    />
                    <Bar 
                      dataKey={`${marketData[rightMarket as keyof typeof marketData].name} ${comparisonMetric === 'price' ? 'Preis' : 'Miete'}`} 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Market Details */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {marketData[leftMarket as keyof typeof marketData].name}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Marktdetails und Kennzahlen' : 'Market details and metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Euro className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Durchschnittspreis' : 'Average Price'}
                    </dt>
                    <dd className="text-2xl font-bold">
                      {marketData[leftMarket as keyof typeof marketData].averagePrice} €/m²
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Euro className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Durchschnittsmiete' : 'Average Rent'}
                    </dt>
                    <dd className="text-2xl font-bold">
                      {marketData[leftMarket as keyof typeof marketData].averageRent} €/m²
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Jährliche Wertsteigerung' : 'Annual Appreciation'}
                    </dt>
                    <dd className="text-xl font-bold">
                      {marketData[leftMarket as keyof typeof marketData].priceChange}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Mietrendite' : 'Rental Yield'}
                    </dt>
                    <dd className="text-xl font-bold">
                      {marketData[leftMarket as keyof typeof marketData].yieldAverage}%
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            {/* Right Market Details */}
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {marketData[rightMarket as keyof typeof marketData].name}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Marktdetails und Kennzahlen' : 'Market details and metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Euro className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Durchschnittspreis' : 'Average Price'}
                    </dt>
                    <dd className="text-2xl font-bold">
                      {marketData[rightMarket as keyof typeof marketData].averagePrice} €/m²
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Euro className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Durchschnittsmiete' : 'Average Rent'}
                    </dt>
                    <dd className="text-2xl font-bold">
                      {marketData[rightMarket as keyof typeof marketData].averageRent} €/m²
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Jährliche Wertsteigerung' : 'Annual Appreciation'}
                    </dt>
                    <dd className="text-xl font-bold">
                      {marketData[rightMarket as keyof typeof marketData].priceChange}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4 inline-block mr-1" /> 
                      {language === 'de' ? 'Mietrendite' : 'Rental Yield'}
                    </dt>
                    <dd className="text-xl font-bold">
                      {marketData[rightMarket as keyof typeof marketData].yieldAverage}%
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketComparisonAssistant;
