
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const AfaCalculator: React.FC = () => {
  const { language } = useLanguage();
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [propertyAge, setPropertyAge] = useState<string>('new');
  const [specialProperty, setSpecialProperty] = useState<boolean>(false);
  const [results, setResults] = useState<{
    yearlyAmount: number;
    monthlyAmount: number;
    percentage: number;
    totalYears: number;
  } | null>(null);

  // Calculate AfA (German depreciation)
  const calculateAfa = () => {
    let percentage = 2;
    let totalYears = 50;
    
    // Property built before 1925 gets higher percentage
    if (propertyAge === 'old') {
      percentage = 2.5;
      totalYears = 40;
    }
    
    // Special property types (protected or historically significant)
    if (specialProperty) {
      percentage = 2.5;
      totalYears = 40;
    }
    
    const yearlyAmount = (buildingValue * percentage) / 100;
    const monthlyAmount = yearlyAmount / 12;
    
    setResults({
      yearlyAmount,
      monthlyAmount,
      percentage,
      totalYears
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="buildingValue">
            {language === 'de' ? 'Gebäudewert (€)' : 'Building Value (€)'}
          </Label>
          <Input
            id="buildingValue"
            type="number"
            min="0"
            value={buildingValue || ''}
            onChange={(e) => setBuildingValue(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="propertyAge">
            {language === 'de' ? 'Baujahr der Immobilie' : 'Property Construction Year'}
          </Label>
          <Select 
            value={propertyAge} 
            onValueChange={setPropertyAge}
          >
            <SelectTrigger id="propertyAge">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">
                {language === 'de' ? 'Nach 1925' : 'After 1925'}
              </SelectItem>
              <SelectItem value="old">
                {language === 'de' ? 'Vor 1925' : 'Before 1925'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <input
            type="checkbox"
            id="specialProperty"
            checked={specialProperty}
            onChange={(e) => setSpecialProperty(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="specialProperty" className="text-sm font-normal">
            {language === 'de' 
              ? 'Denkmalgeschützte Immobilie' 
              : 'Heritage-protected property'}
          </Label>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={calculateAfa}
        >
          <Calculator className="mr-2 h-4 w-4" />
          {language === 'de' ? 'AfA berechnen' : 'Calculate Depreciation'}
        </Button>
      </div>
      
      {results && (
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === 'de' ? 'AfA-Satz:' : 'Depreciation Rate:'}
                </span>
                <span className="font-medium">{results.percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === 'de' ? 'Nutzungsdauer:' : 'Useful life:'}
                </span>
                <span className="font-medium">{results.totalYears} {language === 'de' ? 'Jahre' : 'years'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === 'de' ? 'Jährliche AfA:' : 'Annual Depreciation:'}
                </span>
                <span className="font-medium">{results.yearlyAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === 'de' ? 'Monatliche AfA:' : 'Monthly Depreciation:'}
                </span>
                <span className="font-medium">{results.monthlyAmount.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-2 pb-6">
            {language === 'de' 
              ? 'Hinweis: Dies ist eine vereinfachte Berechnung. Für steuerliche Zwecke konsultieren Sie bitte einen Steuerberater.'
              : 'Note: This is a simplified calculation. For tax purposes, please consult a tax advisor.'}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AfaCalculator;
