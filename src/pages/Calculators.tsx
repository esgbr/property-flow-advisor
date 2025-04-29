
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Calculators = () => {
  // Property Calculator State
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [squareMeters, setSquareMeters] = useState(75);
  const [monthlyRent, setMonthlyRent] = useState(1200);
  const [expenses, setExpenses] = useState(20); // percentage of rent
  
  // Financing Calculator State
  const [downPayment, setDownPayment] = useState(20); // percentage
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [amortizationRate, setAmortizationRate] = useState(2);
  
  // Calculated values
  const [pricePerSqm, setPricePerSqm] = useState(0);
  const [grossRentalYield, setGrossRentalYield] = useState(0);
  const [monthlyCashFlow, setMonthlyCashFlow] = useState(0);
  const [annualCashFlow, setAnnualCashFlow] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [netCashFlow, setNetCashFlow] = useState(0);
  
  // Calculate property metrics
  useEffect(() => {
    if (squareMeters > 0) {
      setPricePerSqm(purchasePrice / squareMeters);
    }
    
    if (purchasePrice > 0) {
      const annualRent = monthlyRent * 12;
      setGrossRentalYield((annualRent / purchasePrice) * 100);
    }
    
    const monthlyExpenses = monthlyRent * (expenses / 100);
    setMonthlyCashFlow(monthlyRent - monthlyExpenses);
    setAnnualCashFlow((monthlyRent - monthlyExpenses) * 12);
  }, [purchasePrice, squareMeters, monthlyRent, expenses]);
  
  // Calculate financing metrics
  useEffect(() => {
    const loanAmount = purchasePrice * (1 - (downPayment / 100));
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly payment (P&I)
    const monthlyPaymentValue = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    
    setMonthlyPayment(monthlyPaymentValue);
    setNetCashFlow(monthlyCashFlow - monthlyPaymentValue);
  }, [purchasePrice, downPayment, interestRate, loanTerm, monthlyCashFlow]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Investment Calculators</h1>
        <p className="text-muted-foreground">Analyze potential investments and financing options</p>
      </div>

      <Tabs defaultValue="property">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="property">Property Analysis</TabsTrigger>
          <TabsTrigger value="financing">Financing</TabsTrigger>
        </TabsList>
        <TabsContent value="property" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Inputs</CardTitle>
                <CardDescription>Enter property details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (€)</Label>
                  <Input 
                    id="purchasePrice" 
                    type="number" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squareMeters">Square Meters</Label>
                  <Input 
                    id="squareMeters" 
                    type="number" 
                    value={squareMeters} 
                    onChange={(e) => setSquareMeters(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Expected Monthly Rent (€)</Label>
                  <Input 
                    id="monthlyRent" 
                    type="number" 
                    value={monthlyRent} 
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="expenses">Monthly Expenses (% of rent)</Label>
                    <span className="text-sm text-muted-foreground">{expenses}%</span>
                  </div>
                  <Slider
                    id="expenses"
                    min={5}
                    max={50}
                    step={1}
                    value={[expenses]}
                    onValueChange={(values) => setExpenses(values[0])}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Property Analysis</CardTitle>
                <CardDescription>Key investment metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Price per m²</div>
                    <div className="text-2xl font-bold">€{pricePerSqm.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Gross Rental Yield</div>
                    <div className="text-2xl font-bold">{grossRentalYield.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Monthly Cash Flow</div>
                    <div className="text-2xl font-bold">€{monthlyCashFlow.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Annual Cash Flow</div>
                    <div className="text-2xl font-bold">€{annualCashFlow.toFixed(0)}</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="text-sm font-medium">Monthly Expenses</div>
                  <div className="h-2 bg-muted rounded mt-2">
                    <div 
                      className="h-2 bg-estate-primary rounded" 
                      style={{ width: `${expenses}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>€{(monthlyRent * (expenses / 100)).toFixed(0)}</span>
                    <span>{expenses}% of rent</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Based on current inputs, this property has a {grossRentalYield.toFixed(2)}% gross rental yield 
                  with a monthly cash flow of €{monthlyCashFlow.toFixed(0)} before financing costs.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financing" className="pt-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Financing Inputs</CardTitle>
                <CardDescription>Enter loan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <span className="text-sm text-muted-foreground">{downPayment}%</span>
                  </div>
                  <Slider
                    id="downPayment"
                    min={0}
                    max={50}
                    step={1}
                    value={[downPayment]}
                    onValueChange={(values) => setDownPayment(values[0])}
                  />
                  <div className="text-sm text-muted-foreground">
                    €{(purchasePrice * (downPayment / 100)).toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="interestRate">Interest Rate</Label>
                    <span className="text-sm text-muted-foreground">{interestRate}%</span>
                  </div>
                  <Slider
                    id="interestRate"
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(values) => setInterestRate(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loanTerm">Loan Term</Label>
                    <span className="text-sm text-muted-foreground">{loanTerm} years</span>
                  </div>
                  <Slider
                    id="loanTerm"
                    min={5}
                    max={40}
                    step={1}
                    value={[loanTerm]}
                    onValueChange={(values) => setLoanTerm(values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amortizationRate">Amortization Rate</Label>
                    <span className="text-sm text-muted-foreground">{amortizationRate}%</span>
                  </div>
                  <Slider
                    id="amortizationRate"
                    min={0}
                    max={10}
                    step={0.1}
                    value={[amortizationRate]}
                    onValueChange={(values) => setAmortizationRate(values[0])}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financing Analysis</CardTitle>
                <CardDescription>Mortgage and cash flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Loan Amount</div>
                    <div className="text-2xl font-bold">
                      €{(purchasePrice * (1 - (downPayment / 100))).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Monthly Payment</div>
                    <div className="text-2xl font-bold">€{monthlyPayment.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Net Cash Flow</div>
                    <div className={`text-2xl font-bold ${netCashFlow < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      €{netCashFlow.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Annual Net Cash Flow</div>
                    <div className={`text-2xl font-bold ${netCashFlow < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      €{(netCashFlow * 12).toFixed(0)}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <div className="text-sm font-medium">Monthly Breakdown</div>
                  <div className="h-6 bg-muted rounded overflow-hidden flex">
                    <div 
                      className="h-full bg-estate-accent" 
                      style={{ width: `${Math.min(100, (monthlyRent / (monthlyRent + monthlyPayment)) * 100)}%` }}
                    >
                      <span className="text-xs text-estate-dark px-2 py-1">Rent €{monthlyRent}</span>
                    </div>
                    <div 
                      className="h-full bg-estate-primary text-white" 
                      style={{ width: `${Math.min(100, (monthlyPayment / (monthlyRent + monthlyPayment)) * 100)}%` }}
                    >
                      <span className="text-xs px-2 py-1">Mortgage €{monthlyPayment.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {netCashFlow >= 0 
                    ? `This property is cash flow positive with €${netCashFlow.toFixed(0)} monthly net income after mortgage payment.`
                    : `This property is cash flow negative by €${Math.abs(netCashFlow).toFixed(0)} per month. Consider adjusting your financing terms.`
                  }
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;
