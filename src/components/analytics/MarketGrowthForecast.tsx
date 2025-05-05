
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ReferenceArea, ReferenceLine
} from 'recharts';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

interface MarketForecastData {
  month: string;
  historical: number;
  forecast: number;
  optimistic?: number;
  pessimistic?: number;
}

// Generate forecast data for different markets
const generateForecastData = (market: InvestmentMarket): MarketForecastData[] => {
  // Base growth rates for different markets
  const marketGrowthRates: Record<string, number> = {
    'germany': 3.2,
    'usa': 4.5,
    'france': 2.8,
    'austria': 3.0,
    'switzerland': 2.5,
    'canada': 3.8,
    'global': 3.5,
    'other': 3.0
  };
  
  // Use market-specific growth rate or default to global
  const growthRate = marketGrowthRates[market] || marketGrowthRates.global;
  
  // Determine starting value based on market
  const startValue = market === 'switzerland' || market === 'usa' ? 500000 :
                    market === 'germany' || market === 'austria' ? 350000 :
                    300000;
  
  // Generate historical data (past 6 months)
  const data: MarketForecastData[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  let value = startValue;
  
  // Past 6 months (historical)
  for (let i = -6; i <= 0; i++) {
    const monthIndex = (currentMonth + i + 12) % 12;
    const variance = (Math.random() * 0.5 - 0.25) * growthRate; // Add some randomness
    value = value * (1 + ((growthRate + variance) / 100));
    
    data.push({
      month: months[monthIndex],
      historical: Math.round(value),
      forecast: i === 0 ? Math.round(value) : undefined as any // Only add forecast point for current month
    });
  }
  
  // Next 12 months (forecast)
  const forecastStartValue = value;
  for (let i = 1; i <= 12; i++) {
    const monthIndex = (currentMonth + i) % 12;
    
    // Calculate forecast with different scenarios
    const baseGrowth = forecastStartValue * Math.pow(1 + (growthRate / 100), i / 12);
    const optimisticGrowth = forecastStartValue * Math.pow(1 + ((growthRate + 1.5) / 100), i / 12);
    const pessimisticGrowth = forecastStartValue * Math.pow(1 + ((growthRate - 1) / 100), i / 12);
    
    data.push({
      month: months[monthIndex],
      historical: undefined as any,
      forecast: Math.round(baseGrowth),
      optimistic: Math.round(optimisticGrowth),
      pessimistic: Math.round(pessimisticGrowth)
    });
  }
  
  return data;
};

const MarketGrowthForecast: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket, getAvailableMarkets } = useMarketFilter();
  const [selectedMarket, setSelectedMarket] = useState<InvestmentMarket>(userMarket || 'global');
  const [forecastRange, setForecastRange] = useState<string>('12m');
  
  const markets = getAvailableMarkets();
  const forecastData = generateForecastData(selectedMarket);
  
  // Get only the relevant portion of data based on selected forecast range
  const getDisplayData = () => {
    // We always show all historical data (first 7 points)
    const historical = forecastData.slice(0, 7);
    
    // Then add forecast data based on selection
    let forecastMonths = 12; // Default
    if (forecastRange === '6m') forecastMonths = 6;
    if (forecastRange === '3m') forecastMonths = 3;
    if (forecastRange === '24m') forecastMonths = 12; // We only have 12 months of forecast data in this example
    
    return [...historical, ...forecastData.slice(7, 7 + forecastMonths)];
  };
  
  // Format currency based on market
  const formatCurrency = (value: number) => {
    const currencyMap: Record<string, string> = {
      'germany': '€',
      'austria': '€',
      'france': '€',
      'switzerland': 'CHF',
      'usa': '$',
      'canada': 'C$'
    };
    
    const currency = currencyMap[selectedMarket] || '€';
    return `${currency}${value.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{t('forecastedGrowth')}</CardTitle>
            <CardDescription>{t('propertyValueProjections')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMarket} onValueChange={(value) => setSelectedMarket(value as InvestmentMarket)}>
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
            <Select value={forecastRange} onValueChange={setForecastRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 {t('months')}</SelectItem>
                <SelectItem value="6m">6 {t('months')}</SelectItem>
                <SelectItem value="12m">12 {t('months')}</SelectItem>
                <SelectItem value="24m">24 {t('months')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getDisplayData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `${value/1000}k`} 
                domain={['dataMin - 20000', 'dataMax + 20000']} 
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              
              {/* Historical line */}
              <Line 
                type="monotone" 
                dataKey="historical" 
                name={t('historicalValues')} 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              
              {/* Forecast line */}
              <Line 
                type="monotone" 
                dataKey="forecast" 
                name={t('forecast')} 
                stroke="#3B82F6" 
                strokeWidth={3} 
                strokeDasharray="5 5" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }} 
              />
              
              {/* Optimistic scenario */}
              <Line 
                type="monotone" 
                dataKey="optimistic" 
                name={t('optimisticScenario')} 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="3 3" 
                dot={false}
              />
              
              {/* Pessimistic scenario */}
              <Line 
                type="monotone" 
                dataKey="pessimistic" 
                name={t('pessimisticScenario')} 
                stroke="#F43F5E" 
                strokeWidth={2} 
                strokeDasharray="3 3" 
                dot={false}
              />
              
              {/* Add a reference line for current date */}
              <ReferenceLine x={forecastData[6].month} stroke="#888" strokeDasharray="3 3" label="Now" />
              
              {/* Reference area showing forecast range */}
              <ReferenceArea 
                x1={forecastData[6].month} 
                x2={getDisplayData()[getDisplayData().length - 1].month} 
                strokeOpacity={0.3} 
                fill="#8884d8"
                fillOpacity={0.1} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketGrowthForecast;
