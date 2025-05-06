
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Download, TrendingUp, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CashFlowData {
  year: number;
  income: number;
  expenses: number;
  cashFlow: number;
  cumulativeCashFlow: number;
}

/**
 * Advanced cash flow simulator for real estate investments with different scenarios
 */
const CashFlowSimulator: React.FC = () => {
  const { language } = useLanguage();
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [downPayment, setDownPayment] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [rentalIncome, setRentalIncome] = useState<number>(3000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [propertyTax, setPropertyTax] = useState<number>(2000);
  const [insurance, setInsurance] = useState<number>(1200);
  const [maintenance, setMaintenance] = useState<number>(2400);
  const [propertyManagement, setPropertyManagement] = useState<number>(8);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(2);
  const [annualRentIncrease, setAnnualRentIncrease] = useState<number>(2);
  const [annualExpenseIncrease, setAnnualExpenseIncrease] = useState<number>(3);
  const [simulationYears, setSimulationYears] = useState<number>(10);
  const [includeRefinance, setIncludeRefinance] = useState<boolean>(false);
  const [refinanceYear, setRefinanceYear] = useState<number>(5);
  const [refinanceRate, setRefinanceRate] = useState<number>(4);
  const [includeSellingCosts, setIncludeSellingCosts] = useState<boolean>(true);
  const [sellingCostPercent, setSellingCostPercent] = useState<number>(6);
  
  const [scenario, setScenario] = useState<'base' | 'optimistic' | 'pessimistic' | 'custom'>('base');
  const [scenarioData, setScenarioData] = useState<{
    base: CashFlowData[];
    optimistic: CashFlowData[];
    pessimistic: CashFlowData[];
    custom: CashFlowData[];
  }>({
    base: [],
    optimistic: [],
    pessimistic: [],
    custom: []
  });
  
  // Calculate mortgage payment
  const calculateMortgage = (
    principal: number, 
    rate: number, 
    termYears: number
  ): number => {
    const monthlyRate = rate / 100 / 12;
    const payments = termYears * 12;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, payments) / 
      (Math.pow(1 + monthlyRate, payments) - 1);
  };
  
  // Generate cash flow data based on inputs
  const generateCashFlowData = () => {
    // Calculate mortgage
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = calculateMortgage(loanAmount, interestRate, loanTerm);
    const annualMortgage = monthlyMortgage * 12;
    
    // Base scenario
    const baseData: CashFlowData[] = [];
    let propertyValue = purchasePrice;
    let currentRent = rentalIncome;
    let currentExpenses = {
      propertyTax,
      insurance,
      maintenance,
      propertyManagement: (rentalIncome * 12 * propertyManagement / 100)
    };
    let cumulativeCashFlow = 0;
    
    for (let year = 1; year <= simulationYears; year++) {
      // Calculate income
      const annualRent = currentRent * 12;
      const effectiveIncome = annualRent * (1 - vacancyRate / 100);
      
      // Calculate expenses
      const totalExpenses = Object.values(currentExpenses).reduce((a, b) => a + b, 0) + annualMortgage;
      
      // Calculate cash flow
      const cashFlow = effectiveIncome - totalExpenses;
      cumulativeCashFlow += cashFlow;
      
      baseData.push({
        year,
        income: effectiveIncome,
        expenses: totalExpenses,
        cashFlow,
        cumulativeCashFlow
      });
      
      // Update for next year
      propertyValue *= (1 + annualAppreciation / 100);
      currentRent *= (1 + annualRentIncrease / 100);
      Object.keys(currentExpenses).forEach(key => {
        currentExpenses[key as keyof typeof currentExpenses] *= (1 + annualExpenseIncrease / 100);
      });
    }
    
    // Optimistic scenario (higher appreciation, rent increases, lower vacancy)
    const optimisticData = generateScenarioData({
      appreciationAdjustment: 1.5,
      rentIncreaseAdjustment: 1.5,
      expenseIncreaseAdjustment: 0.8,
      vacancyAdjustment: 0.5
    });
    
    // Pessimistic scenario (lower appreciation, rent increases, higher vacancy and expenses)
    const pessimisticData = generateScenarioData({
      appreciationAdjustment: 0.5,
      rentIncreaseAdjustment: 0.5,
      expenseIncreaseAdjustment: 1.5,
      vacancyAdjustment: 2
    });
    
    // Custom scenario with user-defined parameters
    const customData = baseData;
    
    setScenarioData({
      base: baseData,
      optimistic: optimisticData,
      pessimistic: pessimisticData,
      custom: customData
    });
    
    toast.success(
      language === 'de' 
        ? 'Cash-Flow-Simulation aktualisiert' 
        : 'Cash flow simulation updated'
    );
  };
  
  // Generate scenario data with adjustments
  const generateScenarioData = (adjustments: {
    appreciationAdjustment: number;
    rentIncreaseAdjustment: number;
    expenseIncreaseAdjustment: number;
    vacancyAdjustment: number;
  }): CashFlowData[] => {
    // Calculate mortgage
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = calculateMortgage(loanAmount, interestRate, loanTerm);
    const annualMortgage = monthlyMortgage * 12;
    
    const scenarioData: CashFlowData[] = [];
    let propertyValue = purchasePrice;
    let currentRent = rentalIncome;
    let currentExpenses = {
      propertyTax,
      insurance,
      maintenance,
      propertyManagement: (rentalIncome * 12 * propertyManagement / 100)
    };
    let cumulativeCashFlow = 0;
    
    const adjustedAppreciation = annualAppreciation * adjustments.appreciationAdjustment;
    const adjustedRentIncrease = annualRentIncrease * adjustments.rentIncreaseAdjustment;
    const adjustedExpenseIncrease = annualExpenseIncrease * adjustments.expenseIncreaseAdjustment;
    const adjustedVacancyRate = vacancyRate * adjustments.vacancyAdjustment;
    
    for (let year = 1; year <= simulationYears; year++) {
      // Calculate income
      const annualRent = currentRent * 12;
      const effectiveIncome = annualRent * (1 - adjustedVacancyRate / 100);
      
      // Calculate expenses
      const totalExpenses = Object.values(currentExpenses).reduce((a, b) => a + b, 0) + annualMortgage;
      
      // Calculate cash flow
      const cashFlow = effectiveIncome - totalExpenses;
      cumulativeCashFlow += cashFlow;
      
      scenarioData.push({
        year,
        income: effectiveIncome,
        expenses: totalExpenses,
        cashFlow,
        cumulativeCashFlow
      });
      
      // Update for next year
      propertyValue *= (1 + adjustedAppreciation / 100);
      currentRent *= (1 + adjustedRentIncrease / 100);
      Object.keys(currentExpenses).forEach(key => {
        currentExpenses[key as keyof typeof currentExpenses] *= (1 + adjustedExpenseIncrease / 100);
      });
    }
    
    return scenarioData;
  };
  
  // Export simulation data to JSON
  const exportSimulationData = () => {
    const data = {
      date: new Date().toISOString(),
      parameters: {
        purchasePrice,
        downPayment,
        interestRate,
        loanTerm,
        rentalIncome,
        vacancyRate,
        propertyTax,
        insurance,
        maintenance,
        propertyManagement,
        annualAppreciation,
        annualRentIncrease,
        annualExpenseIncrease,
        simulationYears,
        includeRefinance,
        refinanceYear,
        refinanceRate,
        includeSellingCosts,
        sellingCostPercent
      },
      results: scenarioData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'cash-flow-simulation.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success(
      language === 'de'
        ? 'Simulationsdaten exportiert'
        : 'Simulation data exported'
    );
  };
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: language === 'de' ? 'EUR' : 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate key performance metrics
  const calculateMetrics = () => {
    if (!scenarioData[scenario] || scenarioData[scenario].length === 0) {
      return {
        totalCashFlow: 0,
        averageAnnualCashFlow: 0,
        cashOnCash: 0,
        breakEvenYear: 0
      };
    }
    
    const data = scenarioData[scenario];
    
    // Total cash flow over simulation period
    const totalCashFlow = data[data.length - 1].cumulativeCashFlow;
    
    // Average annual cash flow
    const averageAnnualCashFlow = totalCashFlow / data.length;
    
    // Cash on cash return (first year cash flow / down payment)
    const cashOnCash = (data[0].cashFlow / downPayment) * 100;
    
    // Break-even year (when cumulative cash flow becomes positive)
    let breakEvenYear = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].cumulativeCashFlow > 0) {
        breakEvenYear = data[i].year;
        break;
      }
    }
    
    return {
      totalCashFlow,
      averageAnnualCashFlow,
      cashOnCash,
      breakEvenYear
    };
  };
  
  const metrics = calculateMetrics();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {language === 'de' ? 'Cash-Flow-Simulator' : 'Cash Flow Simulator'}
        </CardTitle>
        <CardDescription>
          {language === 'de'
            ? 'Simulieren Sie Cash-Flows unter verschiedenen Szenarien'
            : 'Simulate cash flows under different scenarios'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="input">
              <Settings className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Eingaben' : 'Inputs'}
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Ergebnisse' : 'Results'}
            </TabsTrigger>
            <TabsTrigger value="scenarios">
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Szenarien' : 'Scenarios'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Kaufpreis' : 'Purchase Price'}</Label>
                  <Input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Anzahlung' : 'Down Payment'}</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {language === 'de' ? 'Zinssatz (%)' : 'Interest Rate (%)'}
                  </Label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Kreditlaufzeit (Jahre)' : 'Loan Term (years)'}</Label>
                  <Input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {language === 'de' ? 'Monatliche Mieteinnahmen' : 'Monthly Rental Income'}
                  </Label>
                  <Input
                    type="number"
                    value={rentalIncome}
                    onChange={(e) => setRentalIncome(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Leerstandsrate (%)' : 'Vacancy Rate (%)'}</Label>
                  <Input
                    type="number"
                    value={vacancyRate}
                    onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                    step="0.5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Jährliche Grundsteuer' : 'Annual Property Tax'}</Label>
                  <Input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{language === 'de' ? 'Jährliche Versicherung' : 'Annual Insurance'}</Label>
                  <Input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {language === 'de' ? 'Jährliche Instandhaltung' : 'Annual Maintenance'}
                  </Label>
                  <Input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>
                    {language === 'de' ? 'Hausverwaltung (% der Miete)' : 'Property Management (% of rent)'}
                  </Label>
                  <Input
                    type="number"
                    value={propertyManagement}
                    onChange={(e) => setPropertyManagement(parseFloat(e.target.value) || 0)}
                    step="0.5"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <Label>
                  {language === 'de' ? 'Jährliche Wertsteigerung (%)' : 'Annual Appreciation (%)'}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[annualAppreciation]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setAnnualAppreciation(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{annualAppreciation}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {language === 'de' ? 'Jährliche Mieterhöhung (%)' : 'Annual Rent Increase (%)'}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[annualRentIncrease]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setAnnualRentIncrease(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{annualRentIncrease}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>
                  {language === 'de' ? 'Jährliche Kostenerhöhung (%)' : 'Annual Expense Increase (%)'}
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[annualExpenseIncrease]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setAnnualExpenseIncrease(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right font-medium">{annualExpenseIncrease}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <Label>
                  {language === 'de' ? 'Simulationszeitraum (Jahre)' : 'Simulation Period (years)'}
                </Label>
                <Select
                  value={simulationYears.toString()}
                  onValueChange={(value) => setSimulationYears(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={simulationYears.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 30].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} {language === 'de' ? 'Jahre' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-6">
                <Button onClick={generateCashFlowData}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Simulation starten' : 'Run Simulation'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {scenarioData[scenario].length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
                <p className="text-center">
                  {language === 'de'
                    ? 'Noch keine Simulationsdaten verfügbar. Bitte starten Sie zunächst die Simulation.'
                    : 'No simulation data available yet. Please run the simulation first.'}
                </p>
                <Button className="mt-4" onClick={generateCashFlowData}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Simulation starten' : 'Run Simulation'}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Gesamt-Cashflow' : 'Total Cash Flow'}
                      </h4>
                      <p className="text-xl font-bold">{formatCurrency(metrics.totalCashFlow)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Durchschn. jährlicher Cashflow' : 'Avg. Annual Cash Flow'}
                      </h4>
                      <p className="text-xl font-bold">{formatCurrency(metrics.averageAnnualCashFlow)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Cash-on-Cash Rendite' : 'Cash-on-Cash Return'}
                      </h4>
                      <p className="text-xl font-bold">{metrics.cashOnCash.toFixed(2)}%</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        {language === 'de' ? 'Break-Even Jahr' : 'Break-Even Year'}
                      </h4>
                      <p className="text-xl font-bold">
                        {metrics.breakEvenYear ? `Jahr ${metrics.breakEvenYear}` : '-'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="h-80 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={scenarioData[scenario]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{
                          value: language === 'de' ? 'Jahr' : 'Year',
                          position: 'insideBottom',
                          offset: -5
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `${language === 'de' ? 'Jahr' : 'Year'} ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        name={language === 'de' ? 'Einnahmen' : 'Income'} 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        name={language === 'de' ? 'Ausgaben' : 'Expenses'} 
                        stroke="#ff7300" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cashFlow" 
                        name={language === 'de' ? 'Cash-Flow' : 'Cash Flow'} 
                        stroke="#82ca9d" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between items-center">
                  <Select
                    value={scenario}
                    onValueChange={(value) => setScenario(value as any)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={scenario} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">
                        {language === 'de' ? 'Basis Szenario' : 'Base Scenario'}
                      </SelectItem>
                      <SelectItem value="optimistic">
                        {language === 'de' ? 'Optimistisch' : 'Optimistic'}
                      </SelectItem>
                      <SelectItem value="pessimistic">
                        {language === 'de' ? 'Pessimistisch' : 'Pessimistic'}
                      </SelectItem>
                      <SelectItem value="custom">
                        {language === 'de' ? 'Benutzerdefiniert' : 'Custom'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" onClick={exportSimulationData}>
                    <Download className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Exportieren' : 'Export'}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="scenarios">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  {language === 'de' ? 'Szenario-Einstellungen' : 'Scenario Settings'}
                </h4>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">
                      {language === 'de' ? 'Optimistisches Szenario' : 'Optimistic Scenario'}
                    </h4>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Wertsteigerung:' : 'Appreciation:'}
                      </span> {(annualAppreciation * 1.5).toFixed(1)}% 
                      <span className="text-green-600 text-xs ml-2">
                        (+50%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Mieterhöhung:' : 'Rent Increase:'}
                      </span> {(annualRentIncrease * 1.5).toFixed(1)}%
                      <span className="text-green-600 text-xs ml-2">
                        (+50%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Kostenerhöhung:' : 'Expense Increase:'}
                      </span> {(annualExpenseIncrease * 0.8).toFixed(1)}%
                      <span className="text-green-600 text-xs ml-2">
                        (-20%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Leerstand:' : 'Vacancy:'}
                      </span> {(vacancyRate * 0.5).toFixed(1)}%
                      <span className="text-green-600 text-xs ml-2">
                        (-50%)
                      </span>
                    </p>
                  </div>
                </div>
              
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">
                      {language === 'de' ? 'Pessimistisches Szenario' : 'Pessimistic Scenario'}
                    </h4>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Wertsteigerung:' : 'Appreciation:'}
                      </span> {(annualAppreciation * 0.5).toFixed(1)}% 
                      <span className="text-red-600 text-xs ml-2">
                        (-50%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Mieterhöhung:' : 'Rent Increase:'}
                      </span> {(annualRentIncrease * 0.5).toFixed(1)}%
                      <span className="text-red-600 text-xs ml-2">
                        (-50%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Kostenerhöhung:' : 'Expense Increase:'}
                      </span> {(annualExpenseIncrease * 1.5).toFixed(1)}%
                      <span className="text-red-600 text-xs ml-2">
                        (+50%)
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'de' ? 'Leerstand:' : 'Vacancy:'}
                      </span> {(vacancyRate * 2).toFixed(1)}%
                      <span className="text-red-600 text-xs ml-2">
                        (+100%)
                      </span>
                    </p>
                  </div>
                </div>
              
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">
                      {language === 'de' ? 'Stresszeiten simulieren' : 'Simulate Stress Periods'}
                    </h4>
                    <Switch 
                      id="stress-periods"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Simuliert außergewöhnliche Ereignisse wie längere Leerstände oder teure Reparaturen'
                      : 'Simulates extraordinary events like extended vacancies or expensive repairs'}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={generateCashFlowData}>
                    <Calculator className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Szenarien aktualisieren' : 'Update Scenarios'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CashFlowSimulator;
