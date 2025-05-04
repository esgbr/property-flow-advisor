
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, TrendingUp, PieChart, RefreshCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const RentalYieldCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [values, setValues] = useState({
    propertyValue: 250000,
    annualRentalIncome: 18000,
    operatingExpenses: 3600, // 20% of rental income as default
    propertyTaxRate: 1.2,
    vacancyRate: 5,
    maintenanceReserve: 5,
    propertyManagementFee: 8
  });
  
  // Calculate gross and net yields
  const grossRentalYield = (values.annualRentalIncome / values.propertyValue) * 100;
  
  const totalOperatingExpenses = 
    values.operatingExpenses +
    (values.propertyValue * values.propertyTaxRate / 100) +
    (values.annualRentalIncome * values.vacancyRate / 100) +
    (values.annualRentalIncome * values.maintenanceReserve / 100) +
    (values.annualRentalIncome * values.propertyManagementFee / 100);
  
  const netOperatingIncome = values.annualRentalIncome - totalOperatingExpenses;
  const netRentalYield = (netOperatingIncome / values.propertyValue) * 100;
  
  // Handle input changes
  const handleInputChange = (field: string, value: number) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          {t('rentalYieldCalculator')}
        </CardTitle>
        <CardDescription>
          {t('analyzeRentalInvestmentReturns')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gross">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gross">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('grossYield')}
            </TabsTrigger>
            <TabsTrigger value="net">
              <PieChart className="h-4 w-4 mr-2" />
              {t('netYield')}
            </TabsTrigger>
          </TabsList>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyValue">{t('propertyValue')}</Label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">€</span>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={values.propertyValue}
                    onChange={(e) => handleInputChange('propertyValue', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="annualRentalIncome">{t('annualRentalIncome')}</Label>
                <div className="flex items-center">
                  <span className="text-sm mr-2">€</span>
                  <Input
                    id="annualRentalIncome"
                    type="number"
                    value={values.annualRentalIncome}
                    onChange={(e) => handleInputChange('annualRentalIncome', parseFloat(e.target.value))}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(values.annualRentalIncome / 12).toFixed(0)}€ / {t('month')}
                </div>
              </div>
              
              <TabsContent value="net" className="mt-0 space-y-4">
                <div>
                  <Label htmlFor="operatingExpenses">{t('operatingExpenses')}</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-2">€</span>
                    <Input
                      id="operatingExpenses"
                      type="number"
                      value={values.operatingExpenses}
                      onChange={(e) => handleInputChange('operatingExpenses', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="propertyTaxRate">{t('propertyTaxRate')} (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="propertyTaxRate"
                      type="number"
                      step="0.1"
                      value={values.propertyTaxRate}
                      onChange={(e) => handleInputChange('propertyTaxRate', parseFloat(e.target.value))}
                    />
                    <span className="text-sm ml-2">%</span>
                  </div>
                </div>
                
                <div>
                  <Label>{t('vacancyRate')} ({values.vacancyRate}%)</Label>
                  <Slider
                    value={[values.vacancyRate]}
                    min={0}
                    max={20}
                    step={0.5}
                    onValueChange={(value) => handleInputChange('vacancyRate', value[0])}
                  />
                </div>
                
                <div>
                  <Label>{t('maintenanceReserve')} ({values.maintenanceReserve}%)</Label>
                  <Slider
                    value={[values.maintenanceReserve]}
                    min={0}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => handleInputChange('maintenanceReserve', value[0])}
                  />
                </div>
                
                <div>
                  <Label>{t('propertyManagementFee')} ({values.propertyManagementFee}%)</Label>
                  <Slider
                    value={[values.propertyManagementFee]}
                    min={0}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => handleInputChange('propertyManagementFee', value[0])}
                  />
                </div>
              </TabsContent>
              
              <Button 
                variant="outline" 
                type="button" 
                className="w-full"
                onClick={() => {
                  // Reset to defaults
                  setValues({
                    propertyValue: 250000,
                    annualRentalIncome: 18000,
                    operatingExpenses: 3600,
                    propertyTaxRate: 1.2,
                    vacancyRate: 5,
                    maintenanceReserve: 5,
                    propertyManagementFee: 8
                  });
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t('resetToDefaults')}
              </Button>
            </div>
            
            <TabsContent value="gross" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('grossRentalYield')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {grossRentalYield.toFixed(2)}%
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('propertyValue')}:</span>
                      <span className="font-medium">€{values.propertyValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('annualRentalIncome')}:</span>
                      <span className="font-medium">€{values.annualRentalIncome.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>{t('grossRentalYield')}:</span>
                      <span className={grossRentalYield >= 5 ? "text-green-600" : "text-amber-600"}>
                        {grossRentalYield.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="text-sm font-medium mb-1">{t('whatIsGrossRentalYield')}</div>
                    <p className="text-xs text-muted-foreground">
                      {t('grossRentalYieldDescription')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="net" className="mt-0 space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('netRentalYield')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center">
                    {netRentalYield.toFixed(2)}%
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('annualRentalIncome')}:</span>
                      <span className="font-medium">€{values.annualRentalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('operatingExpenses')}:</span>
                      <span>-€{values.operatingExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('propertyTax')}:</span>
                      <span>-€{(values.propertyValue * values.propertyTaxRate / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('vacancyLoss')}:</span>
                      <span>-€{(values.annualRentalIncome * values.vacancyRate / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('maintenance')}:</span>
                      <span>-€{(values.annualRentalIncome * values.maintenanceReserve / 100).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{t('propertyManagement')}:</span>
                      <span>-€{(values.annualRentalIncome * values.propertyManagementFee / 100).toFixed(0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-sm">
                      <span>{t('netOperatingIncome')}:</span>
                      <span className="font-medium">€{netOperatingIncome.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>{t('netRentalYield')}:</span>
                      <span className={netRentalYield >= 4 ? "text-green-600" : "text-amber-600"}>
                        {netRentalYield.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{t('investmentMetrics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground">{t('priceToRentRatio')}</div>
                      <div className="text-xl font-medium mt-1">
                        {(values.propertyValue / values.annualRentalIncome).toFixed(1)}
                      </div>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground">{t('monthlyCashFlow')}</div>
                      <div className="text-xl font-medium mt-1">
                        €{((values.annualRentalIncome - totalOperatingExpenses) / 12).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <div className="text-sm font-medium mb-1">{t('investmentAnalysis')}</div>
                    <p className="text-xs text-muted-foreground">
                      {netRentalYield >= 5
                        ? t('goodInvestmentDescription')
                        : netRentalYield >= 3.5
                        ? t('averageInvestmentDescription')
                        : t('poorInvestmentDescription')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Calculator className="mr-2 h-4 w-4" />
          {t('exportCalculation')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RentalYieldCalculator;
