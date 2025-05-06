
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Sample market growth data - in a real app, this would come from an API
const marketGrowthData = {
  germany: [
    { year: '2022', residential: 4.2, commercial: 3.1, land: 5.6 },
    { year: '2023', residential: 3.8, commercial: 1.9, land: 4.5 },
    { year: '2024', residential: 2.5, commercial: 1.2, land: 3.9 },
    { year: '2025', residential: 3.1, commercial: 2.7, land: 4.2 },
  ],
  austria: [
    { year: '2022', residential: 3.9, commercial: 2.8, land: 4.8 },
    { year: '2023', residential: 3.5, commercial: 1.7, land: 4.1 },
    { year: '2024', residential: 2.3, commercial: 1.0, land: 3.5 },
    { year: '2025', residential: 2.8, commercial: 2.2, land: 3.8 },
  ],
  switzerland: [
    { year: '2022', residential: 2.8, commercial: 1.9, land: 3.2 },
    { year: '2023', residential: 2.5, commercial: 1.4, land: 2.9 },
    { year: '2024', residential: 1.9, commercial: 1.0, land: 2.4 },
    { year: '2025', residential: 2.1, commercial: 1.6, land: 2.7 },
  ],
  usa: [
    { year: '2022', residential: 5.9, commercial: 4.2, land: 6.7 },
    { year: '2023', residential: 4.7, commercial: 3.1, land: 5.9 },
    { year: '2024', residential: 3.8, commercial: 2.5, land: 4.8 },
    { year: '2025', residential: 4.5, commercial: 3.8, land: 5.2 },
  ],
  canada: [
    { year: '2022', residential: 5.1, commercial: 3.7, land: 5.8 },
    { year: '2023', residential: 4.3, commercial: 2.9, land: 5.2 },
    { year: '2024', residential: 3.5, commercial: 2.2, land: 4.4 },
    { year: '2025', residential: 4.0, commercial: 3.3, land: 4.7 },
  ],
  france: [
    { year: '2022', residential: 3.7, commercial: 2.4, land: 4.5 },
    { year: '2023', residential: 3.2, commercial: 1.6, land: 3.9 },
    { year: '2024', residential: 2.1, commercial: 0.8, land: 3.0 },
    { year: '2025', residential: 2.6, commercial: 1.9, land: 3.4 },
  ],
  global: [
    { year: '2022', residential: 4.5, commercial: 3.2, land: 5.3 },
    { year: '2023', residential: 3.9, commercial: 2.3, land: 4.7 },
    { year: '2024', residential: 3.0, commercial: 1.7, land: 3.8 },
    { year: '2025', residential: 3.5, commercial: 2.8, land: 4.2 },
  ],
};

const MarketGrowthForecast: React.FC = () => {
  const { language } = useLanguage();
  const marketFilter = useMarketFilter();
  const [selectedMarket, setSelectedMarket] = useState<InvestmentMarket>(marketFilter.userMarket);
  
  // When the user's market changes, update the selected market
  useEffect(() => {
    setSelectedMarket(marketFilter.userMarket);
  }, [marketFilter.userMarket]);
  
  const handleMarketChange = (value: string) => {
    setSelectedMarket(value as InvestmentMarket);
  };
  
  const data = marketGrowthData[selectedMarket] || marketGrowthData.global;
  const availableMarkets = marketFilter.getAvailableMarkets();
  
  const colorMap = {
    residential: '#4f46e5',
    commercial: '#16a34a',
    land: '#eab308'
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>{language === 'de' ? 'Wachstumsprognose' : 'Growth Forecast'}</CardTitle>
            <CardDescription>
              {language === 'de'
                ? 'Immobilienmarkt-Wachstumsprognose bis 2025'
                : 'Real estate market growth forecast through 2025'}
            </CardDescription>
          </div>
          
          <Select value={selectedMarket} onValueChange={handleMarketChange}>
            <SelectTrigger className="w-[160px] mt-2 sm:mt-0">
              <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Select market'} />
            </SelectTrigger>
            <SelectContent>
              {marketFilter.getMarketOptions().map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            <Bar
              dataKey="residential"
              name={language === 'de' ? 'Wohnimmobilien' : 'Residential'}
              fill={colorMap.residential}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="commercial"
              name={language === 'de' ? 'Gewerbeimmobilien' : 'Commercial'}
              fill={colorMap.commercial}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="land"
              name={language === 'de' ? 'Grundstücke' : 'Land'}
              fill={colorMap.land}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarketGrowthForecast;
