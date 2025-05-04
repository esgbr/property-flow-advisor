
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Building,
  Calculator,
  Euro,
  Home,
  FileText,
  BarChart,
  PiggyBank,
  Search,
  Landmark,
  Receipt,
  Map,
  LineChart,
  Building2,
  Calendar,
  BookOpen
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

const Features = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { largeText } = useAccessibility();
  
  // Get tab from URL query parameter
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    return tabParam || 'grunderwerbsteuer';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update URL when tab changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', activeTab);
    const newRelativePathQuery = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [activeTab, location.pathname, location.search]);
  
  // German states with their Grunderwerbsteuer rates
  const germanStates = [
    { name: 'Baden-Württemberg', tax: 5.0 },
    { name: 'Bayern', tax: 3.5 },
    { name: 'Berlin', tax: 6.0 },
    { name: 'Brandenburg', tax: 6.5 },
    { name: 'Bremen', tax: 5.0 },
    { name: 'Hamburg', tax: 4.5 },
    { name: 'Hessen', tax: 6.0 },
    { name: 'Mecklenburg-Vorpommern', tax: 6.0 },
    { name: 'Niedersachsen', tax: 5.0 },
    { name: 'Nordrhein-Westfalen', tax: 6.5 },
    { name: 'Rheinland-Pfalz', tax: 5.0 },
    { name: 'Saarland', tax: 6.5 },
    { name: 'Sachsen', tax: 3.5 },
    { name: 'Sachsen-Anhalt', tax: 5.0 },
    { name: 'Schleswig-Holstein', tax: 6.5 },
    { name: 'Thüringen', tax: 6.5 },
  ];
  
  // Form states
  const [propertyPrice, setPropertyPrice] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [transferTax, setTransferTax] = useState(0);
  const [mietkaufPrice, setMietkaufPrice] = useState('');
  const [mietkaufRent, setMietkaufRent] = useState('');
  const [mietkaufDuration, setMietkaufDuration] = useState('');
  const [afaValue, setAfaValue] = useState('');
  const [afaRate, setAfaRate] = useState('2');
  const [buildingCostPercentage, setBuildingCostPercentage] = useState('70');

  // Reset form when changing tabs
  useEffect(() => {
    setTransferTax(0);
  }, [activeTab]);

  // Calculate transfer tax
  const calculateTransferTax = () => {
    if (!propertyPrice || !selectedState) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    const price = parseFloat(propertyPrice);
    const stateData = germanStates.find(state => state.name === selectedState);
    
    if (stateData) {
      const taxAmount = (price * stateData.tax) / 100;
      setTransferTax(taxAmount);
      toast.success(t('calculationSuccess') || 'Calculation completed successfully');
    }
  };
  
  // Calculate Mietkauf (rent-to-own)
  const calculateMietkauf = () => {
    if (!mietkaufPrice || !mietkaufRent || !mietkaufDuration) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    const price = parseFloat(mietkaufPrice);
    const monthlyRent = parseFloat(mietkaufRent);
    const years = parseFloat(mietkaufDuration);
    
    const totalRentPayments = monthlyRent * 12 * years;
    const remainingAmount = price - totalRentPayments;
    
    toast.success(
      language === 'de' 
        ? `Nach ${years} Jahren: ${totalRentPayments.toLocaleString('de-DE')}€ bezahlt, ${remainingAmount.toLocaleString('de-DE')}€ verbleibend`
        : `After ${years} years: ${totalRentPayments.toLocaleString('en-US')}€ paid, ${remainingAmount.toLocaleString('en-US')}€ remaining`
    );
  };
  
  // Calculate AfA (depreciation)
  const calculateAfa = () => {
    if (!afaValue) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    const propertyValue = parseFloat(afaValue);
    const rate = parseFloat(afaRate);
    const buildingPercentage = parseFloat(buildingCostPercentage) / 100;
    
    // Only the building can be depreciated, not the land
    const buildingValue = propertyValue * buildingPercentage;
    const yearlyDepreciation = buildingValue * (rate / 100);
    
    toast.success(
      language === 'de'
        ? `Jährliche AfA: ${yearlyDepreciation.toLocaleString('de-DE')}€`
        : `Yearly depreciation: ${yearlyDepreciation.toLocaleString('en-US')}€`
    );
  };

  // Tab configuration with icons and labels
  const tabConfig = [
    {
      id: 'grunderwerbsteuer',
      icon: <Receipt className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax',
    },
    {
      id: 'mietkauf',
      icon: <Landmark className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Mietkauf' : 'Rent-to-Own',
    },
    {
      id: 'afa',
      icon: <PiggyBank className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'AfA-Rechner' : 'Depreciation',
    },
    {
      id: 'mietspiegel',
      icon: <Map className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Mietspiegel' : 'Rent Index',
    },
    {
      id: 'energieausweis',
      icon: <LineChart className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Energieausweis' : 'Energy Certificate',
    },
    {
      id: 'nebenkosten',
      icon: <Calculator className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Nebenkosten' : 'Additional Costs',
    },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className={`text-3xl font-bold ${largeText ? 'text-4xl' : ''}`}>
          {language === 'de' ? 'Deutsche Immobilien Tools' : 'German Real Estate Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Spezielle Tools für deutsche Immobilieninvestoren' 
            : 'Specialized tools for German real estate investors'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={`mb-6 ${isMobile ? 'overflow-x-auto' : ''}`}>
          <TabsList className={isMobile ? 'flex w-max space-x-1' : ''}>
            {tabConfig.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center"
                aria-label={tab.label}
              >
                {tab.icon}
                <span className={largeText ? 'text-base' : ''}>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Grunderwerbsteuer (Transfer Tax) Calculator */}
        <TabsContent value="grunderwerbsteuer">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Grunderwerbsteuer-Rechner' : 'Property Transfer Tax Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Berechnen Sie die anfallende Grunderwerbsteuer für Immobilienkäufe in verschiedenen Bundesländern.'
                  : 'Calculate the property transfer tax for real estate purchases in different German states.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyPrice">
                      {language === 'de' ? 'Kaufpreis (€)' : 'Purchase Price (€)'}
                    </Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      placeholder="z.B. 350000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">
                      {language === 'de' ? 'Bundesland' : 'State'}
                    </Label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger id="state" aria-required="true">
                        <SelectValue placeholder={language === 'de' ? 'Bundesland wählen' : 'Select state'} />
                      </SelectTrigger>
                      <SelectContent>
                        {germanStates.map((state) => (
                          <SelectItem key={state.name} value={state.name}>
                            {state.name} ({state.tax}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={calculateTransferTax} className="w-full">
                  {language === 'de' ? 'Grunderwerbsteuer berechnen' : 'Calculate Transfer Tax'}
                </Button>

                {transferTax > 0 && (
                  <div className="mt-4 p-4 border rounded-md bg-muted" aria-live="polite">
                    <h3 className="font-semibold">
                      {language === 'de' ? 'Ergebnis:' : 'Result:'}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span>
                        {language === 'de' ? 'Grunderwerbsteuer:' : 'Transfer Tax:'}
                      </span>
                      <span className="text-xl font-bold">
                        {transferTax.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')} €
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mietkauf (Rent-to-Own) Calculator */}
        <TabsContent value="mietkauf">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Mietkauf-Rechner' : 'Rent-to-Own Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Analysieren Sie Mietkauf-Modelle und berechnen Sie die verbleibende Kaufsumme nach einer bestimmten Mietperiode.'
                  : 'Analyze rent-to-own models and calculate the remaining purchase amount after a certain rental period.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mietkaufPrice">
                      {language === 'de' ? 'Immobilienwert (€)' : 'Property Value (€)'}
                    </Label>
                    <Input
                      id="mietkaufPrice"
                      type="number"
                      placeholder="z.B. 350000"
                      value={mietkaufPrice}
                      onChange={(e) => setMietkaufPrice(e.target.value)}
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mietkaufRent">
                      {language === 'de' ? 'Monatliche Miete (€)' : 'Monthly Rent (€)'}
                    </Label>
                    <Input
                      id="mietkaufRent"
                      type="number"
                      placeholder="z.B. 1200"
                      value={mietkaufRent}
                      onChange={(e) => setMietkaufRent(e.target.value)}
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mietkaufDuration">
                      {language === 'de' ? 'Laufzeit (Jahre)' : 'Duration (years)'}
                    </Label>
                    <Input
                      id="mietkaufDuration"
                      type="number"
                      placeholder="z.B. 15"
                      value={mietkaufDuration}
                      onChange={(e) => setMietkaufDuration(e.target.value)}
                      aria-required="true"
                    />
                  </div>
                </div>

                <Button onClick={calculateMietkauf} className="w-full">
                  {language === 'de' ? 'Mietkauf berechnen' : 'Calculate Rent-to-Own'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AfA (Depreciation) Calculator */}
        <TabsContent value="afa">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Berechnen Sie die steuerliche Absetzung für Abnutzung (AfA) für Ihre Immobilieninvestition.'
                  : 'Calculate the tax depreciation (AfA) for your real estate investment.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="afaValue">
                      {language === 'de' ? 'Immobilienwert (€)' : 'Property Value (€)'}
                    </Label>
                    <Input
                      id="afaValue"
                      type="number"
                      placeholder="z.B. 350000"
                      value={afaValue}
                      onChange={(e) => setAfaValue(e.target.value)}
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="afaRate">
                      {language === 'de' ? 'AfA-Satz (%)' : 'Depreciation Rate (%)'}
                    </Label>
                    <Select value={afaRate} onValueChange={setAfaRate}>
                      <SelectTrigger id="afaRate">
                        <SelectValue placeholder={language === 'de' ? 'AfA-Satz wählen' : 'Select depreciation rate'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">{language === 'de' ? '2% (Standard)' : '2% (Standard)'}</SelectItem>
                        <SelectItem value="2.5">{language === 'de' ? '2.5% (vor 1925)' : '2.5% (before 1925)'}</SelectItem>
                        <SelectItem value="3">{language === 'de' ? '3% (Denkmalschutz)' : '3% (Monument protection)'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingCostPercentage">
                      {language === 'de' ? 'Gebäudeanteil (%)' : 'Building Portion (%)'}
                    </Label>
                    <Input
                      id="buildingCostPercentage"
                      type="number"
                      placeholder="70"
                      value={buildingCostPercentage}
                      onChange={(e) => setBuildingCostPercentage(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={calculateAfa} className="w-full">
                  {language === 'de' ? 'AfA berechnen' : 'Calculate Depreciation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mietspiegel (Rent Index) */}
        <TabsContent value="mietspiegel">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Mietspiegel-Analyse' : 'Rent Index Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Vergleichen Sie Ihre Mietpreise mit dem lokalen Mietspiegel für deutsche Städte.'
                  : 'Compare your rental prices with the local rent index for German cities.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Search className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden="true" />
                  <p className="text-muted-foreground">
                    {language === 'de' ? 'Kommt bald' : 'Coming Soon'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Energieausweis (Energy Certificate) Analyzer */}
        <TabsContent value="energieausweis">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Energieausweis-Analyse' : 'Energy Certificate Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Analysieren Sie Energieausweise und deren Einfluss auf Immobilieninvestitionen.'
                  : 'Analyze energy certificates and their impact on real estate investments.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <LineChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden="true" />
                  <p className="text-muted-foreground">
                    {language === 'de' ? 'Kommt bald' : 'Coming Soon'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nebenkosten (Additional Costs) Calculator */}
        <TabsContent value="nebenkosten">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Nebenkosten-Rechner' : 'Additional Costs Calculator'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Berechnen und schätzen Sie die Nebenkosten für Mietobjekte.'
                  : 'Calculate and estimate additional costs for rental properties.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Calculator className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden="true" />
                  <p className="text-muted-foreground">
                    {language === 'de' ? 'Kommt bald' : 'Coming Soon'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Features;
