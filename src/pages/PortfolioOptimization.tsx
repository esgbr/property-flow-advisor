
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, PlayCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import PortfolioSimulator from '@/components/portfolio/PortfolioSimulator';

const PortfolioOptimization: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio-Optimierung</h1>
          <p className="text-muted-foreground">Optimieren Sie Ihr Immobilienportfolio für maximale Rendite und Risikominimierung</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Portfolio-Daten aktualisiert")}>
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </Button>
          <Button onClick={() => toast.success("Optimierungsanalyse gestartet")}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Analyse starten
          </Button>
        </div>
      </div>

      <Tabs defaultValue="simulator">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="simulator">
            <BarChart className="h-4 w-4 mr-2" />
            Simulator
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <LineChart className="h-4 w-4 mr-2" />
            Strategien
          </TabsTrigger>
          <TabsTrigger value="allocation">
            <PieChart className="h-4 w-4 mr-2" />
            Allokation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4">
          <PortfolioSimulator />
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Wachstumsstrategie</CardTitle>
                <CardDescription>Fokus auf langfristiges Kapitalwachstum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Diese Strategie priorisiert Immobilien mit hohem Wertsteigerungspotenzial, oft in aufstrebenden Märkten oder Stadtteilen.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Empfohlene Allokation:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>70% Wohnimmobilien in aufstrebenden Lagen</li>
                      <li>20% Gewerbeimmobilien mit Entwicklungspotenzial</li>
                      <li>10% REITs mit Fokus auf Wachstumsmärkten</li>
                    </ul>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Wachstumsstrategie angewendet")}>
                    Strategie anwenden
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Einkommensstrategie</CardTitle>
                <CardDescription>Fokus auf regelmäßige Mieteinnahmen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Diese Strategie maximiert laufende Einnahmen durch Vermietung und priorisiert Cashflow über Wertsteigerung.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Empfohlene Allokation:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>50% Mehrfamilienhäuser in stabilen Lagen</li>
                      <li>30% Gewerbeobjekte mit langfristigen Mietverträgen</li>
                      <li>20% REITs mit hohen Ausschüttungen</li>
                    </ul>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Einkommensstrategie angewendet")}>
                    Strategie anwenden
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ausgewogene Strategie</CardTitle>
                <CardDescription>Balance zwischen Wachstum und Einkommen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Diese Strategie kombiniert Cashflow-Generierung mit moderatem Wachstumspotenzial für ein ausgewogenes Portfolio.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Empfohlene Allokation:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>40% Wohnimmobilien in guten Lagen</li>
                      <li>30% Gewerbeobjekte mit soliden Mietverträgen</li>
                      <li>20% Immobilien in aufstrebenden Märkten</li>
                      <li>10% REITs diversifiziert</li>
                    </ul>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Ausgewogene Strategie angewendet")}>
                    Strategie anwenden
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Steueroptimierte Strategie</CardTitle>
                <CardDescription>Fokus auf steuerliche Vorteile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Diese Strategie nutzt steuerliche Abschreibungsmöglichkeiten und andere Vorteile zur Optimierung der Nachsteuerrendite.</p>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium">Empfohlene Allokation:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>40% Neubauimmobilien mit maximaler AfA</li>
                      <li>30% Denkmalgeschützte Objekte</li>
                      <li>20% Immobilien in Fördergebieten</li>
                      <li>10% Immobilien für Sonderabschreibungen</li>
                    </ul>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Steueroptimierte Strategie angewendet")}>
                    Strategie anwenden
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio-Allokation</CardTitle>
              <CardDescription>Optimieren Sie Ihre Vermögensverteilung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Immobilientypen</h3>
                    <Select defaultValue="balanced">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Allokationsstrategie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="growth">Wachstum</SelectItem>
                        <SelectItem value="income">Einkommen</SelectItem>
                        <SelectItem value="balanced">Ausgewogen</SelectItem>
                        <SelectItem value="tax">Steueroptimiert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Wohnimmobilien</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Gewerbeimmobilien</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Grundstücke</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>REITs</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Regionale Verteilung</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Großstädte (A-Lagen)</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Mittelstädte (B-Lagen)</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Kleinstädte (C-Lagen)</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Ländliche Gebiete</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={() => toast.success("Portfolio-Allokation aktualisiert")}>
                  Allokation speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioOptimization;
