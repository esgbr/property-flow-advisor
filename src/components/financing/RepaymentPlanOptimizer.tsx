
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PiggyBank, Clock, LineChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const RepaymentPlanOptimizer: React.FC = () => {
  const { language } = useLanguage();
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(2.5);
  const [initialTerm, setInitialTerm] = useState(25);
  const [initialRepaymentRate, setInitialRepaymentRate] = useState(3);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [actualTerm, setActualTerm] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Function to calculate repayment plan
  const calculateRepaymentPlan = () => {
    // Calculate monthly payment
    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyRepaymentRate = initialRepaymentRate / 100 / 12;
    
    // Initial monthly payment (interest + principal)
    const calculatedMonthlyPayment = loanAmount * (monthlyInterestRate + monthlyRepaymentRate);
    setMonthlyPayment(calculatedMonthlyPayment);
    
    // Calculate actual term in months
    const n = Math.log(calculatedMonthlyPayment / (calculatedMonthlyPayment - loanAmount * monthlyInterestRate)) / 
              Math.log(1 + monthlyInterestRate);
              
    const calculatedActualTerm = Math.ceil(n / 12); // Convert to years
    setActualTerm(calculatedActualTerm);
    
    // Calculate total interest
    const calculatedTotalInterest = (calculatedMonthlyPayment * calculatedActualTerm * 12) - loanAmount;
    setTotalInterest(calculatedTotalInterest);
    
    setShowResults(true);
  };

  // Function to optimize repayment plan for shorter term (higher repayment rate)
  const optimizeForShorterTerm = () => {
    // Increase repayment rate to reduce term
    const newRepaymentRate = Math.min(initialRepaymentRate * 1.5, 8);
    setInitialRepaymentRate(newRepaymentRate);
    
    // Re-calculate with the new rate
    calculateRepaymentPlan();
  };

  // Function to optimize repayment plan for lower monthly payment (longer term)
  const optimizeForLowerPayment = () => {
    // Decrease repayment rate to reduce monthly payment
    const newRepaymentRate = Math.max(initialRepaymentRate * 0.7, 1);
    setInitialRepaymentRate(newRepaymentRate);
    
    // Re-calculate with the new rate
    calculateRepaymentPlan();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Tilgungsplanoptimierer' : 'Repayment Plan Optimizer'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Optimieren Sie Ihren Tilgungsplan basierend auf Ihren finanziellen Zielen' 
            : 'Optimize your repayment plan based on your financial goals'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inputs">
              {language === 'de' ? 'Eingabeparameter' : 'Input Parameters'}
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!showResults}>
              {language === 'de' ? 'Ergebnisse' : 'Results'}
            </TabsTrigger>
            <TabsTrigger value="optimize" disabled={!showResults}>
              {language === 'de' ? 'Optimierung' : 'Optimization'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">
                    {language === 'de' ? 'Darlehensbetrag (€)' : 'Loan Amount (€)'}
                  </Label>
                  <Input 
                    id="loanAmount" 
                    type="number" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label htmlFor="interestRate">
                    {language === 'de' ? 'Zinssatz (%)' : 'Interest Rate (%)'}
                  </Label>
                  <Input 
                    id="interestRate" 
                    type="number" 
                    step="0.1"
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="initialTerm">
                    {language === 'de' ? 'Gewünschte Laufzeit (Jahre)' : 'Desired Term (years)'}
                  </Label>
                  <Input 
                    id="initialTerm" 
                    type="number" 
                    value={initialTerm} 
                    onChange={(e) => setInitialTerm(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    {language === 'de' ? `Anfängliche Tilgungsrate: ${initialRepaymentRate}%` : `Initial Repayment Rate: ${initialRepaymentRate}%`}
                  </Label>
                  <Slider
                    value={[initialRepaymentRate]}
                    min={1}
                    max={8}
                    step={0.1}
                    onValueChange={(value) => setInitialRepaymentRate(value[0])}
                  />
                </div>
              </div>
            </div>

            <Button onClick={calculateRepaymentPlan} className="w-full">
              {language === 'de' ? 'Tilgungsplan berechnen' : 'Calculate Repayment Plan'}
            </Button>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Monatliche Rate' : 'Monthly Payment'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {monthlyPayment.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Tatsächliche Laufzeit' : 'Actual Term'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {actualTerm}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        {language === 'de' ? 'Jahre' : 'years'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {language === 'de' ? 'Tilgungsverlauf' : 'Repayment Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={10} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PiggyBank className="h-5 w-5 mr-2" />
                    {language === 'de' ? 'Kostenübersicht' : 'Cost Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Darlehensbetrag:' : 'Loan Amount:'}</span>
                      <span className="font-medium">
                        {loanAmount.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Gesamte Zinszahlungen:' : 'Total Interest Payments:'}</span>
                      <span className="font-medium">
                        {totalInterest.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Gesamtkosten:' : 'Total Cost:'}</span>
                      <span className="font-medium">
                        {(loanAmount + totalInterest).toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-medium">{language === 'de' ? 'Effektiver Jahreszins:' : 'Effective Annual Rate:'}</span>
                      <span className="font-bold">{interestRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimize">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {language === 'de' ? 'Kürzere Laufzeit' : 'Shorter Term'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'de' ? 'Höhere monatliche Rate, weniger Zinsen' : 'Higher monthly payment, less interest'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Tilgungsrate:' : 'Repayment Rate:'}</span>
                        <span className="font-medium">{(initialRepaymentRate * 1.5).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Geschätzte Laufzeit:' : 'Estimated Term:'}</span>
                        <span className="font-medium">{Math.round(actualTerm * 0.7)} {language === 'de' ? 'Jahre' : 'years'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Zinsersparnis:' : 'Interest Savings:'}</span>
                        <span className="font-medium text-green-600">
                          ~{(totalInterest * 0.3).toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0
                          })}
                        </span>
                      </div>
                    </div>
                    <Button onClick={optimizeForShorterTerm} className="w-full">
                      {language === 'de' ? 'Diesen Plan anwenden' : 'Apply This Plan'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <LineChart className="h-5 w-5 mr-2" />
                      {language === 'de' ? 'Niedrigere Rate' : 'Lower Payment'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'de' ? 'Geringere monatliche Belastung, längere Laufzeit' : 'Lower monthly burden, longer term'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Tilgungsrate:' : 'Repayment Rate:'}</span>
                        <span className="font-medium">{(initialRepaymentRate * 0.7).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Geschätzte Laufzeit:' : 'Estimated Term:'}</span>
                        <span className="font-medium">{Math.round(actualTerm * 1.4)} {language === 'de' ? 'Jahre' : 'years'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{language === 'de' ? 'Monatliche Ersparnis:' : 'Monthly Savings:'}</span>
                        <span className="font-medium text-green-600">
                          ~{(monthlyPayment * 0.15).toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0
                          })}
                        </span>
                      </div>
                    </div>
                    <Button onClick={optimizeForLowerPayment} className="w-full">
                      {language === 'de' ? 'Diesen Plan anwenden' : 'Apply This Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {language === 'de' ? 'Persönliche Empfehlungen' : 'Personal Recommendations'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    {language === 'de' 
                      ? 'Basierend auf Ihrem Profil empfehlen wir eine Kombination aus Sondertilgungen und einer leicht erhöhten Tilgungsrate, um die Laufzeit zu verkürzen, ohne die monatliche Belastung zu stark zu erhöhen.'
                      : 'Based on your profile, we recommend a combination of special repayments and a slightly increased repayment rate to shorten the term without significantly increasing the monthly burden.'}
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      {language === 'de' ? 'Individuelle Beratung anfordern' : 'Request Individual Consultation'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RepaymentPlanOptimizer;
