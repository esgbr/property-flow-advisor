import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, LineChart, PieChart, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PieChart as RechartsChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const MortgageCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(25);
  
  // Calculate total property price
  const propertyPrice = loanAmount + downPayment;
  
  // Calculate down payment percentage
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;
  
  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return loanAmount / numberOfPayments;
    
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    return loanAmount * monthlyRate * x / (x - 1);
  };
  
  // Monthly payment
  const monthlyPayment = calculateMonthlyPayment();
  
  // Total loan cost
  const totalLoanCost = monthlyPayment * loanTerm * 12;
  
  // Total interest paid
  const totalInterestPaid = totalLoanCost - loanAmount;
  
  // Pie chart data for payment breakdown
  const pieData = [
    { name: t('principal'), value: loanAmount },
    { name: t('totalInterestPaid'), value: totalInterestPaid }
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('mortgageCalculator')}
        </CardTitle>
        <CardDescription>{t('calculateMortgagePayments')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              {t('calculator')}
            </TabsTrigger>
            <TabsTrigger value="payment-breakdown">
              <PieChart className="h-4 w-4 mr-2" />
              {t('paymentBreakdown')}
            </TabsTrigger>
            <TabsTrigger value="amortization">
              <LineChart className="h-4 w-4 mr-2" />
              {t('amortizationSchedule')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>{t('propertyPrice')} (€{propertyPrice.toLocaleString()})</Label>
                  <Slider
                    value={[propertyPrice]}
                    min={50000}
                    max={1500000}
                    step={10000}
                    onValueChange={(value) => {
                      const newPropertyPrice = value[0];
                      // Keep down payment percentage consistent when changing property price
                      const newDownPayment = Math.round(newPropertyPrice * (downPaymentPercentage / 100));
                      setDownPayment(newDownPayment);
                      setLoanAmount(newPropertyPrice - newDownPayment);
                    }}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>{t('downPayment')}</Label>
                    <span className="text-xs text-muted-foreground">
                      {downPaymentPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Slider
                        value={[downPaymentPercentage]}
                        min={5}
                        max={50}
                        step={1}
                        onValueChange={(value) => {
                          const newPercentage = value[0];
                          const newDownPayment = Math.round(propertyPrice * (newPercentage / 100));
                          setDownPayment(newDownPayment);
                          setLoanAmount(propertyPrice - newDownPayment);
                        }}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={downPayment}
                        onChange={(e) => {
                          const newDownPayment = parseFloat(e.target.value) || 0;
                          setDownPayment(newDownPayment);
                          setLoanAmount(propertyPrice - newDownPayment);
                        }}
                        className="text-right"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>{t('interestRate')}</Label>
                    <span className="text-xs text-muted-foreground">
                      {interestRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Slider
                        value={[interestRate]}
                        min={0.5}
                        max={10}
                        step={0.1}
                        onValueChange={(value) => setInterestRate(value[0])}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={interestRate}
                        step="0.1"
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>{t('loanTerm')}</Label>
                    <span className="text-xs text-muted-foreground">
                      {loanTerm} {t('years')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Slider
                        value={[loanTerm]}
                        min={5}
                        max={40}
                        step={1}
                        onValueChange={(value) => setLoanTerm(value[0])}
                      />
                    </div>
                    <div className="w-20">
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value) || 5)}
                        className="text-right"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card className="border-2 border-primary/20">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">{t('monthlyPayment')}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-6">
                    <div className="text-center">
                      <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-3xl font-bold">€{monthlyPayment.toFixed(0)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t('principal')} + {t('interest')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="font-medium">{t('loanSummary')}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('loanAmount')}:</span>
                      <span className="font-medium">€{loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('downPayment')}:</span>
                      <span>€{downPayment.toLocaleString()} ({downPaymentPercentage.toFixed(0)}%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('interestRate')}:</span>
                      <span>{interestRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('loanTerm')}:</span>
                      <span>{loanTerm} {t('years')}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{t('totalLoanCost')}:</span>
                      <span>€{totalLoanCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('totalInterestPaid')}:</span>
                      <span>€{totalInterestPaid.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  {t('saveCalculation')}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment-breakdown" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                  </RechartsChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{t('costBreakdown')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('mortgagePaymentExplained')}
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#0088FE] mr-2"></div>
                      <div className="text-sm">{t('principal')}: <span className="font-medium">€{loanAmount.toLocaleString()}</span></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></div>
                      <div className="text-sm">{t('interest')}: <span className="font-medium">€{totalInterestPaid.toLocaleString()}</span></div>
                    </div>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{t('paymentDistribution')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>{t('principalPercentage')}:</span>
                        <span className="font-medium">{((loanAmount / totalLoanCost) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('interestPercentage')}:</span>
                        <span className="font-medium">{((totalInterestPaid / totalLoanCost) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-xs text-muted-foreground border-t pt-2">
                  {t('mortgagePaymentNote')}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="amortization" className="mt-6">
            <div className="text-center py-12 border rounded-lg">
              <LineChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">{t('amortizationSchedule')}</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
                {t('amortizationScheduleDescription')}
              </p>
              <Button>
                {t('unlockAmortizationSchedule')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
