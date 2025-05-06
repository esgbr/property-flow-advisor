
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { useToast } from '@/components/ui/use-toast';
import { Calculator, Save, Share } from 'lucide-react';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';

// Grunderwerbsteuer rates by German state
const germanyTaxRates = {
  'baden-wuerttemberg': 5.0,
  'bayern': 3.5,
  'berlin': 6.0,
  'brandenburg': 6.5,
  'bremen': 5.0,
  'hamburg': 4.5,
  'hessen': 6.0,
  'mecklenburg-vorpommern': 6.0,
  'niedersachsen': 5.0,
  'nordrhein-westfalen': 6.5,
  'rheinland-pfalz': 5.0,
  'saarland': 6.5,
  'sachsen': 3.5,
  'sachsen-anhalt': 5.0,
  'schleswig-holstein': 6.5,
  'thueringen': 6.5
};

interface GrunderwerbsteuerCalculatorProps {
  onCalculationComplete?: (results: any) => void;
  workflowStep?: string;
  standalone?: boolean;
}

const GrunderwerbsteuerCalculator: React.FC<GrunderwerbsteuerCalculatorProps> = ({ 
  onCalculationComplete,
  workflowStep = 'grunderwerbsteuer',
  standalone = true
}) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { getCurrentMarket } = useMarketFilter();
  const currentMarket = getCurrentMarket();
  
  // Initialize workflow navigation if part of a workflow
  const workflow = useWorkflow('steuer');

  // State
  const [propertyValue, setPropertyValue] = useState<number>(200000);
  const [selectedState, setSelectedState] = useState<string>('bayern');
  const [taxRate, setTaxRate] = useState<number>(3.5);
  const [taxAmount, setTaxAmount] = useState<number>(7000);

  // Calculate tax when inputs change
  useEffect(() => {
    if (propertyValue && taxRate) {
      const calculatedTax = (propertyValue * taxRate) / 100;
      setTaxAmount(calculatedTax);
    }
  }, [propertyValue, taxRate]);

  // Update tax rate when state changes
  useEffect(() => {
    if (selectedState) {
      setTaxRate(germanyTaxRates[selectedState as keyof typeof germanyTaxRates]);
    }
  }, [selectedState]);

  // Handle form submission
  const handleCalculate = () => {
    const result = {
      propertyValue,
      state: selectedState,
      taxRate,
      taxAmount
    };
    
    toast({
      title: language === 'de' ? 'Berechnung abgeschlossen' : 'Calculation complete',
      description: language === 'de' 
        ? `Grunderwerbsteuer für ${propertyValue.toLocaleString('de')} €: ${taxAmount.toLocaleString('de')} €` 
        : `Real estate transfer tax for ${propertyValue.toLocaleString('en')} €: ${taxAmount.toLocaleString('en')} €`
    });
    
    if (onCalculationComplete) {
      onCalculationComplete(result);
    }
    
    if (workflowStep) {
      workflow.markStepComplete(workflowStep);
    }
  };

  // Save calculation
  const handleSave = () => {
    if (workflowStep) {
      workflow.saveData('grunderwerbsteuer_result', {
        propertyValue,
        state: selectedState,
        taxRate,
        taxAmount,
        calculatedAt: new Date().toISOString()
      });
    }
    
    toast({
      title: language === 'de' ? 'Berechnung gespeichert' : 'Calculation saved',
      description: language === 'de' 
        ? 'Die Berechnung wurde in Ihrem Profil gespeichert' 
        : 'The calculation has been saved to your profile'
    });
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-2 h-7 w-7" />
            {language === 'de' ? 'Grunderwerbsteuer-Rechner' : 'Real Estate Transfer Tax Calculator'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Berechnen Sie die Grunderwerbsteuer für Immobilienkäufe in Deutschland' 
              : 'Calculate the real estate transfer tax for property purchases in Germany'}
          </p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Grunderwerbsteuer berechnen' : 'Calculate Transfer Tax'}
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Geben Sie den Kaufpreis ein und wählen Sie das Bundesland' 
              : 'Enter the purchase price and select the federal state'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyValue">
                {language === 'de' ? 'Kaufpreis der Immobilie (€)' : 'Property Purchase Price (€)'}
              </Label>
              <Input
                id="propertyValue"
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="text-right"
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="federalState">
                {language === 'de' ? 'Bundesland' : 'Federal State'}
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={language === 'de' ? 'Bundesland auswählen' : 'Select federal state'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baden-wuerttemberg">Baden-Württemberg (5.0%)</SelectItem>
                  <SelectItem value="bayern">Bayern (3.5%)</SelectItem>
                  <SelectItem value="berlin">Berlin (6.0%)</SelectItem>
                  <SelectItem value="brandenburg">Brandenburg (6.5%)</SelectItem>
                  <SelectItem value="bremen">Bremen (5.0%)</SelectItem>
                  <SelectItem value="hamburg">Hamburg (4.5%)</SelectItem>
                  <SelectItem value="hessen">Hessen (6.0%)</SelectItem>
                  <SelectItem value="mecklenburg-vorpommern">Mecklenburg-Vorpommern (6.0%)</SelectItem>
                  <SelectItem value="niedersachsen">Niedersachsen (5.0%)</SelectItem>
                  <SelectItem value="nordrhein-westfalen">Nordrhein-Westfalen (6.5%)</SelectItem>
                  <SelectItem value="rheinland-pfalz">Rheinland-Pfalz (5.0%)</SelectItem>
                  <SelectItem value="saarland">Saarland (6.5%)</SelectItem>
                  <SelectItem value="sachsen">Sachsen (3.5%)</SelectItem>
                  <SelectItem value="sachsen-anhalt">Sachsen-Anhalt (5.0%)</SelectItem>
                  <SelectItem value="schleswig-holstein">Schleswig-Holstein (6.5%)</SelectItem>
                  <SelectItem value="thueringen">Thüringen (6.5%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Steuersatz' : 'Tax Rate'}
                </p>
                <p className="text-2xl font-bold">{taxRate}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax'}
                </p>
                <p className="text-2xl font-bold">
                  {taxAmount.toLocaleString(language === 'de' ? 'de' : 'en')} €
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Speichern' : 'Save'}
            </Button>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Teilen' : 'Share'}
            </Button>
          </div>
          <Button onClick={handleCalculate}>
            <Calculator className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Berechnen' : 'Calculate'}
          </Button>
        </CardFooter>
      </Card>
      
      {workflowStep && (
        <WorkflowNavigation 
          workflowType="steuer" 
          currentStep={workflowStep}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default GrunderwerbsteuerCalculator;
