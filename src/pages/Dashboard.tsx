
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, BarChart2, ChevronsRight, Bell, LineChart, BarChart, ChevronRight } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import PropertySummary from '@/components/property/PropertySummary';
import PropertyValueChart from '@/components/charts/PropertyValueChart';
import RecentTransactions from '@/components/finance/RecentTransactions';
import MarketUpdateCard from '@/components/market/MarketUpdateCard';
import PortfolioAllocationChart from '@/components/charts/PortfolioAllocationChart';
import MarketTrendsChart from '@/components/charts/MarketTrendsChart';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  const properties = [
    { id: 1, name: 'Apartment 12B', value: 350000, location: 'Berlin', rental_yield: 4.2, ownership: 100 },
    { id: 2, name: 'Commercial Space', value: 520000, location: 'Frankfurt', rental_yield: 5.8, ownership: 100 },
    { id: 3, name: 'Residential Building', value: 1250000, location: 'Munich', rental_yield: 3.9, ownership: 75 }
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t('welcomeBack')}, {preferences.name || t('investor')}
            </h1>
            <p className="text-muted-foreground">
              {t('dashboardDescription')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
              <Bell className="h-4 w-4 mr-1" />
              <span>2</span>
            </Button>
            <Button onClick={() => navigate('/properties')}>
              {t('viewProperties')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('portfolioValue')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€2,120,000</div>
              <p className="text-sm text-green-600 flex items-center">
                +5.2% <span className="text-muted-foreground ml-1">{t('fromLastMonth')}</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('monthlyIncome')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">€8,450</div>
              <p className="text-sm text-green-600 flex items-center">
                +2.1% <span className="text-muted-foreground ml-1">{t('fromLastMonth')}</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('averageYield')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.7%</div>
              <p className="text-sm text-muted-foreground">
                {t('acrossAllProperties')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="properties">{t('properties')}</TabsTrigger>
            <TabsTrigger value="market">{t('market')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>{t('portfolioPerformance')}</CardTitle>
                  <CardDescription>{t('portfolioPerformanceDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertyValueChart />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('recentTransactions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto">
                    {t('viewAll')} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('portfolioAllocation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PortfolioAllocationChart />
                </CardContent>
              </Card>
            </div>
            
            <MarketUpdateCard />
          </TabsContent>
          
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{t('yourProperties')}</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/properties')}>
                {t('viewAll')} <ChevronsRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertySummary key={property.id} property={property} />
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('propertyValuesOverTime')}</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <MarketTrendsChart />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  {t('exportData')}
                </Button>
                <Button size="sm" className="ml-auto">
                  {t('analyzePerformance')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('marketTrends')}</CardTitle>
                  <CardDescription>
                    {t('marketTrendsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <MarketTrendsChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('yourMarket')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{preferences.investmentMarket === 'germany' ? 'Deutscher Markt' : 'German Market'}</p>
                        <p className="text-sm text-muted-foreground">{t('yourPrimaryMarket')}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('averagePriceGrowth')}</p>
                        <p className="font-medium">+4.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('averageYield')}</p>
                        <p className="font-medium">3.8%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('liquidity')}</p>
                        <p className="font-medium">{t('high')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button size="sm" className="w-full" onClick={() => navigate('/market-explorer')}>
                    {t('exploreMarket')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('regionalComparison')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>Berlin</p>
                        <p className="font-medium">€4,500 / m²</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>Munich</p>
                        <p className="font-medium">€7,800 / m²</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>Hamburg</p>
                        <p className="font-medium">€5,100 / m²</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>Frankfurt</p>
                        <p className="font-medium">€5,600 / m²</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="h-full w-full flex items-center justify-center bg-muted/50 rounded-lg">
                      <BarChart className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => navigate('/regional-analysis')}>
                  {t('viewDetailedAnalysis')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
