
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area
} from 'recharts';

// Sample data for property analytics
const propertyPerformanceData = [
  { month: 'Jan', income: 3200, expenses: 1200, profit: 2000 },
  { month: 'Feb', income: 3500, expenses: 1300, profit: 2200 },
  { month: 'Mar', income: 3300, expenses: 1500, profit: 1800 },
  { month: 'Apr', income: 3700, expenses: 1400, profit: 2300 },
  { month: 'May', income: 3900, expenses: 1600, profit: 2300 },
  { month: 'Jun', income: 4100, expenses: 1700, profit: 2400 },
  { month: 'Jul', income: 4300, expenses: 1800, profit: 2500 },
  { month: 'Aug', income: 4400, expenses: 1700, profit: 2700 },
  { month: 'Sep', income: 4200, expenses: 1600, profit: 2600 },
  { month: 'Oct', income: 4000, expenses: 1500, profit: 2500 },
  { month: 'Nov', income: 4200, expenses: 1700, profit: 2500 },
  { month: 'Dec', income: 4500, expenses: 1800, profit: 2700 }
];

const yearlyData = [
  { year: '2022', value: 85000, appreciation: 4.2 },
  { year: '2023', value: 92000, appreciation: 8.2 },
  { year: '2024', value: 96000, appreciation: 4.3 },
  { year: '2025', value: 103000, appreciation: 7.3 },
  { year: '2026', value: 112000, appreciation: 8.7 }
];

const propertyTypeData = [
  { name: 'Residential', value: 65 },
  { name: 'Commercial', value: 20 },
  { name: 'Industrial', value: 10 },
  { name: 'Land', value: 5 }
];

const quarterlyData = [
  { quarter: 'Q1 2023', cashflow: 6000, maintenance: 1200, vacancy: 800, management: 900 },
  { quarter: 'Q2 2023', cashflow: 6500, maintenance: 800, vacancy: 600, management: 900 },
  { quarter: 'Q3 2023', cashflow: 7000, maintenance: 1500, vacancy: 400, management: 900 },
  { quarter: 'Q4 2023', cashflow: 7200, maintenance: 2000, vacancy: 300, management: 900 },
  { quarter: 'Q1 2024', cashflow: 7500, maintenance: 1100, vacancy: 200, management: 950 },
  { quarter: 'Q2 2024', cashflow: 8000, maintenance: 900, vacancy: 400, management: 950 }
];

const marketComparisonData = [
  { name: 'Your Portfolio', cashflow: 7.2, appreciation: 6.5, combined: 13.7 },
  { name: 'Market Average', cashflow: 5.8, appreciation: 5.2, combined: 11.0 },
  { name: 'Top Quartile', cashflow: 8.5, appreciation: 7.3, combined: 15.8 }
];

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];

const PropertyAnalyticsVisualizations: React.FC = () => {
  const { t } = useLanguage();
  const [propertyId, setPropertyId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1y');
  
  // Mock property list - would come from api in real app
  const properties = [
    { id: 'all', name: 'All Properties' },
    { id: 'prop1', name: '123 Main Street' },
    { id: 'prop2', name: '456 Oak Avenue' },
    { id: 'prop3', name: '789 Pine Boulevard' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>{t('propertyAnalytics')}</CardTitle>
            <CardDescription>{t('analyzeYourPropertyPerformance')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>{property.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="2y">2 Years</SelectItem>
                <SelectItem value="5y">5 Years</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="w-full mb-4 grid grid-cols-5">
            <TabsTrigger value="monthly">{t('monthlyCashFlow')}</TabsTrigger>
            <TabsTrigger value="yearly">{t('yearlyComparison')}</TabsTrigger>
            <TabsTrigger value="quarterly">{t('quarterlyPerformance')}</TabsTrigger>
            <TabsTrigger value="distribution">{t('distribution')}</TabsTrigger>
            <TabsTrigger value="market">{t('marketComparison')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={propertyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#EC4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="value" name="Property Value" fill="#8B5CF6" />
                  <Line yAxisId="right" type="monotone" dataKey="appreciation" name="Appreciation %" stroke="#10B981" strokeWidth={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="quarterly">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="cashflow" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Area type="monotone" dataKey="maintenance" stackId="2" stroke="#EC4899" fill="#EC4899" />
                  <Area type="monotone" dataKey="vacancy" stackId="2" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="management" stackId="2" stroke="#10B981" fill="#10B981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="market">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cashflow" name="Cash Flow Return %" fill="#8B5CF6" />
                  <Bar dataKey="appreciation" name="Appreciation %" fill="#10B981" />
                  <Bar dataKey="combined" name="Combined Return %" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyAnalyticsVisualizations;
