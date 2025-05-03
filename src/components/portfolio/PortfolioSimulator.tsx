
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, BarChart, Download, LineChart, RefreshCcw } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for portfolio simulation
const sampleSimulationData = [
  { year: '2025', conservative: 105, balanced: 110, aggressive: 115 },
  { year: '2026', conservative: 110, balanced: 121, aggressive: 132 },
  { year: '2027', conservative: 115, balanced: 133, aggressive: 152 },
  { year: '2028', conservative: 121, balanced: 146, aggressive: 175 },
  { year: '2029', conservative: 127, balanced: 161, aggressive: 201 },
  { year: '2030', conservative: 133, balanced: 177, aggressive: 231 },
  { year: '2031', conservative: 140, balanced: 195, aggressive: 266 },
  { year: '2032', conservative: 147, balanced: 214, aggressive: 306 },
  { year: '2033', conservative: 154, balanced: 236, aggressive: 352 },
  { year: '2034', conservative: 162, balanced: 259, aggressive: 405 },
];

type RiskProfile = 'conservative' | 'balanced' | 'aggressive';

const PortfolioSimulator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [simulationYears, setSimulationYears] = useState(10);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('balanced');
  const [inflationRate, setInflationRate] = useState(2);

  const calculateReturns = (profile: RiskProfile): number => {
    switch (profile) {
      case 'conservative':
        return 5.0;
      case 'balanced':
        return 8.0;
      case 'aggressive':
        return 11.0;
      default:
        return 8.0;
    }
  };

  const expectedReturn = calculateReturns(riskProfile);
  
  const handleRunSimulation = () => {
    toast.success("Simulation mit neuen Parametern ausgeführt");
  };

  const handleRiskProfileChange = (value: number[]) => {
    const profiles: RiskProfile[] = ['conservative', 'balanced', 'aggressive'];
    setRiskProfile(profiles[value[0]]);
  };

  const getRiskProfileValue = (): number[] => {
    switch (riskProfile) {
      case 'conservative':
        return [0];
      case 'balanced':
        return [1];
      case 'aggressive':
        return [2];
      default:
        return [1];
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio-Simulator</CardTitle>
          <CardDescription>Simulieren Sie die Entwicklung Ihres Immobilienportfolios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Anfangsinvestition (€)</Label>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualContribution">Jährliche Zusatzinvestition (€)</Label>
              <Input
                id="annualContribution"
                type="number"
                value={annualContribution}
                onChange={(e) => setAnnualContribution(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Simulationszeitraum: {simulationYears} Jahre</Label>
              <Slider
                value={[simulationYears]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setSimulationYears(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Risikoprofil: {riskProfile === 'conservative' ? 'Konservativ' : riskProfile === 'balanced' ? 'Ausgewogen' : 'Aggressiv'}</Label>
              <Slider
                value={getRiskProfileValue()}
                min={0}
                max={2}
                step={1}
                onValueChange={handleRiskProfileChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Konservativ</span>
                <span>Ausgewogen</span>
                <span>Aggressiv</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflationRate">Inflationsrate (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleRunSimulation}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Simulation ausführen
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Ergebnisse exportieren
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulationsergebnisse</CardTitle>
          <CardDescription>Erwartete Portfolio-Entwicklung über {simulationYears} Jahre</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Erwartete Rendite</div>
                <div className="text-2xl font-bold">{expectedReturn}%</div>
                <div className="text-xs text-muted-foreground">pro Jahr</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Endwert (nominal)</div>
                <div className="text-2xl font-bold">{(initialInvestment * Math.pow(1 + expectedReturn / 100, simulationYears)).toLocaleString('de-DE')} €</div>
                <div className="text-xs text-muted-foreground">nach {simulationYears} Jahren</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Inflationsbereinigt</div>
                <div className="text-2xl font-bold">{(initialInvestment * Math.pow(1 + (expectedReturn - inflationRate) / 100, simulationYears)).toLocaleString('de-DE')} €</div>
                <div className="text-xs text-muted-foreground">Realwert</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Jährlicher Cashflow</div>
                <div className="text-2xl font-bold">{Math.round(initialInvestment * 0.045).toLocaleString('de-DE')} €</div>
                <div className="text-xs text-muted-foreground">bei 4,5% Mietrendite</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Portfolio-Performance</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={sampleSimulationData.slice(0, simulationYears)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Wertentwicklung']} />
                    <Legend />
                    <Line type="monotone" dataKey="conservative" stroke="#8884d8" name="Konservativ" />
                    <Line type="monotone" dataKey="balanced" stroke="#82ca9d" name="Ausgewogen" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="aggressive" stroke="#ff7300" name="Aggressiv" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSimulator;
