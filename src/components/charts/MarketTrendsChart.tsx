
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketData } from '@/contexts/MarketDataContext';

const MarketTrendsChart: React.FC = () => {
  const { language } = useLanguage();
  const { marketData } = useMarketData();

  // Sample market data (would ideally come from the MarketDataContext)
  const data = marketData?.trends || [
    { name: '2018', german: 100, european: 100, global: 100 },
    { name: '2019', german: 106, european: 104, global: 105 },
    { name: '2020', german: 110, european: 105, global: 104 },
    { name: '2021', german: 118, european: 112, global: 110 },
    { name: '2022', german: 124, european: 115, global: 112 },
    { name: '2023', german: 128, european: 119, global: 116 },
    { name: '2024', german: 132, european: 122, global: 119 }
  ];

  return (
    <div className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value}`, language === 'de' ? 'Indexwert' : 'Index Value']}
            labelFormatter={(label) => `${language === 'de' ? 'Jahr' : 'Year'}: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="german"
            name={language === 'de' ? 'Deutscher Markt' : 'German Market'}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="european"
            name={language === 'de' ? 'Europäischer Markt' : 'European Market'}
            stroke="#82ca9d"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="global"
            name={language === 'de' ? 'Globaler Markt' : 'Global Market'}
            stroke="#ffc658"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketTrendsChart;
