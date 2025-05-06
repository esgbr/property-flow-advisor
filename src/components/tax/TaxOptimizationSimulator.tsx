
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BarChart, LineChart } from 'lucide-react';

const TaxOptimizationSimulator: React.FC = () => {
  const { language } = useLanguage();
  const [scenario, setScenario] = useState('personal');
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [rentalIncome, setRentalIncome] = useState(2000);
  const [renovationCosts, setRenovationCosts] = useState(50000);
  const [interestRate, setInterestRate] = useState(2.5);
  const [taxRate, setTaxRate] = useState(42);

  // Simplified calculation for demonstration purposes
  const calculateTaxSavings = () => {
    const monthlyMortgageInterest = (purchasePrice - renovationCosts) * (interestRate / 100) / 12;
    const yearlyDepreciation = (purchasePrice * 0.02); // 2% depreciation rate for simplification
    const yearlyRentalIncome = rentalIncome * 12;
    
    const taxableIncome = yearlyRentalIncome - monthlyMortgageInterest * 12 - yearlyDepreciation;
    const taxSavings = (yearlyRentalIncome - taxableIncome) * (taxRate / 100);
    
    return {
      yearlyRentalIncome,
      monthlyMortgageInterest: monthlyMortgageInterest,
      yearlyDepreciation,
      taxableIncome,
      taxSavings
    };
  };

  const results = calculateTaxSavings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Steueroptimierungssimulator' : 'Tax Optimization Simulator'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Simulieren Sie verschiedene Szenarien zur Steueroptimierung für Ihre Immobilieninvestitionen' 
            : 'Simulate different scenarios for tax optimization of your real estate investments'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inputs">
              {language === 'de' ? 'Eingabeparameter' : 'Input Parameters'}
            </TabsTrigger>
            <TabsTrigger value="results">
              {language === 'de' ? 'Ergebnisse' : 'Results'}
            </TabsTrigger>
            <TabsTrigger value="comparison">
              {language === 'de' ? 'Szenarienvergleich' : 'Scenario Comparison'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario">
                    {language === 'de' ? 'Investitionstyp' : 'Investment Type'}
                  </Label>
                  <Select value={scenario} onValueChange={setScenario}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">
                        {language === 'de' ? 'Privatinvestition' : 'Personal Investment'}
                      </SelectItem>
                      <SelectItem value="company">
                        {language === 'de' ? 'Unternehmensinvestition' : 'Company Investment'}
                      </SelectItem>
                      <SelectItem value="mixed">
                        {language === 'de' ? 'Gemischte Nutzung' : 'Mixed Usage'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="purchasePrice">
                    {language === 'de' ? 'Kaufpreis (€)' : 'Purchase Price (€)'}
                  </Label>
                  <Input 
                    id="purchasePrice" 
                    type="number" 
                    value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label htmlFor="rentalIncome">
                    {language === 'de' ? 'Monatliche Mieteinnahmen (€)' : 'Monthly Rental Income (€)'}
                  </Label>
                  <Input 
                    id="rentalIncome" 
                    type="number" 
                    value={rentalIncome} 
                    onChange={(e) => setRentalIncome(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="renovationCosts">
                    {language === 'de' ? 'Renovierungskosten (€)' : 'Renovation Costs (€)'}
                  </Label>
                  <Input 
                    id="renovationCosts" 
                    type="number" 
                    value={renovationCosts} 
                    onChange={(e) => setRenovationCosts(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    {language === 'de' ? `Zinssatz: ${interestRate}%` : `Interest Rate: ${interestRate}%`}
                  </Label>
                  <Slider
                    value={[interestRate]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setInterestRate(value[0])}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    {language === 'de' ? `Persönlicher Steuersatz: ${taxRate}%` : `Personal Tax Rate: ${taxRate}%`}
                  </Label>
                  <Slider
                    value={[taxRate]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => setTaxRate(value[0])}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full">
              {language === 'de' ? 'Steueroptimierung berechnen' : 'Calculate Tax Optimization'}
            </Button>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Steuerliche Ersparnis' : 'Tax Savings'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {results.taxSavings.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      })}
                      <span className="text-sm font-normal text-muted-foreground ml-2">{language === 'de' ? 'pro Jahr' : 'per year'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Zu versteuerndes Einkommen' : 'Taxable Income'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {results.taxableIncome.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      })}
                      <span className="text-sm font-normal text-muted-foreground ml-2">{language === 'de' ? 'pro Jahr' : 'per year'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    {language === 'de' ? 'Detaillierte Aufstellung' : 'Detailed Breakdown'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Jährliche Mieteinnahmen:' : 'Yearly Rental Income:'}</span>
                      <span className="font-medium">
                        {results.yearlyRentalIncome.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Monatliche Hypothekenzinsen:' : 'Monthly Mortgage Interest:'}</span>
                      <span className="font-medium">
                        {results.monthlyMortgageInterest.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Jährliche Abschreibung:' : 'Yearly Depreciation:'}</span>
                      <span className="font-medium">
                        {results.yearlyDepreciation.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-medium">{language === 'de' ? 'Effektiver Steuersatz:' : 'Effective Tax Rate:'}</span>
                      <span className="font-bold">{taxRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline">
                  {language === 'de' ? 'Bericht exportieren' : 'Export Report'}
                </Button>
                <Button>
                  {language === 'de' ? 'Optimierungsvorschläge' : 'Optimization Suggestions'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <LineChart className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'de' ? 'Szenarienvergleich in Entwicklung' : 'Scenario Comparison in Development'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                {language === 'de'
                  ? 'Diese Funktion wird derzeit entwickelt und steht in Kürze zur Verfügung.'
                  : 'This feature is currently under development and will be available soon.'}
              </p>
              <Button variant="outline">
                {language === 'de' ? 'Szenario speichern' : 'Save Scenario'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxOptimizationSimulator;
