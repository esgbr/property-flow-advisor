
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, TrendingUp, ArrowUpDown, Calendar, Settings } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart as ReLineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Historical cash flow data
const historicalCashFlow = [
  { month: 'Jan', income: 12500, expenses: 7200, netCashFlow: 5300 },
  { month: 'Feb', income: 12700, expenses: 7500, netCashFlow: 5200 },
  { month: 'Mar', income: 12700, expenses: 7800, netCashFlow: 4900 },
  { month: 'Apr', income: 12900, expenses: 7300, netCashFlow: 5600 },
  { month: 'May', income: 13100, expenses: 7600, netCashFlow: 5500 },
  { month: 'Jun', income: 13200, expenses: 7400, netCashFlow: 5800 },
];

// Forecasted cash flow data for next 12 months
const forecastedCashFlow = [
  { month: 'Jul', income: 13400, expenses: 7500, netCashFlow: 5900, predictedLow: 5600, predictedHigh: 6200 },
  { month: 'Aug', income: 13500, expenses: 7600, netCashFlow: 5900, predictedLow: 5500, predictedHigh: 6300 },
  { month: 'Sep', income: 13700, expenses: 7800, netCashFlow: 5900, predictedLow: 5500, predictedHigh: 6400 },
  { month: 'Oct', income: 13900, expenses: 8000, netCashFlow: 5900, predictedLow: 5400, predictedHigh: 6500 },
  { month: 'Nov', income: 14100, expenses: 8100, netCashFlow: 6000, predictedLow: 5500, predictedHigh: 6700 },
  { month: 'Dec', income: 14300, expenses: 8300, netCashFlow: 6000, predictedLow: 5400, predictedHigh: 6700 },
  { month: 'Jan', income: 14500, expenses: 8400, netCashFlow: 6100, predictedLow: 5500, predictedHigh: 6800 },
  { month: 'Feb', income: 14700, expenses: 8500, netCashFlow: 6200, predictedLow: 5600, predictedHigh: 7000 },
  { month: 'Mar', income: 14900, expenses: 8600, netCashFlow: 6300, predictedLow: 5700, predictedHigh: 7100 },
  { month: 'Apr', income: 15100, expenses: 8700, netCashFlow: 6400, predictedLow: 5800, predictedHigh: 7200 },
  { month: 'May', income: 15300, expenses: 8800, netCashFlow: 6500, predictedLow: 5900, predictedHigh: 7300 },
  { month: 'Jun', income: 15500, expenses: 8900, netCashFlow: 6600, predictedLow: 6000, predictedHigh: 7400 },
];

// Scenario data for different interest rate environments
const scenarios = [
  { name: 'Current (3.5%)', cashFlow: 6000, totalReturn: 8.5, appreciation: 3.2 },
  { name: 'Low Rates (2.0%)', cashFlow: 6800, totalReturn: 9.7, appreciation: 3.5 },
  { name: 'High Rates (5.0%)', cashFlow: 5200, totalReturn: 7.2, appreciation: 2.8 },
  { name: 'Recession', cashFlow: 4500, totalReturn: 5.1, appreciation: 0.5 },
  { name: 'Economic Boom', cashFlow: 7200, totalReturn: 12.3, appreciation: 6.5 },
];

const incomeBreakdown = [
  { name: 'Rental Income', value: 85 },
  { name: 'Parking Fees', value: 5 },
  { name: 'Laundry Services', value: 3 },
  { name: 'Late Fees', value: 2 },
  { name: 'Other', value: 5 },
];

const expenseBreakdown = [
  { name: 'Mortgage', value: 45 },
  { name: 'Property Tax', value: 15 },
  { name: 'Insurance', value: 8 },
  { name: 'Maintenance', value: 12 },
  { name: 'Management Fees', value: 10 },
  { name: 'Utilities', value: 7 },
  { name: 'Other', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const CashFlowForecasting: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('12m');
  const [scenarioMode, setScenarioMode] = useState<string>('current');
  const { toast } = useToast();

  // Combine historical and forecasted data for full timeline view
  const combinedData = [...historicalCashFlow, ...forecastedCashFlow];
  
  const displayData = timeframe === '6m' 
    ? combinedData.slice(combinedData.length - 6)
    : timeframe === '12m'
      ? combinedData.slice(combinedData.length - 12)
      : combinedData;

  const handleGenerateReport = () => {
    toast({
      title: "Generating forecast report",
      description: "Your cash flow forecast report is being generated. It will be available in the reports section shortly.",
    });
  };

  const handleScenarioChange = (value: string) => {
    setScenarioMode(value);
    toast({
      title: "Scenario updated",
      description: `Forecasting calculations updated to the "${value}" scenario.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-6 w-6" />
            Cash Flow Forecasting
          </h2>
          <p className="text-muted-foreground">Project future financial performance based on historical data</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={timeframe}
            onValueChange={setTimeframe}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="12 Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="all">All Data</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport}>
            <Calendar className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Net Cash Flow</CardTitle>
            <CardDescription>Current and projected monthly cash flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{forecastedCashFlow[0].netCashFlow}</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{((forecastedCashFlow[0].netCashFlow - historicalCashFlow[historicalCashFlow.length-1].netCashFlow) / historicalCashFlow[historicalCashFlow.length-1].netCashFlow * 100).toFixed(1)}% from last month
            </p>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Area type="monotone" dataKey="netCashFlow" stroke="#0088FE" fillOpacity={1} fill="url(#colorCashFlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Income vs. Expenses</CardTitle>
            <CardDescription>Monthly revenue and cost breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Income</div>
                <div className="text-xl font-bold text-green-600">€{forecastedCashFlow[0].income}</div>
              </div>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mx-2" />
              <div>
                <div className="text-sm text-muted-foreground">Expenses</div>
                <div className="text-xl font-bold text-red-500">€{forecastedCashFlow[0].expenses}</div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#82ca9d" />
                  <Bar dataKey="expenses" name="Expenses" fill="#ff7373" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Forecast Confidence</CardTitle>
            <CardDescription>Projected cash flow with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">Forecasted range for next quarter</div>
            <div className="text-xl font-bold">
              €{forecastedCashFlow[2].predictedLow} - €{forecastedCashFlow[2].predictedHigh}
            </div>
            <div className="h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastedCashFlow}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Area type="monotone" dataKey="predictedHigh" stroke="none" fill="#8884d8" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="netCashFlow" stroke="#8884d8" fill="url(#splitColor)" />
                  <Area type="monotone" dataKey="predictedLow" stroke="none" fill="#8884d8" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Scenario Analysis</CardTitle>
          <CardDescription>Compare financial performance in different economic scenarios</CardDescription>
          <div className="mt-2">
            <Tabs value={scenarioMode} onValueChange={handleScenarioChange}>
              <TabsList>
                <TabsTrigger value="current">Current Rates</TabsTrigger>
                <TabsTrigger value="low">Low Rates</TabsTrigger>
                <TabsTrigger value="high">High Rates</TabsTrigger>
                <TabsTrigger value="recession">Recession</TabsTrigger>
                <TabsTrigger value="boom">Economic Boom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scenarios}
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
                  <Tooltip formatter={(value, name) => [
                    name === 'cashFlow' ? `€${value}` : `${value}%`, 
                    name === 'cashFlow' ? 'Monthly Cash Flow' : name === 'totalReturn' ? 'Total Return' : 'Appreciation'
                  ]} />
                  <Legend />
                  <Bar dataKey="cashFlow" name="Monthly Cash Flow" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scenarios}
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
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="totalReturn" name="Total Return %" fill="#82ca9d" />
                  <Bar dataKey="appreciation" name="Appreciation %" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6 border p-4 rounded-lg">
            <h3 className="font-medium mb-2">Scenario Impact Analysis</h3>
            <div className="text-sm text-muted-foreground">
              {scenarioMode === 'current' && (
                <>Current interest rates at 3.5% offer balanced cash flow performance with moderate appreciation potential.</>
              )}
              {scenarioMode === 'low' && (
                <>Lower interest rates (2.0%) significantly boost cash flow and increase property values through higher demand.</>
              )}
              {scenarioMode === 'high' && (
                <>Higher interest rates (5.0%) reduce cash flow as financing costs increase, also slowing appreciation.</>
              )}
              {scenarioMode === 'recession' && (
                <>Economic recession threatens rental income stability and property values, reducing both cash flow and appreciation.</>
              )}
              {scenarioMode === 'boom' && (
                <>Economic boom creates strong rental demand and significant property value growth, maximizing returns.</>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <Badge className={
                  scenarioMode === 'current' || scenarioMode === 'low' || scenarioMode === 'boom' 
                    ? 'bg-green-500' 
                    : scenarioMode === 'high' 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }>
                  Cash Flow Impact
                </Badge>
              </div>
              <div>
                <Badge className={
                  scenarioMode === 'boom' 
                    ? 'bg-green-500' 
                    : scenarioMode === 'current' || scenarioMode === 'low' 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                }>
                  Value Appreciation
                </Badge>
              </div>
              <div>
                <Badge className={
                  scenarioMode === 'recession'
                    ? 'bg-green-500'
                    : scenarioMode === 'high'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }>
                  Buying Opportunities
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income Breakdown</CardTitle>
            <CardDescription>Sources of monthly property income</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 flex flex-wrap gap-2 justify-center">
              {incomeBreakdown.map((item, index) => (
                <Badge key={item.name} style={{backgroundColor: COLORS[index % COLORS.length]}} className="text-white">
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of monthly property expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 flex flex-wrap gap-2 justify-center">
              {expenseBreakdown.map((item, index) => (
                <Badge key={item.name} style={{backgroundColor: COLORS[index % COLORS.length]}} className="text-white">
                  {item.name}: {item.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-muted border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Settings className="h-6 w-6 mr-2 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Advanced Forecasting Settings</h3>
                <p className="text-sm text-muted-foreground">Adjust parameters used in the cash flow prediction model</p>
              </div>
            </div>
            <Button variant="outline">Configure Variables</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowForecasting;
