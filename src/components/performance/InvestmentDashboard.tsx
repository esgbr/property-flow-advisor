
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, ChartBarIcon, ChartLineUp, PieChart, TrendingUp } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';

// Sample data - this would come from your backend in a real app
const portfolioData = [
  {
    name: "Jan",
    cashFlow: 4000,
    appreciation: 2400,
    totalValue: 240000,
  },
  {
    name: "Feb",
    cashFlow: 5000,
    appreciation: 1398,
    totalValue: 245000,
  },
  {
    name: "Mar",
    cashFlow: 5500,
    appreciation: 9800,
    totalValue: 255000,
  },
  {
    name: "Apr",
    cashFlow: 4780,
    appreciation: 3908,
    totalValue: 258000,
  },
  {
    name: "May",
    cashFlow: 5890,
    appreciation: 4800,
    totalValue: 265000,
  },
  {
    name: "Jun",
    cashFlow: 6390,
    appreciation: 3800,
    totalValue: 273000,
  },
];

const propertyData = [
  { name: 'Residential Apartment', value: 45 },
  { name: 'Commercial Retail', value: 20 },
  { name: 'Vacation Rental', value: 15 },
  { name: 'Office Space', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface InvestmentDashboardProps {
  className?: string;
}

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({ className }) => {
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | '5y'>('6m');

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Performance</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeframe === '6m' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('6m')}
          >
            6 Months
          </Button>
          <Button 
            variant={timeframe === '1y' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('1y')}
          >
            1 Year
          </Button>
          <Button 
            variant={timeframe === '5y' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('5y')}
          >
            5 Years
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Cash Flow
            </CardTitle>
            <CardDescription>Monthly income after expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{portfolioData[portfolioData.length - 1].cashFlow}</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% from last month
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart
                data={portfolioData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="cashFlow" stroke="#8884d8" fillOpacity={1} fill="url(#colorCashFlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Property Value
            </CardTitle>
            <CardDescription>Total portfolio value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{portfolioData[portfolioData.length - 1].totalValue.toLocaleString()}</div>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3% appreciation
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={portfolioData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="totalValue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary" />
              Portfolio Mix
            </CardTitle>
            <CardDescription>Asset allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={propertyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Detailed metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roi">
            <TabsList>
              <TabsTrigger value="roi">ROI</TabsTrigger>
              <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
              <TabsTrigger value="appreciation">Appreciation</TabsTrigger>
            </TabsList>
            <TabsContent value="roi" className="space-y-4">
              <div className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cashFlow" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="appreciation" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground">
                Return on investment combines cash flow and property appreciation, showing your overall performance.
              </p>
            </TabsContent>
            <TabsContent value="cashflow" className="space-y-4">
              <div className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cashFlow" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground">
                Monthly cash flow represents your rental income after expenses, indicating how much passive income your properties generate.
              </p>
            </TabsContent>
            <TabsContent value="appreciation" className="space-y-4">
              <div className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="appreciation" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground">
                Property appreciation shows how your real estate assets are gaining value over time, contributing to your overall wealth growth.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentDashboard;
