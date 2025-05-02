
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, InfoIcon, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface MortgageDetails {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyValue: number;
}

const MortgageCalculator: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [mortgageDetails, setMortgageDetails] = useState<MortgageDetails>({
    propertyValue: 300000,
    downPayment: 60000,
    loanAmount: 240000,
    interestRate: 3.5,
    loanTerm: 30
  });
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);
  
  // Calculate mortgage details when inputs change
  useEffect(() => {
    calculateMortgage();
  }, [mortgageDetails]);
  
  const calculateMortgage = () => {
    const principal = mortgageDetails.loanAmount;
    const interestRate = mortgageDetails.interestRate / 100 / 12; // Monthly interest rate
    const numberOfPayments = mortgageDetails.loanTerm * 12; // Total number of payments
    
    // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    if (interestRate === 0) {
      setMonthlyPayment(principal / numberOfPayments);
      setTotalInterest(0);
    } else {
      const monthlyPayment = principal * interestRate * Math.pow(1 + interestRate, numberOfPayments) / (Math.pow(1 + interestRate, numberOfPayments) - 1);
      setMonthlyPayment(monthlyPayment);
      setTotalInterest((monthlyPayment * numberOfPayments) - principal);
    }
    
    generateAmortizationSchedule(principal, interestRate, numberOfPayments);
  };
  
  // Generate amortization schedule for the entire loan term
  const generateAmortizationSchedule = (principal: number, monthlyInterestRate: number, numberOfPayments: number) => {
    const schedule = [];
    
    // Calculate payment first
    const payment = monthlyInterestRate === 0 ? 
      principal / numberOfPayments : 
      principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    let balance = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    // Generate yearly data points for the chart (instead of monthly)
    for (let year = 1; year <= mortgageDetails.loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      // Calculate 12 months for each data point
      for (let month = 1; month <= 12; month++) {
        if ((year - 1) * 12 + month <= numberOfPayments) {
          const interestPayment = balance * monthlyInterestRate;
          const principalPayment = payment - interestPayment;
          
          yearlyPrincipal += principalPayment;
          yearlyInterest += interestPayment;
          balance -= principalPayment;
        }
      }
      
      totalPrincipal += yearlyPrincipal;
      totalInterest += yearlyInterest;
      
      schedule.push({
        year,
        balance: Math.max(0, balance),
        totalPaid: totalPrincipal + totalInterest,
        principalPaid: totalPrincipal,
        interestPaid: totalInterest
      });
    }
    
    setAmortizationSchedule(schedule);
  };
  
  // Handle input changes
  const handlePropertyValueChange = (value: number) => {
    const downPaymentPercent = mortgageDetails.downPayment / mortgageDetails.propertyValue;
    const newDownPayment = value * downPaymentPercent;
    const newLoanAmount = value - newDownPayment;
    
    setMortgageDetails({
      ...mortgageDetails,
      propertyValue: value,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount
    });
  };
  
  const handleDownPaymentChange = (value: number) => {
    const newLoanAmount = mortgageDetails.propertyValue - value;
    
    setMortgageDetails({
      ...mortgageDetails,
      downPayment: value,
      loanAmount: newLoanAmount
    });
  };
  
  const handleDownPaymentPercentChange = (percentValue: number[]) => {
    const percent = percentValue[0];
    const downPayment = mortgageDetails.propertyValue * (percent / 100);
    const loanAmount = mortgageDetails.propertyValue - downPayment;
    
    setMortgageDetails({
      ...mortgageDetails,
      downPayment: downPayment,
      loanAmount: loanAmount
    });
  };
  
  const handleInterestRateChange = (value: number) => {
    setMortgageDetails({
      ...mortgageDetails,
      interestRate: value
    });
  };
  
  const handleTermChange = (value: number) => {
    setMortgageDetails({
      ...mortgageDetails,
      loanTerm: value
    });
  };
  
  const handleSaveCalculation = () => {
    toast({
      title: t('calculationSaved'),
      description: t('calculationSavedToProfile'),
    });
  };
  
  const handleShareCalculation = () => {
    toast({
      title: t('shareLinkCreated'),
      description: t('shareLinkCreatedDescription'),
    });
  };
  
  // Format numbers as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Create data for the breakdown pie chart
  const breakdownData = [
    { name: t('principal'), value: mortgageDetails.loanAmount },
    { name: t('interest'), value: totalInterest }
  ];
  
  const COLORS = ['#4f46e5', '#f59e0b'];
  
  const downPaymentPercentage = (mortgageDetails.downPayment / mortgageDetails.propertyValue) * 100;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t('mortgageCalculator')}</CardTitle>
            <CardDescription>{t('calculateYourMonthlyPayments')}</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between">
                <Label>{t('propertyValue')}</Label>
                <span className="text-sm font-medium">{formatCurrency(mortgageDetails.propertyValue)}</span>
              </div>
              <div className="flex mt-2">
                <Input 
                  type="number" 
                  value={mortgageDetails.propertyValue} 
                  onChange={(e) => handlePropertyValueChange(Number(e.target.value))} 
                  min="10000"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>{t('downPayment')}</Label>
                <span className="text-sm font-medium">
                  {formatCurrency(mortgageDetails.downPayment)} ({downPaymentPercentage.toFixed(0)}%)
                </span>
              </div>
              <div className="mt-2">
                <Slider 
                  value={[downPaymentPercentage]} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onValueChange={handleDownPaymentPercentChange}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>{t('loanAmount')}</Label>
                <span className="text-sm font-medium">{formatCurrency(mortgageDetails.loanAmount)}</span>
              </div>
              <div className="flex mt-2">
                <Input 
                  type="number" 
                  value={mortgageDetails.loanAmount} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>{t('interestRate')}</Label>
                <span className="text-sm font-medium">{mortgageDetails.interestRate}%</span>
              </div>
              <div className="flex mt-2">
                <Input 
                  type="number" 
                  value={mortgageDetails.interestRate} 
                  onChange={(e) => handleInterestRateChange(Number(e.target.value))} 
                  min="0" 
                  max="20" 
                  step="0.1" 
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>{t('loanTerm')}</Label>
                <span className="text-sm font-medium">{mortgageDetails.loanTerm} {t('years')}</span>
              </div>
              <div className="mt-2">
                <Tabs defaultValue="30" onValueChange={(value) => handleTermChange(parseInt(value))}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="15">15 {t('years')}</TabsTrigger>
                    <TabsTrigger value="20">20 {t('years')}</TabsTrigger>
                    <TabsTrigger value="30">30 {t('years')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">{t('monthlyPayment')}</div>
              <div className="text-3xl font-bold">
                {formatCurrency(monthlyPayment)}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>{t('totalPaid')}:</span>
                  <span className="font-medium">{formatCurrency(mortgageDetails.loanAmount + totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('totalInterest')}:</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSaveCalculation} className="flex-1">
                {t('saveCalculation')}
              </Button>
              <Button variant="outline" onClick={handleShareCalculation} className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                {t('share')}
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">{t('amortizationSchedule')}</h3>
              <div className="bg-muted p-1 rounded-lg">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={amortizationSchedule}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: t('year'), position: 'insideBottom', offset: 0 }} />
                    <YAxis tickFormatter={(tick) => `${Math.round(tick / 1000)}k`} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                    <Line type="monotone" dataKey="balance" name={t('remainingBalance')} stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="principalPaid" name={t('principalPaid')} stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{t('paymentBreakdown')}</h3>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('paymentBreakdownTooltip')}</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center space-x-4">
                {breakdownData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 mr-1 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
