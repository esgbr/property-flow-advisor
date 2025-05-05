
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Calendar, TrendingUp, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { LiquidityForecast, LiquidityForecastEntry } from '@/interfaces/financing';

interface LiquidityPlanningProps {
  initialBalance?: number;
  associatedPropertyId?: string;
}

// Sample monthly forecast data
const generateSampleForecastData = (months: number = 24, initialBalance: number = 10000) => {
  let balance = initialBalance;
  const entries: LiquidityForecastEntry[] = [];
  
  const currentDate = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() + i);
    
    // Base rental income with some fluctuation
    const baseRentalIncome = 2000 + (Math.random() * 200 - 100);
    
    // Base expenses with seasonal fluctuations
    const month = (currentDate.getMonth() + i) % 12;
    let baseExpenses = 1200;
    
    // Higher expenses in winter months
    if (month === 0 || month === 1 || month === 11) { // Jan, Feb, Dec
      baseExpenses += 200 + (Math.random() * 100);
    }
    
    // Add some randomized expenses for maintenance
    if (i % 6 === 0) {
      baseExpenses += 500 + (Math.random() * 300);
    }
    
    // Yearly tax payment
    if (i % 12 === 3) { // April
      baseExpenses += 1200;
    }
    
    const income = baseRentalIncome;
    const expenses = baseExpenses;
    const cashFlow = income - expenses;
    balance += cashFlow;
    
    entries.push({
      date: date.toISOString(),
      income,
      expenses,
      cashFlow,
      balance,
      category: 'rental_income',
      isRecurring: true,
      recurringFrequency: 'monthly',
      description: `Month ${i + 1} forecast`
    });
  }
  
  return entries;
};

const sampleForecast: LiquidityForecast = {
  id: 'forecast-1',
  name: 'Standard 2-Year Forecast',
  createdAt: new Date().toISOString(),
  startDate: new Date().toISOString(),
  endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
  initialBalance: 10000,
  forecastEntries: generateSampleForecastData(24, 10000),
};

// Chart data helpers
const prepareChartData = (forecast: LiquidityForecast) => {
  return forecast.forecastEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    income: entry.income,
    expenses: entry.expenses,
    cashFlow: entry.cashFlow,
    balance: entry.balance,
  }));
};

const LiquidityPlanning: React.FC<LiquidityPlanningProps> = ({ initialBalance = 10000, associatedPropertyId }) => {
  const { t } = useLanguage();
  const [forecastPeriod, setForecastPeriod] = useState<number>(24);
  const [forecast, setForecast] = useState<LiquidityForecast>(sampleForecast);
  const [showIncomeConfig, setShowIncomeConfig] = useState(false);
  const [showExpenseConfig, setShowExpenseConfig] = useState(false);
  
  const chartData = prepareChartData(forecast);
  
  // Calculate key metrics from the forecast
  const lowestBalance = Math.min(...forecast.forecastEntries.map(e => e.balance));
  const highestBalance = Math.max(...forecast.forecastEntries.map(e => e.balance));
  const averageCashFlow = forecast.forecastEntries.reduce((sum, entry) => sum + entry.cashFlow, 0) / forecast.forecastEntries.length;
  const totalIncome = forecast.forecastEntries.reduce((sum, entry) => sum + entry.income, 0);
  const totalExpenses = forecast.forecastEntries.reduce((sum, entry) => sum + entry.expenses, 0);
  
  // Handle regenerating the forecast
  const handleRegenerateForecast = () => {
    const newForecast = {
      ...forecast,
      forecastEntries: generateSampleForecastData(forecastPeriod, initialBalance),
    };
    setForecast(newForecast);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('liquidityPlanning')}</h1>
          <p className="text-muted-foreground">{t('forecastYourCashFlowAndLiquidity')}</p>
        </div>
        <Button onClick={handleRegenerateForecast}>
          {t('regenerateForecast')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('initialBalance')}</CardTitle>
            <CardDescription>{t('startingLiquidityPosition')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{initialBalance.toLocaleString()}</div>
            <div className="mt-4">
              <Label>{t('forecastPeriod')}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[forecastPeriod]}
                  min={6}
                  max={60}
                  step={6}
                  onValueChange={([value]) => setForecastPeriod(value)}
                />
                <span className="font-medium w-10 text-right">{forecastPeriod}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t('months')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('cashFlowForecast')}</CardTitle>
            <CardDescription>{t('projectedMonthlyCashFlow')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{averageCashFlow.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">{t('monthlyAverage')}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="flex items-center text-sm">
                  <ArrowUp className="h-4 w-4 mr-1 text-green-500" />
                  {t('income')}
                </div>
                <p className="text-xl font-semibold">€{(totalIncome / forecastPeriod).toFixed(2)}</p>
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
                  {t('expenses')}
                </div>
                <p className="text-xl font-semibold">€{(totalExpenses / forecastPeriod).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('liquidityRange')}</CardTitle>
            <CardDescription>{t('forecastBalanceRange')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{forecast.forecastEntries[forecast.forecastEntries.length - 1].balance.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">{t('finalForecastBalance')}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-muted-foreground">{t('lowestBalance')}</div>
                <p className="text-xl font-semibold">€{lowestBalance.toLocaleString()}</p>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('highestBalance')}</div>
                <p className="text-xl font-semibold">€{highestBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('liquidityForecast')}</CardTitle>
          <CardDescription>{t('forecastDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="balance">
            <TabsList className="mb-6">
              <TabsTrigger value="balance">
                <TrendingUp className="mr-2 h-4 w-4" />
                {t('balanceForecast')}
              </TabsTrigger>
              <TabsTrigger value="cashflow">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('cashFlowAnalysis')}
              </TabsTrigger>
              <TabsTrigger value="monthly">
                <Calendar className="mr-2 h-4 w-4" />
                {t('monthlyBreakdown')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="balance" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(tick, index) => index % 3 === 0 ? tick : ''}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    name={t('balance')}
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="cashflow" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(tick, index) => index % 3 === 0 ? tick : ''}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    name={t('income')}
                    stackId="1"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    name={t('expenses')}
                    stackId="1"
                    stroke="#ff7300" 
                    fill="#ff7300" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cashFlow" 
                    name={t('cashFlow')}
                    stroke="#8884d8" 
                    fill="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="monthly" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.slice(0, 12)} // Show only the first 12 months for readability
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" name={t('income')} fill="#82ca9d" />
                  <Bar dataKey="expenses" name={t('expenses')} fill="#ff7300" />
                  <Bar dataKey="cashFlow" name={t('cashFlow')} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('incomeConfiguration')}</CardTitle>
              <CardDescription>{t('configureIncomeSource')}</CardDescription>
            </div>
            <Switch 
              checked={showIncomeConfig} 
              onCheckedChange={setShowIncomeConfig} 
            />
          </CardHeader>
          {showIncomeConfig && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>{t('baseRentalIncome')}</Label>
                  <Input 
                    type="number" 
                    placeholder="2000" 
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('annualRentIncrease')} (%)</Label>
                    <p className="text-xs text-muted-foreground">{t('yearlyIncreasePercentage')}</p>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="2" 
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('includeMiscIncome')}</Label>
                    <p className="text-xs text-muted-foreground">{t('additionalRentalIncome')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => alert(t('incomeForecastConfigSaved'))}
                    className="w-full"
                  >
                    {t('applyIncomeSettings')}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('expenseConfiguration')}</CardTitle>
              <CardDescription>{t('configureExpenseSettings')}</CardDescription>
            </div>
            <Switch 
              checked={showExpenseConfig} 
              onCheckedChange={setShowExpenseConfig} 
            />
          </CardHeader>
          {showExpenseConfig && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>{t('baseMortgagePayment')}</Label>
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>{t('maintenanceReserve')}</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="100" 
                      min="0"
                      className="mt-1"
                    />
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">{t('monthly')}</SelectItem>
                        <SelectItem value="quarterly">{t('quarterly')}</SelectItem>
                        <SelectItem value="yearly">{t('yearly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('includeSeasonalExpenses')}</Label>
                    <p className="text-xs text-muted-foreground">{t('higherExpensesInWinter')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-2">
                  <Button
                    onClick={() => alert(t('expenseForecastConfigSaved'))}
                    className="w-full"
                  >
                    {t('applyExpenseSettings')}
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LiquidityPlanning;
