
import React, { useEffect, useRef, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppTheme } from '@/components/theme-provider';

// Sample data for the property comparisons
const sampleData = [
  {
    name: 'Property A',
    cashFlow: 1200,
    roi: 6.8,
    appreciation: 4.2,
  },
  {
    name: 'Property B',
    cashFlow: 950,
    roi: 5.9,
    appreciation: 3.8,
  },
  {
    name: 'Property C',
    cashFlow: 1750,
    roi: 8.1,
    appreciation: 5.7,
  },
  {
    name: 'Property D',
    cashFlow: 850,
    roi: 4.9,
    appreciation: 6.2,
  },
  {
    name: 'Property E',
    cashFlow: 1500,
    roi: 7.5,
    appreciation: 5.1,
  },
  {
    name: 'Property F',
    cashFlow: 1100,
    roi: 6.2,
    appreciation: 4.8,
  },
];

const PortfolioAnalytics: React.FC = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useAppTheme();
  const [chartData, setChartData] = useState(sampleData);
  const chartContainer = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState<number>(0);

  // Fix for chart rendering issues - re-render chart when component mounts and window is resized
  useEffect(() => {
    // Re-render chart on first load
    setChartKey(prev => prev + 1);
    
    // Re-render chart when window resizes
    const handleResize = () => {
      setChartKey(prev => prev + 1);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get theme-appropriate colors
  const textColor = isDarkMode ? '#e0e0e0' : '#333333';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const barColors = {
    cashFlow: isDarkMode ? '#6366f1' : '#4f46e5',
    roi: isDarkMode ? '#10b981' : '#059669',
    appreciation: isDarkMode ? '#f59e0b' : '#d97706'
  };

  return (
    <div ref={chartContainer} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%" key={chartKey}>
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            stroke={textColor}
            tick={{ fill: textColor }}
            tickLine={{ stroke: textColor }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            stroke={textColor}
            tick={{ fill: textColor }}
            tickLine={{ stroke: textColor }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: textColor,
              border: `1px solid ${gridColor}`,
              borderRadius: '8px'
            }} 
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar 
            dataKey="cashFlow" 
            name={t('monthlyCashFlow')} 
            fill={barColors.cashFlow} 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="roi" 
            name={t('annualROI')} 
            fill={barColors.roi} 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="appreciation" 
            name={t('annualAppreciation')} 
            fill={barColors.appreciation}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioAnalytics;
