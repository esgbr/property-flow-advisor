
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  BarChart3, FileText, Calculator, Building, LineChart, 
  Calendar, ArrowRight, Euro, Landmark, PiggyBank
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface GrunderwerbsteuerInfo {
  bundesland: string;
  steuerProzent: number;
  beispiel: number;
}

interface MietkaufModell {
  initialeMiete: number;
  monatlicheRate: number;
  kaufpreis: number;
  laufzeit: number;
  mietanteil: number;
}

interface AfaBerechnung {
  gebäudewert: number;
  laufzeit: number;
  satz: number; // in %
}

const DeutscheImmobilienTools: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('grunderwerbsteuer');
  
  // Grunderwerbsteuer Calculator
  const [kaufpreis, setKaufpreis] = useState<number>(300000);
  const [bundesland, setBundesland] = useState<string>("Berlin");
  
  // Mietkauf Calculator
  const [mietkauf, setMietkauf] = useState<MietkaufModell>({
    initialeMiete: 1200,
    monatlicheRate: 1600,
    kaufpreis: 400000,
    laufzeit: 15,
    mietanteil: 60,
  });

  // AfA Calculator
  const [afaBerechnung, setAfaBerechnung] = useState<AfaBerechnung>({
    gebäudewert: 250000,
    laufzeit: 50,
    satz: 2,
  });

  // Beleihungswert Calculator
  const [immobilienwert, setImmobilienwert] = useState<number>(500000);
  const [beleihungsauslauf, setBeleihungsauslauf] = useState<number[]>([80]);

  const grunderwerbsteuerInfo: GrunderwerbsteuerInfo[] = [
    { bundesland: "Baden-Württemberg", steuerProzent: 5.0, beispiel: 15000 },
    { bundesland: "Bayern", steuerProzent: 3.5, beispiel: 10500 },
    { bundesland: "Berlin", steuerProzent: 6.0, beispiel: 18000 },
    { bundesland: "Brandenburg", steuerProzent: 6.5, beispiel: 19500 },
    { bundesland: "Bremen", steuerProzent: 5.0, beispiel: 15000 },
    { bundesland: "Hamburg", steuerProzent: 4.5, beispiel: 13500 },
    { bundesland: "Hessen", steuerProzent: 6.0, beispiel: 18000 },
    { bundesland: "Mecklenburg-Vorpommern", steuerProzent: 6.0, beispiel: 18000 },
    { bundesland: "Niedersachsen", steuerProzent: 5.0, beispiel: 15000 },
    { bundesland: "Nordrhein-Westfalen", steuerProzent: 6.5, beispiel: 19500 },
    { bundesland: "Rheinland-Pfalz", steuerProzent: 5.0, beispiel: 15000 },
    { bundesland: "Saarland", steuerProzent: 6.5, beispiel: 19500 },
    { bundesland: "Sachsen", steuerProzent: 3.5, beispiel: 10500 },
    { bundesland: "Sachsen-Anhalt", steuerProzent: 5.0, beispiel: 15000 },
    { bundesland: "Schleswig-Holstein", steuerProzent: 6.5, beispiel: 19500 },
    { bundesland: "Thüringen", steuerProzent: 6.5, beispiel: 19500 },
  ];

  const calculateGrunderwerbsteuer = (preis: number, bundesland: string) => {
    const info = grunderwerbsteuerInfo.find(g => g.bundesland === bundesland);
    return info ? (preis * info.steuerProzent) / 100 : 0;
  };

  const calculateMietkaufDetails = () => {
    const gesamteMietzahlungen = mietkauf.initialeMiete * 12 * mietkauf.laufzeit;
    const gesamteKaufpreiszahlungen = (mietkauf.monatlicheRate - mietkauf.initialeMiete) * 12 * mietkauf.laufzeit;
    const restKaufpreis = mietkauf.kaufpreis - gesamteKaufpreiszahlungen;
    const kaufpreisAnteilProzent = (gesamteKaufpreiszahlungen / mietkauf.kaufpreis) * 100;

    return {
      gesamteMietzahlungen,
      gesamteKaufpreiszahlungen,
      restKaufpreis,
      kaufpreisAnteilProzent
    };
  };

  const calculateAfA = () => {
    const jährlicheAbschreibung = (afaBerechnung.gebäudewert * afaBerechnung.satz) / 100;
    const gesamtabschreibung = jährlicheAbschreibung * afaBerechnung.laufzeit;
    const restbuchwert = Math.max(0, afaBerechnung.gebäudewert - gesamtabschreibung);
    
    return {
      jährlicheAbschreibung,
      gesamtabschreibung,
      restbuchwert
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deutsche Immobilientools</h1>
        <p className="text-muted-foreground">Spezielle Tools für deutsche Immobilieninvestoren</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`${isMobile ? 'flex w-max min-w-full space-x-1' : 'grid grid-cols-4 gap-1'}`}>
          <TabsTrigger value="grunderwerbsteuer" className={isMobile ? "text-xs px-2 py-2" : ""}>
            <Euro className="h-4 w-4 mr-2" />
            {!isMobile ? "Grunderwerbsteuer" : "Steuer"}
          </TabsTrigger>
          <TabsTrigger value="mietkauf" className={isMobile ? "text-xs px-2 py-2" : ""}>
            <Building className="h-4 w-4 mr-2" />
            {!isMobile ? "Mietkauf-Modell" : "Mietkauf"}
          </TabsTrigger>
          <TabsTrigger value="afa" className={isMobile ? "text-xs px-2 py-2" : ""}>
            <Calculator className="h-4 w-4 mr-2" />
            {!isMobile ? "AfA-Rechner" : "AfA"}
          </TabsTrigger>
          <TabsTrigger value="beleihung" className={isMobile ? "text-xs px-2 py-2" : ""}>
            <Landmark className="h-4 w-4 mr-2" />
            {!isMobile ? "Beleihungsrechner" : "Beleihung"}
          </TabsTrigger>
        </TabsList>

        {isMobile && (
          <div className="flex overflow-x-auto pb-2 mb-4 mt-2">
            <div className="text-sm font-medium">
              {activeTab === 'grunderwerbsteuer' && "Grunderwerbsteuer-Rechner"}
              {activeTab === 'mietkauf' && "Mietkauf-Modell Rechner"}
              {activeTab === 'afa' && "AfA-Abschreibungsberechnung"}
              {activeTab === 'beleihung' && "Beleihungswert-Rechner"}
            </div>
          </div>
        )}

        {/* Grunderwerbsteuer Tab */}
        <TabsContent value="grunderwerbsteuer" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grunderwerbsteuer-Rechner</CardTitle>
                <CardDescription>Berechnen Sie die anfallende Grunderwerbsteuer in verschiedenen Bundesländern</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="kaufpreis">Kaufpreis</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="kaufpreis"
                      type="number" 
                      value={kaufpreis}
                      onChange={(e) => setKaufpreis(Number(e.target.value))}
                    />
                    <span>€</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bundesland">Bundesland</Label>
                  <Select value={bundesland} onValueChange={setBundesland}>
                    <SelectTrigger id="bundesland">
                      <SelectValue placeholder="Bundesland auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {grunderwerbsteuerInfo.map((info) => (
                        <SelectItem key={info.bundesland} value={info.bundesland}>
                          {info.bundesland} ({info.steuerProzent}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Grunderwerbsteuer:</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(calculateGrunderwerbsteuer(kaufpreis, bundesland))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Steuersatz in {bundesland}:</span>
                    <span>{grunderwerbsteuerInfo.find(g => g.bundesland === bundesland)?.steuerProzent}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grunderwerbsteuer im Vergleich</CardTitle>
                <CardDescription>Übersicht der Steuersätze in allen Bundesländern</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {grunderwerbsteuerInfo
                    .sort((a, b) => b.steuerProzent - a.steuerProzent)
                    .map((info) => (
                      <div key={info.bundesland} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{info.bundesland}</div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(info.steuerProzent / 6.5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="font-medium">{info.steuerProzent}%</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(kaufpreis * info.steuerProzent / 100)}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Stand: Mai 2025
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Mietkauf Tab */}
        <TabsContent value="mietkauf" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mietkauf-Modell Berechnung</CardTitle>
                <CardDescription>Analysieren Sie Mietkauf-Optionen für Immobilien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="kaufpreis-mietkauf">Gesamtkaufpreis</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="kaufpreis-mietkauf"
                      type="number" 
                      value={mietkauf.kaufpreis}
                      onChange={(e) => setMietkauf({...mietkauf, kaufpreis: Number(e.target.value)})}
                    />
                    <span>€</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="initiale-miete">Initiale monatliche Miete</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="initiale-miete"
                      type="number" 
                      value={mietkauf.initialeMiete}
                      onChange={(e) => setMietkauf({...mietkauf, initialeMiete: Number(e.target.value)})}
                    />
                    <span>€</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="monatliche-rate">Monatliche Gesamtrate</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="monatliche-rate"
                      type="number" 
                      value={mietkauf.monatlicheRate}
                      onChange={(e) => setMietkauf({...mietkauf, monatlicheRate: Number(e.target.value)})}
                    />
                    <span>€</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enthält Miete und Kaufpreisanteil
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="laufzeit">Laufzeit in Jahren</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="laufzeit"
                      type="number" 
                      value={mietkauf.laufzeit}
                      onChange={(e) => setMietkauf({...mietkauf, laufzeit: Number(e.target.value)})}
                    />
                    <span>Jahre</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mietanteil">Mietanteil (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="mietanteil"
                      type="number" 
                      value={mietkauf.mietanteil}
                      onChange={(e) => setMietkauf({...mietkauf, mietanteil: Number(e.target.value)})}
                    />
                    <span>%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mietkauf-Analyse</CardTitle>
                <CardDescription>Auswertung Ihres Mietkauf-Modells</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const details = calculateMietkaufDetails();
                  return (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-3">Monatliche Zahlungen</h3>
                        <div className="bg-muted/50 p-4 rounded-md">
                          <div className="grid grid-cols-2 gap-y-2">
                            <div className="text-sm text-muted-foreground">Mietanteil:</div>
                            <div className="text-sm font-medium">
                              {formatCurrency(mietkauf.initialeMiete)}
                            </div>
                            <div className="text-sm text-muted-foreground">Kaufpreisanteil:</div>
                            <div className="text-sm font-medium">
                              {formatCurrency(mietkauf.monatlicheRate - mietkauf.initialeMiete)}
                            </div>
                            <div className="text-sm text-muted-foreground pt-2 border-t">Gesamtrate:</div>
                            <div className="text-sm font-medium pt-2 border-t">
                              {formatCurrency(mietkauf.monatlicheRate)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Gesamtzahlungen über {mietkauf.laufzeit} Jahre</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Gesamte Mietzahlungen</span>
                              <span>{formatCurrency(details.gesamteMietzahlungen)}</span>
                            </div>
                            <Progress value={details.gesamteMietzahlungen / (details.gesamteMietzahlungen + details.gesamteKaufpreiszahlungen) * 100} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Gesamte Kaufpreiszahlungen</span>
                              <span>{formatCurrency(details.gesamteKaufpreiszahlungen)}</span>
                            </div>
                            <Progress value={details.gesamteKaufpreiszahlungen / (details.gesamteMietzahlungen + details.gesamteKaufpreiszahlungen) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-3">Nach Ablauf der Laufzeit</h3>
                        <div className="bg-muted/50 p-4 rounded-md">
                          <div className="grid grid-cols-2 gap-y-2">
                            <div className="text-sm text-muted-foreground">Bezahlter Kaufpreisanteil:</div>
                            <div className="text-sm font-medium">
                              {formatCurrency(details.gesamteKaufpreiszahlungen)} ({details.kaufpreisAnteilProzent.toFixed(1)}%)
                            </div>
                            <div className="text-sm text-muted-foreground">Restlicher Kaufpreis:</div>
                            <div className="text-sm font-medium">
                              {formatCurrency(details.restKaufpreis)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Zusammenfassung</h3>
                        <p className="text-sm">
                          Nach {mietkauf.laufzeit} Jahren haben Sie {details.kaufpreisAnteilProzent.toFixed(1)}% des Kaufpreises abbezahlt. 
                          Um die Immobilie vollständig zu erwerben, müssten Sie noch {formatCurrency(details.restKaufpreis)} bezahlen.
                        </p>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AfA-Rechner Tab */}
        <TabsContent value="afa" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AfA-Abschreibungsrechner</CardTitle>
                <CardDescription>Berechnen Sie die lineare Abschreibung für Gebäude</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gebaeudewert">Gebäudewert</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="gebaeudewert"
                      type="number" 
                      value={afaBerechnung.gebäudewert}
                      onChange={(e) => setAfaBerechnung({...afaBerechnung, gebäudewert: Number(e.target.value)})}
                    />
                    <span>€</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nur der Gebäudewert ohne Grundstück ist abschreibungsfähig
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="afa-satz">AfA-Satz</Label>
                  <Select 
                    value={afaBerechnung.satz.toString()}
                    onValueChange={(value) => setAfaBerechnung({...afaBerechnung, satz: Number(value)})}
                  >
                    <SelectTrigger id="afa-satz">
                      <SelectValue placeholder="AfA-Satz wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2,0% - Standardsatz (Baujahr ab 2023)</SelectItem>
                      <SelectItem value="2.5">2,5% - Erhöhter Satz für Neubauten (Baujahr ab 2023)</SelectItem>
                      <SelectItem value="3">3,0% - Sondersatz (vor 1925 erbaut)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="laufzeit-afa">Berechnungszeitraum</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="laufzeit-afa"
                      type="number" 
                      value={afaBerechnung.laufzeit}
                      onChange={(e) => setAfaBerechnung({...afaBerechnung, laufzeit: Number(e.target.value)})}
                    />
                    <span>Jahre</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  {(() => {
                    const afaDetails = calculateAfA();
                    return (
                      <div className="bg-muted/50 p-4 rounded-md space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm text-muted-foreground">Jährliche Abschreibung:</div>
                          <div className="text-sm font-medium">{formatCurrency(afaDetails.jährlicheAbschreibung)}</div>
                          
                          <div className="text-sm text-muted-foreground">Gesamtabschreibung:</div>
                          <div className="text-sm font-medium">{formatCurrency(afaDetails.gesamtabschreibung)}</div>
                          
                          <div className="text-sm text-muted-foreground">Restbuchwert nach {afaBerechnung.laufzeit} Jahren:</div>
                          <div className="text-sm font-medium">{formatCurrency(afaDetails.restbuchwert)}</div>
                        </div>
                        
                        <div className="pt-2 text-xs text-muted-foreground">
                          <p>AfA-Satz: {afaBerechnung.satz}% pro Jahr</p>
                          <p className="mt-1">Abschreibungsdauer: {Math.ceil(100 / afaBerechnung.satz)} Jahre</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AfA-Visualisierung</CardTitle>
                <CardDescription>Sehen Sie den Verlauf der Abschreibung und des Restbuchwerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const yearlyData = [];
                  let remainingValue = afaBerechnung.gebäudewert;
                  const yearlyDepreciation = (afaBerechnung.gebäudewert * afaBerechnung.satz) / 100;
                  
                  for (let i = 0; i <= Math.min(afaBerechnung.laufzeit, 15); i++) {
                    if (i > 0) {
                      remainingValue = Math.max(0, remainingValue - yearlyDepreciation);
                    }
                    
                    yearlyData.push({
                      year: i,
                      remainingValue,
                      percentRemaining: (remainingValue / afaBerechnung.gebäudewert) * 100
                    });
                  }
                  
                  return (
                    <>
                      <div>
                        <h3 className="text-sm font-medium mb-3">Wertentwicklung</h3>
                        <div className="space-y-3">
                          {yearlyData.map((data) => (
                            <div key={data.year} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{data.year === 0 ? 'Anfangswert' : `Jahr ${data.year}`}</span>
                                <span>{formatCurrency(data.remainingValue)}</span>
                              </div>
                              <Progress value={data.percentRemaining} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Steuerliche Auswirkungen</h3>
                        <p className="text-sm">
                          Durch die AfA-Abschreibung von jährlich {formatCurrency((afaBerechnung.gebäudewert * afaBerechnung.satz) / 100)} reduzieren 
                          Sie Ihre steuerliche Bemessungsgrundlage. Bei einem Steuersatz von 42% entspricht das einer jährlichen Steuerersparnis 
                          von ca. {formatCurrency(((afaBerechnung.gebäudewert * afaBerechnung.satz) / 100) * 0.42)}.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Diese Berechnung dient nur zur Information. Steuerliche Beratung wird empfohlen.
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Beleihungswert Tab */}
        <TabsContent value="beleihung" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Beleihungswert-Rechner</CardTitle>
                <CardDescription>Berechnen Sie den maximalen Darlehensbetrag für Ihre Immobilienfinanzierung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="immobilienwert">Immobilienwert</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="immobilienwert"
                      type="number" 
                      value={immobilienwert}
                      onChange={(e) => setImmobilienwert(Number(e.target.value))}
                    />
                    <span>€</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="beleihungsauslauf">Beleihungsauslauf (%)</Label>
                  <div className="px-1">
                    <Slider
                      id="beleihungsauslauf"
                      min={50}
                      max={100}
                      step={1}
                      value={beleihungsauslauf}
                      onValueChange={setBeleihungsauslauf}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50%</span>
                    <span>{beleihungsauslauf[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="bg-muted/50 p-4 rounded-md space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Beleihungsberechnung</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-sm text-muted-foreground">Immobilienwert:</div>
                        <div className="text-sm font-medium">{formatCurrency(immobilienwert)}</div>
                        
                        <div className="text-sm text-muted-foreground">Beleihungsauslauf:</div>
                        <div className="text-sm font-medium">{beleihungsauslauf[0]}%</div>
                        
                        <div className="text-sm text-muted-foreground pt-2 border-t">Maximaler Darlehensbetrag:</div>
                        <div className="text-sm font-medium pt-2 border-t">{formatCurrency(immobilienwert * beleihungsauslauf[0] / 100)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Eigenkapitalanteil</h3>
                      <div className="grid grid-cols-2 gap-y-2">
                        <div className="text-sm text-muted-foreground">Mindest-Eigenkapital:</div>
                        <div className="text-sm font-medium">{formatCurrency(immobilienwert * (100 - beleihungsauslauf[0]) / 100)}</div>
                        
                        <div className="text-sm text-muted-foreground">Eigenkapitalquote:</div>
                        <div className="text-sm font-medium">{100 - beleihungsauslauf[0]}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Beleihungsgrenzen in Deutschland</CardTitle>
                <CardDescription>Wichtige Schwellenwerte und deren Bedeutung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Ihr Beleihungswert</h3>
                      <div className={cn(
                        "h-8 w-full bg-muted rounded-full overflow-hidden relative",
                        beleihungsauslauf[0] <= 60 ? "bg-green-100" :
                        beleihungsauslauf[0] <= 80 ? "bg-yellow-100" : "bg-red-100"
                      )}>
                        <div 
                          className={cn(
                            "h-full",
                            beleihungsauslauf[0] <= 60 ? "bg-green-500" :
                            beleihungsauslauf[0] <= 80 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${beleihungsauslauf[0]}%` }}
                        />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium">
                          {beleihungsauslauf[0]}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">60% Beleihungsgrenze</h4>
                          <p className="text-xs text-muted-foreground">Standard-Pfandbriefgrenze</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={beleihungsauslauf[0] === 60 ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setBeleihungsauslauf([60])}
                        >
                          {formatCurrency(immobilienwert * 0.6)}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">80% Beleihungsgrenze</h4>
                          <p className="text-xs text-muted-foreground">Übliche Finanzierungsgrenze ohne Zusatzkosten</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={beleihungsauslauf[0] === 80 ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setBeleihungsauslauf([80])}
                        >
                          {formatCurrency(immobilienwert * 0.8)}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">90% Beleihungsgrenze</h4>
                          <p className="text-xs text-muted-foreground">Höhere Finanzierung mit Risikoaufschlag</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={beleihungsauslauf[0] === 90 ? "bg-primary text-primary-foreground" : ""}
                          onClick={() => setBeleihungsauslauf([90])}
                        >
                          {formatCurrency(immobilienwert * 0.9)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Was bedeutet der Beleihungsauslauf?</h3>
                  <p className="text-sm mb-3">
                    Der Beleihungsauslauf (LTV - Loan-to-Value) gibt das Verhältnis zwischen Darlehensbetrag und Immobilienwert an. 
                    Je niedriger der Beleihungsauslauf, desto bessere Konditionen bieten Banken typischerweise an.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {beleihungsauslauf[0] <= 60 ? (
                      <div className="text-sm text-green-700">
                        <span className="font-medium">Ihr Beleihungsauslauf liegt bei 60% oder darunter.</span> 
                        Sie erhalten die besten Konditionen bei Banken und erfüllen die Pfandbriefgrenze.
                      </div>
                    ) : beleihungsauslauf[0] <= 80 ? (
                      <div className="text-sm text-yellow-700">
                        <span className="font-medium">Ihr Beleihungsauslauf liegt zwischen 60% und 80%.</span> 
                        Sie erhalten noch gute Konditionen, aber nicht die besten Zinssätze.
                      </div>
                    ) : (
                      <div className="text-sm text-red-700">
                        <span className="font-medium">Ihr Beleihungsauslauf liegt über 80%.</span> 
                        Es fallen Zinsaufschläge an und nicht alle Banken bieten Finanzierungen über 80% an.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <div className="flex items-center">
                  <PiggyBank className="h-3 w-3 mr-1" />
                  Tipp: Ein Beleihungsauslauf unter 80% verbessert Ihre Konditionen deutlich.
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={() => toast.success("Tool-Daten wurden gespeichert")}
          variant="outline"
        >
          Berechnungen speichern
        </Button>
      </div>
    </div>
  );
};

export default DeutscheImmobilienTools;
