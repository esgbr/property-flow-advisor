
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, BarChart3, ChartBar, ChartPie, LineChart, PieChart } from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart as ReChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const PortfolioAnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const { userMarket } = useMarketFilter();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1y');

  // Sample portfolio performance data
  const performanceData = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 103 },
    { month: 'Mar', value: 105 },
    { month: 'Apr', value: 107 },
    { month: 'May', value: 106 },
    { month: 'Jun', value: 110 },
    { month: 'Jul', value: 112 },
    { month: 'Aug', value: 114 },
    { month: 'Sep', value: 116 },
    { month: 'Oct', value: 118 },
    { month: 'Nov', value: 122 },
    { month: 'Dec', value: 125 },
  ];

  // Sample allocation data
  const allocationData = [
    { name: 'Residential', value: 65 },
    { name: 'Commercial', value: 20 },
    { name: 'Industrial', value: 10 },
    { name: 'Land', value: 5 },
  ];
  
  // Sample location data
  const locationData = [
    { name: 'Berlin', value: 35 },
    { name: 'Munich', value: 25 },
    { name: 'Hamburg', value: 20 },
    { name: 'Frankfurt', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  // Sample cash flow data
  const cashFlowData = [
    { month: 'Jan', income: 15000, expenses: 5000, net: 10000 },
    { month: 'Feb', income: 15000, expenses: 5200, net: 9800 },
    { month: 'Mar', income: 15200, expenses: 5100, net: 10100 },
    { month: 'Apr', income: 15100, expenses: 5300, net: 9800 },
    { month: 'May', income: 15300, expenses: 5200, net: 10100 },
    { month: 'Jun', income: 15400, expenses: 5100, net: 10300 },
    { month: 'Jul', income: 15500, expenses: 5400, net: 10100 },
    { month: 'Aug', income: 15600, expenses: 5300, net: 10300 },
    { month: 'Sep', income: 15700, expenses: 5400, net: 10300 },
    { month: 'Oct', income: 15800, expenses: 5300, net: 10500 },
    { month: 'Nov', income: 15900, expenses: 5200, net: 10700 },
    { month: 'Dec', income: 16000, expenses: 5100, net: 10900 },
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ChartBar className="mr-2 h-6 w-6" />
            {t('portfolioAnalytics')}
          </h1>
          <p className="text-muted-foreground">{t('insightfulDataAboutYourPortfolio')}</p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="1y" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 {t('months')}</SelectItem>
              <SelectItem value="6m">6 {t('months')}</SelectItem>
              <SelectItem value="1y">1 {t('year')}</SelectItem>
              <SelectItem value="3y">3 {t('years')}</SelectItem>
              <SelectItem value="5y">5 {t('years')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-1 h-4 w-4" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="performance">
            <LineChart className="mr-1 h-4 w-4" />
            {t('performance')}
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <PieChart className="mr-1 h-4 w-4" />
            {t('allocation')}
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <BarChart className="mr-1 h-4 w-4" />
            {t('cashFlow')}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('portfolioSummary')}</CardTitle>
                <CardDescription>{t('keyPortfolioMetrics')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalValue')}</p>
                      <p className="text-xl font-medium">€2,500,000</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('netEquity')}</p>
                      <p className="text-xl font-medium">€950,000</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('averageRoi')}</p>
                      <p className="text-xl font-medium text-green-600">7.2%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalProperties')}</p>
                      <p className="text-xl font-medium">6</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('portfolioPerformance')}</CardTitle>
                <CardDescription>{t('valueGrowthOver', { period: timeRange })}</CardDescription>
              </CardHeader>
              <CardContent className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name={t('indexedValue')} />
                  </ReChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('propertyTypeAllocation')}</CardTitle>
                <CardDescription>{t('breakdownByPropertyType')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('locationAllocation')}</CardTitle>
                <CardDescription>{t('breakdownByLocation')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>{t('detailedPerformance')}</CardTitle>
              <CardDescription>{t('individualPropertyPerformance')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name={t('portfolioValue')} fill="#8884d8" />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('propertyTypeDistribution')}</CardTitle>
                <CardDescription>{t('breakdownByPropertyType')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('geographicDistribution')}</CardTitle>
                <CardDescription>{t('breakdownByLocation')}</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle>{t('cashFlowAnalysis')}</CardTitle>
              <CardDescription>{t('incomeAndExpenses')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name={t('income')} fill="#4CAF50" />
                    <Bar dataKey="expenses" name={t('expenses')} fill="#F44336" />
                    <Bar dataKey="net" name={t('netCashFlow')} fill="#2196F3" />
                  </ReChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('averageMonthlyIncome')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">€15,500</p>
                <p className="text-sm text-muted-foreground">+3.5% {t('fromLastYear')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('averageMonthlyExpenses')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600">€5,200</p>
                <p className="text-sm text-muted-foreground">+2.1% {t('fromLastYear')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('averageMonthlyNetCashflow')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">€10,300</p>
                <p className="text-sm text-muted-foreground">+4.2% {t('fromLastYear')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioAnalyticsPage;
