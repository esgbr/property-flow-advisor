
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, BuildingIcon, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Sample market data
const marketTrends = [
  { month: 'Jan', value: 1000 },
  { month: 'Feb', value: 1050 },
  { month: 'Mar', value: 1100 },
  { month: 'Apr', value: 1075 },
  { month: 'May', value: 1150 },
  { month: 'Jun', value: 1200 },
  { month: 'Jul', value: 1250 },
  { month: 'Aug', value: 1300 },
  { month: 'Sep', value: 1350 },
  { month: 'Oct', value: 1400 },
  { month: 'Nov', value: 1450 },
  { month: 'Dec', value: 1500 },
];

const neighborhoodScores = [
  { name: 'Downtown', investment: 85, growth: 90, rental: 80 },
  { name: 'Westside', investment: 75, growth: 85, rental: 70 },
  { name: 'Northside', investment: 90, growth: 78, rental: 88 },
  { name: 'Eastside', investment: 65, growth: 72, rental: 78 },
  { name: 'Southside', investment: 70, growth: 68, rental: 75 },
];

const MarketAnalysisTools: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('trends');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  
  const handleSearch = () => {
    console.log('Searching for:', searchLocation);
    // In a real app, this would trigger an API call to fetch market data
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <TrendingUp className="inline-block mr-2 h-8 w-8" />
          {t('marketAnalysis')}
        </h1>
        <p className="text-muted-foreground">{t('marketAnalysisDesc')}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by city, zip code, or neighborhood..."
            className="pl-8"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
          <TabsTrigger value="investment">Investment Opportunity</TabsTrigger>
          <TabsTrigger value="reports">Market Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Market Price Trends</CardTitle>
                  <CardDescription>Average property prices over time</CardDescription>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="5y">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `$${value}`} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Price"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,250,000</div>
                <p className="text-sm text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Price Per Sq Ft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$450</div>
                <p className="text-sm text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Days on Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">28</div>
                <p className="text-sm text-muted-foreground">-3 days from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="neighborhoods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Neighborhood Comparison</CardTitle>
              <CardDescription>Investment potential across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {neighborhoodScores.map((neighborhood) => (
                  <div key={neighborhood.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{neighborhood.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Overall Score: {Math.round((neighborhood.investment + neighborhood.growth + neighborhood.rental) / 3)}%
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Investment Potential</span>
                        <span>{neighborhood.investment}%</span>
                      </div>
                      <Progress value={neighborhood.investment} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Growth Forecast</span>
                        <span>{neighborhood.growth}%</span>
                      </div>
                      <Progress value={neighborhood.growth} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Rental Yield</span>
                        <span>{neighborhood.rental}%</span>
                      </div>
                      <Progress value={neighborhood.rental} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="investment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Opportunity Index</CardTitle>
              <CardDescription>Areas with the highest investment potential</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>The Investment Opportunity Index evaluates areas based on:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Current price vs. historical trends</li>
                  <li>Rental yield potential</li>
                  <li>Development projects in the area</li>
                  <li>Economic growth indicators</li>
                  <li>Population growth and demographic shifts</li>
                </ul>
                
                <div className="h-[300px] mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { index: 0, score: 65 },
                      { index: 1, score: 75 },
                      { index: 2, score: 90 },
                      { index: 3, score: 80 },
                      { index: 4, score: 85 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip formatter={(value) => `Index: ${value}`} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Investment Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis Reports</CardTitle>
              <CardDescription>In-depth market analysis documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <BuildingIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Q2 2023 Residential Market Analysis</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <Map className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Downtown Investment Opportunities</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>5-Year Market Projection Report</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
                
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm">
                    Need a custom market analysis? Contact our team to request a detailed report
                    tailored to your specific investment criteria.
                  </p>
                  <Button className="mt-2">Request Custom Report</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysisTools;
