import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowUpRight, BarChart3, Building, Calendar, ChartBar, LineChart, 
  Map, MapPin, Search, TrendingDown, TrendingUp, Info 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import AIAssistant from '@/components/ai/AIAssistant';

// Sample data for price trends
const priceTrendData = [
  { month: 'Jan', thisYear: 105, lastYear: 100 },
  { month: 'Feb', thisYear: 106, lastYear: 101 },
  { month: 'Mar', thisYear: 108, lastYear: 102 },
  { month: 'Apr', thisYear: 109, lastYear: 103 },
  { month: 'May', thisYear: 110, lastYear: 104 },
  { month: 'Jun', thisYear: 112, lastYear: 105 },
  { month: 'Jul', thisYear: 114, lastYear: 106 },
  { month: 'Aug', thisYear: 116, lastYear: 107 },
  { month: 'Sep', thisYear: 118, lastYear: 109 },
  { month: 'Oct', thisYear: 120, lastYear: 110 },
  { month: 'Nov', thisYear: 122, lastYear: 112 },
  { month: 'Dec', thisYear: 125, lastYear: 115 }
];

// Sample data for market indicators
const marketIndicatorsData = [
  { name: 'North', rentGrowth: 4.2, priceGrowth: 3.8, inventory: 80, demand: 90 },
  { name: 'South', rentGrowth: 3.5, priceGrowth: 4.2, inventory: 65, demand: 85 },
  { name: 'East', rentGrowth: 2.8, priceGrowth: 3.0, inventory: 70, demand: 75 },
  { name: 'West', rentGrowth: 5.1, priceGrowth: 5.5, inventory: 55, demand: 95 },
  { name: 'Central', rentGrowth: 3.9, priceGrowth: 4.0, inventory: 60, demand: 80 }
];

// Sample data for investment scores
const investmentScoreData = {
  cash_flow: 85,
  appreciation: 70,
  tax_benefits: 65,
  risk_level: 45,
  market_liquidity: 75
};

// Sample economic indicator data
const economicIndicatorData = [
  { year: '2020', gdpGrowth: 1.5, unemployment: 6.2, interestRate: 3.2 },
  { year: '2021', gdpGrowth: 2.2, unemployment: 5.8, interestRate: 3.0 },
  { year: '2022', gdpGrowth: 2.8, unemployment: 5.2, interestRate: 3.5 },
  { year: '2023', gdpGrowth: 3.0, unemployment: 4.8, interestRate: 4.2 },
  { year: '2024', gdpGrowth: 2.5, unemployment: 4.5, interestRate: 4.5 },
  { year: '2025', gdpGrowth: 2.7, unemployment: 4.3, interestRate: 4.0 }
];

interface MarketOpportunity {
  id: string;
  location: string;
  propertyType: string;
  averagePrice: number;
  priceChange: number;
  rentYield: number;
  score: number;
}

const MarketAnalysisTools: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // State for location search
  const [searchLocation, setSearchLocation] = useState('');
  const [searchRadius, setSearchRadius] = useState(10);
  const [propertyType, setPropertyType] = useState('all');
  
  // State for investment score parameters
  const [cashFlowWeight, setCashFlowWeight] = useState(5);
  const [appreciationWeight, setAppreciationWeight] = useState(3);
  const [riskWeight, setRiskWeight] = useState(2);
  
  // Sample market opportunities data (would be filtered based on real user inputs)
  const [marketOpportunities, setMarketOpportunities] = useState<MarketOpportunity[]>([
    {
      id: '1',
      location: 'North District',
      propertyType: 'Residential',
      averagePrice: 320000,
      priceChange: 4.2,
      rentYield: 5.8,
      score: 85
    },
    {
      id: '2',
      location: 'Tech Hub Area',
      propertyType: 'Commercial',
      averagePrice: 550000,
      priceChange: 5.5,
      rentYield: 6.2,
      score: 83
    },
    {
      id: '3',
      location: 'Waterfront',
      propertyType: 'Residential',
      averagePrice: 480000,
      priceChange: 3.8,
      rentYield: 4.9,
      score: 79
    },
    {
      id: '4',
      location: 'University Area',
      propertyType: 'Residential',
      averagePrice: 290000,
      priceChange: 2.9,
      rentYield: 7.2,
      score: 78
    },
    {
      id: '5',
      location: 'Downtown',
      propertyType: 'Commercial',
      averagePrice: 620000,
      priceChange: 3.2,
      rentYield: 5.5,
      score: 76
    }
  ]);
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('marketAnalysisUpdated'),
      description: t('marketDataUpdatedForLocation')
    });
    // In a real application, this would trigger an API call to get real market data
  };
  
  // Handle saving a market opportunity
  const handleSaveOpportunity = (id: string) => {
    toast({
      title: t('opportunitySaved'),
      description: t('opportunitySavedToWatchlist')
    });
    // In a real application, this would save to user preferences
  };
  
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <BarChart3 className="inline-block mr-2 h-8 w-8" />
            {t('marketAnalysis')}
          </h1>
          <p className="text-muted-foreground">{t('analyzeRealEstateMarketTrends')}</p>
        </div>
        <AIAssistant 
          variant="icon" 
          size="md"
          contextData={{ 
            location: searchLocation,
            propertyType: propertyType,
            investmentParameters: {
              cashFlowWeight,
              appreciationWeight,
              riskWeight
            }
          }}
          title={t('marketInsightsAssistant')}
          description={t('getPersonalizedMarketAnalysis')}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('marketSearch')}</CardTitle>
          <CardDescription>{t('searchForMarketDataByLocation')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('enterLocationCityState')}
                    className="pl-8"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('propertyType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allTypes')}</SelectItem>
                    <SelectItem value="residential">{t('residential')}</SelectItem>
                    <SelectItem value="commercial">{t('commercial')}</SelectItem>
                    <SelectItem value="industrial">{t('industrial')}</SelectItem>
                    <SelectItem value="land">{t('land')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  {t('searchRadius')}: {searchRadius} km
                </label>
                <span className="text-sm text-muted-foreground">
                  {t('max')}: 50 km
                </span>
              </div>
              <Slider
                value={[searchRadius]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setSearchRadius(value[0])}
              />
            </div>
            
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              {t('analyzeMarket')}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="trends">
            <LineChart className="h-4 w-4 mr-2" />
            {t('priceTrends')}
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <Map className="h-4 w-4 mr-2" />
            {t('marketHeatmap')}
          </TabsTrigger>
          <TabsTrigger value="indicators">
            <ChartBar className="h-4 w-4 mr-2" />
            {t('marketIndicators')}
          </TabsTrigger>
          <TabsTrigger value="opportunities">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('investmentOpportunities')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('propertyPriceTrends')}</CardTitle>
                <CardDescription>
                  {searchLocation ? t('priceIndexFor', { location: searchLocation }) : t('nationalPriceIndex')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={priceTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [`Index: ${value}`, ""]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="thisYear" 
                        name={t('thisYear')} 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        name={t('lastYear')} 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('yearOverYear')}</div>
                    <div className="text-2xl font-bold flex items-center">
                      +8.7%
                      <ArrowUpRight className="h-4 w-4 ml-1 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('quarterOverQuarter')}</div>
                    <div className="text-2xl font-bold flex items-center">
                      +2.2%
                      <ArrowUpRight className="h-4 w-4 ml-1 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('medianPrice')}</div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(345000)}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('daysOnMarket')}</div>
                    <div className="text-2xl font-bold flex items-center">
                      28
                      <TrendingDown className="h-4 w-4 ml-1 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('economicIndicators')}</CardTitle>
                <CardDescription>{t('economicFactorsAffectingMarket')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* GDP Growth */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t('gdpGrowth')}</span>
                      <span className="text-sm font-medium">2.7%</span>
                    </div>
                    <Progress value={2.7 / 5 * 100} className="h-2" />
                  </div>
                  
                  {/* Unemployment Rate */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t('unemploymentRate')}</span>
                      <span className="text-sm font-medium">4.3%</span>
                    </div>
                    <Progress value={(1 - 4.3 / 10) * 100} className="h-2" />
                  </div>
                  
                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{t('interestRate')}</span>
                      <span className="text-sm font-medium">4.0%</span>
                    </div>
                    <Progress value={(1 - 4.0 / 8) * 100} className="h-2" />
                  </div>
                </div>
                
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={economicIndicatorData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="interestRate" 
                        name={t('interestRate')} 
                        stroke="#ff7300" 
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="unemployment" 
                        name={t('unemployment')} 
                        stroke="#387908" 
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center justify-between pt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{t('forecast')}: 2025</span>
                  </div>
                  <Button variant="link" className="p-0 h-auto">
                    {t('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('rentalMarketTrends')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{t('averageRentByPropertyType')}</h3>
                    <div className="h-48 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={[
                            { type: t('studio'), rent: 950 },
                            { type: '1-BR', rent: 1250 },
                            { type: '2-BR', rent: 1550 },
                            { type: '3-BR', rent: 1950 },
                            { type: '4+ BR', rent: 2550 }
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`€${value}`, t('averageRent')]} />
                          <Bar dataKey="rent" fill="#8884d8" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium">{t('vacancyRate')}</div>
                      <div className="text-xl font-bold">3.8%</div>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm font-medium">{t('rentGrowthYOY')}</div>
                      <div className="text-xl font-bold">+5.2%</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{t('rentToPrice')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('rentToPriceDescription')}
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      {[
                        { district: t('northDistrict'), yield: 5.8 },
                        { district: t('southDistrict'), yield: 5.2 },
                        { district: t('eastDistrict'), yield: 4.9 },
                        { district: t('westDistrict'), yield: 6.1 },
                        { district: t('centralDistrict'), yield: 4.5 }
                      ].map((data, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{data.district}</span>
                            <span className="text-sm font-medium">{data.yield}%</span>
                          </div>
                          <Progress value={data.yield * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('marketHeatmap')}</CardTitle>
              <CardDescription>{t('visualPropertyValuesAndTrends')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Map className="h-16 w-16 mx-auto text-muted-foreground/70" />
                  <div className="font-medium">{t('interactiveMapComingSoon')}</div>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {t('interactiveMapDescription')}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6 mt-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium">{t('heatmapLayers')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="price-heat" className="mr-2" checked />
                      <label htmlFor="price-heat">{t('propertyValues')}</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="growth-heat" className="mr-2" />
                      <label htmlFor="growth-heat">{t('appreciationRate')}</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="rent-heat" className="mr-2" />
                      <label htmlFor="rent-heat">{t('rentalYields')}</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="demand-heat" className="mr-2" />
                      <label htmlFor="demand-heat">{t('buyerDemand')}</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="inventory-heat" className="mr-2" />
                      <label htmlFor="inventory-heat">{t('inventoryLevels')}</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <h3 className="font-medium">{t('neighborhoodStats')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: t('northDistrict'), price: '€345,000', change: '+4.2%' },
                      { name: t('southDistrict'), price: '€315,000', change: '+3.5%' },
                      { name: t('eastDistrict'), price: '€295,000', change: '+2.8%' },
                      { name: t('westDistrict'), price: '€375,000', change: '+5.1%' },
                      { name: t('centralDistrict'), price: '€425,000', change: '+3.9%' },
                      { name: t('suburbanArea'), price: '€310,000', change: '+3.2%' }
                    ].map((area, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">{area.name}</div>
                          <div className="text-xs text-muted-foreground">{area.price}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {area.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="indicators" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('keyMarketIndicators')}</CardTitle>
                <CardDescription>{t('comparingDifferentAreas')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={marketIndicatorsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rentGrowth" name={t('rentGrowth')} fill="#8884d8" />
                      <Bar dataKey="priceGrowth" name={t('priceGrowth')} fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('bestPriceGrowth')}</div>
                    <div className="text-xl font-bold">{t('westDistrict')}</div>
                    <div className="text-sm text-muted-foreground">+5.5%</div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('bestRentGrowth')}</div>
                    <div className="text-xl font-bold">{t('westDistrict')}</div>
                    <div className="text-sm text-muted-foreground">+5.1%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('supplyAndDemandIndicators')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={marketIndicatorsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inventory" name={t('inventory')} fill="#8884d8" />
                      <Bar dataKey="demand" name={t('demand')} fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('highestDemand')}</div>
                    <div className="text-xl font-bold">{t('westDistrict')}</div>
                    <div className="text-sm text-muted-foreground">{t('score')}: 95/100</div>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm font-medium">{t('lowestInventory')}</div>
                    <div className="text-xl font-bold">{t('westDistrict')}</div>
                    <div className="text-sm text-muted-foreground">{t('score')}: 55/100</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('investmentScoreCalculator')}</CardTitle>
              <CardDescription>{t('customizeYourInvestmentParameters')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{t('cashFlowImportance')}</label>
                      <span className="text-sm font-medium">{cashFlowWeight}/5</span>
                    </div>
                    <Slider
                      value={[cashFlowWeight]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setCashFlowWeight(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{t('appreciationImportance')}</label>
                      <span className="text-sm font-medium">{appreciationWeight}/5</span>
                    </div>
                    <Slider
                      value={[appreciationWeight]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setAppreciationWeight(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">{t('riskTolerance')}</label>
                      <span className="text-sm font-medium">{riskWeight}/5</span>
                    </div>
                    <Slider
                      value={[riskWeight]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => setRiskWeight(value[0])}
                    />
                  </div>
                  
                  <Button className="mt-2">
                    {t('recalculateScores')}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">{t('investmentScore')}</h3>
                  <div className="space-y-3">
                    {Object.entries(investmentScoreData).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{t(key.replace(/_/g, ''))}</span>
                          <span className="text-sm font-medium">{value}/100</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-primary/10 p-3 rounded-lg mt-4">
                    <div className="text-sm font-medium text-center">{t('overallScore')}</div>
                    <div className="text-3xl font-bold text-center">78/100</div>
                    <div className="text-xs text-center text-muted-foreground mt-1">{t('basedOnYourParameters')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="opportunities" className="mt-6">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {marketOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute top-2 right-2">
                      <Badge className={opportunity.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                        {opportunity.score}/100
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <h3 className="font-medium text-white">{opportunity.location}</h3>
                      <div className="flex items-center text-xs text-white/90">
                        <MapPin className="h-3 w-3 mr-1" />
                        {opportunity.propertyType}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">{t('avgPrice')}</div>
                        <div className="font-medium">{formatCurrency(opportunity.averagePrice)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{t('priceChange')}</div>
                        <div className="font-medium text-green-600">+{opportunity.priceChange}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">{t('rentYield')}</div>
                        <div className="font-medium">{opportunity.rentYield}%</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => handleSaveOpportunity(opportunity.id)}>
                      <Building className="h-4 w-4 mr-1" />
                      {t('viewProperties')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('marketInsightsReport')}</CardTitle>
                <CardDescription>{t('comprehensiveAnalysisOfSelectedAreas')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{t('topGrowthArea')}: {t('westDistrict')}</div>
                    <div className="text-sm text-muted-foreground">{t('projectedGrowth')}: 5.5% {t('annually')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{t('bestRentalYield')}: {t('universityArea')}</div>
                    <div className="text-sm text-muted-foreground">{t('averageYield')}: 7.2%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{t('developmentHotspot')}: {t('techHubArea')}</div>
                    <div className="text-sm text-muted-foreground">{t('newDevelopments')}: 8 {t('projects')}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Info className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium">{t('marketRiskAssessment')}: {t('moderate')}</div>
                    <div className="text-sm text-muted-foreground">{t('marketCyclePeak')}</div>
                  </div>
                </div>
                
                <Button className="w-full mt-2">
                  {t('downloadFullReport')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysisTools;
