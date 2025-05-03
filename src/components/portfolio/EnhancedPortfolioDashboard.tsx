
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, BarChart3, Building, Calculator, ChartBar, Lightbulb, List, PieChart, TrendingUp } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import PortfolioAnalytics from '@/components/analytics/PortfolioAnalytics';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { SearchInput } from '@/components/ui/search-input';

// Sample data
const portfolioData = [
  { name: "Jan", cashFlow: 4000, appreciation: 2400, totalValue: 240000 },
  { name: "Feb", cashFlow: 5000, appreciation: 1398, totalValue: 245000 },
  { name: "Mar", cashFlow: 5500, appreciation: 9800, totalValue: 255000 },
  { name: "Apr", cashFlow: 4780, appreciation: 3908, totalValue: 258000 },
  { name: "May", cashFlow: 5890, appreciation: 4800, totalValue: 265000 },
  { name: "Jun", cashFlow: 6390, appreciation: 3800, totalValue: 273000 },
];

const propertyData = [
  { name: 'Residential Apartment', value: 45 },
  { name: 'Commercial Retail', value: 20 },
  { name: 'Vacation Rental', value: 15 },
  { name: 'Office Space', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Dummy data for visualizations
const portfolioSummary = {
  totalValue: 2500000,
  equity: 950000,
  totalProperties: 6,
  cashFlow: 12500,
  roi: 7.2,
  appreciation: 5.4,
  debt: 1550000
};

const EnhancedPortfolioDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<'6m' | '1y' | '5y'>('6m');
  const [searchQuery, setSearchQuery] = useState("");

  const handleActionClick = (action: string) => {
    toast({
      title: t('featureNotification'),
      description: `${action} ${t('featureComingSoon')}`,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    console.log("Selected location:", place.formatted_address);
    toast({
      title: t('locationSelected'),
      description: place.formatted_address,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Building className="inline-block mr-2 h-8 w-8" />
            {t('investmentPortfolio')}
          </h1>
          <p className="text-muted-foreground">{t('trackYourRealEstateInvestments')}</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchInput 
            usePlacesAutocomplete 
            placeholder={t('searchProperties')} 
            value={searchQuery}
            onChange={handleSearch}
            onLocationSelect={handleLocationSelect}
            className="w-64"
          />
          <Button variant="outline" size="sm" onClick={() => handleActionClick(t('addNewProperty'))}>
            {t('addProperty')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('portfolioValue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{portfolioSummary.totalValue.toLocaleString()}</div>
            <div className="flex justify-between mt-2">
              <div className="text-sm text-muted-foreground">{t('equity')}: €{portfolioSummary.equity.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('debt')}: €{portfolioSummary.debt.toLocaleString()}</div>
            </div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(portfolioSummary.equity / portfolioSummary.totalValue) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('cashFlow')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              €{portfolioSummary.cashFlow.toLocaleString()}
              <span className="text-base text-muted-foreground">/mo</span>
            </div>
            <div className="text-sm text-green-500 font-medium mt-2">
              <TrendingUp className="inline-block mr-1 h-4 w-4" />
              {t('positive')}
            </div>
            <ResponsiveContainer width="100%" height={100} className="mt-4">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorCashFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={false} hide />
                <Area 
                  type="monotone" 
                  dataKey="cashFlow" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorCashFlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('returnsAndGrowth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <div>
                <div className="text-sm text-muted-foreground">{t('cashOnCashROI')}</div>
                <div className="text-xl font-semibold">{portfolioSummary.roi}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('appreciation')}</div>
                <div className="text-xl font-semibold">{portfolioSummary.appreciation}%</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">{t('totalReturn')}</div>
              <div className="font-medium">{(portfolioSummary.roi + portfolioSummary.appreciation).toFixed(1)}%</div>
            </div>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${((portfolioSummary.roi + portfolioSummary.appreciation) / 15) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('propertyPerformance')}</CardTitle>
            <CardDescription>{t('compareYourInvestments')}</CardDescription>
            <div className="flex items-center space-x-2 mt-2">
              <Button 
                variant={timeframe === '6m' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('6m')}
              >
                6 {t('months')}
              </Button>
              <Button 
                variant={timeframe === '1y' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('1y')}
              >
                1 {t('year')}
              </Button>
              <Button 
                variant={timeframe === '5y' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('5y')}
              >
                5 {t('years')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cashflow">
              <TabsList className="mb-4">
                <TabsTrigger value="cashflow">
                  <Calculator className="mr-1 h-4 w-4" />
                  {t('cashFlow')}
                </TabsTrigger>
                <TabsTrigger value="roi">
                  <PieChart className="mr-1 h-4 w-4" />
                  {t('roi')}
                </TabsTrigger>
                <TabsTrigger value="appreciation">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  {t('appreciation')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cashflow" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="cashFlow" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="roi" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="cashFlow" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="appreciation" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="appreciation" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="appreciation" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('portfolioMix')}</CardTitle>
            <CardDescription>{t('assetAllocation')}</CardDescription>
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
                <RechartsTooltip />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => handleActionClick(t('optimizePortfolio'))}
            >
              {t('optimizePortfolio')}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('investmentGoals')}</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleActionClick(t('editGoals'))}>{t('edit')}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">{t('cashflowGoal')}</div>
              <div className="text-sm">€15,000 / €25,000</div>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">{t('equityTarget')}</div>
              <div className="text-sm">€950,000 / €1,500,000</div>
            </div>
            <Progress value={63} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <div className="text-sm font-medium">{t('totalPropertiesGoal')}</div>
              <div className="text-sm">6 / 10</div>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('portfolioAlerts')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{t('refinancingOpportunity')}</div>
                <p className="text-sm text-muted-foreground">
                  {t('propertyEligibleRefinancing')}
                </p>
                <Button 
                  size="sm" 
                  variant="link" 
                  className="p-0 h-auto mt-1" 
                  onClick={() => handleActionClick(t('viewDetails'))}
                >
                  {t('viewDetails')}
                </Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">{t('marketOpportunity')}</div>
                <p className="text-sm text-muted-foreground">
                  {t('newPropertyMatchingCriteria')}
                </p>
                <Badge className="mt-2" variant="outline">{t('northDistrict')}</Badge>
                <Button 
                  size="sm" 
                  variant="link" 
                  className="p-0 h-auto mt-1 block" 
                  onClick={() => handleActionClick(t('viewProperty'))}
                >
                  {t('viewProperty')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t('propertyValueIncreased')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('yesterday')} - {t('cityCenter')}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-green-500">+3.5%</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded">
                  <Calculator className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t('mortgagePayment')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    3 {t('daysAgo')} - {t('suburbanProperty')}
                  </p>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline">€1,250</Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded">
                  <List className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {t('documentUpdated')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 {t('daysAgo')} - {t('apartmentComplex')}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7"
                    onClick={() => handleActionClick(t('view'))}
                  >
                    {t('view')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPortfolioDashboard;
