
import React, { useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { FinancingPlan, PaymentScheduleEntry } from '@/interfaces/financing';

interface PaymentScheduleViewProps {
  plans: FinancingPlan[];
}

interface ComparisonDataPoint {
  date: string;
  totalPayment: number;
  principal: number;
  interest: number;
  remaining: number;
  originalDate: Date;
}

const PaymentScheduleView: React.FC<PaymentScheduleViewProps> = ({ plans }) => {
  const { t } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans.length > 0 ? plans[0].id : '');
  
  const selectedPlan = useMemo(() => plans.find(p => p.id === selectedPlanId), [selectedPlanId, plans]);
  
  // Generate consistent chart data from payment schedules
  const chartData = useMemo(() => {
    if (!selectedPlan || !selectedPlan.paymentSchedule) return [];
    
    return selectedPlan.paymentSchedule
      .map(payment => ({
        date: new Date(payment.date).toLocaleDateString(),
        originalDate: new Date(payment.date),
        payment: payment.paymentNumber,
        totalPayment: payment.totalPayment,
        principal: payment.principalPayment,
        interest: payment.interestPayment,
        remaining: payment.remainingBalance
      }))
      .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());
  }, [selectedPlan]);
  
  // Generate liquidity forecast for all plans combined
  const liquidityForecast = useMemo(() => {
    if (plans.length === 0) return [];
    
    // Get the earliest start date and latest end date
    const startDates = plans.map(p => new Date(p.initialDate));
    const endDates = plans.map(p => new Date(p.endDate));
    
    const earliestStartDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    const latestEndDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    // Create a month-by-month sequence from start to end
    const months = [];
    const currentDate = new Date(earliestStartDate);
    
    while (currentDate <= latestEndDate) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // For each month, calculate the total payments across all plans
    return months.map(date => {
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const monthPayments = plans.reduce((total, plan) => {
        // Check if the plan is active on this date
        const planStartDate = new Date(plan.initialDate);
        const planEndDate = new Date(plan.endDate);
        
        if (date >= planStartDate && date <= planEndDate) {
          return total + plan.monthlyPayment;
        }
        return total;
      }, 0);
      
      return {
        date: monthYear,
        totalPayment: monthPayments,
        originalDate: date
      };
    });
  }, [plans]);
  
  // Format money values
  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  if (plans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('paymentSchedule')}</CardTitle>
          <CardDescription>{t('noFinancingPlansFound')}</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">{t('addAFinancingPlanToSeeSchedule')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{t('paymentSchedule')}</h3>
          <p className="text-sm text-muted-foreground">{t('trackYourPaymentsOverTime')}</p>
        </div>
        <Select 
          value={selectedPlanId} 
          onValueChange={setSelectedPlanId}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder={t('selectPlan')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t('selectFinancingPlan')}</SelectLabel>
              {plans.map(plan => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
              <SelectItem value="all">{t('allPlans')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">{t('visualize')}</TabsTrigger>
          <TabsTrigger value="table">{t('details')}</TabsTrigger>
          <TabsTrigger value="forecast">{t('liquidityForecast')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="h-80">
          {selectedPlan ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(tick, index) => {
                    // Show fewer date labels
                    return index % 3 === 0 ? tick : '';
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="principal" 
                  name={t('principal')}  
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
                <Area 
                  type="monotone" 
                  dataKey="interest" 
                  name={t('interest')} 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="remaining" 
                  name={t('remainingBalance')} 
                  stroke="#ff7300" 
                  dot={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">{t('selectAPlanToSeeChart')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table">
          {selectedPlan ? (
            <div className="border rounded-md max-h-80 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>{t('paymentNumber')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead className="text-right">{t('totalPayment')}</TableHead>
                    <TableHead className="text-right">{t('principal')}</TableHead>
                    <TableHead className="text-right">{t('interest')}</TableHead>
                    <TableHead className="text-right">{t('remainingBalance')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.payment}</TableCell>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.totalPayment)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.principal)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.interest)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.remaining)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">{t('selectAPlanToSeeDetails')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="forecast" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={liquidityForecast}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(tick, index) => {
                  // Show fewer date labels for readability
                  return index % 6 === 0 ? tick : '';
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`€${value.toLocaleString()}`, t('monthlyPayment')]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalPayment" 
                name={t('totalMonthlyPayment')}
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          {t('downloadAsExcel')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScheduleView;
