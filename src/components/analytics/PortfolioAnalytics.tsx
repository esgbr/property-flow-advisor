
import React, { useEffect, useRef, useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  TooltipProps 
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppTheme } from '@/components/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';

// Verbesserte Datentypen für die Immobiliendaten
interface PropertyData {
  name: string;
  cashFlow: number;
  roi: number;
  appreciation: number;
}

// Beispieldaten für den Immobilienvergleich
const sampleData: PropertyData[] = [
  {
    name: 'Immobilie A',
    cashFlow: 1200,
    roi: 6.8,
    appreciation: 4.2,
  },
  {
    name: 'Immobilie B',
    cashFlow: 950,
    roi: 5.9,
    appreciation: 3.8,
  },
  {
    name: 'Immobilie C',
    cashFlow: 1750,
    roi: 8.1,
    appreciation: 5.7,
  },
  {
    name: 'Immobilie D',
    cashFlow: 850,
    roi: 4.9,
    appreciation: 6.2,
  },
  {
    name: 'Immobilie E',
    cashFlow: 1500,
    roi: 7.5,
    appreciation: 5.1,
  },
  {
    name: 'Immobilie F',
    cashFlow: 1100,
    roi: 6.2,
    appreciation: 4.8,
  },
];

// Angepasstes Tooltip-Format für bessere Lesbarkeit
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const { t, language } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-background border border-border p-2 rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <div className="space-y-1 mt-1">
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name === t('monthlyCashFlow') 
                  ? `${entry.value} €` 
                  : `${entry.value}%`
              }
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const PortfolioAnalytics: React.FC = () => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useAppTheme();
  const [chartData, setChartData] = useState<PropertyData[]>(sampleData);
  const chartContainer = useRef<HTMLDivElement>(null);
  const [chartKey, setChartKey] = useState<number>(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Lokalisierte Immobiliennamen entsprechend der gewählten Sprache
  useEffect(() => {
    if (language === 'de') {
      // Deutsche Immobiliendaten verwenden
      setChartData(prevData => 
        prevData.map((item, index) => ({
          ...item,
          name: `Immobilie ${String.fromCharCode(65 + index)}` // A, B, C, ...
        }))
      );
    } else {
      // Standardnamen für andere Sprachen
      setChartData(prevData => 
        prevData.map((item, index) => ({
          ...item,
          name: `Property ${String.fromCharCode(65 + index)}` // A, B, C, ...
        }))
      );
    }
  }, [language]);

  // Fix für Chart-Rendering-Probleme - Chart neu rendern, wenn die Komponente gemounted wird und beim Ändern des Fensters
  useEffect(() => {
    // Chart beim ersten Laden neu rendern
    setChartKey(prev => prev + 1);
    
    // Chart bei Fensteränderungen neu rendern
    const handleResize = () => {
      setChartKey(prev => prev + 1);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Design-angepasste Farben
  const textColor = isDarkMode ? '#e0e0e0' : '#333333';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const barColors = {
    cashFlow: isDarkMode ? '#6366f1' : '#4f46e5',
    roi: isDarkMode ? '#10b981' : '#059669',
    appreciation: isDarkMode ? '#f59e0b' : '#d97706'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('propertyComparison')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <div ref={chartContainer} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%" key={chartKey}>
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: isMobile ? 60 : 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="name" 
                stroke={textColor}
                tick={{ fill: textColor }}
                tickLine={{ stroke: textColor }}
                angle={isMobile ? -45 : -30}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis 
                stroke={textColor}
                tick={{ fill: textColor }}
                tickLine={{ stroke: textColor }}
              />
              <Tooltip content={<CustomTooltip />} />
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
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalytics;
