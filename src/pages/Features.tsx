
import React, { useState, useEffect, useCallback } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

const Features = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { largeText, highContrast } = useAccessibility();
  
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
  const [calculationResult, setCalculationResult] = useState('');

  // Reset form when changing tabs
  useEffect(() => {
    setTransferTax(0);
    setCalculationResult('');
  }, [activeTab]);

  // Handle keyboard navigation for tabs
  const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
    if (e.altKey) {
      if (e.key === 'ArrowRight') {
        const tabConfig = [
          'grunderwerbsteuer', 
          'mietkauf', 
          'afa', 
          'mietspiegel', 
          'energieausweis', 
          'nebenkosten'
        ];
        const currentIndex = tabConfig.indexOf(activeTab);
        if (currentIndex < tabConfig.length - 1) {
          setActiveTab(tabConfig[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        const tabConfig = [
          'grunderwerbsteuer', 
          'mietkauf', 
          'afa', 
          'mietspiegel', 
          'energieausweis', 
          'nebenkosten'
        ];
        const currentIndex = tabConfig.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabConfig[currentIndex - 1]);
        }
      }
    }
  }, [activeTab, setActiveTab]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [handleKeyNavigation]);

  // Validate number input
  const validateNumberInput = (value: string): boolean => {
    return !isNaN(parseFloat(value)) && parseFloat(value) > 0;
  };

  // Calculate transfer tax
  const calculateTransferTax = () => {
    if (!propertyPrice || !selectedState) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    try {
      if (!validateNumberInput(propertyPrice)) {
        toast.error(language === 'de' ? 'Bitte geben Sie einen gültigen Kaufpreis ein' : 'Please enter a valid purchase price');
        return;
      }
      
      const price = parseFloat(propertyPrice);
      const stateData = germanStates.find(state => state.name === selectedState);
      
      if (stateData) {
        const taxAmount = (price * stateData.tax) / 100;
        setTransferTax(taxAmount);
        toast.success(t('calculationSuccess') || 'Calculation completed successfully');

        // Set calculation result for screen readers
        const resultText = language === 'de' 
          ? `Grunderwerbsteuer: ${taxAmount.toLocaleString('de-DE')}€ (${stateData.tax}% von ${price.toLocaleString('de-DE')}€)`
          : `Transfer Tax: ${taxAmount.toLocaleString('en-US')}€ (${stateData.tax}% of ${price.toLocaleString('en-US')}€)`;
        setCalculationResult(resultText);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(t('calculationError') || 'Error during calculation');
    }
  };
  
  // Calculate Mietkauf (rent-to-own)
  const calculateMietkauf = () => {
    if (!mietkaufPrice || !mietkaufRent || !mietkaufDuration) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    try {
      if (!validateNumberInput(mietkaufPrice) || 
          !validateNumberInput(mietkaufRent) || 
          !validateNumberInput(mietkaufDuration)) {
        toast.error(language === 'de' ? 'Bitte geben Sie gültige Werte ein' : 'Please enter valid values');
        return;
      }
      
      const price = parseFloat(mietkaufPrice);
      const monthlyRent = parseFloat(mietkaufRent);
      const years = parseFloat(mietkaufDuration);
      
      const totalRentPayments = monthlyRent * 12 * years;
      const remainingAmount = price - totalRentPayments;

      const resultText = language === 'de' 
        ? `Nach ${years} Jahren: ${totalRentPayments.toLocaleString('de-DE')}€ bezahlt, ${remainingAmount.toLocaleString('de-DE')}€ verbleibend`
        : `After ${years} years: ${totalRentPayments.toLocaleString('en-US')}€ paid, ${remainingAmount.toLocaleString('en-US')}€ remaining`;
      
      toast.success(resultText);
      setCalculationResult(resultText);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(t('calculationError') || 'Error during calculation');
    }
  };
  
  // Calculate AfA (depreciation)
  const calculateAfa = () => {
    if (!afaValue) {
      toast.error(t('pleaseEnterAllFields') || 'Please enter all fields');
      return;
    }
    
    try {
      if (!validateNumberInput(afaValue) || 
          !validateNumberInput(afaRate) || 
          !validateNumberInput(buildingCostPercentage)) {
        toast.error(language === 'de' ? 'Bitte geben Sie gültige Werte ein' : 'Please enter valid values');
        return;
      }
      
      const propertyValue = parseFloat(afaValue);
      const rate = parseFloat(afaRate);
      const buildingPercentage = parseFloat(buildingCostPercentage) / 100;
      
      // Only the building can be depreciated, not the land
      const buildingValue = propertyValue * buildingPercentage;
      const yearlyDepreciation = buildingValue * (rate / 100);
      
      const resultText = language === 'de'
        ? `Jährliche AfA: ${yearlyDepreciation.toLocaleString('de-DE')}€ (${rate}% von ${buildingValue.toLocaleString('de-DE')}€)`
        : `Yearly depreciation: ${yearlyDepreciation.toLocaleString('en-US')}€ (${rate}% of ${buildingValue.toLocaleString('en-US')}€)`;
      
      toast.success(resultText);
      setCalculationResult(resultText);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(t('calculationError') || 'Error during calculation');
    }
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
  
  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToDashboard}
          className="hidden md:flex items-center gap-2"
          aria-label={language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
        >
          <Home className="h-4 w-4" />
          {language === 'de' ? 'Dashboard' : 'Dashboard'}
        </Button>
      </div>

      {/* Mobile dashboard button */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBackToDashboard}
          className="w-full flex items-center justify-center gap-2"
          aria-label={language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
        >
          <Home className="h-4 w-4" />
          {language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={`mb-6 ${isMobile ? 'overflow-x-auto pb-2' : ''}`}>
          <TabsList className={`${isMobile ? 'flex w-max space-x-1 border-b' : ''} ${highContrast ? 'border-2 p-1' : ''}`}>
            {tabConfig.map((tab, index) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className={`flex items-center ${largeText ? 'text-base px-4 py-2' : ''}`}
                aria-label={tab.label}
                data-testid={`tab-${tab.id}`}
                accessKey={`${index + 1}`}
              >
                {tab.icon}
                <span className={largeText ? 'text-base' : ''}>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Screen reader only instructions */}
        <div className="sr-only" aria-live="polite">
          {language === 'de' 
            ? 'Verwenden Sie Alt + Pfeiltasten links/rechts, um zwischen Tabs zu navigieren.' 
            : 'Use Alt + Arrow Left/Right to navigate between tabs.'}
        </div>

        {/* Grunderwerbsteuer (Transfer Tax) Calculator */}
        <TabsContent value="grunderwerbsteuer">
          <Card className={highContrast ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle className={largeText ? 'text-2xl' : ''}>
                {language === 'de' ? 'Grunderwerbsteuer-Rechner' : 'Property Transfer Tax Calculator'}
              </CardTitle>
              <CardDescription className={largeText ? 'text-lg' : ''}>
                {language === 'de'
                  ? 'Berechnen Sie die anfallende Grunderwerbsteuer für Immobilienkäufe in verschiedenen Bundesländern.'
                  : 'Calculate the property transfer tax for real estate purchases in different German states.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyPrice" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Kaufpreis (€)' : 'Purchase Price (€)'}
                    </Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      placeholder="z.B. 350000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(e.target.value)}
                      aria-required="true"
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Bundesland' : 'State'}
                    </Label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger id="state" aria-required="true" className={largeText ? 'text-base h-12' : ''}>
                        <SelectValue placeholder={language === 'de' ? 'Bundesland wählen' : 'Select state'} />
                      </SelectTrigger>
                      <SelectContent>
                        {germanStates.map((state) => (
                          <SelectItem key={state.name} value={state.name} className={largeText ? 'text-base' : ''}>
                            {state.name} ({state.tax}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={calculateTransferTax} 
                  className={`w-full ${largeText ? 'text-base py-6' : ''}`}
                >
                  {language === 'de' ? 'Grunderwerbsteuer berechnen' : 'Calculate Transfer Tax'}
                </Button>

                {transferTax > 0 && (
                  <div 
                    className={`mt-4 p-4 border rounded-md bg-muted ${highContrast ? 'border-2 border-primary' : ''}`} 
                    aria-live="polite"
                  >
                    <h3 className={`font-semibold ${largeText ? 'text-lg' : ''}`}>
                      {language === 'de' ? 'Ergebnis:' : 'Result:'}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className={largeText ? 'text-lg' : ''}>
                        {language === 'de' ? 'Grunderwerbsteuer:' : 'Transfer Tax:'}
                      </span>
                      <span className={`font-bold ${largeText ? 'text-2xl' : 'text-xl'}`}>
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
          <Card className={highContrast ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle className={largeText ? 'text-2xl' : ''}>
                {language === 'de' ? 'Mietkauf-Rechner' : 'Rent-to-Own Calculator'}
              </CardTitle>
              <CardDescription className={largeText ? 'text-lg' : ''}>
                {language === 'de'
                  ? 'Analysieren Sie Mietkauf-Modelle und berechnen Sie die verbleibende Kaufsumme nach einer bestimmten Mietperiode.'
                  : 'Analyze rent-to-own models and calculate the remaining purchase amount after a certain rental period.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mietkaufPrice" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Immobilienwert (€)' : 'Property Value (€)'}
                    </Label>
                    <Input
                      id="mietkaufPrice"
                      type="number"
                      placeholder="z.B. 350000"
                      value={mietkaufPrice}
                      onChange={(e) => setMietkaufPrice(e.target.value)}
                      aria-required="true"
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mietkaufRent" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Monatliche Miete (€)' : 'Monthly Rent (€)'}
                    </Label>
                    <Input
                      id="mietkaufRent"
                      type="number"
                      placeholder="z.B. 1200"
                      value={mietkaufRent}
                      onChange={(e) => setMietkaufRent(e.target.value)}
                      aria-required="true"
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mietkaufDuration" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Laufzeit (Jahre)' : 'Duration (years)'}
                    </Label>
                    <Input
                      id="mietkaufDuration"
                      type="number"
                      placeholder="z.B. 15"
                      value={mietkaufDuration}
                      onChange={(e) => setMietkaufDuration(e.target.value)}
                      aria-required="true"
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateMietkauf} 
                  className={`w-full ${largeText ? 'text-base py-6' : ''}`}
                >
                  {language === 'de' ? 'Mietkauf berechnen' : 'Calculate Rent-to-Own'}
                </Button>

                {calculationResult && activeTab === 'mietkauf' && (
                  <div 
                    className={`mt-4 p-4 border rounded-md bg-muted ${highContrast ? 'border-2 border-primary' : ''}`} 
                    aria-live="polite"
                  >
                    <h3 className={`font-semibold ${largeText ? 'text-lg' : ''}`}>
                      {language === 'de' ? 'Ergebnis:' : 'Result:'}
                    </h3>
                    <div className="mt-2">
                      <p className={`${largeText ? 'text-lg' : ''}`}>
                        {calculationResult}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AfA (Depreciation) Calculator */}
        <TabsContent value="afa">
          <Card className={highContrast ? 'border-2' : ''}>
            <CardHeader>
              <CardTitle className={largeText ? 'text-2xl' : ''}>
                {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
              </CardTitle>
              <CardDescription className={largeText ? 'text-lg' : ''}>
                {language === 'de'
                  ? 'Berechnen Sie die steuerliche Absetzung für Abnutzung (AfA) für Ihre Immobilieninvestition.'
                  : 'Calculate the tax depreciation (AfA) for your real estate investment.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="afaValue" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Immobilienwert (€)' : 'Property Value (€)'}
                    </Label>
                    <Input
                      id="afaValue"
                      type="number"
                      placeholder="z.B. 350000"
                      value={afaValue}
                      onChange={(e) => setAfaValue(e.target.value)}
                      aria-required="true"
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="afaRate" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'AfA-Satz (%)' : 'Depreciation Rate (%)'}
                    </Label>
                    <Select value={afaRate} onValueChange={setAfaRate}>
                      <SelectTrigger id="afaRate" className={largeText ? 'text-base h-12' : ''}>
                        <SelectValue placeholder={language === 'de' ? 'AfA-Satz wählen' : 'Select depreciation rate'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2" className={largeText ? 'text-base' : ''}>{language === 'de' ? '2% (Standard)' : '2% (Standard)'}</SelectItem>
                        <SelectItem value="2.5" className={largeText ? 'text-base' : ''}>{language === 'de' ? '2.5% (vor 1925)' : '2.5% (before 1925)'}</SelectItem>
                        <SelectItem value="3" className={largeText ? 'text-base' : ''}>{language === 'de' ? '3% (Denkmalschutz)' : '3% (Monument protection)'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingCostPercentage" className={largeText ? 'text-base' : ''}>
                      {language === 'de' ? 'Gebäudeanteil (%)' : 'Building Portion (%)'}
                    </Label>
                    <Input
                      id="buildingCostPercentage"
                      type="number"
                      placeholder="70"
                      value={buildingCostPercentage}
                      onChange={(e) => setBuildingCostPercentage(e.target.value)}
                      className={largeText ? 'text-base h-12' : ''}
                    />
                  </div>
                </div>

                <Button 
                  onClick={calculateAfa} 
                  className={`w-full ${largeText ? 'text-base py-6' : ''}`}
                >
                  {language === 'de' ? 'AfA berechnen' : 'Calculate Depreciation'}
                </Button>

                {calculationResult && activeTab === 'afa' && (
                  <div 
                    className={`mt-4 p-4 border rounded-md bg-muted ${highContrast ? 'border-2 border-primary' : ''}`} 
                    aria-live="polite"
                  >
                    <h3 className={`font-semibold ${largeText ? 'text-lg' : ''}`}>
                      {language === 'de' ? 'Ergebnis:' : 'Result:'}
                    </h3>
                    <div className="mt-2">
                      <p className={`${largeText ? 'text-lg' : ''}`}>
                        {calculationResult}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coming Soon tabs with improved UI */}
        {['mietspiegel', 'energieausweis', 'nebenkosten'].map((tabId) => {
          const tabData = tabConfig.find(tab => tab.id === tabId);
          if (!tabData) return null;
          
          return (
            <TabsContent key={tabId} value={tabId}>
              <Card className={highContrast ? 'border-2' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tabData.icon}
                    {tabData.label}
                  </CardTitle>
                  <CardDescription>
                    {language === 'de'
                      ? 'Diese Funktion wird demnächst verfügbar sein.'
                      : 'This feature will be available soon.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    {tabId === 'mietspiegel' && <Search className="h-16 w-16 text-muted-foreground mb-2" aria-hidden="true" />}
                    {tabId === 'energieausweis' && <LineChart className="h-16 w-16 text-muted-foreground mb-2" aria-hidden="true" />}
                    {tabId === 'nebenkosten' && <Calculator className="h-16 w-16 text-muted-foreground mb-2" aria-hidden="true" />}
                    
                    <p className={`text-muted-foreground font-semibold ${largeText ? 'text-xl' : 'text-lg'}`}>
                      {language === 'de' ? 'Kommt bald' : 'Coming Soon'}
                    </p>
                    
                    <p className="text-center text-muted-foreground max-w-md">
                      {language === 'de' 
                        ? 'Wir arbeiten daran, dieses Feature so schnell wie möglich bereitzustellen.'
                        : 'We are working to make this feature available as soon as possible.'}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info(language === 'de' ? 'Sie werden benachrichtigt, wenn diese Funktion verfügbar ist' : 'You will be notified when this feature becomes available')}
                      className={`mt-4 ${largeText ? 'text-base py-6 px-8' : ''}`}
                    >
                      {language === 'de' ? 'Benachrichtigen' : 'Notify me'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" aria-live="assertive">
        {calculationResult}
      </div>
    </div>
  );
};

export default Features;
