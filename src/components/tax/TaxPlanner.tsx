
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BookOpen, CheckCircle2, ClipboardList, CreditCard, FilePlus2, HelpCircle, 
  Lightbulb, Receipt, RefreshCw, TrendingDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AIAssistant from '@/components/ai/AIAssistant';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TaxDeduction {
  id: string;
  category: string;
  description: string;
  amount: number;
  recurring: boolean;
  eligibility: 'eligible' | 'ineligible' | 'needsReview';
}

const TaxPlanner: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Sample tax deductions data
  const [taxDeductions, setTaxDeductions] = useState<TaxDeduction[]>([
    {
      id: '1',
      category: 'mortgage',
      description: t('mortgageInterest'),
      amount: 12000,
      recurring: true,
      eligibility: 'eligible'
    },
    {
      id: '2',
      category: 'property',
      description: t('propertyTaxes'),
      amount: 8500,
      recurring: true,
      eligibility: 'eligible'
    },
    {
      id: '3',
      category: 'maintenance',
      description: t('repairsAndMaintenance'),
      amount: 6200,
      recurring: false,
      eligibility: 'eligible'
    },
    {
      id: '4',
      category: 'insurance',
      description: t('propertyInsurance'),
      amount: 2800,
      recurring: true,
      eligibility: 'eligible'
    },
    {
      id: '5',
      category: 'utilities',
      description: t('utilities'),
      amount: 3400,
      recurring: true,
      eligibility: 'needsReview'
    },
    {
      id: '6',
      category: 'professional',
      description: t('accountingFees'),
      amount: 1200,
      recurring: true,
      eligibility: 'eligible'
    },
    {
      id: '7',
      category: 'travel',
      description: t('travelExpenses'),
      amount: 1800,
      recurring: false,
      eligibility: 'ineligible'
    },
    {
      id: '8',
      category: 'depreciation',
      description: t('buildingDepreciation'),
      amount: 15000,
      recurring: true,
      eligibility: 'eligible'
    }
  ]);
  
  // State for the new deduction form
  const [newDeduction, setNewDeduction] = useState<Omit<TaxDeduction, 'id' | 'eligibility'>>({
    category: 'mortgage',
    description: '',
    amount: 0,
    recurring: false
  });
  
  // Handle saving a new tax deduction
  const handleSaveDeduction = () => {
    if (!newDeduction.description || newDeduction.amount <= 0) {
      toast({
        title: t('validationError'),
        description: t('pleaseFillAllFields'),
        variant: 'destructive'
      });
      return;
    }
    
    const newItem: TaxDeduction = {
      id: Date.now().toString(),
      ...newDeduction,
      eligibility: 'needsReview'
    };
    
    setTaxDeductions([...taxDeductions, newItem]);
    setNewDeduction({
      category: 'mortgage',
      description: '',
      amount: 0,
      recurring: false
    });
    
    toast({
      title: t('deductionAdded'),
      description: t('deductionAddedDescription')
    });
  };
  
  // Calculate total eligible deductions
  const totalEligibleDeductions = taxDeductions
    .filter(d => d.eligibility === 'eligible')
    .reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate total pending review deductions
  const totalPendingDeductions = taxDeductions
    .filter(d => d.eligibility === 'needsReview')
    .reduce((sum, item) => sum + item.amount, 0);
    
  // Data for pie chart
  const deductionsBreakdown = [
    { name: t('mortgageInterest'), value: taxDeductions.filter(d => d.category === 'mortgage' && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) },
    { name: t('propertyTaxes'), value: taxDeductions.filter(d => d.category === 'property' && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) },
    { name: t('repairsAndMaintenance'), value: taxDeductions.filter(d => d.category === 'maintenance' && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) },
    { name: t('insurance'), value: taxDeductions.filter(d => d.category === 'insurance' && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) },
    { name: t('depreciation'), value: taxDeductions.filter(d => d.category === 'depreciation' && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) },
    { name: t('other'), value: taxDeductions.filter(d => !['mortgage', 'property', 'maintenance', 'insurance', 'depreciation'].includes(d.category) && d.eligibility === 'eligible').reduce((sum, item) => sum + item.amount, 0) }
  ].filter(item => item.value > 0);
  
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
  
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handler for the 1031 Exchange Calculator
  const handleExchangeCalculator = () => {
    toast({
      title: t('featureComingSoon'),
      description: t('exchange1031CalculatorComingSoon')
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Receipt className="inline-block mr-2 h-8 w-8" />
            {t('taxPlanner')}
          </h1>
          <p className="text-muted-foreground">{t('optimizeYourTaxStrategy')}</p>
        </div>
        <AIAssistant 
          variant="icon" 
          size="md"
          contextData={{ 
            totalDeductions: totalEligibleDeductions,
            deductionCategories: Array.from(new Set(taxDeductions.map(d => d.category)))
          }}
          title={t('taxOptimizationAssistant')}
          description={t('getPersonalizedTaxAdvice')}
        />
      </div>
      
      <Tabs defaultValue="deductions" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="deductions">
            <ClipboardList className="h-4 w-4 mr-2" />
            {t('deductions')}
          </TabsTrigger>
          <TabsTrigger value="1031exchange">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('1031Exchange')}
          </TabsTrigger>
          <TabsTrigger value="depreciation">
            <TrendingDown className="h-4 w-4 mr-2" />
            {t('depreciation')}
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="h-4 w-4 mr-2" />
            {t('resources')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deductions" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('taxDeductions')}</CardTitle>
                <CardDescription>{t('trackYourEligibleDeductions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between mb-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{t('eligibleDeductions')}</div>
                      <div className="text-2xl font-bold">{formatCurrency(totalEligibleDeductions)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">{t('pendingReview')}</div>
                      <div className="text-2xl font-semibold text-amber-500">{formatCurrency(totalPendingDeductions)}</div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                    {taxDeductions.map((deduction) => (
                      <div key={deduction.id} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{deduction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {deduction.recurring && <Badge variant="outline" className="mr-2">{t('recurring')}</Badge>}
                            <span className="capitalize">{t(deduction.category)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="font-medium text-right">{formatCurrency(deduction.amount)}</div>
                          <div>
                            {deduction.eligibility === 'eligible' && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {deduction.eligibility === 'needsReview' && (
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-5 w-5 text-amber-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('needsReviewTooltip')}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            )}
                            {deduction.eligibility === 'ineligible' && (
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="h-5 w-5 text-red-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('ineligibleDeductionTooltip')}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('deductionsBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deductionsBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {deductionsBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {deductionsBreakdown.map((entry, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div 
                        className="w-3 h-3 mr-1 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('addNewDeduction')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">{t('category')}</Label>
                  <Select 
                    value={newDeduction.category} 
                    onValueChange={(value) => setNewDeduction({...newDeduction, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage">{t('mortgage')}</SelectItem>
                      <SelectItem value="property">{t('property')}</SelectItem>
                      <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                      <SelectItem value="insurance">{t('insurance')}</SelectItem>
                      <SelectItem value="utilities">{t('utilities')}</SelectItem>
                      <SelectItem value="professional">{t('professional')}</SelectItem>
                      <SelectItem value="travel">{t('travel')}</SelectItem>
                      <SelectItem value="depreciation">{t('depreciation')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t('description')}</Label>
                  <Input 
                    id="description"
                    value={newDeduction.description}
                    onChange={(e) => setNewDeduction({...newDeduction, description: e.target.value})}
                    placeholder={t('enterDescription')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">{t('amount')}</Label>
                  <Input 
                    id="amount"
                    type="number"
                    value={newDeduction.amount || ''}
                    onChange={(e) => setNewDeduction({...newDeduction, amount: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-4">{t('recurring')}</Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="recurring"
                      checked={newDeduction.recurring}
                      onCheckedChange={(checked) => setNewDeduction({...newDeduction, recurring: checked})}
                    />
                    <Label htmlFor="recurring" className="cursor-pointer">{t('recurringExpense')}</Label>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4 w-full sm:w-auto" onClick={handleSaveDeduction}>
                <FilePlus2 className="h-4 w-4 mr-2" />
                {t('addDeduction')}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-primary mt-1" />
                <div>
                  <CardTitle className="text-lg">{t('taxTip')}</CardTitle>
                  <CardDescription>{t('scheduleConsultation')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('taxConsultationTip')}
              </p>
              <Button variant="outline" className="mt-4 text-sm h-8">
                {t('findTaxProfessional')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="1031exchange" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('1031ExchangePlanner')}</CardTitle>
              <CardDescription>{t('deferCapitalGainsTaxes')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                  {t('about1031Exchange')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('1031ExchangeDescription')}
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('relinquishedProperty')}</h3>
                  <div className="space-y-2">
                    <Label>{t('currentPropertyValue')}</Label>
                    <Input type="number" placeholder="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('originalPurchasePrice')}</Label>
                    <Input type="number" placeholder="350000" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('capitalImprovements')}</Label>
                    <Input type="number" placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('sellingExpenses')}</Label>
                    <Input type="number" placeholder="30000" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('replacementProperty')}</h3>
                  <div className="space-y-2">
                    <Label>{t('newPropertyValue')}</Label>
                    <Input type="number" placeholder="600000" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('closingCosts')}</Label>
                    <Input type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('exchangeFees')}</Label>
                    <Input type="number" placeholder="5000" />
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="font-medium text-amber-800 dark:text-amber-300">{t('deadline')}</div>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      {t('1031DeadlineWarning')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={handleExchangeCalculator}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {t('calculate1031Exchange')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="depreciation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('depreciationScheduler')}</CardTitle>
              <CardDescription>{t('trackAssetDepreciationTaxBenefits')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{t('residentialProperty')}</CardTitle>
                      <Badge>{t('27.5Years')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('residentialDepreciationDescription')}
                    </p>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('propertyValue')}</span>
                      <span>€500,000</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('landValue')}</span>
                      <span>€150,000</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('depreciableBasis')}</span>
                      <span className="font-medium">€350,000</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>{t('annualDepreciation')}</span>
                      <span>€12,727</span>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t('viewFullSchedule')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{t('commercialProperty')}</CardTitle>
                      <Badge>{t('39Years')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('commercialDepreciationDescription')}
                    </p>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('propertyValue')}</span>
                      <span>€800,000</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('landValue')}</span>
                      <span>€250,000</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('depreciableBasis')}</span>
                      <span className="font-medium">€550,000</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>{t('annualDepreciation')}</span>
                      <span>€14,103</span>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {t('viewFullSchedule')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('addNewAssetForDepreciation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="asset-type">{t('assetType')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectAssetType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">{t('residentialProperty')}</SelectItem>
                          <SelectItem value="commercial">{t('commercialProperty')}</SelectItem>
                          <SelectItem value="improvement">{t('landImprovement')}</SelectItem>
                          <SelectItem value="furniture">{t('furnitureFixtures')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('purchaseDate')}</Label>
                      <Input type="date" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('purchasePrice')}</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('landValuePercentage')}</Label>
                      <Input type="number" placeholder="20" />
                    </div>
                  </div>
                  
                  <Button className="mt-4">
                    {t('calculateDepreciation')}
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('taxResourcesAndGuides')}</CardTitle>
              <CardDescription>{t('helpfulResourcesForInvestors')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium">{t('realEstateInvestorTaxGuide')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('comprehensiveTaxGuideDescription')}
                      </p>
                      <Button variant="link" className="px-0 h-auto text-primary">
                        {t('downloadGuide')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ClipboardList className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium">{t('deductionChecklist')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('deductionChecklistDescription')}
                      </p>
                      <Button variant="link" className="px-0 h-auto text-primary">
                        {t('viewChecklist')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Receipt className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium">{t('taxCalendarReminders')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('taxCalendarDescription')}
                      </p>
                      <Button variant="link" className="px-0 h-auto text-primary">
                        {t('setupReminders')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-6 w-6 mt-1 text-primary" />
                    <div>
                      <h3 className="font-medium">{t('taxProfessionalDirectory')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('taxProfessionalDirectoryDescription')}
                      </p>
                      <Button variant="link" className="px-0 h-auto text-primary">
                        {t('findProfessional')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t('upcomingWebinars')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <div>
                        <div className="font-medium">{t('taxStrategiesForInvestors')}</div>
                        <div className="text-sm text-muted-foreground">{t('webinarDate1')}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('register')}
                      </Button>
                    </li>
                    <li className="flex justify-between">
                      <div>
                        <div className="font-medium">{t('1031ExchangeDeepDive')}</div>
                        <div className="text-sm text-muted-foreground">{t('webinarDate2')}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        {t('register')}
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxPlanner;
