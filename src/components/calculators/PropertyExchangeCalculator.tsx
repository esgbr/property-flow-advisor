
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, DollarSign, PieChart, Building, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const PropertyExchangeCalculator: React.FC = () => {
  const { t } = useLanguage();
  
  // Form values for the relinquished property (sold property)
  const [relinquishedValue, setRelinquishedValue] = useState<number>(500000);
  const [originalBasis, setOriginalBasis] = useState<number>(300000);
  const [depreciationTaken, setDepreciationTaken] = useState<number>(50000);
  const [sellingCosts, setSellingCosts] = useState<number>(30000);
  const [mortgageBalance, setMortgageBalance] = useState<number>(200000);
  
  // Form values for the replacement property (new property)
  const [replacementValue, setReplacementValue] = useState<number>(600000);
  const [newMortgage, setNewMortgage] = useState<number>(300000);
  const [closingCosts, setClosingCosts] = useState<number>(20000);
  const [improvementCosts, setImprovementCosts] = useState<number>(50000);
  
  // Additional 1031 exchange options
  const [useQI, setUseQI] = useState<boolean>(true);
  const [exchangeDeadlineDays, setExchangeDeadlineDays] = useState<number>(45);
  
  // Results
  const [results, setResults] = useState<any>(null);

  const calculateExchange = () => {
    // Calculate adjusted basis
    const adjustedBasis = originalBasis - depreciationTaken;
    
    // Calculate realized gain
    const realizedGain = relinquishedValue - sellingCosts - adjustedBasis;
    
    // Calculate boot (cash or debt relief received)
    const equityInRelinquishedProperty = relinquishedValue - sellingCosts - mortgageBalance;
    const equityNeededInReplacementProperty = replacementValue + closingCosts + improvementCosts - newMortgage;
    const cashBoot = Math.max(0, equityInRelinquishedProperty - equityNeededInReplacementProperty);
    const debtBoot = Math.max(0, mortgageBalance - newMortgage);
    const totalBoot = cashBoot + debtBoot;
    
    // Calculate recognized gain (taxable)
    const recognizedGain = Math.min(realizedGain, totalBoot);
    
    // Calculate deferred gain
    const deferredGain = realizedGain - recognizedGain;
    
    // Calculate new basis in replacement property
    const newBasis = replacementValue - deferredGain;
    
    // Calculate estimated taxes if not doing an exchange
    const estimatedCapitalGainsTax = realizedGain * 0.20; // Simplified capital gains rate
    const estimatedDepreciationRecaptureTax = depreciationTaken * 0.25; // Depreciation recapture rate
    const totalEstimatedTax = estimatedCapitalGainsTax + estimatedDepreciationRecaptureTax;
    
    // Calculate tax savings
    const taxSavings = totalEstimatedTax - (recognizedGain * 0.20 + Math.min(recognizedGain, depreciationTaken) * 0.25);
    
    // Calculate ROI of exchange
    const roiOfExchange = (taxSavings / (replacementValue - newMortgage)) * 100;
    
    const results = {
      adjustedBasis,
      realizedGain,
      cashBoot,
      debtBoot,
      totalBoot,
      recognizedGain,
      deferredGain,
      newBasis,
      estimatedCapitalGainsTax,
      estimatedDepreciationRecaptureTax,
      totalEstimatedTax,
      taxSavings,
      roiOfExchange
    };
    
    setResults(results);
    toast.success(t('calculationComplete'), {
      description: t('exchangeCalculatorSuccess')
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            {t('propertyExchangeCalculator')}
          </CardTitle>
          <CardDescription>
            {t('calculate1031ExchangeResults')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{t('relinquishedProperty')}</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="relinquishedValue">{t('sellingPrice')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="relinquishedValue"
                    type="number"
                    className="pl-8"
                    value={relinquishedValue}
                    onChange={(e) => setRelinquishedValue(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="originalBasis">{t('originalPurchasePrice')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="originalBasis"
                    type="number" 
                    className="pl-8"
                    value={originalBasis}
                    onChange={(e) => setOriginalBasis(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="depreciationTaken">{t('depreciationTaken')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="depreciationTaken" 
                    type="number" 
                    className="pl-8"
                    value={depreciationTaken}
                    onChange={(e) => setDepreciationTaken(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sellingCosts">{t('sellingCosts')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sellingCosts" 
                    type="number" 
                    className="pl-8"
                    value={sellingCosts}
                    onChange={(e) => setSellingCosts(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="mortgageBalance">{t('mortgageBalance')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mortgageBalance" 
                    type="number" 
                    className="pl-8"
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">{t('replacementProperty')}</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="replacementValue">{t('purchasePrice')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="replacementValue" 
                    type="number" 
                    className="pl-8"
                    value={replacementValue}
                    onChange={(e) => setReplacementValue(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="newMortgage">{t('newMortgage')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newMortgage" 
                    type="number" 
                    className="pl-8"
                    value={newMortgage}
                    onChange={(e) => setNewMortgage(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="closingCosts">{t('closingCosts')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="closingCosts" 
                    type="number" 
                    className="pl-8"
                    value={closingCosts}
                    onChange={(e) => setClosingCosts(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="improvementCosts">{t('plannedImprovements')}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="improvementCosts" 
                    type="number" 
                    className="pl-8"
                    value={improvementCosts}
                    onChange={(e) => setImprovementCosts(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">{t('exchangeOptions')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="useQI">{t('useQualifiedIntermediary')}</Label>
                <Switch
                  id="useQI"
                  checked={useQI}
                  onCheckedChange={setUseQI}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="exchangeDeadline">{t('identificationPeriod')}</Label>
                  <span className="text-sm">{exchangeDeadlineDays} {t('days')}</span>
                </div>
                <Slider
                  id="exchangeDeadline"
                  min={1}
                  max={45}
                  step={1}
                  value={[exchangeDeadlineDays]}
                  onValueChange={(value) => setExchangeDeadlineDays(value[0])}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('identificationPeriodNote')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={calculateExchange} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            {t('calculateExchange')}
          </Button>
        </CardFooter>
      </Card>
      
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>{t('exchangeResults')}</CardTitle>
            <CardDescription>{t('taxImplications')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('realizedGain')}:</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.realizedGain)}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('deferredGain')}:</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.deferredGain)}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('taxableGain')} ({t('boot')}):</p>
                  <p className="text-2xl font-bold">{formatCurrency(results.recognizedGain)}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t('estimatedTaxSavings')}:</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(results.taxSavings)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{t('returnOnExchangeInvestment')}:</p>
                <p className="text-3xl font-bold text-primary">
                  {results.roiOfExchange.toFixed(2)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {results.roiOfExchange > 5 
                    ? t('exchangeHighlyBeneficial') 
                    : t('exchangeMarginalBenefit')}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('additionalConsiderations')}:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
                  <li>{t('newBasisInProperty')}: {formatCurrency(results.newBasis)}</li>
                  <li>{t('cashBootReceived')}: {formatCurrency(results.cashBoot)}</li>
                  <li>{t('debtReliefBoot')}: {formatCurrency(results.debtBoot)}</li>
                  <li>{t('exchangeDeadline')}: {exchangeDeadlineDays} {t('days')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyExchangeCalculator;
