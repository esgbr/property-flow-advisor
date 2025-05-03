
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartBar, LineChart as LineChartIcon, MapPin, ArrowUpRight, TrendingUp, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Market data
const marketData = [
  { month: 'Jan', currentYear: 950, previousYear: 850, forecast: 980 },
  { month: 'Feb', currentYear: 930, previousYear: 870, forecast: 960 },
  { month: 'Mar', currentYear: 980, previousYear: 880, forecast: 1000 },
  { month: 'Apr', currentYear: 1000, previousYear: 890, forecast: 1020 },
  { month: 'May', currentYear: 1050, previousYear: 900, forecast: 1080 },
  { month: 'Jun', currentYear: 1080, previousYear: 940, forecast: 1100 },
  { month: 'Jul', currentYear: 1120, previousYear: 960, forecast: 1150 },
  { month: 'Aug', currentYear: 1150, previousYear: 980, forecast: 1180 },
  { month: 'Sep', currentYear: 1180, previousYear: 1000, forecast: 1200 },
  { month: 'Oct', currentYear: 1200, previousYear: 1050, forecast: 1230 },
  { month: 'Nov', currentYear: 1230, previousYear: 1100, forecast: 1260 },
  { month: 'Dec', currentYear: 1260, previousYear: 1150, forecast: 1300 },
];

const regionalData = [
  { region: 'Downtown', residential: 1200, commercial: 2200 },
  { region: 'Suburbs', residential: 1800, commercial: 1200 },
  { region: 'Industrial', residential: 600, commercial: 2800 },
  { region: 'Waterfront', residential: 2200, commercial: 1500 },
  { region: 'Tech District', residential: 1400, commercial: 2600 },
];

const MarketAnalysis = () => {
  const [market, setMarket] = useState('national');
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Market Analysis</h2>
          <p className="text-muted-foreground">Track real estate market trends and forecasts</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="regional">Regional</SelectItem>
              <SelectItem value="local">Local</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Price Trends
          </TabsTrigger>
          <TabsTrigger value="regional">
            <MapPin className="h-4 w-4 mr-2" />
            Regional Analysis
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Forecast
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Per Square Foot</CardTitle>
              <CardDescription>Historical and current market prices</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={marketData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="currentYear" stroke="#8884d8" name="2024" />
                  <Line type="monotone" dataKey="previousYear" stroke="#82ca9d" name="2023" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Year-over-Year Change</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">+9.8%</div>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-xs text-muted-foreground">Compared to previous year</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Days on Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">24</div>
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">7 days faster than last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">3.2 months</div>
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-xs text-muted-foreground">Seller's market conditions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Price Comparison</CardTitle>
              <CardDescription>Residential vs Commercial by Area</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart
                  data={regionalData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="residential" fill="#8884d8" name="Residential" />
                  <Bar dataKey="commercial" fill="#82ca9d" name="Commercial" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Appreciating Areas</CardTitle>
                <CardDescription>Highest price growth regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Tech District</span>
                    <span className="font-medium text-emerald-600">+12.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Waterfront</span>
                    <span className="font-medium text-emerald-600">+10.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Downtown</span>
                    <span className="font-medium text-emerald-600">+8.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suburbs</span>
                    <span className="font-medium text-emerald-600">+6.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Industrial</span>
                    <span className="font-medium text-emerald-600">+4.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Development Activity</CardTitle>
                <CardDescription>New construction and renovations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Downtown</div>
                      <div className="text-sm text-muted-foreground">Mixed-use development</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downtown development details loaded")}>Details</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Suburbs</div>
                      <div className="text-sm text-muted-foreground">Residential communities</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Suburbs development details loaded")}>Details</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Waterfront</div>
                      <div className="text-sm text-muted-foreground">Luxury condominiums</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Waterfront development details loaded")}>Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>12-Month Price Forecast</CardTitle>
              <CardDescription>Projected market trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={marketData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="currentYear" stackId="1" stroke="#8884d8" fill="#8884d8" name="Current" />
                  <Area type="monotone" dataKey="forecast" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expected Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+3.2%</div>
                <p className="text-xs text-muted-foreground">Over the next 12 months</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Market Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">High</div>
                <p className="text-xs text-muted-foreground">Based on economic indicators</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Interest Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Stable</div>
                <p className="text-xs text-muted-foreground">Projected to remain consistent</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Opportunity Assessment</CardTitle>
              <CardDescription>Strategic recommendations based on forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="font-medium">Downtown Commercial</div>
                  <div className="text-sm mt-1">Strong opportunity for office space conversion to mixed-use development due to shifting work patterns.</div>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="font-medium">Suburban Residential</div>
                  <div className="text-sm mt-1">Continued growth expected in family-friendly neighborhoods with good schools and amenities.</div>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="font-medium">Tech District</div>
                  <div className="text-sm mt-1">Highest appreciation potential with increasing demand from tech companies and employees.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysis;
