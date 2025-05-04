
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calendar, Home, Landmark, LineChart, PieChart, TrendingUp } from 'lucide-react';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import { PropertyScanner } from '@/components/property/PropertyScanner';
import InvestmentOpportunityFeed from '@/components/property/InvestmentOpportunityFeed';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Home className="mr-2 h-6 w-6" />
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground">{t('trackYourRealEstateInvestments')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('investmentSummary')}</CardTitle>
              <CardDescription>{t('portfolioOverview')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <LineChart className="mr-2 h-4 w-4" />
              {t('viewTrends')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-muted-foreground text-sm">{t('totalValue')}</div>
                <div className="text-2xl font-bold mt-1">€2,450,000</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +8.3%
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-muted-foreground text-sm">{t('totalProperties')}</div>
                <div className="text-2xl font-bold mt-1">6</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +1
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-muted-foreground text-sm">{t('monthlyCashFlow')}</div>
                <div className="text-2xl font-bold mt-1">€12,500</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +4.2%
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-muted-foreground text-sm">{t('totalEquity')}</div>
                <div className="text-2xl font-bold mt-1">€950,000</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +10.5%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('upcomingEvents')}</CardTitle>
            <CardDescription>{t('propertiesAndInvestments')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('propertyInspection')}</p>
                  <p className="text-xs text-muted-foreground">123 Main St, May 10, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Landmark className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('mortgagePaymentDue')}</p>
                  <p className="text-xs text-muted-foreground">Rental Property A, May 15</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t('propertyTaxDue')}</p>
                  <p className="text-xs text-muted-foreground">456 Oak Ave, May 20</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('portfolioPerformance')}</CardTitle>
          <CardDescription>{t('trackInvestmentGrowth')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList>
              <TabsTrigger value="performance">
                <LineChart className="h-4 w-4 mr-2" />
                {t('performance')}
              </TabsTrigger>
              <TabsTrigger value="allocation">
                <PieChart className="h-4 w-4 mr-2" />
                {t('allocation')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="pt-4">
              <PortfolioDashboard />
            </TabsContent>
            <TabsContent value="allocation" className="pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{t('assetAllocation')}</h3>
                  <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">{t('assetAllocationChart')}</p>
                      <p className="text-xs text-muted-foreground">{t('breakdownByPropertyType')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t('residential')}</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t('commercial')}</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t('mixed')}</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{t('land')}</span>
                      <span className="font-medium">5%</span>
                    </div>
                    <div className="bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <PropertyScanner />
        <InvestmentOpportunityFeed />
      </div>
    </div>
  );
};

export default Dashboard;
