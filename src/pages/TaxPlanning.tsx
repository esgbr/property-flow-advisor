
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Euro, FilePlus, Calculator, BarChart, FileText, Save, Download } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Separator } from '@/components/ui/separator';

const TaxPlanning: React.FC = () => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();

  const [selectedYear, setSelectedYear] = useState("2023");
  const [propertyIncome, setPropertyIncome] = useState(50000);
  const [propertyExpenses, setPropertyExpenses] = useState(20000);
  const [depreciation, setDepreciation] = useState(15000);
  const [otherIncome, setOtherIncome] = useState(60000);
  const [countrySpecificSettings, setCountrySpecificSettings] = useState({
    useLinearDepreciation: true,
    includePropertyTransferTax: true,
    reduceTaxRateForRentalIncome: false
  });

  // Calculate basic tax metrics
  const netRentalIncome = propertyIncome - propertyExpenses - depreciation;
  const totalTaxableIncome = netRentalIncome + otherIncome;
  
  // Very simple tax rate estimation (would be more complex in reality)
  const getTaxRate = (income: number) => {
    if (income < 20000) return 0.15;
    if (income < 50000) return 0.25;
    if (income < 100000) return 0.35;
    return 0.42;
  };
  
  const estimatedTaxRate = getTaxRate(totalTaxableIncome);
  const estimatedTax = totalTaxableIncome * estimatedTaxRate;
  
  // Potential tax savings from property investments
  const taxSavingsFromDepreciation = depreciation * estimatedTaxRate;
  const effectiveTaxRate = (estimatedTax / (propertyIncome + otherIncome)) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Steuerplanung' : 'Tax Planning'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Optimieren Sie Ihre Steuerbelastung aus Immobilieninvestitionen' 
              : 'Optimize your tax burden from real estate investments'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder={language === 'de' ? 'Jahr wählen' : 'Select year'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <FilePlus className="h-4 w-4" />
            {language === 'de' ? 'Neuer Plan' : 'New Plan'}
          </Button>
          
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            {language === 'de' ? 'Speichern' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calculator">
        <TabsList className="mb-8">
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Steuerrechner' : 'Tax Calculator'}
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <BarChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Steuerstrategien' : 'Tax Strategies'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Dokumente' : 'Documents'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Einkommensdaten' : 'Income Data'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Geben Sie Ihre Einkommensdaten für die Steuerberechnung ein'
                    : 'Enter your income data for tax calculation'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyIncome">
                      {language === 'de' ? 'Mieteinnahmen' : 'Rental Income'}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="propertyIncome"
                        type="number"
                        value={propertyIncome}
                        onChange={(e) => setPropertyIncome(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="propertyExpenses">
                      {language === 'de' ? 'Immobilienausgaben' : 'Property Expenses'}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="propertyExpenses"
                        type="number"
                        value={propertyExpenses}
                        onChange={(e) => setPropertyExpenses(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="depreciation">
                      {language === 'de' ? 'Abschreibungen (AfA)' : 'Depreciation'}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="depreciation"
                        type="number"
                        value={depreciation}
                        onChange={(e) => setDepreciation(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">
                      {language === 'de' ? 'Sonstiges Einkommen' : 'Other Income'}
                    </Label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="otherIncome"
                        type="number"
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(Number(e.target.value))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                
                {preferences.investmentMarket === 'germany' && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">
                      {language === 'de' ? 'Spezifische Einstellungen für Deutschland' : 'Germany-specific Settings'}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="linearDepreciation" 
                          checked={countrySpecificSettings.useLinearDepreciation}
                          onChange={() => setCountrySpecificSettings(prev => ({
                            ...prev,
                            useLinearDepreciation: !prev.useLinearDepreciation
                          }))}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="linearDepreciation">
                          {language === 'de' ? 'Lineare AfA (2% p.a.)' : 'Linear depreciation (2% p.a.)'}
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="propertyTransferTax" 
                          checked={countrySpecificSettings.includePropertyTransferTax}
                          onChange={() => setCountrySpecificSettings(prev => ({
                            ...prev,
                            includePropertyTransferTax: !prev.includePropertyTransferTax
                          }))}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="propertyTransferTax">
                          {language === 'de' ? 'Grunderwerbsteuer einbeziehen' : 'Include property transfer tax'}
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
                
                {preferences.investmentMarket === 'usa' && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">
                      {language === 'de' ? 'Spezifische Einstellungen für die USA' : 'USA-specific Settings'}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="reduceTaxRate" 
                          checked={countrySpecificSettings.reduceTaxRateForRentalIncome}
                          onChange={() => setCountrySpecificSettings(prev => ({
                            ...prev,
                            reduceTaxRateForRentalIncome: !prev.reduceTaxRateForRentalIncome
                          }))}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="reduceTaxRate">
                          {language === 'de' ? '199A Qualified Business Abzug anwenden' : 'Apply 199A Qualified Business deduction'}
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'de' ? 'Berechnung aktualisieren' : 'Update Calculation'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Steuerberechnung' : 'Tax Calculation'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Steuerliche Auswirkungen Ihrer Immobilieninvestitionen'
                    : 'Tax implications of your real estate investments'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'de' ? 'Zusammenfassung' : 'Summary'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Netto-Mieteinnahmen' : 'Net Rental Income'}</span>
                      <span className="font-medium">{netRentalIncome.toLocaleString()} €</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Sonstiges Einkommen' : 'Other Income'}</span>
                      <span className="font-medium">{otherIncome.toLocaleString()} €</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Zu versteuerndes Einkommen' : 'Taxable Income'}</span>
                      <span className="font-medium">{totalTaxableIncome.toLocaleString()} €</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Geschätzter Steuersatz' : 'Estimated Tax Rate'}</span>
                      <span className="font-medium">{(estimatedTaxRate * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'de' ? 'Geschätzte Steuer' : 'Estimated Tax'}</span>
                      <span className="font-medium">{estimatedTax.toLocaleString()} €</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between text-primary">
                      <span className="font-medium">{language === 'de' ? 'Effektiver Steuersatz' : 'Effective Tax Rate'}</span>
                      <span className="font-bold">{effectiveTaxRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">
                      {language === 'de' ? 'Steuervorteile' : 'Tax Benefits'}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'de' ? 'Steuerersparnis durch Abschreibung' : 'Tax Savings from Depreciation'}</span>
                        <span className="font-medium text-green-600">{taxSavingsFromDepreciation.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Detaillierte Berechnung' : 'Detailed Calculation'}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Bericht exportieren' : 'Export Report'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Vermögensplanung' : 'Asset Planning'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">1</div>
                    <span>{language === 'de' ? 'Optimale Verteilung des Vermögens auf verschiedene Anlageklassen' : 'Optimal distribution of assets across different investment classes'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">2</div>
                    <span>{language === 'de' ? 'Immobilien als steuerlich vorteilhafte Kapitalanlage nutzen' : 'Use real estate as a tax-advantaged investment'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">3</div>
                    <span>{language === 'de' ? 'Langfristige Kapitalaufbaustrategie mit Steuervorteilen' : 'Long-term capital accumulation strategy with tax benefits'}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'de' ? 'Strategie anzeigen' : 'View Strategy'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Abschreibungsoptimierung' : 'Depreciation Optimization'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">1</div>
                    <span>{language === 'de' ? 'Optimale Nutzung von linearen und degressiven Abschreibungsmethoden' : 'Optimal use of linear and declining balance depreciation methods'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">2</div>
                    <span>{language === 'de' ? 'Strategische Zuordnung von Anschaffungskosten' : 'Strategic allocation of acquisition costs'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">3</div>
                    <span>{language === 'de' ? 'Beschleunigte Abschreibungen für bestimmte Gebäudebestandteile' : 'Accelerated depreciation for certain building components'}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'de' ? 'Strategie anzeigen' : 'View Strategy'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Gewerbliche Strukturierung' : 'Business Structuring'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">1</div>
                    <span>{language === 'de' ? 'Optimale Rechtsform für Immobilieninvestitionen' : 'Optimal legal structure for real estate investments'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">2</div>
                    <span>{language === 'de' ? 'Steuervorteile durch Unternehmensstrukturen' : 'Tax advantages through business structures'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-xs text-primary mt-0.5">3</div>
                    <span>{language === 'de' ? 'Familienmitglieder in die Steuerstrategie einbeziehen' : 'Incorporate family members into your tax strategy'}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  {language === 'de' ? 'Strategie anzeigen' : 'View Strategy'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">
                  {language === 'de' ? 'Steuerliche Haftungsausschluss' : 'Tax Disclaimer'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? 'Die hier dargestellten Informationen dienen nur zur allgemeinen Orientierung.'
                    : 'The information presented here is for general guidance only.'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Diese Steuerstrategien sind allgemeine Empfehlungen und sollten nicht als individuelle Steuerberatung verstanden werden. Bitte konsultieren Sie einen qualifizierten Steuerberater für Ihre spezifische Situation.'
                : 'These tax strategies are general recommendations and should not be understood as individual tax advice. Please consult a qualified tax advisor for your specific situation.'}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Steuerdokumente' : 'Tax Documents'}</CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Verwalten Sie Ihre steuerbezogenen Dokumente'
                  : 'Manage your tax-related documents'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="mt-4 text-xl font-medium">
                  {language === 'de' ? 'Keine Dokumente vorhanden' : 'No documents available'}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {language === 'de' 
                    ? 'Laden Sie Steuerdokumente hoch, um sie hier zu organisieren'
                    : 'Upload tax documents to organize them here'}
                </p>
                <Button className="mt-4">
                  {language === 'de' ? 'Dokument hochladen' : 'Upload Document'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxPlanning;
