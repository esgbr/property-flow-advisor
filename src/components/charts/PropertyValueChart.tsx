
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const PropertyValueChart: React.FC = () => {
  const { language } = useLanguage();

  // Sample property value data over time
  const data = [
    { month: 'Jan', value: 1850000 },
    { month: 'Feb', value: 1870000 },
    { month: 'Mar', value: 1890000 },
    { month: 'Apr', value: 1905000 },
    { month: 'May', value: 1935000 },
    { month: 'Jun', value: 1960000 },
    { month: 'Jul', value: 1975000 },
    { month: 'Aug', value: 2010000 },
    { month: 'Sep', value: 2045000 },
    { month: 'Oct', value: 2080000 },
    { month: 'Nov', value: 2095000 },
    { month: 'Dec', value: 2120000 }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`} 
            domain={['dataMin - 50000', 'dataMax + 50000']}
          />
          <Tooltip 
            formatter={(value) => [`€${value.toLocaleString()}`, language === 'de' ? 'Portfoliowert' : 'Portfolio Value']}
            labelFormatter={(label) => `${language === 'de' ? 'Monat' : 'Month'}: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyValueChart;
