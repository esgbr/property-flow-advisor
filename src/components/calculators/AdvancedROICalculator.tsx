
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, DollarSign, Percent, TrendingUp } from 'lucide-react';

const AdvancedROICalculator = () => {
  const { t } = useLanguage();
  
  // Purchase details
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(20);
  const [closingCosts, setClosingCosts] = useState(10000);
  const [renovationCosts, setRenovationCosts] = useState(25000);
  
  // Financing details
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  
  // Income details
  const [monthlyRent, setMonthlyRent] = useState(3000);
  const [otherIncome, setOtherIncome] = useState(0);
  
  // Expense details
  const [propertyTax, setPropertyTax] = useState(5000);
  const [insurance, setInsurance] = useState(2000);
  const [maintenance, setMaintenance] = useState(2500);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [managementFee, setManagementFee] = useState(10);
  const [utilities, setUtilities] = useState(0);
  
  // Appreciation & selling
  const [annualAppreciation, setAnnualAppreciation] = useState(3);
  const [holdingPeriod, setHoldingPeriod] = useState(10);
  const [sellingCosts, setSellingCosts] = useState(6);
  
  // Results
  const [results, setResults] = useState({
    totalInvestment: 0,
    monthlyMortgage: 0,
    netOperatingIncome: 0,
    cashFlow: 0,
    cashOnCash: 0,
    capRate: 0,
    totalROI: 0,
    irr: 0,
    futureSalePrice: 0,
    equityBuilt: 0,
    breakEven: 0
  });
  
  // Calculate results
  useEffect(() => {
    // Calculate loan amount and down payment
    const downPaymentAmount = (purchasePrice * downPayment) / 100;
    const loanAmount = purchasePrice - downPaymentAmount;
    
    // Calculate total investment
    const totalInvestment = downPaymentAmount + closingCosts + renovationCosts;
    
    // Calculate monthly mortgage payment (P&I)
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                           (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    // Calculate annual income with vacancy adjustment
    const effectiveRent = monthlyRent * 12 * (1 - vacancyRate / 100);
    const totalIncome = effectiveRent + otherIncome;
    
    // Calculate annual expenses
    const managementAmount = totalIncome * (managementFee / 100);
    const totalExpenses = propertyTax + insurance + maintenance + managementAmount + utilities;
    
    // Calculate NOI and cash flow
    const netOperatingIncome = totalIncome - totalExpenses;
    const annualMortgage = monthlyMortgage * 12;
    const cashFlow = netOperatingIncome - annualMortgage;
    
    // Calculate returns
    const cashOnCash = (cashFlow / totalInvestment) * 100;
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    
    // Calculate future value and equity
    const futureSalePrice = purchasePrice * Math.pow(1 + annualAppreciation / 100, holdingPeriod);
    
    // Calculate mortgage balance after holding period
    let mortgageBalance = loanAmount;
    for (let i = 0; i < holdingPeriod * 12; i++) {
      const interestPayment = mortgageBalance * monthlyRate;
      const principalPayment = monthlyMortgage - interestPayment;
      mortgageBalance -= principalPayment;
    }
    
    // Calculate equity and selling proceeds
    const equityBuilt = futureSalePrice - mortgageBalance;
    const sellingCostsAmount = futureSalePrice * (sellingCosts / 100);
    const netProceeds = equityBuilt - sellingCostsAmount;
    
    // Calculate total ROI
    const totalCashFlow = cashFlow * holdingPeriod;
    const totalReturn = netProceeds + totalCashFlow - totalInvestment;
    const totalROI = (totalReturn / totalInvestment) * 100;
    
    // Simplified IRR calculation (rough estimate)
    const annualizedROI = Math.pow(1 + totalROI / 100, 1 / holdingPeriod) - 1;
    const irr = annualizedROI * 100;
    
    // Calculate break-even occupancy rate
    const monthlyExpenses = (totalExpenses / 12) + monthlyMortgage;
    const breakEven = (monthlyExpenses / monthlyRent) * 100;
    
    setResults({
      totalInvestment,
      monthlyMortgage,
      netOperatingIncome,
      cashFlow,
      cashOnCash,
      capRate,
      totalROI,
      irr,
      futureSalePrice,
      equityBuilt,
      breakEven: Math.min(breakEven, 100) // Cap at 100%
    });
  }, [
    purchasePrice, downPayment, closingCosts, renovationCosts,
    interestRate, loanTerm, monthlyRent, otherIncome,
    propertyTax, insurance, maintenance, vacancyRate,
    managementFee, utilities, annualAppreciation, holdingPeriod, sellingCosts
  ]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('advancedROICalculator')}
        </CardTitle>
        <CardDescription>{t('calculateInvestmentReturns')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Purchase Details */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('purchaseDetails')}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('purchasePrice')}</label>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <Input 
                  type="number" 
                  value={purchasePrice} 
                  onChange={(e) => setPurchasePrice(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('downPayment')}</label>
                <span className="text-sm text-muted-foreground">{downPayment}%</span>
              </div>
              <Slider
                value={[downPayment]}
                min={5}
                max={100}
                step={1}
                onValueChange={(values) => setDownPayment(values[0])}
              />
              <p className="text-sm text-muted-foreground">
                ${((purchasePrice * downPayment) / 100).toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('closingCosts')}</label>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <Input 
                  type="number" 
                  value={closingCosts} 
                  onChange={(e) => setClosingCosts(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('renovationCosts')}</label>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <Input 
                  type="number" 
                  value={renovationCosts} 
                  onChange={(e) => setRenovationCosts(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
          
          {/* Income & Expenses */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('incomeAndExpenses')}</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('monthlyRent')}</label>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                <Input 
                  type="number" 
                  value={monthlyRent} 
                  onChange={(e) => setMonthlyRent(Number(e.target.value))} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('interestRate')}</label>
                <span className="text-sm text-muted-foreground">{interestRate}%</span>
              </div>
              <Slider
                value={[interestRate]}
                min={1}
                max={10}
                step={0.1}
                onValueChange={(values) => setInterestRate(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('vacancyRate')}</label>
                <span className="text-sm text-muted-foreground">{vacancyRate}%</span>
              </div>
              <Slider
                value={[vacancyRate]}
                min={0}
                max={20}
                step={1}
                onValueChange={(values) => setVacancyRate(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t('annualAppreciation')}</label>
                <span className="text-sm text-muted-foreground">{annualAppreciation}%</span>
              </div>
              <Slider
                value={[annualAppreciation]}
                min={0}
                max={10}
                step={0.1}
                onValueChange={(values) => setAnnualAppreciation(values[0])}
              />
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="mt-8">
          <h3 className="font-medium mb-4">{t('investmentResults')}</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {t('monthlyCashFlow')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className={`text-2xl font-bold ${results.cashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.round(results.cashFlow / 12).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('annualCashFlow')}: ${Math.round(results.cashFlow).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  {t('cashOnCash')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className={`text-2xl font-bold ${results.cashOnCash > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.cashOnCash.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('annualCashFlowDividedByInvestment')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {t('totalROI')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className={`text-2xl font-bold ${results.totalROI > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.totalROI.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('over')} {holdingPeriod} {t('years')}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('totalInvestment')}</p>
              <p className="text-lg">${results.totalInvestment.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('monthlyMortgage')}</p>
              <p className="text-lg">${results.monthlyMortgage.toFixed(2)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('capRate')}</p>
              <p className="text-lg">{results.capRate.toFixed(2)}%</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('futureSalePrice')}</p>
              <p className="text-lg">${results.futureSalePrice.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('equityBuilt')}</p>
              <p className="text-lg">${results.equityBuilt.toLocaleString()}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('breakEvenOccupancy')}</p>
              <p className="text-lg">{results.breakEven.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto">
          {t('saveAnalysis')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedROICalculator;
