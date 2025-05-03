
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, Home, PieChart, ArrowRight, BarChart, CalendarDays, Building } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const InvestmentCalculator = () => {
  const [activeTab, setActiveTab] = useState('roi');
  const isMobile = useIsMobile();
  
  // ROI Calculator state
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [rentalIncome, setRentalIncome] = useState(3000);
  const [expenses, setExpenses] = useState(500);
  const [appreciationRate, setAppreciationRate] = useState(3);
  
  // Mortgage Calculator state
  const [mortgageAmount, setMortgageAmount] = useState(400000);
  const [mortgageRate, setMortgageRate] = useState(4.5);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  
  // Amortization data
  const generateAmortizationData = () => {
    const principal = mortgageAmount;
    const monthlyRate = mortgageRate / 100 / 12;
    const totalPayments = mortgageTerm * 12;
    
    const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    
    let data = [];
    let remainingBalance = principal;
    
    for (let year = 1; year <= Math.min(mortgageTerm, 30); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }
      
      data.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        balance: remainingBalance > 0 ? remainingBalance : 0
      });
    }
    
    return data;
  };
  
  // ROI Projections data
  const generateProjectionData = () => {
    const monthlyMortgage = calculateMonthlyPayment(purchasePrice - downPayment, interestRate, loanTerm);
    const monthlyCashFlow = rentalIncome - expenses - monthlyMortgage;
    const annualCashFlow = monthlyCashFlow * 12;
    
    let data = [];
    let propertyValue = purchasePrice;
    let equity = downPayment;
    
    for (let year = 0; year <= 10; year++) {
      if (year > 0) {
        propertyValue *= (1 + appreciationRate / 100);
        equity += annualCashFlow + (purchasePrice - downPayment) / loanTerm;
      }
      
      data.push({
        year: year,
        propertyValue: Math.round(propertyValue),
        equity: Math.round(equity),
        cashFlow: Math.round(year === 0 ? 0 : annualCashFlow)
      });
    }
    
    return data;
  };
  
  // Calculate monthly mortgage payment
  const calculateMonthlyPayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
  };
  
  // Calculate ROI metrics
  const calculateROI = () => {
    const mortgagePayment = calculateMonthlyPayment(purchasePrice - downPayment, interestRate, loanTerm);
    const monthlyCashFlow = rentalIncome - expenses - mortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
    const capRate = ((rentalIncome * 12 - expenses * 12) / purchasePrice) * 100;
    
    return {
      cashOnCashReturn: cashOnCashReturn.toFixed(2),
      capRate: capRate.toFixed(2),
      monthlyCashFlow: monthlyCashFlow.toFixed(2),
      mortgagePayment: mortgagePayment.toFixed(2)
    };
  };
  
  // ROI Calculation data
  const roiData = calculateROI();
  const amortizationData = generateAmortizationData();
  const projectionData = generateProjectionData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Investment Calculator</h1>
        <p className="text-muted-foreground">Analyze potential investment opportunities and make data-driven decisions</p>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="roi">
            <Calculator className="h-4 w-4 mr-2" />
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="mortgage">
            <Building className="h-4 w-4 mr-2" />
            Mortgage Calculator
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <BarChart className="h-4 w-4 mr-2" />
            Investment Comparison
          </TabsTrigger>
        </TabsList>
        
        {/* ROI Calculator Tab */}
        <TabsContent value="roi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Inputs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Property Investment Details</CardTitle>
                <CardDescription>Enter your investment parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase-price">Purchase Price (€)</Label>
                  <Input 
                    id="purchase-price" 
                    type="number" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="down-payment">Down Payment (€)</Label>
                  <Input 
                    id="down-payment" 
                    type="number" 
                    value={downPayment} 
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <span className="text-sm text-muted-foreground">{interestRate}%</span>
                  </div>
                  <Slider 
                    id="interest-rate"
                    min={1} 
                    max={10} 
                    step={0.1} 
                    value={[interestRate]} 
                    onValueChange={(value) => setInterestRate(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-term">Loan Term (years)</Label>
                    <span className="text-sm text-muted-foreground">{loanTerm} years</span>
                  </div>
                  <Slider 
                    id="loan-term"
                    min={5} 
                    max={30} 
                    step={5} 
                    value={[loanTerm]} 
                    onValueChange={(value) => setLoanTerm(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rental-income">Monthly Rental Income (€)</Label>
                  <Input 
                    id="rental-income" 
                    type="number" 
                    value={rentalIncome} 
                    onChange={(e) => setRentalIncome(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expenses">Monthly Expenses (€)</Label>
                  <Input 
                    id="expenses" 
                    type="number" 
                    value={expenses} 
                    onChange={(e) => setExpenses(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="appreciation-rate">Annual Appreciation (%)</Label>
                    <span className="text-sm text-muted-foreground">{appreciationRate}%</span>
                  </div>
                  <Slider 
                    id="appreciation-rate"
                    min={0} 
                    max={10} 
                    step={0.5} 
                    value={[appreciationRate]} 
                    onValueChange={(value) => setAppreciationRate(value[0])} 
                  />
                </div>
                
                <Button className="w-full mt-4" onClick={() => toast.success("Calculation updated!")}>
                  Update Calculation
                </Button>
              </CardContent>
            </Card>
            
            {/* Results Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Investment Analysis</CardTitle>
                <CardDescription>Return on investment metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">Cash on Cash Return</div>
                    <div className="text-2xl font-bold">{roiData.cashOnCashReturn}%</div>
                    <div className="text-xs text-muted-foreground">Annual return on initial investment</div>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">Cap Rate</div>
                    <div className="text-2xl font-bold">{roiData.capRate}%</div>
                    <div className="text-xs text-muted-foreground">Net operating income / property value</div>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">Monthly Cash Flow</div>
                    <div className="text-2xl font-bold">€{roiData.monthlyCashFlow}</div>
                    <div className="text-xs text-muted-foreground">Income after all expenses</div>
                  </div>
                  
                  <div className="space-y-2 p-4 bg-primary/10 rounded-lg">
                    <div className="text-sm font-medium">Monthly Mortgage</div>
                    <div className="text-2xl font-bold">€{roiData.mortgagePayment}</div>
                    <div className="text-xs text-muted-foreground">Principal + interest payment</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">10-Year Projection</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={projectionData}
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
                      <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="propertyValue" name="Property Value" stroke="#8884d8" />
                      <Line type="monotone" dataKey="equity" name="Equity" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Mortgage Calculator Tab */}
        <TabsContent value="mortgage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Mortgage Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Calculator</CardTitle>
                <CardDescription>Calculate your monthly payments and amortization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mortgage-amount">Loan Amount (€)</Label>
                  <Input 
                    id="mortgage-amount" 
                    type="number" 
                    value={mortgageAmount} 
                    onChange={(e) => setMortgageAmount(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mortgage-rate">Interest Rate (%)</Label>
                    <span className="text-sm text-muted-foreground">{mortgageRate}%</span>
                  </div>
                  <Slider 
                    id="mortgage-rate"
                    min={1} 
                    max={10} 
                    step={0.1} 
                    value={[mortgageRate]} 
                    onValueChange={(value) => setMortgageRate(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mortgage-term">Loan Term (years)</Label>
                    <span className="text-sm text-muted-foreground">{mortgageTerm} years</span>
                  </div>
                  <Slider 
                    id="mortgage-term"
                    min={5} 
                    max={30} 
                    step={5} 
                    value={[mortgageTerm]} 
                    onValueChange={(value) => setMortgageTerm(value[0])} 
                  />
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg mt-6">
                  <div className="text-sm font-medium">Monthly Payment</div>
                  <div className="text-2xl font-bold">
                    €{calculateMonthlyPayment(mortgageAmount, mortgageRate, mortgageTerm).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Principal + interest</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <div className="text-sm font-medium">Total Payments</div>
                    <div className="text-lg font-bold">
                      €{(calculateMonthlyPayment(mortgageAmount, mortgageRate, mortgageTerm) * mortgageTerm * 12).toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium">Total Interest</div>
                    <div className="text-lg font-bold">
                      €{((calculateMonthlyPayment(mortgageAmount, mortgageRate, mortgageTerm) * mortgageTerm * 12) - mortgageAmount).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => toast.success("Mortgage calculation updated!")}>
                  Update Calculation
                </Button>
              </CardContent>
            </Card>
            
            {/* Amortization Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Loan Amortization</CardTitle>
                <CardDescription>Principal vs. interest over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pt-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart
                      data={amortizationData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="principalPaid" name="Principal" fill="#8884d8" stackId="a" />
                      <Bar dataKey="interestPaid" name="Interest" fill="#82ca9d" stackId="a" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Remaining Balance Over Time</h3>
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Year</th>
                          <th className="p-2 text-right">Principal Paid</th>
                          <th className="p-2 text-right">Interest Paid</th>
                          <th className="p-2 text-right">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationData.slice(0, 10).map((item, index) => (
                          <tr key={index} className="border-t border-muted">
                            <td className="p-2">{item.year}</td>
                            <td className="p-2 text-right">€{item.principalPaid.toFixed(2)}</td>
                            <td className="p-2 text-right">€{item.interestPaid.toFixed(2)}</td>
                            <td className="p-2 text-right">€{item.balance.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Investment Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Comparison</CardTitle>
              <CardDescription>Compare multiple investment opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <h3 className="text-xl font-medium mb-4">Investment Comparison Tool</h3>
                <p className="text-muted-foreground mb-6">Add investment properties to compare metrics side by side</p>
                <Button onClick={() => toast.success("Investment comparison feature coming soon!")}>
                  <PieChart className="mr-2 h-4 w-4" />
                  Start Comparison
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Investment Types</CardTitle>
                <CardDescription>Explore different investment strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Home className="h-8 w-8 mr-4 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Single-Family</h4>
                      <p className="text-sm text-muted-foreground">Residential properties for individual families</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Building className="h-8 w-8 mr-4 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Multi-Family</h4>
                      <p className="text-sm text-muted-foreground">Buildings with multiple rental units</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <TrendingUp className="h-8 w-8 mr-4 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">REIT Investments</h4>
                      <p className="text-sm text-muted-foreground">Real estate investment trusts</p>
                    </div>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Market Trends</CardTitle>
                <CardDescription>Analysis of current investment climate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Interest Rates</h4>
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Rates trending upward after recent economic changes</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Housing Inventory</h4>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Slight increase in available properties this quarter</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Rental Demand</h4>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Strong demand in urban and suburban markets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Investment Resources</CardTitle>
                <CardDescription>Tools to help your decision making</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <CalendarDays className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Market Timing Guide</h4>
                      <p className="text-sm text-muted-foreground">When to buy or sell properties</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <BarChart className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Investment Reports</h4>
                      <p className="text-sm text-muted-foreground">Quarterly market analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Calculator className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">Tax Strategies</h4>
                      <p className="text-sm text-muted-foreground">Optimize your investment taxes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentCalculator;
