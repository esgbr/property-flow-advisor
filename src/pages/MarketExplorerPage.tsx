
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Building, ChartBar, Filter, Globe, Map, MapPin, Search, Trending, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const MarketExplorerPage: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket } = useMarketFilter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMarket, setSelectedMarket] = useState(userMarket || 'germany');
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [yieldRange, setYieldRange] = useState([3, 8]);

  const marketData = {
    germany: {
      averagePrice: '€3,500/sqm',
      averageRent: '€12/sqm',
      yieldRange: '3.5% - 5.2%',
      growth: '+2.8%',
      hotAreas: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
      keyInsights: [
        'Strong tenant protection laws',
        'Low home ownership rate (51%)',
        'Attractive depreciation model (AfA)',
        'Property transfer tax varies by state (3.5% - 6.5%)'
      ]
    },
    usa: {
      averagePrice: '$260/sqft',
      averageRent: '$1.70/sqft',
      yieldRange: '5.0% - 7.5%',
      growth: '+3.5%',
      hotAreas: ['Austin', 'Denver', 'Tampa', 'Phoenix'],
      keyInsights: [
        '1031 exchange for tax-deferred property swaps',
        'Higher homeownership rate (65%)',
        'Property taxes vary by location (0.5% - 2.2%)',
        '30-year fixed mortgages common'
      ]
    },
    austria: {
      averagePrice: '€3,200/sqm',
      averageRent: '€10/sqm',
      yieldRange: '3.2% - 4.8%',
      growth: '+2.3%',
      hotAreas: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz'],
      keyInsights: [
        'Strong rental market in Vienna',
        'Transfer tax rate of 3.5%',
        'New construction often exempt from rental controls',
        'Mortgage terms typically shorter than US'
      ]
    },
    canada: {
      averagePrice: 'C$740/sqft',
      averageRent: 'C$2.80/sqft',
      yieldRange: '4.2% - 6.0%',
      growth: '+2.1%',
      hotAreas: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
      keyInsights: [
        'Foreign buyer taxes in some provinces',
        'Property transfer tax varies by province',
        'Capital gains tax (50% inclusion rate)',
        'Mortgage stress test for buyers'
      ]
    },
    france: {
      averagePrice: '€4,200/sqm',
      averageRent: '€16/sqm',
      yieldRange: '2.8% - 4.0%',
      growth: '+1.8%',
      hotAreas: ['Paris', 'Lyon', 'Nice', 'Bordeaux'],
      keyInsights: [
        'Notary fees around 7-8% for existing properties',
        'Strong tenant protection laws',
        'Non-resident tax considerations',
        'Wealth tax on high-value real estate'
      ]
    },
    switzerland: {
      averagePrice: 'CHF 10,500/sqm',
      averageRent: 'CHF 25/sqm',
      yieldRange: '2.5% - 3.5%',
      growth: '+1.5%',
      hotAreas: ['Zurich', 'Geneva', 'Basel', 'Lausanne'],
      keyInsights: [
        'Restrictions on foreign ownership',
        'Very low mortgage interest rates',
        'High down payment requirements (20-30%)',
        'Low vacancy rates in major cities'
      ]
    }
  };

  const currentMarketData = marketData[selectedMarket as keyof typeof marketData] || marketData.germany;
  
  // Filter cities based on search term
  const allCities = Object.values(marketData).flatMap(market => market.hotAreas);
  const filteredCities = allCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Globe className="mr-2 h-6 w-6" />
            {t('marketExplorer')}
          </h1>
          <p className="text-muted-foreground">{t('exploreRealEstateMarkets')}</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('searchMarkets')} 
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectMarket')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="austria">Austria</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="switzerland">Switzerland</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <ChartBar className="mr-1 h-4 w-4" />
            {t('marketOverview')}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-1 h-4 w-4" />
            {t('trends')}
          </TabsTrigger>
          <TabsTrigger value="areas">
            <Map className="mr-1 h-4 w-4" />
            {t('hotAreas')}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Trending className="mr-1 h-4 w-4" />
            {t('marketInsights')}
          </TabsTrigger>
        </TabsList>

        {/* Market Overview Tab */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedMarket.charAt(0).toUpperCase() + selectedMarket.slice(1)} {t('marketOverview')}</CardTitle>
                <CardDescription>{t('keyMarketMetrics')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('averagePrice')}</p>
                      <p className="text-xl font-medium">{currentMarketData.averagePrice}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('averageRent')}</p>
                      <p className="text-xl font-medium">{currentMarketData.averageRent}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('yieldRange')}</p>
                      <p className="text-xl font-medium">{currentMarketData.yieldRange}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('annualGrowth')}</p>
                      <p className="text-xl font-medium text-green-600">{currentMarketData.growth}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('keyInsights')}</CardTitle>
                <CardDescription>{t('importantFactorsToConsider')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentMarketData.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('investmentProperties')}</CardTitle>
              <CardDescription>{t('propertiesInMarket', { market: selectedMarket })}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('priceRange')}</p>
                  <div className="px-2">
                    <Slider 
                      defaultValue={priceRange} 
                      max={1000000} 
                      step={10000} 
                      onValueChange={setPriceRange} 
                    />
                    <div className="flex justify-between mt-1 text-sm">
                      <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(priceRange[0])}</span>
                      <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('expectedYield')}</p>
                  <div className="px-2">
                    <Slider 
                      defaultValue={yieldRange} 
                      max={10} 
                      step={0.1} 
                      onValueChange={setYieldRange} 
                    />
                    <div className="flex justify-between mt-1 text-sm">
                      <span>{yieldRange[0]}%</span>
                      <span>{yieldRange[1]}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    {t('findProperties')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t('marketTrends')}</CardTitle>
              <CardDescription>{t('realEstateMarketTrends')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <ChartBar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">{t('marketTrendsVisualization')}</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                  {t('trendsDescription')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hot Areas Tab */}
        <TabsContent value="areas">
          <Card>
            <CardHeader>
              <CardTitle>{t('hotInvestmentAreas')}</CardTitle>
              <CardDescription>{t('promisingLocationsForInvestment')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(searchTerm ? filteredCities : currentMarketData.hotAreas).map((city, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {city}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('popularity')}</span>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${i < 4 ? 'bg-primary' : 'bg-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{t('growth')}</span>
                          <span className="text-sm font-medium text-green-600">+3.2%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 w-full">
                        {t('exploreArea')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {searchTerm && filteredCities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('noMatchingAreas')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>{t('marketInsights')}</CardTitle>
              <CardDescription>{t('latestResearchAndAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{t('research')}</Badge>
                    <span className="text-sm text-muted-foreground">May 2025</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{t('marketAnalysisTitle')}</h3>
                  <p className="text-muted-foreground mb-3">{t('marketAnalysisDescription')}</p>
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('readMore')}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{t('forecast')}</Badge>
                    <span className="text-sm text-muted-foreground">April 2025</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{t('marketForecastTitle')}</h3>
                  <p className="text-muted-foreground mb-3">{t('marketForecastDescription')}</p>
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('readMore')}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{t('trends')}</Badge>
                    <span className="text-sm text-muted-foreground">March 2025</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{t('emergingTrendsTitle')}</h3>
                  <p className="text-muted-foreground mb-3">{t('emergingTrendsDescription')}</p>
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('readMore')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketExplorerPage;
