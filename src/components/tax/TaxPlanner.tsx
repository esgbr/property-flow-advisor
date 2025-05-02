import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';

const TaxPlanner: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // State variables for input fields
  const [rentalIncome, setRentalIncome] = useState<number>(0);
  const [propertyTaxes, setPropertyTaxes] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);
  const [maintenance, setMaintenance] = useState<number>(0);
  const [mortgageInterest, setMortgageInterest] = useState<number>(0);
  const [depreciation, setDepreciation] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(25);

  // State variables for calculated values
  const [netOperatingIncome, setNetOperatingIncome] = useState<number>(0);
  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [taxSavings, setTaxSavings] = useState<number>(0);

  // Function to calculate tax savings
  const calculateTaxSavings = () => {
    const noi = rentalIncome - propertyTaxes - insurance - maintenance;
    setNetOperatingIncome(noi);

    const ti = noi - mortgageInterest - depreciation - otherExpenses;
    setTaxableIncome(ti);

    const savings = ti * (taxRate / 100);
    setTaxSavings(savings);
  };

  const handleReset = () => {
    setRentalIncome(0);
    setPropertyTaxes(0);
    setInsurance(0);
    setMaintenance(0);
    setMortgageInterest(0);
    setDepreciation(0);
    setOtherExpenses(0);
    setTaxRate(25);
    setNetOperatingIncome(0);
    setTaxableIncome(0);
    setTaxSavings(0);
  };

  const handleActionClick = (action: string) => {
    toast({
      title: t('featureNotification'),
      description: `${action} ${t('featureComingSoon')}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t('taxPlanning')}</h1>
        <p className="text-muted-foreground">{t('estimateTaxImplications')}</p>
      </div>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{t('incomeAndExpenses')}</CardTitle>
          <CardDescription>{t('enterPropertyDetails')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentalIncome">{t('rentalIncome')}</Label>
              <Input
                type="number"
                id="rentalIncome"
                placeholder="€0"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="propertyTaxes">{t('propertyTaxes')}</Label>
              <Input
                type="number"
                id="propertyTaxes"
                placeholder="€0"
                value={propertyTaxes}
                onChange={(e) => setPropertyTaxes(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insurance">{t('insurance')}</Label>
              <Input
                type="number"
                id="insurance"
                placeholder="€0"
                value={insurance}
                onChange={(e) => setInsurance(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="maintenance">{t('maintenance')}</Label>
              <Input
                type="number"
                id="maintenance"
                placeholder="€0"
                value={maintenance}
                onChange={(e) => setMaintenance(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mortgageInterest">{t('mortgageInterest')}</Label>
              <Input
                type="number"
                id="mortgageInterest"
                placeholder="€0"
                value={mortgageInterest}
                onChange={(e) => setMortgageInterest(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="depreciation">{t('depreciation')}</Label>
              <Input
                type="number"
                id="depreciation"
                placeholder="€0"
                value={depreciation}
                onChange={(e) => setDepreciation(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="otherExpenses">{t('otherExpenses')}</Label>
            <Input
              type="number"
              id="otherExpenses"
              placeholder="€0"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="taxRate">{t('taxRate')}</Label>
            <div className="flex items-center space-x-2">
              <Slider
                id="taxRate"
                defaultValue={[taxRate]}
                max={50}
                min={0}
                step={1}
                onValueChange={(value) => setTaxRate(value[0])}
                className="max-w-md"
              />
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                className="w-16"
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>{t('reset')}</Button>
        <Button onClick={calculateTaxSavings}>{t('calculate')}</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('taxAnalysis')}</CardTitle>
          <CardDescription>{t('potentialTaxImplications')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('netOperatingIncome')}</Label>
              <div className="font-semibold">€{netOperatingIncome.toLocaleString()}</div>
            </div>
            <div>
              <Label>{t('taxableIncome')}</Label>
              <div className="font-semibold">€{taxableIncome.toLocaleString()}</div>
            </div>
          </div>
          <div>
            <Label>{t('estimatedTaxSavings')}</Label>
            <div className="text-green-500 font-bold">€{taxSavings.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('advancedAnalysis')}</CardTitle>
          <CardDescription>{t('accessAdvancedTools')}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center space-y-2">
            <AlertCircle className="h-12 w-12 mx-auto text-blue-500" />
            <h3 className="font-semibold text-lg">{t('scenarioPlanning')}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {t('scenarioPlanningDescription')}
            </p>
            <Button variant="outline" size="sm" onClick={() => handleActionClick(t('unlockScenarioPlanning'))}>
              {t('exploreScenarios')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxPlanner;
