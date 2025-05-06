import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Chart component placeholder - in a real app, you would use Recharts
const AfaChart = () => (
  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
    <p className="text-muted-foreground">AfA-Verlauf über die Jahre</p>
  </div>
);

const AfaPlanner: React.FC = () => {
  const { language } = useLanguage();
  const [propertyType, setPropertyType] = useState('residential');
  const [purchaseYear, setPurchaseYear] = useState(new Date().getFullYear());
  const [purchasePrice, setPurchasePrice] = useState(500000);
  const [landValue, setLandValue] = useState(200000);
  const [buildingValue, setBuildingValue] = useState(300000);
  const [afaRate, setAfaRate] = useState(2);
  const [usefulLifeYears, setUsefulLifeYears] = useState(50);

  // Calculate AfA values
  const calculateAfa = () => {
    const yearlyAfaAmount = buildingValue * (afaRate / 100);
    const totalAfaYears = Math.ceil(buildingValue / yearlyAfaAmount);
    const currentYear = new Date().getFullYear();
    const elapsedYears = currentYear - purchaseYear;
    const remainingYears = Math.max(0, totalAfaYears - elapsedYears);
    const totalAfaClaimed = Math.min(elapsedYears, totalAfaYears) * yearlyAfaAmount;
    const remainingAfaValue = buildingValue - totalAfaClaimed;
    const progress = (elapsedYears / totalAfaYears) * 100;
    
    return {
      yearlyAfaAmount,
      totalAfaYears,
      elapsedYears,
      remainingYears,
      totalAfaClaimed,
      remainingAfaValue,
      progress: Math.min(100, Math.max(0, progress))
    };
  };

  const afaData = calculateAfa();

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
    // Set default AfA rate based on property type
    switch (value) {
      case 'residential':
        setAfaRate(2);
        setUsefulLifeYears(50);
        break;
      case 'commercial':
        setAfaRate(3);
        setUsefulLifeYears(33);
        break;
      case 'monument':
        setAfaRate(2.5);
        setUsefulLifeYears(40);
        break;
      default:
        setAfaRate(2);
        setUsefulLifeYears(50);
    }
  };

  const handleBuildingValueChange = (value: number) => {
    setBuildingValue(value);
    setPurchasePrice(value + landValue);
  };

  const handleLandValueChange = (value: number) => {
    setLandValue(value);
    setPurchasePrice(buildingValue + value);
  };

  const handlePurchasePriceChange = (value: number) => {
    setPurchasePrice(value);
    // Adjust building value while keeping the same ratio
    const currentTotal = buildingValue + landValue;
    if (currentTotal > 0) {
      const buildingRatio = buildingValue / currentTotal;
      setBuildingValue(Math.round(value * buildingRatio));
      setLandValue(value - Math.round(value * buildingRatio));
    } else {
      // Default split if no previous values
      setBuildingValue(Math.round(value * 0.7));
      setLandValue(Math.round(value * 0.3));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Integrierter AfA-Planer' : 'Integrated Depreciation Planner'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Langfristige Planung und Visualisierung der AfA über die gesamte Nutzungsdauer einer Immobilie' 
            : 'Long-term planning and visualization of depreciation over the entire useful life of a property'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inputs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inputs">
              {language === 'de' ? 'Eingabeparameter' : 'Input Parameters'}
            </TabsTrigger>
            <TabsTrigger value="results">
              {language === 'de' ? 'AfA-Übersicht' : 'Depreciation Overview'}
            </TabsTrigger>
            <TabsTrigger value="schedule">
              {language === 'de' ? 'AfA-Verlauf' : 'Depreciation Schedule'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inputs" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyType">
                    {language === 'de' ? 'Immobilientyp' : 'Property Type'}
                  </Label>
                  <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        {language === 'de' ? 'Wohnimmobilie' : 'Residential Property'}
                      </SelectItem>
                      <SelectItem value="commercial">
                        {language === 'de' ? 'Gewerbeimmobilie' : 'Commercial Property'}
                      </SelectItem>
                      <SelectItem value="monument">
                        {language === 'de' ? 'Denkmalgeschützte Immobilie' : 'Heritage Building'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="purchaseYear">
                    {language === 'de' ? 'Kaufjahr' : 'Purchase Year'}
                  </Label>
                  <Input 
                    id="purchaseYear" 
                    type="number" 
                    value={purchaseYear} 
                    onChange={(e) => setPurchaseYear(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label htmlFor="purchasePrice">
                    {language === 'de' ? 'Kaufpreis (€)' : 'Purchase Price (€)'}
                  </Label>
                  <Input 
                    id="purchasePrice" 
                    type="number" 
                    value={purchasePrice} 
                    onChange={(e) => handlePurchasePriceChange(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="landValue">
                    {language === 'de' ? 'Grundstückswert (€)' : 'Land Value (€)'}
                  </Label>
                  <Input 
                    id="landValue" 
                    type="number" 
                    value={landValue} 
                    onChange={(e) => handleLandValueChange(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label htmlFor="buildingValue">
                    {language === 'de' ? 'Gebäudewert (€)' : 'Building Value (€)'}
                  </Label>
                  <Input 
                    id="buildingValue" 
                    type="number" 
                    value={buildingValue} 
                    onChange={(e) => handleBuildingValueChange(Number(e.target.value))} 
                  />
                </div>

                <div>
                  <Label htmlFor="afaRate">
                    {language === 'de' ? 'AfA-Satz (%)' : 'Depreciation Rate (%)'}
                  </Label>
                  <Input 
                    id="afaRate" 
                    type="number" 
                    step="0.1"
                    value={afaRate} 
                    onChange={(e) => setAfaRate(Number(e.target.value))} 
                  />
                </div>
              </div>
            </div>

            <Button className="w-full">
              {language === 'de' ? 'AfA-Plan erstellen' : 'Create Depreciation Plan'}
            </Button>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Jährliche AfA' : 'Annual Depreciation'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {afaData.yearlyAfaAmount.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {language === 'de' ? 'Restlaufzeit' : 'Remaining Term'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {afaData.remainingYears} 
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        {language === 'de' ? 'Jahre' : 'years'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {language === 'de' ? 'AfA-Fortschritt' : 'Depreciation Progress'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={afaData.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>
                      {language === 'de' ? 'Beginn' : 'Start'} ({purchaseYear})
                    </span>
                    <span>
                      {language === 'de' ? 'Ende' : 'End'} ({purchaseYear + afaData.totalAfaYears})
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {language === 'de' ? 'Detaillierte Übersicht' : 'Detailed Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Gebäudewert:' : 'Building Value:'}</span>
                      <span className="font-medium">
                        {buildingValue.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Bisher abgeschrieben:' : 'Depreciated So Far:'}</span>
                      <span className="font-medium">
                        {afaData.totalAfaClaimed.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Verbleibender AfA-Wert:' : 'Remaining Depreciation Value:'}</span>
                      <span className="font-medium">
                        {afaData.remainingAfaValue.toLocaleString(language === 'de' ? 'de-DE' : 'en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-medium">{language === 'de' ? 'Nutzungsdauer:' : 'Useful Life:'}</span>
                      <span className="font-bold">{usefulLifeYears} {language === 'de' ? 'Jahre' : 'years'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'AfA-Verlaufsdiagramm' : 'Depreciation Schedule Chart'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AfaChart />
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    {language === 'de' ? 'AfA-Plan exportieren' : 'Export Depreciation Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AfaPlanner;
