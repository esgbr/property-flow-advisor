
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, RefreshCcw, TrendingUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CashOnCashCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    purchasePrice: 400000,
    downPayment: 100000,
    closingCosts: 4000,
    renovationCosts: 15000,
    monthlyRentalIncome: 2800,
    vacancyRate: 5,
    propertyManagementFee: 10,
    propertyTaxes: 3600,
    insurance: 1200,
    maintenance: 2400,
    utilities: 0,
    hoaFees: 0,
    otherExpenses: 600,
    loanAmount: 300000,
    interestRate: 4.5,
    loanTerm: 30
  });
  
  // Calculate monthly mortgage payment
  const calculateMonthlyMortgage = () => {
    const principal = values.loanAmount;
    const monthlyInterestRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;
    
    if (monthlyInterestRate === 0) return principal / numberOfPayments;
    
    const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    return principal * monthlyInterestRate * x / (x - 1);
  };
  
  // Calculate cash-on-cash return
  const calculateCashOnCashReturn = () => {
    // Calculate total investment
    const totalInvestment = values.downPayment + values.closingCosts + values.renovationCosts;
    
    // Calculate annual income
    const effectiveGrossIncome = values.monthlyRentalIncome * 12 * (1 - values.vacancyRate / 100);
    
    // Calculate annual expenses
    const monthlyMortgage = calculateMonthlyMortgage();
    const annualMortgage = monthlyMortgage * 12;
    const propertyManagement = effectiveGrossIncome * values.propertyManagementFee / 100;
    const totalAnnualExpenses = annualMortgage + values.propertyTaxes + values.insurance + 
                              values.maintenance + values.utilities + values.hoaFees + 
                              values.otherExpenses + propertyManagement;
    
    // Calculate annual cash flow
    const annualCashFlow = effectiveGrossIncome - totalAnnualExpenses;
    
    // Calculate cash-on-cash return
    return totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;
  };
  
  // Calculate return metrics
  const monthlyMortgage = calculateMonthlyMortgage();
  const effectiveMonthlyIncome = values.monthlyRentalIncome * (1 - values.vacancyRate / 100);
  const monthlyPropertyManagement = effectiveMonthlyIncome * values.propertyManagementFee / 100;
  const monthlyExpenses = monthlyMortgage + (values.propertyTaxes / 12) + (values.insurance / 12) + 
                        (values.maintenance / 12) + (values.utilities / 12) + (values.hoaFees / 12) + 
                        (values.otherExpenses / 12) + monthlyPropertyManagement;
  const monthlyCashFlow = effectiveMonthlyIncome - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = calculateCashOnCashReturn();
  
  const totalInvestment = values.downPayment + values.closingCosts + values.renovationCosts;
  
  // Handle input changes
  const handleInputChange = (field: string, value: number) => {
    setValues(prev => {
      const updatedValues = { ...prev, [field]: value };
      
      // Auto-calculate loan amount if purchase price or down payment changes
      if (field === 'purchasePrice' || field === 'downPayment') {
        updatedValues.loanAmount = updatedValues.purchasePrice - updatedValues.downPayment;
      }
      
      return updatedValues;
    });
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setValues({
      purchasePrice: 400000,
      downPayment: 100000,
      closingCosts: 4000,
      renovationCosts: 15000,
      monthlyRentalIncome: 2800,
      vacancyRate: 5,
      propertyManagementFee: 10,
      propertyTaxes: 3600,
      insurance: 1200,
      maintenance: 2400,
      utilities: 0,
      hoaFees: 0,
      otherExpenses: 600,
      loanAmount: 300000,
      interestRate: 4.5,
      loanTerm: 30
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('cashOnCashCalculator')}
        </CardTitle>
        <CardDescription>
          {t('calculateRealEstateInvestmentReturns')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inputs">
              <Calculator className="h-4 w-4 mr-2" />
              {t('inputs')}
            </TabsTrigger>
            <TabsTrigger value="results">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('results')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inputs" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('propertyDetails')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasePrice">{t('purchasePrice')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={values.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
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
                      onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {values.purchasePrice > 0 && `${((values.downPayment / values.purchasePrice) * 100).toFixed(1)}% ${t('ofPropertyValue')}`}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="closingCosts">{t('closingCosts')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="closingCosts"
                      type="number"
                      value={values.closingCosts}
                      onChange={(e) => handleInputChange('closingCosts', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="renovationCosts">{t('renovationCosts')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="renovationCosts"
                      type="number"
                      value={values.renovationCosts}
                      onChange={(e) => handleInputChange('renovationCosts', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('income')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRentalIncome">{t('monthlyRentalIncome')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="monthlyRentalIncome"
                      type="number"
                      value={values.monthlyRentalIncome}
                      onChange={(e) => handleInputChange('monthlyRentalIncome', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>{t('vacancyRate')} ({values.vacancyRate}%)</Label>
                  <Slider
                    value={[values.vacancyRate]}
                    min={0}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => handleInputChange('vacancyRate', value[0])}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('expenses')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyManagementFee">{t('propertyManagementFee')} (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="propertyManagementFee"
                      type="number"
                      value={values.propertyManagementFee}
                      onChange={(e) => handleInputChange('propertyManagementFee', parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-sm ml-2">%</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="propertyTaxes">{t('annualPropertyTaxes')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="propertyTaxes"
                      type="number"
                      value={values.propertyTaxes}
                      onChange={(e) => handleInputChange('propertyTaxes', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="insurance">{t('annualInsurance')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="insurance"
                      type="number"
                      value={values.insurance}
                      onChange={(e) => handleInputChange('insurance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="maintenance">{t('annualMaintenance')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="maintenance"
                      type="number"
                      value={values.maintenance}
                      onChange={(e) => handleInputChange('maintenance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="utilities">{t('annualUtilities')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="utilities"
                      type="number"
                      value={values.utilities}
                      onChange={(e) => handleInputChange('utilities', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hoaFees">{t('annualHOAFees')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="hoaFees"
                      type="number"
                      value={values.hoaFees}
                      onChange={(e) => handleInputChange('hoaFees', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="otherExpenses">{t('annualOtherExpenses')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="otherExpenses"
                      type="number"
                      value={values.otherExpenses}
                      onChange={(e) => handleInputChange('otherExpenses', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('financing')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loanAmount">{t('loanAmount')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={values.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="interestRate">{t('interestRate')} (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.125"
                      value={values.interestRate}
                      onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
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
                      onChange={(e) => handleInputChange('loanTerm', parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-sm ml-2">{t('years')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              className="w-full"
              onClick={resetToDefaults}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {t('resetToDefaults')}
            </Button>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-3">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">{t('cashOnCashReturn')}</div>
                    <div className="text-4xl font-bold">
                      {cashOnCashReturn.toFixed(2)}%
                    </div>
                    <div className={`text-sm ${cashOnCashReturn >= 8 ? 'text-green-600' : cashOnCashReturn >= 6 ? 'text-emerald-600' : cashOnCashReturn >= 4 ? 'text-amber-600' : 'text-red-600'} mt-1 font-medium`}>
                      {cashOnCashReturn >= 8 ? t('excellent') : cashOnCashReturn >= 6 ? t('good') : cashOnCashReturn >= 4 ? t('average') : t('poor')}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Progress value={cashOnCashReturn * 6.25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t('totalInvestment')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    €{totalInvestment.toLocaleString()}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('downPayment')}</span>
                      <span>€{values.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('closingCosts')}</span>
                      <span>€{values.closingCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('renovationCosts')}</span>
                      <span>€{values.renovationCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t('monthlyCashFlow')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-4 ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    €{monthlyCashFlow.toFixed(0)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('grossMonthlyIncome')}</span>
                      <span>€{values.monthlyRentalIncome.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('vacancy')} ({values.vacancyRate}%)</span>
                      <span>-€{(values.monthlyRentalIncome * values.vacancyRate / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('totalMonthlyExpenses')}</span>
                      <span>-€{monthlyExpenses.toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t('annualReturns')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">
                    €{annualCashFlow.toFixed(0)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('monthlyCashFlow')}</span>
                      <span>€{monthlyCashFlow.toFixed(0)} × 12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('annualROI')}</span>
                      <span>{cashOnCashReturn.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('breakEvenPoint')}</span>
                      <span>
                        {annualCashFlow > 0 
                          ? `${(totalInvestment / annualCashFlow).toFixed(1)} ${t('years')}`
                          : t('negative')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('expenseBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t('mortgage')}</span>
                      <span className="text-sm font-medium">€{monthlyMortgage.toFixed(0)} / {t('month')}</span>
                    </div>
                    <Progress value={(monthlyMortgage / monthlyExpenses) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t('propertyTaxes')}</span>
                      <span className="text-sm font-medium">€{(values.propertyTaxes / 12).toFixed(0)} / {t('month')}</span>
                    </div>
                    <Progress value={((values.propertyTaxes / 12) / monthlyExpenses) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t('insurance')}</span>
                      <span className="text-sm font-medium">€{(values.insurance / 12).toFixed(0)} / {t('month')}</span>
                    </div>
                    <Progress value={((values.insurance / 12) / monthlyExpenses) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t('maintenance')}</span>
                      <span className="text-sm font-medium">€{(values.maintenance / 12).toFixed(0)} / {t('month')}</span>
                    </div>
                    <Progress value={((values.maintenance / 12) / monthlyExpenses) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{t('propertyManagement')}</span>
                      <span className="text-sm font-medium">€{monthlyPropertyManagement.toFixed(0)} / {t('month')}</span>
                    </div>
                    <Progress value={(monthlyPropertyManagement / monthlyExpenses) * 100} className="h-2" />
                  </div>
                  
                  {values.utilities > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('utilities')}</span>
                        <span className="text-sm font-medium">€{(values.utilities / 12).toFixed(0)} / {t('month')}</span>
                      </div>
                      <Progress value={((values.utilities / 12) / monthlyExpenses) * 100} className="h-2" />
                    </div>
                  )}
                  
                  {values.hoaFees > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('hoaFees')}</span>
                        <span className="text-sm font-medium">€{(values.hoaFees / 12).toFixed(0)} / {t('month')}</span>
                      </div>
                      <Progress value={((values.hoaFees / 12) / monthlyExpenses) * 100} className="h-2" />
                    </div>
                  )}
                  
                  {values.otherExpenses > 0 && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('otherExpenses')}</span>
                        <span className="text-sm font-medium">€{(values.otherExpenses / 12).toFixed(0)} / {t('month')}</span>
                      </div>
                      <Progress value={((values.otherExpenses / 12) / monthlyExpenses) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('investmentAnalysis')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  {cashOnCashReturn >= 8 ? (
                    <p className="text-sm">
                      {t('excellentInvestmentDescription')}
                    </p>
                  ) : cashOnCashReturn >= 6 ? (
                    <p className="text-sm">
                      {t('goodInvestmentDescription')}
                    </p>
                  ) : cashOnCashReturn >= 4 ? (
                    <p className="text-sm">
                      {t('averageInvestmentDescription')}
                    </p>
                  ) : (
                    <p className="text-sm">
                      {t('poorInvestmentDescription')}
                    </p>
                  )}
                  
                  <div className="mt-4 text-sm">
                    {monthlyCashFlow < 0 ? (
                      <p className="text-red-600">
                        {t('negativeCashFlowWarning')}
                      </p>
                    ) : null}
                    
                    {values.downPayment / values.purchasePrice < 0.2 ? (
                      <p className="text-amber-600 mt-2">
                        {t('lowDownPaymentWarning')}
                      </p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          {t('exportCalculation')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CashOnCashCalculator;
