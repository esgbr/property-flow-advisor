
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calculator, 
  CalendarIcon, 
  Building, 
  FileSpreadsheet, 
  Download, 
  Info,
  PiggyBank,
  Euro
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// AfA-Typen und ihre Raten
const afaTypes = [
  { id: 'standard', rateDe: '2% (50 Jahre)', rateEn: '2% (50 years)', value: 2 },
  { id: 'pre1925', rateDe: '2.5% (40 Jahre)', rateEn: '2.5% (40 years)', value: 2.5 },
  { id: 'new2023', rateDe: '3% (33.33 Jahre)', rateEn: '3% (33.33 years)', value: 3 },
  { id: 'commercial', rateDe: '3% (33.33 Jahre)', rateEn: '3% (33.33 years)', value: 3 },
  { id: 'commercial-pre1925', rateDe: '2.5% (40 Jahre)', rateEn: '2.5% (40 years)', value: 2.5 },
];

// Gebäudetypen
const buildingTypes = [
  { id: 'residential', nameDe: 'Wohngebäude', nameEn: 'Residential Building' },
  { id: 'mixed', nameDe: 'Gemischt genutztes Gebäude', nameEn: 'Mixed-Use Building' },
  { id: 'commercial', nameDe: 'Gewerbegebäude', nameEn: 'Commercial Building' },
];

// Erwerbsjahre für die Simulation
const acquisitionYears = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());

export interface GermanAfaCalculatorProps {
  className?: string;
  onCalculationComplete?: (result: any) => void;
}

export const GermanAfaCalculator: React.FC<GermanAfaCalculatorProps> = ({ 
  className,
  onCalculationComplete 
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // State für die Form-Eingaben
  const [purchasePrice, setPurchasePrice] = useState<string>('500000');
  const [landValue, setLandValue] = useState<string>('150000');
  const [landValuePercentage, setLandValuePercentage] = useState<number>(30);
  const [buildingValue, setBuildingValue] = useState<number>(350000);
  const [afaType, setAfaType] = useState<string>('standard');
  const [buildingType, setBuildingType] = useState<string>('residential');
  const [acquisitionYear, setAcquisitionYear] = useState<string>(new Date().getFullYear().toString());
  const [renovationCosts, setRenovationCosts] = useState<string>('0');
  
  // State für die Ergebnisse
  const [yearlyAfa, setYearlyAfa] = useState<number>(0);
  const [monthlyAfa, setMonthlyAfa] = useState<number>(0);
  const [totalAfa, setTotalAfa] = useState<number>(0);
  const [afaRate, setAfaRate] = useState<number>(2);
  const [afaYears, setAfaYears] = useState<number>(50);
  
  // Berechne den Gebäudewert basierend auf dem Kaufpreis und dem Grundstückswert
  useEffect(() => {
    try {
      const purchasePriceValue = parseFloat(purchasePrice) || 0;
      const landValueValue = parseFloat(landValue) || 0;
      
      // Setze den Prozentsatz des Grundstückswerts
      if (purchasePriceValue > 0) {
        setLandValuePercentage(Math.round((landValueValue / purchasePriceValue) * 100));
      }
      
      // Berechne den Gebäudewert
      const calculatedBuildingValue = purchasePriceValue - landValueValue;
      setBuildingValue(calculatedBuildingValue > 0 ? calculatedBuildingValue : 0);
    } catch (error) {
      console.error('Fehler bei der Berechnung des Gebäudewerts:', error);
    }
  }, [purchasePrice, landValue]);
  
  // Update AfA-Rate basierend auf dem gewählten AfA-Typ
  useEffect(() => {
    const selectedAfaType = afaTypes.find(type => type.id === afaType);
    if (selectedAfaType) {
      setAfaRate(selectedAfaType.value);
      setAfaYears(Math.round(100 / selectedAfaType.value));
    }
  }, [afaType]);
  
  // Berechne die AfA
  useEffect(() => {
    try {
      // Berücksichtige auch Renovierungskosten
      const totalBuildingValue = buildingValue + (parseFloat(renovationCosts) || 0);
      
      // Berechne jährliche AfA
      const calculatedYearlyAfa = (totalBuildingValue * afaRate) / 100;
      setYearlyAfa(calculatedYearlyAfa);
      
      // Berechne monatliche AfA
      setMonthlyAfa(calculatedYearlyAfa / 12);
      
      // Berechne Gesamt-AfA
      setTotalAfa(calculatedYearlyAfa * afaYears);
      
      // Notify parent component when calculation is complete
      if (onCalculationComplete) {
        onCalculationComplete({
          yearlyAfa: calculatedYearlyAfa,
          monthlyAfa: calculatedYearlyAfa / 12,
          totalAfa: calculatedYearlyAfa * afaYears,
          afaRate,
          afaYears,
          buildingValue: totalBuildingValue
        });
      }
    } catch (error) {
      console.error('Fehler bei der AfA-Berechnung:', error);
    }
  }, [buildingValue, afaRate, afaYears, renovationCosts, onCalculationComplete]);
  
  // Exportiere die Berechnung
  const handleExport = () => {
    toast({
      title: language === 'de' ? 'Export gestartet' : 'Export started',
      description: language === 'de' 
        ? 'Die Berechnung wird als PDF exportiert.' 
        : 'The calculation is being exported as PDF.',
    });
  };
  
  // Land-Wert Prozentsatz ändern und Grundstückswert aktualisieren
  const handleLandValuePercentageChange = (percentage: number) => {
    setLandValuePercentage(percentage);
    const purchasePriceValue = parseFloat(purchasePrice) || 0;
    const newLandValue = (purchasePriceValue * percentage) / 100;
    setLandValue(newLandValue.toFixed(2));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-primary" />
            <div>
              <CardTitle>
                {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Berechnung der Abschreibung für Abnutzung (AfA)' 
                  : 'Calculation of depreciation for German properties'}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Exportieren' : 'Export'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="purchasePrice">
                {language === 'de' ? 'Kaufpreis' : 'Purchase Price'}
              </Label>
              <div className="relative">
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="pl-8"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="landValue">
                {language === 'de' ? 'Grundstückswert' : 'Land Value'}
              </Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="landValue"
                    type="number"
                    value={landValue}
                    onChange={(e) => setLandValue(e.target.value)}
                    className="pl-8"
                  />
                  <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={landValuePercentage}
                    onChange={(e) => handleLandValuePercentageChange(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <span className="text-sm">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'de' 
                  ? 'Der Grundstückswert ist nicht abschreibungsfähig.' 
                  : 'Land value is not depreciable.'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="buildingValue">
                {language === 'de' ? 'Gebäudewert' : 'Building Value'}
              </Label>
              <div className="relative">
                <Input
                  id="buildingValue"
                  type="number"
                  value={buildingValue}
                  readOnly
                  className="pl-8 bg-muted/50"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'de' 
                  ? 'Kaufpreis - Grundstückswert' 
                  : 'Purchase price - land value'}
              </p>
            </div>
            
            <div>
              <Label htmlFor="renovationCosts">
                {language === 'de' ? 'Modernisierungskosten' : 'Renovation Costs'}
              </Label>
              <div className="relative">
                <Input
                  id="renovationCosts"
                  type="number"
                  value={renovationCosts}
                  onChange={(e) => setRenovationCosts(e.target.value)}
                  className="pl-8"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'de' 
                  ? 'Separat abschreibbare Modernisierungskosten' 
                  : 'Separately depreciable renovation costs'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="buildingType">
                {language === 'de' ? 'Gebäudetyp' : 'Building Type'}
              </Label>
              <Select 
                value={buildingType} 
                onValueChange={setBuildingType}
              >
                <SelectTrigger id="buildingType" className="w-full">
                  <SelectValue placeholder={language === 'de' ? 'Gebäudetyp wählen' : 'Select building type'} />
                </SelectTrigger>
                <SelectContent>
                  {buildingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {language === 'de' ? type.nameDe : type.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="afaType">
                {language === 'de' ? 'AfA-Typ' : 'Depreciation Type'}
              </Label>
              <Select 
                value={afaType} 
                onValueChange={setAfaType}
              >
                <SelectTrigger id="afaType" className="w-full">
                  <SelectValue placeholder={language === 'de' ? 'AfA-Typ wählen' : 'Select depreciation type'} />
                </SelectTrigger>
                <SelectContent>
                  {afaTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {language === 'de' ? type.rateDe : type.rateEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="acquisitionYear">
                {language === 'de' ? 'Anschaffungsjahr' : 'Acquisition Year'}
              </Label>
              <Select 
                value={acquisitionYear} 
                onValueChange={setAcquisitionYear}
              >
                <SelectTrigger id="acquisitionYear" className="w-full">
                  <SelectValue placeholder={language === 'de' ? 'Jahr wählen' : 'Select year'} />
                </SelectTrigger>
                <SelectContent>
                  {acquisitionYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-500 mb-2">
                <Info className="h-4 w-4 mr-1" />
                {language === 'de' 
                  ? 'Hinweis zur steuerlichen Beratung' 
                  : 'Tax advice notice'}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'de' 
                  ? 'Diese Berechnung dient nur zur Information. Bitte konsultieren Sie einen Steuerberater für verbindliche Auskünfte.' 
                  : 'This calculation is for informational purposes only. Please consult a tax advisor for binding information.'}
              </p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
          <h3 className="font-semibold mb-3 flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-primary" />
            {language === 'de' ? 'AfA-Berechnung' : 'Depreciation Calculation'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Jährliche AfA' : 'Yearly Depreciation'}
              </p>
              <p className="text-xl font-bold">
                {yearlyAfa.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                  style: 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Monatliche AfA' : 'Monthly Depreciation'}
              </p>
              <p className="text-xl font-bold">
                {monthlyAfa.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                  style: 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Gesamte AfA' : 'Total Depreciation'}
              </p>
              <p className="text-xl font-bold">
                {totalAfa.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                  style: 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="text-sm">
              <span className="text-muted-foreground mr-2">
                {language === 'de' ? 'AfA-Satz:' : 'Depreciation Rate:'}
              </span>
              <span className="font-medium">{afaRate}%</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground mr-2">
                {language === 'de' ? 'AfA-Dauer:' : 'Depreciation Period:'}
              </span>
              <span className="font-medium">{afaYears} {language === 'de' ? 'Jahre' : 'Years'}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          {language === 'de' ? 'Zurücksetzen' : 'Reset'}
        </Button>
        <Button>
          {language === 'de' ? 'Detaillierte Aufstellung' : 'Detailed Breakdown'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GermanAfaCalculator;
