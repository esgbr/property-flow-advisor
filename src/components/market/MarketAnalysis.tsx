
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart, MapPin, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample market data
const marketTrendData = [
  { month: 'Jan', currentYear: 525, previousYear: 480, forecast: 540 },
  { month: 'Feb', currentYear: 528, previousYear: 485, forecast: 545 },
  { month: 'Mar', currentYear: 540, previousYear: 490, forecast: 550 },
  { month: 'Apr', currentYear: 550, previousYear: 495, forecast: 555 },
  { month: 'May', currentYear: 545, previousYear: 500, forecast: 560 },
  { month: 'Jun', currentYear: 560, previousYear: 505, forecast: 565 },
];

const vacancyRateData = [
  { region: 'Downtown', rate: 3.5, change: -0.5, arrow: 'down' },
  { region: 'Suburbs', rate: 2.8, change: -0.2, arrow: 'down' },
  { region: 'Industrial', rate: 5.1, change: 0.8, arrow: 'up' },
  { region: 'Retail', rate: 7.2, change: 1.2, arrow: 'up' },
  { region: 'Office', rate: 9.5, change: 2.1, arrow: 'up' },
];

const rentalYieldData = [
  { region: 'Downtown', residential: 4.1, commercial: 5.8 },
  { region: 'Suburbs', residential: 5.2, commercial: 6.3 },
  { region: 'Industrial Area', residential: 5.8, commercial: 7.5 },
  { region: 'University District', residential: 6.3, commercial: 5.1 },
  { region: 'Waterfront', residential: 3.9, commercial: 5.5 },
];

const MarketAnalysis: React.FC = () => {
  const [region, setRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('6m');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Market Analysis Tool</h2>
          <p className="text-muted-foreground">Real-time market data for informed investment decisions</p>
        </div>
        <div className="flex space-x-2">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="suburbs">Suburbs</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="6 Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="5y">5 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Price Trends
          </CardTitle>
          <CardDescription>Average price per square foot over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketTrendData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: '€ / Square Foot', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `€${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="previousYear"
                  stroke="#8884d8"
                  name="Previous Year"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="currentYear"
                  stroke="#82ca9d"
                  name="Current Year"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#ff7300"
                  name="Forecast"
                  strokeDasharray="3 4 5 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <strong>Market Insight:</strong> Prices in all regions have increased by an average of 4.2% compared to last year, with downtown areas showing the strongest growth at 6.1%.
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Vacancy Rates
            </CardTitle>
            <CardDescription>Current vacancy percentages by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vacancyRateData.map((item) => (
                <div key={item.region} className="flex items-center justify-between p-3 border rounded-md">
                  <span className="font-medium">{item.region}</span>
                  <div className="flex items-center">
                    <span className="text-lg font-bold">{item.rate}%</span>
                    <span className={`ml-2 flex items-center ${item.arrow === 'down' ? 'text-green-500' : 'text-red-500'}`}>
                      {item.arrow === 'down' ? (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Vacancy rates for residential properties are generally decreasing, indicating a strong rental market with high demand.
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Rental Yield Comparison
            </CardTitle>
            <CardDescription>Residential vs. Commercial yield by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rentalYieldData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis label={{ value: 'Yield %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="residential" name="Residential" fill="#8884d8" />
                  <Bar dataKey="commercial" name="Commercial" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Commercial properties consistently show higher yields, but residential properties in the Industrial Area and University District are closing the gap.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalysis;
