
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ArrowUpRight, BarChart3, Building, Calendar, ChartBar, LineChart, 
  Map, MapPin, Search, TrendingDown, TrendingUp, Info, Calculator,
  Check, CheckCircle, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  BarChart as RechartsBarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const TaxPlanner = () => {
  const { t } = useLanguage();
  const [propertyValue, setPropertyValue] = useState(350000);
  const [rentalIncome, setRentalIncome] = useState(2400);
  const [expenses, setExpenses] = useState(1200);
  const [depreciation, setDepreciation] = useState(1050);
  const [selectedTaxYear, setSelectedTaxYear] = useState('2024');

  // Sample tax deduction data
  const taxDeductions = [
    { category: 'Mortgage Interest', amount: 12000, allowable: true },
    { category: 'Property Tax', amount: 4800, allowable: true },
    { category: 'Depreciation', amount: 12600, allowable: true },
    { category: 'Insurance', amount: 2400, allowable: true },
    { category: 'Repairs & Maintenance', amount: 3600, allowable: true },
    { category: 'Property Management', amount: 3000, allowable: true },
    { category: 'Utilities', amount: 1800, allowable: true },
    { category: 'Home Office', amount: 2000, allowable: false }
  ];

  // Calculate total deductions
  const totalDeductions = taxDeductions
    .filter(deduction => deduction.allowable)
    .reduce((sum, deduction) => sum + deduction.amount, 0);
  
  // Sample monthly data
  const monthlyData = [
    { month: 'Jan', income: 2400, expenses: 1100, profit: 1300 },
    { month: 'Feb', income: 2400, expenses: 1250, profit: 1150 },
    { month: 'Mar', income: 2400, expenses: 1300, profit: 1100 },
    { month: 'Apr', income: 2400, expenses: 1150, profit: 1250 },
    { month: 'May', income: 2400, expenses: 1200, profit: 1200 },
    { month: 'Jun', income: 2400, expenses: 1450, profit: 950 },
    { month: 'Jul', income: 2500, expenses: 1100, profit: 1400 },
    { month: 'Aug', income: 2500, expenses: 1250, profit: 1250 },
    { month: 'Sep', income: 2500, expenses: 1300, profit: 1200 },
    { month: 'Oct', income: 2500, expenses: 1150, profit: 1350 },
    { month: 'Nov', income: 2500, expenses: 1200, profit: 1300 },
    { month: 'Dec', income: 2500, expenses: 1100, profit: 1400 },
  ];
  
  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Pie chart data for tax deduction breakdown
  const pieData = taxDeductions
    .filter(deduction => deduction.allowable)
    .map(deduction => ({
      name: deduction.category,
      value: deduction.amount
    }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6E6E', '#65D572'];

  // Fix the ValueType issue by ensuring the value is treated as a number
  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyValue(Number(e.target.value) || 0);
  };

  // Fix the ValueType issue for expenses
  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenses(Number(e.target.value) || 0);
  };

  // Fix the ValueType issue for depreciation
  const handleDepreciationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepreciation(Number(e.target.value) || 0);
  };

  // Fix the ValueType issue for rental income
  const handleRentalIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRentalIncome(Number(e.target.value) || 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <Calculator className="inline-block mr-2 h-8 w-8" />
          {t('taxPlanner')}
        </h1>
        <p className="text-muted-foreground">{t('optimizeYourInvestmentTax')}</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('taxOverview')}
          </TabsTrigger>
          <TabsTrigger value="deductions">
            <ChartBar className="h-4 w-4 mr-2" />
            {t('taxDeductions')}
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            {t('taxCalculator')}
          </TabsTrigger>
          <TabsTrigger value="planning">
            <Calendar className="h-4 w-4 mr-2" />
            {t('taxPlanning')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('rentalPropertyTaxSummary')}</CardTitle>
                <CardDescription>{t('annualTaxProjection')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalIncome')}</p>
                      <p className="text-2xl font-bold">{formatCurrency(rentalIncome * 12)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('totalExpenses')}</p>
                      <p className="text-2xl font-bold">{formatCurrency(expenses * 12)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('netRentalIncome')}</p>
                      <p className="text-2xl font-bold">{formatCurrency((rentalIncome - expenses) * 12)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('taxableIncome')}</p>
                      <p className="text-2xl font-bold">{formatCurrency((rentalIncome - expenses - depreciation) * 12)}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="mb-2 font-medium">{t('monthlyPerformance')}</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={monthlyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Legend />
                          <Bar dataKey="income" name={t('income')} fill="#8884d8" />
                          <Bar dataKey="expenses" name={t('expenses')} fill="#82ca9d" />
                          <Bar dataKey="profit" name={t('profit')} fill="#ffc658" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('taxDeductionBreakdown')}</CardTitle>
                <CardDescription>{t('annualDeductibleExpenses')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-sm text-muted-foreground">{t('totalDeductions')}</div>
                  <div className="text-2xl font-bold">{formatCurrency(totalDeductions)}</div>
                  <div className="text-xs text-muted-foreground">
                    <Info className="inline h-3 w-3 mr-1" />
                    {t('estimatedTaxSavings')} {formatCurrency(totalDeductions * 0.3)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('taxCalendar')}</CardTitle>
              <CardDescription>{t('upcomingTaxDeadlines')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-red-100 dark:bg-red-900 rounded-full">
                      <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">{t('taxReturnDeadline')}</p>
                      <p className="text-sm text-muted-foreground">April 30, 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200">30 {t('daysLeft')}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                      <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">{t('quarterlyEstimatedTax')}</p>
                      <p className="text-sm text-muted-foreground">June 15, 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">76 {t('daysLeft')}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">{t('propertyTaxPayment')}</p>
                      <p className="text-sm text-muted-foreground">July 31, 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">122 {t('daysLeft')}</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                {t('viewFullTaxCalendar')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="deductions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('allowableDeductions')}</CardTitle>
              <CardDescription>{t('propertyExpensesYouCanDeduct')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('expenseCategory')}</TableHead>
                    <TableHead>{t('annualAmount')}</TableHead>
                    <TableHead>{t('deductible')}</TableHead>
                    <TableHead>{t('notes')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDeductions.map((deduction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{deduction.category}</TableCell>
                      <TableCell>{formatCurrency(deduction.amount)}</TableCell>
                      <TableCell>
                        {deduction.allowable ? (
                          <Badge className="bg-green-100 text-green-800">{t('yes')}</Badge>
                        ) : (
                          <Badge variant="outline">{t('no')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {deduction.allowable ? t('fullyDeductible') : t('notDeductibleForRental')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('specialTaxDeductions')}</CardTitle>
                <CardDescription>{t('lessKnownDeductions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="travel">
                    <AccordionTrigger>
                      {t('travelExpenses')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        {t('travelExpensesDescription')}
                      </p>
                      <div className="p-3 bg-primary/10 rounded-md mt-2 text-sm">
                        <p className="font-medium">{t('exampleScenario')}:</p>
                        <p>{t('travelExpensesExample')}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="home-office">
                    <AccordionTrigger>
                      {t('homeOfficeCosts')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        {t('homeOfficeCostsDescription')}
                      </p>
                      <div className="p-3 bg-primary/10 rounded-md mt-2 text-sm">
                        <p className="font-medium">{t('taxTip')}:</p>
                        <p>{t('homeOfficeTaxTip')}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="education">
                    <AccordionTrigger>
                      {t('educationExpenses')}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        {t('educationExpensesDescription')}
                      </p>
                      <div className="p-3 bg-primary/10 rounded-md mt-2 text-sm">
                        <p className="font-medium">{t('eligibleItems')}:</p>
                        <ul className="list-disc pl-5">
                          <li>{t('realEstateCoursesAndSeminars')}</li>
                          <li>{t('books')}</li>
                          <li>{t('subscriptionsToIndustryPublications')}</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('depreciation')}</CardTitle>
                <CardDescription>{t('propertyDepreciationGuidance')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  {t('depreciationDescription')}
                </p>
                
                <div className="p-3 bg-primary/10 rounded-md">
                  <h4 className="font-semibold">{t('depreciationFormula')}</h4>
                  <p className="text-sm mt-1">{t('depreciationFormulaDescription')}</p>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label>{t('propertyValue')}</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="number" 
                        value={propertyValue}
                        onChange={handlePropertyValueChange}
                        className="max-w-[180px]"
                      />
                      <span className="text-sm text-muted-foreground">EUR</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">{t('annualDepreciation')}</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(propertyValue * 0.03)} <span className="text-sm font-normal text-muted-foreground">({t('at')} 3%)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('documentationChecklist')}</CardTitle>
              <CardDescription>{t('recordsToKeepForTax')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">{t('incomeRecords')}</h3>
                  <div className="space-y-2">
                    {['rentalContracts', 'rentReceived', 'securityDeposits', 'otherIncomeRelated'].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm">{t(item)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">{t('expenseRecords')}</h3>
                  <div className="space-y-2">
                    {['receiptsForRepairs', 'utilityBills', 'mortgageStatements', 'insurancePremiums', 'propertyTaxPayments'].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        <span className="text-sm">{t(item)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                {t('downloadCompleteChecklist')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('rentalPropertyTaxCalculator')}</CardTitle>
              <CardDescription>{t('estimateYourTaxLiabilityOrRefund')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tax-year">{t('taxYear')}</Label>
                  <Select value={selectedTaxYear} onValueChange={setSelectedTaxYear}>
                    <SelectTrigger id="tax-year">
                      <SelectValue placeholder={t('selectTaxYear')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-type">{t('propertyType')}</Label>
                  <Select defaultValue="residential">
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder={t('selectPropertyType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">{t('residential')}</SelectItem>
                      <SelectItem value="commercial">{t('commercial')}</SelectItem>
                      <SelectItem value="vacation">{t('vacation')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-rent">{t('monthlyRentalIncome')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="monthly-rent"
                      type="number" 
                      value={rentalIncome}
                      onChange={handleRentalIncomeChange}
                    />
                    <span className="text-sm text-muted-foreground">EUR</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-expenses">{t('monthlyExpenses')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="monthly-expenses"
                      type="number" 
                      value={expenses}
                      onChange={handleExpensesChange}
                    />
                    <span className="text-sm text-muted-foreground">EUR</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-depreciation">{t('monthlyDepreciation')}</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="monthly-depreciation"
                      type="number" 
                      value={depreciation}
                      onChange={handleDepreciationChange}
                    />
                    <span className="text-sm text-muted-foreground">EUR</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">{t('effectiveTaxRate')}</Label>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="30">
                      <SelectTrigger id="tax-rate">
                        <SelectValue placeholder={t('selectTaxRate')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="35">35%</SelectItem>
                        <SelectItem value="40">40%</SelectItem>
                        <SelectItem value="45">45%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">{t('calculateTax')}</Button>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">{t('taxCalculationResults')}</h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 bg-muted rounded-lg space-y-1">
                    <p className="text-sm text-muted-foreground">{t('annualRentalIncome')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(rentalIncome * 12)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg space-y-1">
                    <p className="text-sm text-muted-foreground">{t('annualExpenses')}</p>
                    <p className="text-2xl font-bold">{formatCurrency((expenses + depreciation) * 12)}</p>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg space-y-1">
                    <p className="text-sm text-muted-foreground">{t('taxableRentalIncome')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(Math.max(0, (rentalIncome - expenses - depreciation) * 12))}</p>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg space-y-1">
                    <p className="text-sm text-muted-foreground">{t('estimatedTaxAmount')}</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(Math.max(0, (rentalIncome - expenses - depreciation) * 12 * 0.3))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('taxStrategies')}</CardTitle>
                <CardDescription>{t('optimizeYourRealEstateTaxes')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">{t('depreciationStrategy')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('depreciationStrategyDescription')}
                    </p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        {t('calculateDepreciation')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">{t('expenseTimingStrategy')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('expenseTimingStrategyDescription')}
                    </p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        {t('planExpenseTiming')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">{t('1031ExchangeStrategy')}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('1031ExchangeStrategyDescription')}
                    </p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline">
                        {t('explore1031Exchange')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('taxPlanningTips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t('keepDetailedRecords')}</p>
                    <p className="text-sm text-muted-foreground">{t('keepDetailedRecordsDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t('separatePersonalAndBusiness')}</p>
                    <p className="text-sm text-muted-foreground">{t('separatePersonalAndBusinessDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t('consultWithTaxProfessional')}</p>
                    <p className="text-sm text-muted-foreground">{t('consultWithTaxProfessionalDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t('stayUpdatedOnTaxLaws')}</p>
                    <p className="text-sm text-muted-foreground">{t('stayUpdatedOnTaxLawsDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('taxSavingsComparison')}</CardTitle>
              <CardDescription>{t('compareStrategiesForMaximumSavings')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('strategy')}</TableHead>
                    <TableHead className="text-right">{t('potentialSavings')}</TableHead>
                    <TableHead className="text-right">{t('implementation')}</TableHead>
                    <TableHead>{t('bestFor')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t('costSegregation')}</TableCell>
                    <TableCell className="text-right">€5,000 - €12,000</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-amber-100 text-amber-800">
                        {t('medium')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t('newPropertyOwners')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('1031Exchange')}</TableCell>
                    <TableCell className="text-right">€25,000+</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-red-100 text-red-800">
                        {t('complex')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t('propertyUpgraders')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('installmentSales')}</TableCell>
                    <TableCell className="text-right">€3,000 - €15,000</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-amber-100 text-amber-800">
                        {t('medium')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t('sellersSeekingIncome')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('realEstateProStatus')}</TableCell>
                    <TableCell className="text-right">€8,000 - €20,000</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-red-100 text-red-800">
                        {t('complex')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t('activeInvestors')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t('opportunityZones')}</TableCell>
                    <TableCell className="text-right">€15,000+</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-green-100 text-green-800">
                        {t('straightforward')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t('longTermHolders')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxPlanner;
