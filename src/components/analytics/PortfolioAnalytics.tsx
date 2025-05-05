
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { sampleProperties } from '@/data/sampleData';
import { Calculator, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import AIAssistant from '../ai/AIAssistant';

// Sample data for analytics
const monthlyReturn = [
  { name: 'Jan', return: 1.2 },
  { name: 'Feb', return: 1.7 },
  { name: 'Mar', return: 1.5 },
  { name: 'Apr', return: 1.8 },
  { name: 'May', return: 2.1 },
  { name: 'Jun', return: 1.9 },
  { name: 'Jul', return: 2.3 },
  { name: 'Aug', return: 2.5 },
  { name: 'Sep', return: 2.2 },
  { name: 'Oct', return: 2.4 },
  { name: 'Nov', return: 2.6 },
  { name: 'Dec', return: 2.8 }
];

const propertyTypeReturns = [
  { name: 'Residential', value: 45 },
  { name: 'Commercial', value: 30 },
  { name: 'Industrial', value: 15 },
  { name: 'Land', value: 10 }
];

const incomeVsExpenses = [
  { name: 'Jan', income: 5000, expenses: 2200 },
  { name: 'Feb', income: 5100, expenses: 2300 },
  { name: 'Mar', income: 5300, expenses: 2100 },
  { name: 'Apr', income: 5200, expenses: 2400 },
  { name: 'May', income: 5500, expenses: 2200 },
  { name: 'Jun', income: 5600, expenses: 2300 }
];

const PortfolioAnalytics: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const performanceChartRef = useRef<HTMLDivElement>(null);
  const distributionChartRef = useRef<HTMLDivElement>(null);
  const cashflowChartRef = useRef<HTMLDivElement>(null);
  
  // Fix chart rendering on window resize
  useEffect(() => {
    const handleResize = () => {
      const charts = document.querySelectorAll('.recharts-wrapper');
      charts.forEach(chart => {
        if (chart.parentElement) {
          const parent = chart.parentElement;
          parent.style.minHeight = '250px';
          setTimeout(() => {
            // Force recharts to recalculate dimensions
            window.dispatchEvent(new Event('resize'));
          }, 100);
        }
      });
    };

    // Initial render
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate portfolio metrics
  const totalProperties = sampleProperties.length;
  const totalPortfolioValue = sampleProperties.reduce((sum, property) => sum + property.purchasePrice, 0);
  const averagePropertyValue = totalProperties > 0 ? totalPortfolioValue / totalProperties : 0;
  
  // Calculate average ROI from sample data
  const averageROI = 5.2; // In a real app, this would be calculated from actual data

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('portfolioAnalytics')}</CardTitle>
          <CardDescription>{t('trackYourInvestmentPerformance')}</CardDescription>
        </div>
        <AIAssistant 
          variant="icon" 
          size="sm"
          contextData={{ portfolioValue: totalPortfolioValue, averageROI, propertyCount: totalProperties }}
          title={t('portfolioInsights')}
          description={t('getAIRecommendationsBasedOnYourPortfolio')}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('performance')}
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChartIcon className="h-4 w-4 mr-2" />
              {t('distribution')}
            </TabsTrigger>
            <TabsTrigger value="cashflow">
              <Calculator className="h-4 w-4 mr-2" />
              {t('cashflow')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">{t('totalValue')}</div>
                <div className="text-2xl font-bold">€{totalPortfolioValue.toLocaleString()}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">{t('averageValue')}</div>
                <div className="text-2xl font-bold">€{Math.round(averagePropertyValue).toLocaleString()}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">{t('averageROI')}</div>
                <div className="text-2xl font-bold">{averageROI}%</div>
              </div>
            </div>
            
            <div ref={performanceChartRef} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyReturn} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Line 
                    type="monotone" 
                    dataKey="return" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="pt-4">
            <div ref={distributionChartRef} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeReturns}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    isAnimationActive={true}
                  />
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="cashflow" className="pt-4">
            <div ref={cashflowChartRef} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={incomeVsExpenses}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#4ade80" name={t('income')} />
                  <Bar dataKey="expenses" fill="#f87171" name={t('expenses')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PortfolioAnalytics;
