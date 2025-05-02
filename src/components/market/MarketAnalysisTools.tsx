
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, BuildingIcon, Map, AlertTriangle, Globe, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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

const riskReturnData = [
  { name: 'Downtown', risk: 65, return: 85 },
  { name: 'Westside', risk: 45, return: 65 },
  { name: 'Northside', risk: 50, return: 75 },
  { name: 'Eastside', risk: 60, return: 70 },
  { name: 'Southside', risk: 40, return: 60 },
];

const MarketAnalysisTools: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('trends');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleSearch = () => {
    if (!searchLocation.trim()) {
      toast.error("Please enter a location to search");
      return;
    }
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      toast.success("Market data updated for " + searchLocation);
      // In a real app, we would update the charts with the search results
    }, 1500);
  };

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchLocation(query);
    
    if (query.length > 2) {
      setShowSuggestions(true);
      // Simulate location suggestions - in a real app this would be an API call
      const mockSuggestions = [
        `${query} City Center`, 
        `${query} Heights`, 
        `${query} Metro Area`,
        `${query} Downtown`
      ];
      setSearchResults(mockSuggestions);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchLocation(suggestion);
    setShowSuggestions(false);
  };
  
  const downloadReport = (reportType: string) => {
    toast.success(`Preparing ${reportType} report for download...`);
    // In a real app, this would trigger a report download
    setTimeout(() => {
      toast.success(`${reportType} report ready`);
    }, 2000);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <TrendingUp className="inline-block mr-2 h-8 w-8" />
          {t('marketAnalysis')}
        </h1>
        <p className="text-muted-foreground">{t('marketAnalysisDesc')}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by city, zip code, or neighborhood..."
            className="pl-8"
            value={searchLocation}
            onChange={handleLocationInput}
            onFocus={() => searchLocation.length > 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute z-10 w-full bg-white dark:bg-gray-800 rounded-md mt-1 shadow-lg border border-gray-200 dark:border-gray-700">
              <ul>
                {searchResults.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching} className="whitespace-nowrap">
          {isSearching ? "Searching..." : "Search"}
        </Button>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="5y">Last 5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
          <TabsTrigger value="investment">Risk vs Return</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
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
              <CardTitle>Risk vs. Return Analysis</CardTitle>
              <CardDescription>Evaluation of investment risk against potential returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskReturnData} barGap={8}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="risk" fill="#ff8042" name="Risk Factor" />
                      <Bar dataKey="return" fill="#82ca9d" name="Return Potential" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Investment Insights</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <div className="h-5 w-5 mr-2 flex-shrink-0 rounded-full bg-green-500"></div>
                      <span>Downtown shows highest return potential with moderate risk</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 mr-2 flex-shrink-0 rounded-full bg-amber-500"></div>
                      <span>Southside offers the best risk-adjusted returns</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 mr-2 flex-shrink-0 rounded-full bg-red-500"></div>
                      <span>Eastside currently presents highest risk profile</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Forecast</CardTitle>
              <CardDescription>Price projections for the next 24 months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Forecasts are based on historical data and current market conditions. Actual results may vary.
                </p>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', forecast: 1500, range: [1450, 1550] },
                      { month: 'Feb', forecast: 1520, range: [1460, 1580] },
                      { month: 'Mar', forecast: 1550, range: [1480, 1620] },
                      { month: 'Apr', forecast: 1580, range: [1500, 1660] },
                      { month: 'May', forecast: 1600, range: [1510, 1690] },
                      { month: 'Jun', forecast: 1650, range: [1550, 1750] },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Price Forecast"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Growth Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm">
                      <li>✓ New infrastructure development</li>
                      <li>✓ Increasing population</li>
                      <li>✓ Limited housing supply</li>
                      <li>✓ Strong local economy</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm">
                      <li>⚠️ Interest rate uncertainty</li>
                      <li>⚠️ Regulatory changes</li>
                      <li>⚠️ Market volatility</li>
                      <li>⚠️ Economic recession possibility</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis Reports</CardTitle>
              <CardDescription>Comprehensive market analysis documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <BuildingIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">Q2 2023 Residential Market Analysis</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('Q2 2023 Residential Market')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <Map className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">Downtown Investment Opportunities</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('Downtown Investment')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">5-Year Market Projection Report</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('5-Year Market Projection')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span className="font-medium">International Investment Comparison</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadReport('International Investment')}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
                
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm">
                    Need a custom market analysis? Contact our team to request a detailed report
                    tailored to your specific investment criteria.
                  </p>
                  <Button className="mt-2" onClick={() => toast.success("Custom report request submitted. Our team will contact you shortly.")}>
                    Request Custom Report
                  </Button>
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
