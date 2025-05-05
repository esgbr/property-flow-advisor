
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Euro, Calculator, Download, Info, Map, PiggyBank } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

// Grunderwerbsteuersätze in deutschen Bundesländern
const bundeslaender = [
  { id: 'bw', nameDe: 'Baden-Württemberg', nameEn: 'Baden-Württemberg', steuersatz: 5.0 },
  { id: 'by', nameDe: 'Bayern', nameEn: 'Bavaria', steuersatz: 3.5 },
  { id: 'be', nameDe: 'Berlin', nameEn: 'Berlin', steuersatz: 6.0 },
  { id: 'bb', nameDe: 'Brandenburg', nameEn: 'Brandenburg', steuersatz: 6.5 },
  { id: 'hb', nameDe: 'Bremen', nameEn: 'Bremen', steuersatz: 5.0 },
  { id: 'hh', nameDe: 'Hamburg', nameEn: 'Hamburg', steuersatz: 4.5 },
  { id: 'he', nameDe: 'Hessen', nameEn: 'Hesse', steuersatz: 6.0 },
  { id: 'mv', nameDe: 'Mecklenburg-Vorpommern', nameEn: 'Mecklenburg-Western Pomerania', steuersatz: 6.0 },
  { id: 'ni', nameDe: 'Niedersachsen', nameEn: 'Lower Saxony', steuersatz: 5.0 },
  { id: 'nw', nameDe: 'Nordrhein-Westfalen', nameEn: 'North Rhine-Westphalia', steuersatz: 6.5 },
  { id: 'rp', nameDe: 'Rheinland-Pfalz', nameEn: 'Rhineland-Palatinate', steuersatz: 5.0 },
  { id: 'sl', nameDe: 'Saarland', nameEn: 'Saarland', steuersatz: 6.5 },
  { id: 'sn', nameDe: 'Sachsen', nameEn: 'Saxony', steuersatz: 3.5 },
  { id: 'st', nameDe: 'Sachsen-Anhalt', nameEn: 'Saxony-Anhalt', steuersatz: 5.0 },
  { id: 'sh', nameDe: 'Schleswig-Holstein', nameEn: 'Schleswig-Holstein', steuersatz: 6.5 },
  { id: 'th', nameDe: 'Thüringen', nameEn: 'Thuringia', steuersatz: 6.5 }
];

interface GrunderwerbsteuerRechnerProps {
  className?: string;
}

export const GrunderwerbsteuerRechner: React.FC<GrunderwerbsteuerRechnerProps> = ({ className }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // State für die Form-Eingaben
  const [kaufpreis, setKaufpreis] = useState<string>('300000');
  const [bundeslandId, setBundeslandId] = useState<string>('by');
  const [grunderwerbsteuer, setGrunderwerbsteuer] = useState<number>(0);
  const [nebenkosten, setNebenkosten] = useState<number>(0);
  const [gesamtkosten, setGesamtkosten] = useState<number>(0);
  const [steuersatz, setSteuersatz] = useState<number>(3.5);
  const [nebenKostenProzent, setNebenKostenProzent] = useState<number>(10);
  
  // Berechnung der Grunderwerbsteuer und Nebenkosten
  useEffect(() => {
    try {
      const kaufpreisValue = parseFloat(kaufpreis) || 0;
      
      // Steuersatz für das ausgewählte Bundesland holen
      const selectedBundesland = bundeslaender.find(land => land.id === bundeslandId);
      if (selectedBundesland) {
        setSteuersatz(selectedBundesland.steuersatz);
        
        // Grunderwerbsteuer berechnen
        const grunderwerbsteuerValue = (kaufpreisValue * selectedBundesland.steuersatz) / 100;
        setGrunderwerbsteuer(grunderwerbsteuerValue);
        
        // Weitere Nebenkosten berechnen (Notar, Grundbuch, etc.)
        const weitereNebenkosten = (kaufpreisValue * nebenKostenProzent) / 100 - grunderwerbsteuerValue;
        setNebenkosten(weitereNebenkosten);
        
        // Gesamtkosten
        setGesamtkosten(kaufpreisValue + grunderwerbsteuerValue + weitereNebenkosten);
      }
    } catch (error) {
      console.error('Fehler bei der Berechnung:', error);
    }
  }, [kaufpreis, bundeslandId, nebenKostenProzent]);
  
  // Exportiere die Berechnung
  const handleExport = () => {
    toast({
      title: language === 'de' ? 'Export gestartet' : 'Export started',
      description: language === 'de' 
        ? 'Die Berechnung wird als PDF exportiert.' 
        : 'The calculation is being exported as PDF.',
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-primary" />
            <div>
              <CardTitle>
                {language === 'de' ? 'Grunderwerbsteuer-Rechner' : 'Real Estate Transfer Tax Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Berechnung der Grunderwerbsteuer in verschiedenen Bundesländern' 
                  : 'Calculate real estate transfer tax in different German states'}
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
              <Label htmlFor="kaufpreis">
                {language === 'de' ? 'Kaufpreis' : 'Purchase Price'}
              </Label>
              <div className="relative">
                <Input
                  id="kaufpreis"
                  type="number"
                  value={kaufpreis}
                  onChange={(e) => setKaufpreis(e.target.value)}
                  className="pl-8"
                />
                <Euro className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bundesland">
                {language === 'de' ? 'Bundesland' : 'German State'}
              </Label>
              <Select 
                value={bundeslandId} 
                onValueChange={setBundeslandId}
              >
                <SelectTrigger id="bundesland" className="w-full">
                  <SelectValue placeholder={language === 'de' ? 'Bundesland wählen' : 'Select German state'} />
                </SelectTrigger>
                <SelectContent>
                  {bundeslaender.map((land) => (
                    <SelectItem key={land.id} value={land.id}>
                      {language === 'de' ? land.nameDe : land.nameEn} ({land.steuersatz}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="nebenkosten">
                {language === 'de' ? 'Nebenkostenschätzung (%)' : 'Additional Costs Estimate (%)'}
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="nebenkosten"
                  type="number"
                  min="5"
                  max="20"
                  value={nebenKostenProzent}
                  onChange={(e) => setNebenKostenProzent(parseFloat(e.target.value) || 10)}
                />
                <span>%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'de' 
                  ? 'Typischerweise liegen die Nebenkosten zwischen 8% und 15% des Kaufpreises.' 
                  : 'Additional costs typically range between 8% and 15% of the purchase price.'}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <h3 className="font-semibold mb-3 flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? `Grunderwerbsteuer in ${bundeslaender.find(land => land.id === bundeslandId)?.nameDe}` : 
                  `Real Estate Transfer Tax in ${bundeslaender.find(land => land.id === bundeslandId)?.nameEn}`}
              </h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {language === 'de' ? 'Steuersatz:' : 'Tax Rate:'}
                  </span>
                  <span className="font-medium">{steuersatz}%</span>
                </div>
                
                <Progress value={steuersatz} max={6.5} className="h-2" />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-muted-foreground">
                    {language === 'de' ? 'Grunderwerbsteuer:' : 'Transfer Tax:'}
                  </span>
                  <span className="font-bold text-lg">
                    {grunderwerbsteuer.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                      style: 'currency', 
                      currency: 'EUR'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    {language === 'de' ? 'Weitere Nebenkosten:' : 'Other Additional Costs:'}
                  </span>
                  <span className="font-medium">
                    {nebenkosten.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                      style: 'currency', 
                      currency: 'EUR'
                    })}
                  </span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">
                    {language === 'de' ? 'Gesamtkosten:' : 'Total Costs:'}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {gesamtkosten.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', { 
                      style: 'currency', 
                      currency: 'EUR'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-center text-amber-700 dark:text-amber-500 mb-2">
                <Info className="h-4 w-4 mr-2" />
                <h4 className="font-medium">
                  {language === 'de' ? 'Hinweis zur Steuergestaltung' : 'Tax Planning Note'}
                </h4>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {language === 'de' 
                  ? 'Durch die Aufteilung des Kaufpreises in Grundstück und Gebäude können in einigen Fällen Steuern optimiert werden. Konsultieren Sie einen Steuerberater.' 
                  : 'By splitting the purchase price into property and building components, taxes can be optimized in some cases. Consult a tax advisor.'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <PiggyBank className="h-4 w-4 mr-1 text-primary" />
            {language === 'de' ? 'Grunderwerbsteuer in Deutschland' : 'Real Estate Transfer Tax in Germany'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {bundeslaender.map((land) => (
              <div 
                key={land.id} 
                className={`p-2 rounded-md ${land.id === bundeslandId ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted cursor-pointer'}`}
                onClick={() => setBundeslandId(land.id)}
              >
                <div className="font-medium">{language === 'de' ? land.nameDe : land.nameEn}</div>
                <div className="text-muted-foreground">{land.steuersatz}%</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          {language === 'de' ? 'Zurücksetzen' : 'Reset'}
        </Button>
        <Button>
          {language === 'de' ? 'Detaillierte Berechnung' : 'Detailed Calculation'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrunderwerbsteuerRechner;
