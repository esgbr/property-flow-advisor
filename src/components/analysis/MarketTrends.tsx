
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for market trends
const priceData = [
  { year: '2019', singleFamily: 250000, condo: 180000, duplex: 320000, commercial: 450000 },
  { year: '2020', singleFamily: 265000, condo: 185000, duplex: 335000, commercial: 440000 },
  { year: '2021', singleFamily: 295000, condo: 195000, duplex: 360000, commercial: 470000 },
  { year: '2022', singleFamily: 335000, condo: 210000, duplex: 390000, commercial: 510000 },
  { year: '2023', singleFamily: 370000, condo: 230000, duplex: 425000, commercial: 545000 }
];

const rentData = [
  { year: '2019', singleFamily: 1500, condo: 1200, duplex: 1800, commercial: 2500 },
  { year: '2020', singleFamily: 1550, condo: 1250, duplex: 1850, commercial: 2450 },
  { year: '2021', singleFamily: 1650, condo: 1300, duplex: 1950, commercial: 2600 },
  { year: '2022', singleFamily: 1800, condo: 1400, duplex: 2100, commercial: 2750 },
  { year: '2023', singleFamily: 1950, condo: 1500, duplex: 2250, commercial: 2900 }
];

const yieldData = [
  { year: '2019', singleFamily: 5.2, condo: 6.1, duplex: 5.8, commercial: 6.5 },
  { year: '2020', singleFamily: 5.0, condo: 6.0, duplex: 5.7, commercial: 6.3 },
  { year: '2021', singleFamily: 4.9, condo: 5.9, duplex: 5.6, commercial: 6.2 },
  { year: '2022', singleFamily: 5.1, condo: 6.0, duplex: 5.8, commercial: 6.4 },
  { year: '2023', singleFamily: 5.2, condo: 6.2, duplex: 5.9, commercial: 6.7 }
];

const MarketTrends: React.FC = () => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState('5year');
  const [propertyType, setPropertyType] = useState('all');

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('historicalMarketTrends')}</CardTitle>
              <CardDescription>{t('trackPerformanceOverTime')}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeframe === '1year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('1year')}
              >
                1Y
              </Button>
              <Button
                variant={timeframe === '5year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('5year')}
              >
                5Y
              </Button>
              <Button
                variant={timeframe === '10year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('10year')}
              >
                10Y
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="price">
            <TabsList className="mb-6">
              <TabsTrigger value="price">{t('prices')}</TabsTrigger>
              <TabsTrigger value="rent">{t('rents')}</TabsTrigger>
              <TabsTrigger value="yield">{t('yields')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={priceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="singleFamily" name={t('singleFamily')} fill="#8884d8" />
                  <Bar dataKey="condo" name={t('condo')} fill="#82ca9d" />
                  <Bar dataKey="duplex" name={t('duplex')} fill="#ffc658" />
                  <Bar dataKey="commercial" name={t('commercial')} fill="#ff8042" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="rent" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={rentData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="singleFamily" name={t('singleFamily')} fill="#8884d8" />
                  <Bar dataKey="condo" name={t('condo')} fill="#82ca9d" />
                  <Bar dataKey="duplex" name={t('duplex')} fill="#ffc658" />
                  <Bar dataKey="commercial" name={t('commercial')} fill="#ff8042" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="yield" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={yieldData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="singleFamily" name={t('singleFamily')} fill="#8884d8" />
                  <Bar dataKey="condo" name={t('condo')} fill="#82ca9d" />
                  <Bar dataKey="duplex" name={t('duplex')} fill="#ffc658" />
                  <Bar dataKey="commercial" name={t('commercial')} fill="#ff8042" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('yearOverYearGrowth')}</CardTitle>
            <CardDescription>{t('annualGrowthByCategory')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>{t('singleFamilyHomes')}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+4.8%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>{t('condominiums')}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+3.2%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>{t('multiFamilyUnits')}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+5.1%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span>{t('commercialProperties')}</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">-1.2%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>{t('vacantLand')}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+6.7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('keyTrendIndicators')}</CardTitle>
            <CardDescription>{t('marketMovementSummary')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{t('priceToRentRatio')}</span>
                  <span className="text-sm font-medium">17.3</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{t('buyersFavor')}</span>
                  <span>{t('balanced')}</span>
                  <span>{t('rentersFavor')}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{t('affordabilityIndex')}</span>
                  <span className="text-sm font-medium">82.5</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{t('unaffordable')}</span>
                  <span>{t('moderate')}</span>
                  <span>{t('affordable')}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{t('marketLiquidity')}</span>
                  <span className="text-sm font-medium">76.2</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{t('illiquid')}</span>
                  <span>{t('average')}</span>
                  <span>{t('liquid')}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{t('newDevelopmentIndex')}</span>
                  <span className="text-sm font-medium">92.7</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{t('slow')}</span>
                  <span>{t('stable')}</span>
                  <span>{t('rapid')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MarketTrends;
