import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { useToast } from '@/components/ui/use-toast';
import { Calculator, Save, Share, Download, Printer } from 'lucide-react';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import { useAccessibility } from '@/hooks/use-accessibility';
import { formatNumber } from '@/utils/formatters';

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

export const GrunderwerbsteuerCalculator: React.FC<GrunderwerbsteuerCalculatorProps> = ({ 
  onCalculationComplete,
  workflowStep = 'grunderwerbsteuer',
  standalone = true
}) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { getCurrentMarket } = useMarketFilter();
  const { announce } = useAccessibility();
  const currentMarket = getCurrentMarket();
  
  // Initialize workflow navigation if part of a workflow
  const workflow = useWorkflow('steuer');

  // State
  const [propertyValue, setPropertyValue] = useState<number>(200000);
  const [selectedState, setSelectedState] = useState<string>('bayern');
  const [taxRate, setTaxRate] = useState<number>(3.5);
  const [taxAmount, setTaxAmount] = useState<number>(7000);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate tax when inputs change
  useEffect(() => {
    try {
      if (propertyValue && taxRate) {
        const calculatedTax = (propertyValue * taxRate) / 100;
        setTaxAmount(calculatedTax);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setErrorMessage(t('calculationError'));
    }
  }, [propertyValue, taxRate, t]);

  // Update tax rate when state changes
  useEffect(() => {
    if (selectedState) {
      setTaxRate(germanyTaxRates[selectedState as keyof typeof germanyTaxRates]);
    }
  }, [selectedState]);

  // Handle value change with validation
  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setPropertyValue(0);
      setErrorMessage(t('invalidNumber'));
    } else if (value < 0) {
      setPropertyValue(0);
      setErrorMessage(t('valueMustBePositive'));
    } else {
      setPropertyValue(value);
    }
  };

  // Handle form submission
  const handleCalculate = () => {
    if (propertyValue <= 0) {
      setErrorMessage(t('propertyValueRequired'));
      announce(t('propertyValueRequired'));
      return;
    }

    const result = {
      propertyValue,
      state: selectedState,
      taxRate,
      taxAmount
    };
    
    toast({
      title: language === 'de' ? 'Berechnung abgeschlossen' : 'Calculation complete',
      description: language === 'de' 
        ? `Grunderwerbsteuer für ${formatNumber(propertyValue, language)} €: ${formatNumber(taxAmount, language)} €` 
        : `Real estate transfer tax for ${formatNumber(propertyValue, language)} €: ${formatNumber(taxAmount, language)} €`
    });
    
    // Announce for screen readers
    announce(language === 'de'
      ? `Berechnete Grunderwerbsteuer: ${formatNumber(taxAmount, language)} Euro`
      : `Calculated transfer tax: ${formatNumber(taxAmount, language)} Euros` 
    );
    
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
    
    // Announce for screen readers
    announce(language === 'de' 
      ? 'Die Berechnung wurde gespeichert' 
      : 'Calculation saved'
    );
  };

  // Export as PDF
  const handleExport = () => {
    // This would connect to a PDF generation service in a real app
    toast({
      title: language === 'de' ? 'Export gestartet' : 'Export initiated',
      description: language === 'de'
        ? 'Ihr PDF wird erstellt und heruntergeladen'
        : 'Your PDF is being created and downloaded'
    });
  };

  // Print calculation
  const handlePrint = () => {
    window.print();
    announce(language === 'de' ? 'Druckdialog geöffnet' : 'Print dialog opened');
  };

  return (
    <div className="space-y-6">
      {standalone && (
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Calculator className="mr-2 h-7 w-7" aria-hidden="true" />
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
                onChange={handlePropertyValueChange}
                className="text-right"
                min={0}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? "property-value-error" : undefined}
              />
              {errorMessage && (
                <p className="text-sm text-destructive" id="property-value-error">{errorMessage}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="federalState">
                {language === 'de' ? 'Bundesland' : 'Federal State'}
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full" id="federalState">
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
                  {formatNumber(taxAmount, language)} €
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              {language === 'de' ? 'Speichern' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              {language === 'de' ? 'Exportieren' : 'Export'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" aria-hidden="true" />
              {language === 'de' ? 'Drucken' : 'Print'}
            </Button>
          </div>
          <Button onClick={handleCalculate}>
            <Calculator className="h-4 w-4 mr-2" aria-hidden="true" />
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
