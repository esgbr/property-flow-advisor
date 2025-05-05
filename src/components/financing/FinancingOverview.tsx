
import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, LineChart, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { FinancingPlan } from '@/interfaces/financing';

interface FinancingOverviewProps {
  plans: FinancingPlan[];
}

const FinancingOverview: React.FC<FinancingOverviewProps> = ({ plans }) => {
  const { t } = useLanguage();
  
  const financialSummary = useMemo(() => {
    if (!plans.length) return null;
    
    const totalLoanAmount = plans.reduce((sum, plan) => sum + plan.loanAmount, 0);
    const totalMonthlyPayment = plans.reduce((sum, plan) => sum + plan.monthlyPayment, 0);
    const weightedInterestRate = plans.reduce((sum, plan) => 
      sum + (plan.interestRate * (plan.loanAmount / totalLoanAmount)), 0);
    
    // Calculate total remaining principal
    const now = new Date();
    const totalRemainingPrincipal = plans.reduce((sum, plan) => {
      const latestPayment = [...plan.paymentSchedule].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return latestPayment ? sum + latestPayment.remainingBalance : sum + plan.loanAmount;
    }, 0);
    
    // Calculate yearly payments by lender
    const paymentsByLender = plans.reduce((acc, plan) => {
      const yearlyPayment = plan.monthlyPayment * 12;
      acc[plan.lender] = (acc[plan.lender] || 0) + yearlyPayment;
      return acc;
    }, {} as Record<string, number>);
    
    const paymentsByLenderChart = Object.entries(paymentsByLender).map(([lender, amount]) => ({
      name: lender,
      value: amount
    }));
    
    // Calculate payments by year for the next 5 years
    const currentYear = new Date().getFullYear();
    const nextFiveYears = [...Array(5)].map((_, i) => currentYear + i);
    
    const paymentsByYear = nextFiveYears.map(year => {
      const totalForYear = plans.reduce((sum, plan) => {
        // Simplified calculation - in reality, you'd need to check if loan is still active
        return sum + (plan.monthlyPayment * 12);
      }, 0);
      
      return {
        name: year.toString(),
        amount: totalForYear
      };
    });
    
    return {
      totalLoanAmount,
      totalRemainingPrincipal,
      totalMonthlyPayment,
      weightedInterestRate,
      paymentsByLenderChart,
      paymentsByYear,
      numberOfPlans: plans.length
    };
  }, [plans]);
  
  // If there are no plans, show a placeholder
  if (!financialSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('financingOverview')}</CardTitle>
          <CardDescription>{t('addFinancingPlansToSeeOverview')}</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">{t('noFinancingData')}</p>
        </CardContent>
      </Card>
    );
  }
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('activePlans')}</CardTitle>
              <CardDescription>
                {t('totalActivePlans')}: {financialSummary.numberOfPlans}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                €{financialSummary.totalLoanAmount.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{t('totalLoanVolume')}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('remainingPrincipal')}</span>
                  <span className="font-medium">
                    €{financialSummary.totalRemainingPrincipal.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(financialSummary.totalRemainingPrincipal / financialSummary.totalLoanAmount) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('monthlyPayments')}</CardTitle>
              <CardDescription>
                {t('averageInterestRate')}: {financialSummary.weightedInterestRate.toFixed(2)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                €{financialSummary.totalMonthlyPayment.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">{t('perMonth')}</p>
              <div className="mt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-muted-foreground">{t('yearlyPayments')}</span>
                  <span className="font-medium">
                    €{(financialSummary.totalMonthlyPayment * 12).toLocaleString()}
                  </span>
                </div>
                <div className="bg-muted p-2 rounded-md">
                  <span className="text-xs flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                    {t('nextPayment')}: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('paymentForecast')}</CardTitle>
            <CardDescription>{t('next5YearsPayments')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">
                  <BarChart className="mr-2 h-4 w-4" />
                  {t('barChart')}
                </TabsTrigger>
                <TabsTrigger value="line">
                  <LineChart className="mr-2 h-4 w-4" />
                  {t('lineChart')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={financialSummary.paymentsByYear}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toLocaleString()}`, t('yearlyPayments')]}
                    />
                    <Legend />
                    <Bar dataKey="amount" name={t('yearlyPayments')} fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="line" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={financialSummary.paymentsByYear}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`€${value.toLocaleString()}`, t('yearlyPayments')]}
                    />
                    <Legend />
                    <Bar dataKey="amount" name={t('yearlyPayments')} fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t('distributionByLender')}</CardTitle>
            <CardDescription>{t('yearlyPaymentsByLender')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialSummary.paymentsByLenderChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {financialSummary.paymentsByLenderChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`€${value.toLocaleString()}`, t('yearlyPayments')]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancingOverview;
