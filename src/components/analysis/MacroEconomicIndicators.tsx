
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Building,
  DollarSign,
  Banknote,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for economic indicators
const economicData = [
  { year: '2019', gdpGrowth: 2.2, inflation: 1.8, unemployment: 3.5, housingStarts: 90 },
  { year: '2020', gdpGrowth: -3.5, inflation: 1.2, unemployment: 8.1, housingStarts: 70 },
  { year: '2021', gdpGrowth: 5.7, inflation: 4.7, unemployment: 5.4, housingStarts: 95 },
  { year: '2022', gdpGrowth: 2.1, inflation: 8.0, unemployment: 3.9, housingStarts: 85 },
  { year: '2023', gdpGrowth: 2.5, inflation: 4.1, unemployment: 3.7, housingStarts: 88 },
  { year: '2024', gdpGrowth: 1.8, inflation: 3.0, unemployment: 3.5, housingStarts: 92 },
];

const MacroEconomicIndicators: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('macroEconomicTrends')}</CardTitle>
          <CardDescription>{t('economicFactorsAffectingRealEstate')}</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={economicData}
              margin={{
                top: 5,
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
              <Line type="monotone" dataKey="gdpGrowth" name={t('gdpGrowth')} stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="inflation" name={t('inflation')} stroke="#82ca9d" />
              <Line type="monotone" dataKey="unemployment" name={t('unemployment')} stroke="#ff7300" />
              <Line type="monotone" dataKey="housingStarts" name={t('housingStarts')} stroke="#0088fe" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('interestRates')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3.5%</div>
              <div className="text-red-500 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +0.25%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('centralBankRate')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('inflation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3.0%</div>
              <div className="text-green-500 text-sm flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -1.1%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('annualInflationRate')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('unemployment')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">3.5%</div>
              <div className="text-green-500 text-sm flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -0.2%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('nationalUnemploymentRate')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('gdpGrowth')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">1.8%</div>
              <div className="text-amber-500 text-sm flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -0.7%
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('annualGDPGrowthRate')}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('economicFactors')}</CardTitle>
            <CardDescription>{t('impactOnRealEstate')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <Percent className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{t('mortgageRateTrend')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('mortgageRateTrendDescription')}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-xs ml-2">6.5%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <Building className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{t('housingStarts')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('housingStartsDescription')}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs ml-2">102k</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{t('disposableIncome')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('disposableIncomeDescription')}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <span className="text-xs ml-2">+2.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('economicOutlook')}</CardTitle>
            <CardDescription>{t('forecastAndPredictions')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start">
                <Banknote className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">{t('monetaryPolicy')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('monetaryPolicyDescription')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">{t('demographicTrends')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('demographicTrendsDescription')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">{t('constructionCosts')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('constructionCostsDescription')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('downloadFullReport')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default MacroEconomicIndicators;
