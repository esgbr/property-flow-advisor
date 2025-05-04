
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, Home, TrendingUp, PieChart, Building } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const InvestmentCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    propertyValue: 300000,
    downPayment: 60000,
    interestRate: 5,
    loanTerm: 25,
    monthlyRent: 1500,
    vacancy: 5,
    propertyTax: 2000,
    insurance: 1200,
    maintenance: 1500,
    managementFee: 10,
    otherExpenses: 1000,
    appreciationRate: 3,
    rentalGrowthRate: 2,
    sellingCosts: 6
  });
  
  // Calculate mortgage
  const calculateMortgage = () => {
    const principal = values.propertyValue - values.downPayment;
    const monthlyRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    const x = Math.pow(1 + monthlyRate, numberOfPayments);
    return principal * monthlyRate * x / (x - 1);
  };
  
  const monthlyMortgage = calculateMortgage();
  
  // Calculate annual expenses
  const annualExpenses = (
    monthlyMortgage * 12 + 
    values.propertyTax + 
    values.insurance +
    values.maintenance +
    (values.monthlyRent * 12 * values.managementFee / 100) +
    values.otherExpenses
  );
  
  // Calculate cash flow
  const effectiveRent = values.monthlyRent * 12 * (1 - values.vacancy / 100);
  const annualCashFlow = effectiveRent - annualExpenses;
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Calculate ROI
  const cashInvested = values.downPayment;
  const cashOnCashReturn = (annualCashFlow / cashInvested) * 100;
  
  // Calculate cap rate
  const netOperatingIncome = effectiveRent - (
    values.propertyTax + 
    values.insurance +
    values.maintenance +
    (values.monthlyRent * 12 * values.managementFee / 100) +
    values.otherExpenses
  );
  const capRate = (netOperatingIncome / values.propertyValue) * 100;
  
  // Calculate 5-year projection
  const fiveYearProjection = Array.from({ length: 5 }, (_, i) => {
    const year = i + 1;
    const propertyValue = values.propertyValue * Math.pow(1 + values.appreciationRate / 100, year);
    const annualRent = values.monthlyRent * 12 * Math.pow(1 + values.rentalGrowthRate / 100, year);
    const effectiveAnnualRent = annualRent * (1 - values.vacancy / 100);
    
    // Remaining loan balance calculation
    const monthlyRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;
    const paymentsMade = year * 12;
    const principal = values.propertyValue - values.downPayment;
    
    let remainingBalance;
    if (monthlyRate === 0) {
      remainingBalance = principal - (principal * paymentsMade / numberOfPayments);
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const y = Math.pow(1 + monthlyRate, paymentsMade);
      remainingBalance = principal * (x - y) / (x - 1);
    }
    
    const equity = propertyValue - remainingBalance;
    const equityGain = equity - values.downPayment;
    
    return {
      year,
      propertyValue,
      annualRent: effectiveAnnualRent,
      equity,
      equityGain
    };
  });
  
  const handleInputChange = (field: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('realEstateInvestmentCalculator')}
        </CardTitle>
        <CardDescription>
          {t('analyzePropertyInvestments')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cashflow">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cashflow" className="text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('cashFlow')}
            </TabsTrigger>
            <TabsTrigger value="mortgage" className="text-xs sm:text-sm">
              <Home className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('mortgage')}
            </TabsTrigger>
            <TabsTrigger value="roi" className="text-xs sm:text-sm">
              <PieChart className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('returns')}
            </TabsTrigger>
            <TabsTrigger value="projection" className="text-xs sm:text-sm">
              <Building className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('projection')}
            </TabsTrigger>
          </TabsList>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyValue">{t('propertyValue')}</Label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">€</span>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={values.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="downPayment">{t('downPayment')}</Label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">€</span>
                  <Input
                    id="downPayment"
                    type="number"
                    value={values.downPayment}
                    onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value))}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round((values.downPayment / values.propertyValue) * 100)}% {t('ofPropertyValue')}
                </div>
              </div>
              
              <div>
                <Label htmlFor="interestRate">{t('interestRate')}</Label>
                <div className="flex items-center">
                  <Input
                    id="interestRate"
                    type="number"
                    value={values.interestRate}
                    step="0.1"
                    onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value))}
                  />
                  <span className="text-sm ml-2">%</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="loanTerm">{t('loanTerm')}</Label>
                <div className="flex items-center">
                  <Input
                    id="loanTerm"
                    type="number"
                    value={values.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', parseFloat(e.target.value))}
                  />
                  <span className="text-sm ml-2">{t('years')}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="monthlyRent">{t('monthlyRent')}</Label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">€</span>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={values.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="vacancy">{t('vacancy')}</Label>
                <div className="flex items-center">
                  <Input
                    id="vacancy"
                    type="number"
                    value={values.vacancy}
                    onChange={(e) => handleInputChange('vacancy', parseFloat(e.target.value))}
                  />
                  <span className="text-sm ml-2">%</span>
                </div>
              </div>
              
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full mt-4"
                  onClick={() => {
                    // Reset to defaults if needed
                  }}
                >
                  {t('resetToDefaults')}
                </Button>
              </div>
            </div>
            
            <TabsContent value="cashflow" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('monthlyCashFlow')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    €{monthlyCashFlow.toFixed(0)}
                    <span className="text-sm text-muted-foreground font-normal"> / {t('month')}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('monthlyRentalIncome')}:</span>
                      <span className="font-medium">€{values.monthlyRent}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('vacancyLoss')}:</span>
                      <span>-€{(values.monthlyRent * values.vacancy / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('mortgagePayment')}:</span>
                      <span>-€{monthlyMortgage.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('propertyTax')}:</span>
                      <span>-€{(values.propertyTax / 12).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('insurance')}:</span>
                      <span>-€{(values.insurance / 12).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('maintenance')}:</span>
                      <span>-€{(values.maintenance / 12).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('managementFee')}:</span>
                      <span>-€{(values.monthlyRent * values.managementFee / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('otherExpenses')}:</span>
                      <span>-€{(values.otherExpenses / 12).toFixed(0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>{t('netCashFlow')}:</span>
                      <span className={monthlyCashFlow > 0 ? "text-green-600" : "text-red-600"}>
                        €{monthlyCashFlow.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mortgage" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('mortgageCalculation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    €{monthlyMortgage.toFixed(0)}
                    <span className="text-sm text-muted-foreground font-normal"> / {t('month')}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('loanAmount')}:</span>
                      <span className="font-medium">€{(values.propertyValue - values.downPayment).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('downPayment')}:</span>
                      <span>€{values.downPayment.toLocaleString()} ({Math.round((values.downPayment / values.propertyValue) * 100)}%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('loanTerm')}:</span>
                      <span>{values.loanTerm} {t('years')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('interestRate')}:</span>
                      <span>{values.interestRate}%</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>{t('totalLoanCost')}:</span>
                      <span>€{(monthlyMortgage * values.loanTerm * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('totalInterestPaid')}:</span>
                      <span>€{(monthlyMortgage * values.loanTerm * 12 - (values.propertyValue - values.downPayment)).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="roi" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('investmentReturns')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">{t('cashOnCashReturn')}</div>
                      <div className="text-2xl font-bold">{cashOnCashReturn.toFixed(2)}%</div>
                    </div>
                    <div className="text-center p-4 border rounded-md">
                      <div className="text-sm text-muted-foreground mb-1">{t('capRate')}</div>
                      <div className="text-2xl font-bold">{capRate.toFixed(2)}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('totalInvestment')}:</span>
                      <span className="font-medium">€{values.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('annualCashFlow')}:</span>
                      <span className={annualCashFlow > 0 ? "text-green-600" : "text-red-600"}>
                        €{annualCashFlow.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('netOperatingIncome')}:</span>
                      <span>€{netOperatingIncome.toFixed(0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-sm">
                      <span>{t('breakEvenPoint')}:</span>
                      <span>
                        {annualCashFlow > 0 ? 
                          `${(values.downPayment / annualCashFlow).toFixed(1)} ${t('years')}` : 
                          t('notProfitable')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projection" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('fiveYearProjection')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left font-medium">{t('year')}</th>
                          <th className="text-right font-medium">{t('propertyValue')}</th>
                          <th className="text-right font-medium">{t('equity')}</th>
                          <th className="text-right font-medium">{t('annualCashFlow')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fiveYearProjection.map((year) => (
                          <tr key={year.year} className="border-b last:border-0">
                            <td className="py-2">{year.year}</td>
                            <td className="py-2 text-right">€{Math.round(year.propertyValue).toLocaleString()}</td>
                            <td className="py-2 text-right">€{Math.round(year.equity).toLocaleString()}</td>
                            <td className="py-2 text-right">€{Math.round(year.annualRent - (annualExpenses * Math.pow(1 + 0.02, year.year - 1))).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="text-sm font-medium mb-1">{t('assumptions')}</div>
                    <div className="text-xs text-muted-foreground">
                      • {t('propertyAppreciation')}: {values.appreciationRate}% {t('annually')}
                      <br />
                      • {t('rentalGrowth')}: {values.rentalGrowthRate}% {t('annually')}
                      <br />
                      • {t('expenseInflation')}: 2% {t('annually')}
                      <br />
                      • {t('sellingCosts')}: {values.sellingCosts}% {t('ofPropertyValue')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;
