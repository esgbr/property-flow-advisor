
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

const PortfolioAllocationChart: React.FC = () => {
  const { language } = useLanguage();

  // Sample data - this would typically come from a data source
  const data = [
    { name: language === 'de' ? 'Wohnen' : 'Residential', value: 55, color: '#8884d8' },
    { name: language === 'de' ? 'Gewerbe' : 'Commercial', value: 25, color: '#82ca9d' },
    { name: language === 'de' ? 'Industrie' : 'Industrial', value: 15, color: '#ffc658' },
    { name: language === 'de' ? 'Sonstiges' : 'Other', value: 5, color: '#ff8042' }
  ];

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, language === 'de' ? 'Anteil' : 'Share']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioAllocationChart;
