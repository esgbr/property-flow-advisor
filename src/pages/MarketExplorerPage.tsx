
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import MarketTrendsAnalysis from '@/components/market/MarketTrendsAnalysis';
import RentalYieldMap from '@/components/analysis/RentalYieldMap';
import NeighborhoodScorecard from '@/components/analysis/NeighborhoodScorecard';
import MacroEconomicIndicators from '@/components/analysis/MacroEconomicIndicators';
import MarketMetricsGrid from '@/components/analysis/MarketMetricsGrid';
import { Badge } from '@/components/ui/badge';
import MarketOpportunitiesTable from '@/components/analysis/MarketOpportunitiesTable';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { BarChart2 as ChartBar, Filter } from 'lucide-react';

// Sample market data
const marketDataMap: Record<string, any> = {
  germany: {
    averagePrice: '€425,000',
    averageRent: '€1,450/mo',
    yieldRange: '3.8% - 5.2%',
    growth: '+3.6%',
    keyInsights: [
      'Strong rental protections for tenants',
      'High demand in major cities like Berlin and Munich',
      'Conservative lending standards',
      'Growing interest in suburban areas post-pandemic'
    ]
  },
  usa: {
    averagePrice: '$365,000',
    averageRent: '$1,850/mo',
    yieldRange: '5.8% - 7.5%',
    growth: '+5.9%',
    keyInsights: [
      'Varied market conditions across different states',
      'Property tax considerations vary significantly by location',
      'Strong opportunity for value-add investments',
      'Growing focus on sustainable building practices'
    ]
  },
  global: {
    averagePrice: '€320,000',
    averageRent: '€1,250/mo',
    yieldRange: '4.5% - 6.3%',
    growth: '+4.2%',
    keyInsights: [
      'Increasing institutional investment in residential sector',
      'Remote work driving new location preferences',
      'Sustainability becoming a key value driver',
      'Interest rates affecting affordability in many markets'
    ]
  }
};

const MarketExplorerPage: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, getAvailableMarkets } = useMarketFilter();
  const { preferences, updatePreferences } = useUserPreferences();
  const [selectedMarket, setSelectedMarket] = useState<InvestmentMarket>(
    preferences.investmentMarket || 'global'
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [priceRange, setPriceRange] = useState([200000, 600000]);
  const [yieldRange, setYieldRange] = useState([3, 7]);
  
  const markets = getAvailableMarkets();

  // Get current market data
  const getCurrentMarketData = () => {
    return marketDataMap[selectedMarket] || marketDataMap.global;
  };
  
  const currentMarketData = getCurrentMarketData();

  // Update user preferences when selected market changes
  useEffect(() => {
    if (selectedMarket !== preferences.investmentMarket) {
      updatePreferences({ 
        ...preferences,
        investmentMarket: selectedMarket 
      });
    }
  }, [selectedMarket]);

  // Simulating map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Delay showing analytics to prevent layout shift
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnalytics(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle market change in select dropdown
  const handleMarketChange = (value: string) => {
    setSelectedMarket(value as InvestmentMarket);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('marketExplorer')}</h1>
          <p className="text-muted-foreground">{t('researchMarketsAndIdentifyOpportunities')}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedMarket} onValueChange={handleMarketChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectAMarket')} />
            </SelectTrigger>
            <SelectContent>
              {markets.map(market => (
                <SelectItem key={market.id} value={market.id}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="trends">{t('marketTrends')}</TabsTrigger>
          <TabsTrigger value="neighborhoods">{t('neighborhoodAnalysis')}</TabsTrigger>
          <TabsTrigger value="opportunities">{t('investmentOpportunities')}</TabsTrigger>
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
                  {currentMarketData.keyInsights.map((insight: string, index: number) => (
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

        {/* Neighborhood Analysis Tab */}
        <TabsContent value="neighborhoods">
          <Card>
            <CardHeader>
              <CardTitle>{t('neighborhoodAnalysis')}</CardTitle>
              <CardDescription>{t('analyzeNeighborhoods')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <RentalYieldMap />
                <NeighborhoodScorecard />
                <MacroEconomicIndicators />
                <MarketMetricsGrid />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Opportunities Tab */}
        <TabsContent value="opportunities">
          <Card>
            <CardHeader>
              <CardTitle>{t('investmentOpportunities')}</CardTitle>
              <CardDescription>{t('identifyInvestmentOpportunities')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <MarketOpportunitiesTable />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketExplorerPage;
