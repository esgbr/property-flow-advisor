import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, TrendingUp, AlertTriangle, RefreshCcw, Share2, Download, Filter, BarChart, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Sample data for monthly cash flow
const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400, cashflow: 1600 },
  { name: 'Feb', income: 3000, expenses: 1398, cashflow: 1602 },
  { name: 'Mar', income: 2000, expenses: 9800, cashflow: -7800 },
  { name: 'Apr', income: 2780, expenses: 3908, cashflow: -1128 },
  { name: 'May', income: 1890, expenses: 4800, cashflow: -2910 },
  { name: 'Jun', income: 2390, expenses: 3800, cashflow: -1410 },
  { name: 'Jul', income: 3490, expenses: 4300, cashflow: -810 },
  { name: 'Aug', income: 4000, expenses: 2400, cashflow: 1600 },
  { name: 'Sep', income: 3000, expenses: 1398, cashflow: 1602 },
  { name: 'Oct', income: 2000, expenses: 9800, cashflow: -7800 },
  { name: 'Nov', income: 2780, expenses: 3908, cashflow: -1128 },
  { name: 'Dec', income: 1890, expenses: 4800, cashflow: -2910 },
];

// Sample data for quarterly cash flow
const quarterlyData = [
  { name: 'Q1', income: 11000, expenses: 5000, cashflow: 6000 },
  { name: 'Q2', income: 8000, expenses: 12000, cashflow: -4000 },
  { name: 'Q3', income: 9000, expenses: 7000, cashflow: 2000 },
  { name: 'Q4', income: 12000, expenses: 6000, cashflow: 6000 },
];

// Sample data for annual cash flow
const annualData = [
  { name: '2023', income: 40000, expenses: 25000, cashflow: 15000 },
  { name: '2024', income: 45000, expenses: 28000, cashflow: 17000 },
  { name: '2025', income: 50000, expenses: 30000, cashflow: 20000 },
];

// Sample data for income distribution
const incomeDistribution = [
  { name: 'Rent', value: 70 },
  { name: 'Other Income', value: 30 },
];

// Sample data for expense distribution
const expenseDistribution = [
  { name: 'Mortgage', value: 40 },
  { name: 'Maintenance', value: 20 },
  { name: 'Taxes', value: 15 },
  { name: 'Insurance', value: 10 },
  { name: 'Management', value: 10 },
  { name: 'Other', value: 5 },
];

// Colors for pie charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

const CashFlowForecasting: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('monthly');
  const [scenario, setScenario] = useState('baseline');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleScenarioChange = (value: string) => {
    setScenario(value);
  };
  
  const calculateROI = (scenario: string) => {
    let cashOnCash = 10;
    let capRate = 7;
    let dcr = 1.5;
    let grm = 8;
    let breakEven = 90;
    
    if (scenario === 'optimistic') {
      cashOnCash = 15;
      capRate = 10;
      dcr = 1.8;
      grm = 7;
      breakEven = 85;
    } else if (scenario === 'pessimistic') {
      cashOnCash = 5;
      capRate = 4;
      dcr = 1.2;
      grm = 9;
      breakEven = 95;
    }
    
    return {
      cashOnCash,
      capRate,
      dcr,
      grm,
      breakEven,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Cash Flow Forecasting</h2>
          <p className="text-muted-foreground">Project future cash flows for your properties</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            toast.success("Cash flow data refreshed");
          }}>
            <RefreshCcw className="mr-1 h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => {
            toast.success("Cash flow report downloaded");
          }}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => {
            toast.success("Filter applied to cash flow data");
          }}>
            <Filter className="mr-1 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="monthly">
            <BarChart className="h-4 w-4 mr-2" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="quarterly">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Quarterly
          </TabsTrigger>
          <TabsTrigger value="annual">
            <TrendingUp className="h-4 w-4 mr-2" />
            Annual
          </TabsTrigger>
        </TabsList>
        
        {/* Monthly Cash Flow Forecast */}
        <TabsContent value="monthly">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Selection</CardTitle>
                <CardDescription>Select different cash flow scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={scenario === 'baseline' ? 'default' : 'outline'} 
                      onClick={() => handleScenarioChange('baseline')}
                      className="w-full"
                    >
                      Baseline
                    </Button>
                    <Button 
                      variant={scenario === 'optimistic' ? 'default' : 'outline'} 
                      onClick={() => handleScenarioChange('optimistic')}
                      className="w-full"
                    >
                      Optimistic
                    </Button>
                    <Button 
                      variant={scenario === 'pessimistic' ? 'default' : 'outline'} 
                      onClick={() => handleScenarioChange('pessimistic')}
                      className="w-full"
                    >
                      Pessimistic
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vacancy-rate">Vacancy Rate (%)</Label>
                    <Input id="vacancy-rate" type="number" defaultValue="5" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-cost">Maintenance Cost (%)</Label>
                    <Input id="maintenance-cost" type="number" defaultValue="10" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rent-increase">Annual Rent Increase (%)</Label>
                    <Input id="rent-increase" type="number" defaultValue="3" />
                  </div>
                  
                  <Button className="w-full" onClick={() => {
                    toast.success("Forecast updated with new parameters");
                  }}>
                    Update Forecast
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Cash Flow Projection</CardTitle>
                <CardDescription>Next 12 months cash flow forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8884d8" name="Income" />
                    <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                    <Bar dataKey="cashflow" fill="#ffc658" name="Net Cash Flow" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
                <CardDescription>Breakdown of income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width={isMobile ? "100%" : 200} height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={incomeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {incomeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {incomeDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Breakdown of expense categories</CardHeader>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width={isMobile ? "100%" : 200} height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={expenseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {expenseDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cash on Cash Return</span>
                    <span className="font-bold text-primary">{calculateROI(scenario).cashOnCash}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cap Rate</span>
                    <span className="font-bold">{calculateROI(scenario).capRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Debt Coverage Ratio</span>
                    <span className="font-bold">{calculateROI(scenario).dcr}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gross Rent Multiplier</span>
                    <span className="font-bold">{calculateROI(scenario).grm}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Break Even Ratio</span>
                    <span className="font-bold">{calculateROI(scenario).breakEven}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Quarterly Cash Flow Forecast */}
        <TabsContent value="quarterly">
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Cash Flow Projection</CardTitle>
              <CardDescription>Cash flow forecast by quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={quarterlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                  <Line type="monotone" dataKey="cashflow" stroke="#ffc658" name="Net Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Annual Cash Flow Forecast */}
        <TabsContent value="annual">
          <Card>
            <CardHeader>
              <CardTitle>Annual Cash Flow Projection</CardTitle>
              <CardDescription>Long-term cash flow forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={annualData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                  <Line type="monotone" dataKey="cashflow" stroke="#ffc658" name="Net Cash Flow" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashFlowForecasting;
