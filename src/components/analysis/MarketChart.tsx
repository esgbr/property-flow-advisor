
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMarketFilter } from '@/hooks/use-market-filter';

// Sample market data
const marketData = [
  { month: 'Jan', priceIndex: 100, salesVolume: 120, rentIndex: 100 },
  { month: 'Feb', priceIndex: 102, salesVolume: 118, rentIndex: 101 },
  { month: 'Mar', priceIndex: 103, salesVolume: 125, rentIndex: 102 },
  { month: 'Apr', priceIndex: 105, salesVolume: 130, rentIndex: 103 },
  { month: 'May', priceIndex: 107, salesVolume: 128, rentIndex: 104 },
  { month: 'Jun', priceIndex: 109, salesVolume: 135, rentIndex: 105 },
  { month: 'Jul', priceIndex: 112, salesVolume: 140, rentIndex: 106 },
  { month: 'Aug', priceIndex: 114, salesVolume: 138, rentIndex: 108 },
  { month: 'Sep', priceIndex: 116, salesVolume: 145, rentIndex: 110 },
  { month: 'Oct', priceIndex: 118, salesVolume: 150, rentIndex: 112 },
  { month: 'Nov', priceIndex: 120, salesVolume: 148, rentIndex: 113 },
  { month: 'Dec', priceIndex: 122, salesVolume: 155, rentIndex: 115 },
];

const MarketChart: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket } = useMarketFilter();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={marketData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="priceIndex" 
          name={t('priceIndex')} 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="rentIndex" 
          name={t('rentIndex')} 
          stroke="#82ca9d" 
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="salesVolume" 
          name={t('salesVolume')} 
          stroke="#ff7300" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MarketChart;
