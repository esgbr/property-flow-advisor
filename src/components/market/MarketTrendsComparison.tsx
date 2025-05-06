
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { BarChart3, LineChart, TrendingUp, ArrowUpDown } from 'lucide-react';
import ImprovedMarketSelector from './ImprovedMarketSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getLocalizedMarketName } from '@/utils/marketHelpers';

// Historical data for markets (mock data - would come from API in real app)
const generateHistoricalData = (market: InvestmentMarket) => {
  // Base values that vary by market
  const baseValues = {
    'germany': { price: 3800, rent: 11.2, yield: 3.5 },
    'austria': { price: 3500, rent: 10.5, yield: 3.6 },
    'switzerland': { price: 7200, rent: 20.5, yield: 2.9 },
    'usa': { price: 3000, rent: 15.0, yield: 5.0 },
    'canada': { price: 3200, rent: 16.0, yield: 4.8 },
    'global': { price: 3400, rent: 14.0, yield: 4.1 }
  };
  
  const base = baseValues[market] || baseValues.global;
  
  // Growth factors that vary by market
  const growthFactors = {
    'germany': { price: 1.06, rent: 1.04, yield: 0.98 },
    'austria': { price: 1.05, rent: 1.03, yield: 0.99 },
    'switzerland': { price: 1.03, rent: 1.02, yield: 0.995 },
    'usa': { price: 1.07, rent: 1.05, yield: 0.99 },
    'canada': { price: 1.06, rent: 1.04, yield: 0.98 },
    'global': { price: 1.05, rent: 1.035, yield: 0.99 }
  };
  
  const growth = growthFactors[market] || growthFactors.global;
  
  // Generate 5 years of data with some randomness
  return Array.from({ length: 60 }, (_, i) => {
    const monthsAgo = 59 - i;
    const yearFraction = monthsAgo / 12;
    
    // Add some seasonality and random variations
    const season = Math.sin(i * 0.5) * 0.03;
    const randomPrice = (Math.random() - 0.5) * 0.04;
    const randomRent = (Math.random() - 0.5) * 0.03;
    const randomYield = (Math.random() - 0.5) * 0.02;
    
    // Calculate values with compound growth from today backwards
    const priceModifier = Math.pow(1/growth.price, yearFraction) * (1 + season + randomPrice);
    const rentModifier = Math.pow(1/growth.rent, yearFraction) * (1 + season * 0.7 + randomRent);
    const yieldModifier = Math.pow(1/growth.yield, yearFraction) * (1 + randomYield);
    
    const price = Math.round(base.price * priceModifier);
    const rent = parseFloat((base.rent * rentModifier).toFixed(1));
    const yieldValue = parseFloat((base.yield * yieldModifier).toFixed(2));
    
    // Create a date string for X axis
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    return {
      date: dateStr,
      price,
      rent,
      yield: yieldValue
    };
  });
};

const MarketTrendsComparison: React.FC = () => {
  const { language } = useLanguage();
  const { 
    currentMarket, 
    getMarketPerformanceData, 
    getMarketRecommendation, 
    isLoading 
  } = useEnhancedMarket();
  
  const [marketA, setMarketA] = useState<InvestmentMarket>(currentMarket);
  const [marketB, setMarketB] = useState<InvestmentMarket>(
    currentMarket === 'germany' ? 'austria' : 'germany'
  );
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y'>('1y');
  const [metric, setMetric] = useState<'price' | 'rent' | 'yield'>('price');
  
  // Generate market data
  const marketAData = generateHistoricalData(marketA);
  const marketBData = generateHistoricalData(marketB);
  
  // Filter data based on selected time range
  const getTimeRangeInMonths = () => {
    switch(timeRange) {
      case '1y': return 12;
      case '3y': return 36;
      case '5y': return 60;
      default: return 12;
    }
  };
  
  const filteredMarketAData = marketAData.slice(-getTimeRangeInMonths());
  const filteredMarketBData = marketBData.slice(-getTimeRangeInMonths());
  
  // Combine data for chart
  const combinedData = filteredMarketAData.map((item, index) => {
    const marketBItem = filteredMarketBData[index] || {};
    
    return {
      date: item.date,
      [`${getLocalizedMarketName(marketA, language)}`]: item[metric],
      [`${getLocalizedMarketName(marketB, language)}`]: marketBItem[metric] || 0
    };
  });
  
  // Get metric labels
  const getMetricLabel = () => {
    switch(metric) {
      case 'price': return language === 'de' ? 'Preis (€/m²)' : 'Price (€/m²)';
      case 'rent': return language === 'de' ? 'Miete (€/m²)' : 'Rent (€/m²)';
      case 'yield': return language === 'de' ? 'Rendite (%)' : 'Yield (%)';
      default: return '';
    }
  };
  
  // Get market performance comparison
  const marketAPerformance = getMarketPerformanceData(marketA);
  const marketBPerformance = getMarketPerformanceData(marketB);
  
  // Function to swap markets
  const handleSwapMarkets = () => {
    const tempMarket = marketA;
    setMarketA(marketB);
    setMarketB(tempMarket);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5" />
          {language === 'de' ? 'Markttrends-Vergleich' : 'Market Trends Comparison'}
        </CardTitle>
        <CardDescription>
          {language === 'de'
            ? 'Vergleichen Sie Trends über verschiedene Immobilienmärkte hinweg'
            : 'Compare trends across different real estate markets'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Markt A' : 'Market A'}
            </label>
            <ImprovedMarketSelector 
              onMarketChange={setMarketA} 
              defaultValue={marketA}
              className="w-full" 
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSwapMarkets} 
              className="mt-7"
              title={language === 'de' ? 'Märkte tauschen' : 'Swap markets'}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Markt B' : 'Market B'}
            </label>
            <ImprovedMarketSelector 
              onMarketChange={setMarketB} 
              defaultValue={marketB} 
              className="w-full"
              size="sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Zeitraum' : 'Time Range'}
            </label>
            <div className="flex">
              <Button 
                variant={timeRange === '1y' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('1y')}
                className="rounded-r-none flex-1"
              >
                {language === 'de' ? '1 Jahr' : '1 Year'}
              </Button>
              <Button 
                variant={timeRange === '3y' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('3y')}
                className="rounded-none border-x-0 flex-1"
              >
                {language === 'de' ? '3 Jahre' : '3 Years'}
              </Button>
              <Button 
                variant={timeRange === '5y' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setTimeRange('5y')}
                className="rounded-l-none flex-1"
              >
                {language === 'de' ? '5 Jahre' : '5 Years'}
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'de' ? 'Metrik' : 'Metric'}
            </label>
            <div className="flex">
              <Button 
                variant={metric === 'price' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setMetric('price')}
                className="rounded-r-none flex-1"
              >
                {language === 'de' ? 'Preis' : 'Price'}
              </Button>
              <Button 
                variant={metric === 'rent' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setMetric('rent')}
                className="rounded-none border-x-0 flex-1"
              >
                {language === 'de' ? 'Miete' : 'Rent'}
              </Button>
              <Button 
                variant={metric === 'yield' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setMetric('yield')}
                className="rounded-l-none flex-1"
              >
                {language === 'de' ? 'Rendite' : 'Yield'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="font-medium text-sm mb-3">
            {language === 'de' 
              ? `${getLocalizedMarketName(marketA, language)} vs. ${getLocalizedMarketName(marketB, language)} - ${getMetricLabel()}`
              : `${getLocalizedMarketName(marketA, language)} vs. ${getLocalizedMarketName(marketB, language)} - ${getMetricLabel()}`}
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={combinedData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (timeRange === '1y') {
                        return value.split('-')[1]; // Only month
                      }
                      return value; // Full date
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => {
                      if (metric === 'yield') return `${value}%`;
                      return `€${value}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (metric === 'yield') return [`${value}%`, name];
                      return [`€${value}`, name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={getLocalizedMarketName(marketA, language)}
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={getLocalizedMarketName(marketB, language)}
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              {language === 'de' ? 'Leistungsvergleich' : 'Performance Comparison'}
            </h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-sm font-medium">{language === 'de' ? 'Metrik' : 'Metric'}</div>
              <div className="grid grid-cols-2 text-sm font-medium">
                <div>{getLocalizedMarketName(marketA, language)}</div>
                <div>{getLocalizedMarketName(marketB, language)}</div>
              </div>
              
              <div className="text-sm text-muted-foreground">{language === 'de' ? 'Jährliches Wachstum' : 'Annual Growth'}</div>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-semibold">{marketAPerformance.yearlyGrowth}%</div>
                <div className="font-semibold">{marketBPerformance.yearlyGrowth}%</div>
              </div>
              
              <div className="text-sm text-muted-foreground">{language === 'de' ? '5-Jahres-Wachstum' : '5 Year Growth'}</div>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-semibold">{marketAPerformance.fiveYearGrowth}%</div>
                <div className="font-semibold">{marketBPerformance.fiveYearGrowth}%</div>
              </div>
              
              <div className="text-sm text-muted-foreground">{language === 'de' ? 'Mietrendite' : 'Rental Yield'}</div>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-semibold">{marketAPerformance.rentalYield}%</div>
                <div className="font-semibold">{marketBPerformance.rentalYield}%</div>
              </div>
              
              <div className="text-sm text-muted-foreground">{language === 'de' ? 'Leistbarkeitsindex' : 'Affordability Index'}</div>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-semibold">{marketAPerformance.affordability}</div>
                <div className="font-semibold">{marketBPerformance.affordability}</div>
              </div>
              
              <div className="text-sm text-muted-foreground">{language === 'de' ? 'Risikoniveau' : 'Risk Level'}</div>
              <div className="grid grid-cols-2 text-sm">
                <div className="font-semibold">{language === 'de' 
                  ? marketAPerformance.riskLevel === 'low' ? 'Niedrig' : marketAPerformance.riskLevel === 'medium' ? 'Mittel' : 'Hoch'
                  : marketAPerformance.riskLevel}
                </div>
                <div className="font-semibold">{language === 'de' 
                  ? marketBPerformance.riskLevel === 'low' ? 'Niedrig' : marketBPerformance.riskLevel === 'medium' ? 'Mittel' : 'Hoch'
                  : marketBPerformance.riskLevel}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {language === 'de' ? 'Marktempfehlung' : 'Market Recommendation'}
            </h3>
            
            <p className="text-sm">
              {getMarketRecommendation(marketA, marketB)}
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">
                {language === 'de' ? 'Wichtige Erkenntnisse' : 'Key Insights'}
              </h4>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>
                  {language === 'de'
                    ? `${getLocalizedMarketName(marketA, language)} zeigt ein ${marketAPerformance.yearlyGrowth > marketBPerformance.yearlyGrowth ? 'höheres' : 'niedrigeres'} jährliches Wachstum.`
                    : `${getLocalizedMarketName(marketA, language)} shows ${marketAPerformance.yearlyGrowth > marketBPerformance.yearlyGrowth ? 'higher' : 'lower'} annual growth.`}
                </li>
                <li>
                  {language === 'de'
                    ? `${getLocalizedMarketName(marketB, language)} bietet ${marketBPerformance.rentalYield > marketAPerformance.rentalYield ? 'bessere' : 'schlechtere'} Mietrenditen.`
                    : `${getLocalizedMarketName(marketB, language)} offers ${marketBPerformance.rentalYield > marketAPerformance.rentalYield ? 'better' : 'worse'} rental yields.`}
                </li>
                <li>
                  {language === 'de'
                    ? `${getLocalizedMarketName(marketAPerformance.affordability < marketBPerformance.affordability ? marketA : marketB, language)} ist leichter zugänglich in Bezug auf die Leistbarkeit.`
                    : `${getLocalizedMarketName(marketAPerformance.affordability < marketBPerformance.affordability ? marketA : marketB, language)} is more accessible in terms of affordability.`}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketTrendsComparison;
