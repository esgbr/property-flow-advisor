
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Property } from '@/interfaces/property';
import { Progress } from '@/components/ui/progress';
import AIAssistant from '../ai/AIAssistant';
import { Button } from '@/components/ui/button';

interface PropertyFinancialTabProps {
  property?: Property;
}

const PropertyFinancialTab: React.FC<PropertyFinancialTabProps> = ({ property }) => {
  const { t } = useLanguage();
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Default values if property is not provided
  const propertyData = property || {
    purchasePrice: 500000,
    currentValue: 550000,
    financials: {
      monthlyIncome: 3000,
      monthlyExpenses: 1200,
      monthlyCashFlow: 1800,
      annualCashFlow: 21600,
      grossRentalYield: 7.2,
      capRate: 5.2
    },
    financing: {
      loanAmount: 400000,
      downPayment: 100000,
      interestRate: 4.5,
      loanTerm: 30,
      monthlyPayment: 2027
    }
  };
  
  // Calculate additional metrics
  const equity = propertyData.currentValue - (propertyData.financing?.loanAmount || 0);
  const appreciationRate = propertyData.purchasePrice > 0 
    ? ((propertyData.currentValue - propertyData.purchasePrice) / propertyData.purchasePrice) * 100 
    : 0;
  const cashOnCash = propertyData.financing?.downPayment 
    ? ((propertyData.financials?.annualCashFlow || 0) / propertyData.financing.downPayment) * 100 
    : 0;
    
  // ROI calculation including appreciation and cash flow
  const totalROI = cashOnCash + (appreciationRate / (propertyData.financing?.downPayment ? propertyData.financing?.loanTerm : 1));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t('financialAnalysis')}</CardTitle>
              <CardDescription>{t('keyFinancialIndicators')}</CardDescription>
            </div>
            <AIAssistant 
              variant="icon"
              contextData={{
                propertyValue: propertyData.currentValue,
                monthlyIncome: propertyData.financials?.monthlyIncome,
                cashOnCash: cashOnCash
              }}
              title={t('financialInsights')}
              description={t('aiGeneratedFinancialAnalysis')}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">
                <LineChart className="h-4 w-4 mr-2" />
                {t('overview')}
              </TabsTrigger>
              <TabsTrigger value="cashflow">
                <Calculator className="h-4 w-4 mr-2" />
                {t('cashFlow')}
              </TabsTrigger>
              <TabsTrigger value="roi">
                <PieChart className="h-4 w-4 mr-2" />
                {t('returns')}
              </TabsTrigger>
              <TabsTrigger value="financing">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t('financing')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">{t('currentValue')}</div>
                    <div className="text-2xl font-bold">€{propertyData.currentValue.toLocaleString()}</div>
                    {appreciationRate !== 0 && (
                      <div className={`text-xs ${appreciationRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {appreciationRate >= 0 ? '+' : ''}{appreciationRate.toFixed(1)}%
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">{t('equity')}</div>
                    <div className="text-2xl font-bold">€{equity.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((equity / propertyData.currentValue) * 100).toFixed(1)}% {t('ofValue')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">{t('monthlyCashFlow')}</div>
                    <div className="text-2xl font-bold">€{propertyData.financials?.monthlyCashFlow?.toLocaleString()}</div>
                    <div className={`text-xs ${(propertyData.financials?.monthlyCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{(propertyData.financials?.annualCashFlow || 0).toLocaleString()} / {t('year')}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">{t('cashOnCash')}</div>
                    <div className="text-2xl font-bold">{cashOnCash.toFixed(2)}%</div>
                    <div className="text-xs text-muted-foreground">
                      {cashOnCash >= 8 ? t('excellent') : cashOnCash >= 6 ? t('good') : cashOnCash >= 4 ? t('average') : t('poor')}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t('performanceMetrics')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t('grossRentalYield')}</span>
                        <span className="font-medium">{(propertyData.financials?.grossRentalYield || 0).toFixed(2)}%</span>
                      </div>
                      <Progress value={propertyData.financials?.grossRentalYield || 0} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t('capRate')}</span>
                        <span className="font-medium">{(propertyData.financials?.capRate || 0).toFixed(2)}%</span>
                      </div>
                      <Progress value={(propertyData.financials?.capRate || 0) * 10} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t('cashOnCash')}</span>
                        <span className="font-medium">{cashOnCash.toFixed(2)}%</span>
                      </div>
                      <Progress value={cashOnCash * 8} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{t('totalROI')}</span>
                        <span className="font-medium">{totalROI.toFixed(2)}%</span>
                      </div>
                      <Progress value={totalROI * 5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t('monthlyFinancials')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('rentalIncome')}</span>
                        <span className="font-medium">€{(propertyData.financials?.monthlyIncome || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-sm">{t('mortgage')}</span>
                        <span>- €{(propertyData.financing?.monthlyPayment || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="text-sm">{t('operatingExpenses')}</span>
                        <span>- €{((propertyData.financials?.monthlyExpenses || 0) - (propertyData.financing?.monthlyPayment || 0)).toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between items-center">
                        <span className="text-sm font-medium">{t('cashFlow')}</span>
                        <span className={`font-medium ${(propertyData.financials?.monthlyCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          €{(propertyData.financials?.monthlyCashFlow || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="cashflow" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('cashFlowAnalysis')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">{t('incomeBreakdown')}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('baseRent')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyIncome || 0) * 0.95).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('otherIncome')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyIncome || 0) * 0.05).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium">{t('totalIncome')}</span>
                          <span className="font-medium">€{(propertyData.financials?.monthlyIncome || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">{t('expenseBreakdown')}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('mortgage')}</span>
                          <span className="font-medium">€{(propertyData.financing?.monthlyPayment || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('propertyTaxes')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyExpenses || 0) * 0.3).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('insurance')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyExpenses || 0) * 0.15).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('maintenance')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyExpenses || 0) * 0.2).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('vacancy')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyExpenses || 0) * 0.1).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('management')}</span>
                          <span className="font-medium">€{((propertyData.financials?.monthlyExpenses || 0) * 0.25).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium">{t('totalExpenses')}</span>
                          <span className="font-medium">€{(propertyData.financials?.monthlyExpenses || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{t('monthlyCashFlow')}</h3>
                        <p className="text-sm text-muted-foreground">{t('incomeMinusExpenses')}</p>
                      </div>
                      <div className={`text-2xl font-bold ${(propertyData.financials?.monthlyCashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        €{(propertyData.financials?.monthlyCashFlow || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="roi" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('returnOnInvestment')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">{t('cashOnCash')}</div>
                        <div className="text-2xl font-bold">{cashOnCash.toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('annualCashFlowDividedByDownPayment')}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">{t('appreciationROI')}</div>
                        <div className="text-2xl font-bold">{(appreciationRate / (propertyData.currentValue > 0 ? 1 : 1)).toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('annualizedGrowthRate')}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">{t('totalROI')}</div>
                        <div className="text-2xl font-bold">{totalROI.toFixed(2)}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('combinedReturnMetric')}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-1 mt-4">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('purchasePrice')}</span>
                      <span className="font-medium">€{propertyData.purchasePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('downPayment')}</span>
                      <span className="font-medium">€{(propertyData.financing?.downPayment || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('currentValue')}</span>
                      <span className="font-medium">€{propertyData.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('equity')}</span>
                      <span className="font-medium">€{equity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('annualCashFlow')}</span>
                      <span className="font-medium">€{(propertyData.financials?.annualCashFlow || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-sm font-medium">{t('breakEvenPoint')}</span>
                      <span className="font-medium">
                        {(propertyData.financials?.annualCashFlow || 0) > 0 
                          ? `${((propertyData.financing?.downPayment || 0) / (propertyData.financials?.annualCashFlow || 1)).toFixed(1)} ${t('years')}`
                          : t('negative')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financing" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('financingDetails')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-medium mb-4">{t('loanDetails')}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('loanAmount')}</span>
                          <span className="font-medium">€{(propertyData.financing?.loanAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('interestRate')}</span>
                          <span className="font-medium">{propertyData.financing?.interestRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('loanTerm')}</span>
                          <span className="font-medium">{propertyData.financing?.loanTerm || 0} {t('years')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('monthlyPayment')}</span>
                          <span className="font-medium">€{(propertyData.financing?.monthlyPayment || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">{t('equityAnalysis')}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t('purchasePrice')}</span>
                          <span className="font-medium">€{propertyData.purchasePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('downPayment')}</span>
                          <span className="font-medium">€{(propertyData.financing?.downPayment || 0).toLocaleString()} ({(((propertyData.financing?.downPayment || 0) / propertyData.purchasePrice) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('currentValue')}</span>
                          <span className="font-medium">€{propertyData.currentValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{t('currentEquity')}</span>
                          <span className="font-medium">€{equity.toLocaleString()} ({((equity / propertyData.currentValue) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Button onClick={() => setShowRecommendations(!showRecommendations)}>
                      {showRecommendations ? t('hideRecommendations') : t('showRefinancingRecommendations')}
                    </Button>
                    
                    {showRecommendations && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">{t('refinancingOptions')}</h3>
                        <ul className="space-y-2">
                          <li className="text-sm flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {t('refinancingRecommendation1')}
                          </li>
                          <li className="text-sm flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {t('refinancingRecommendation2')}
                          </li>
                          <li className="text-sm flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {t('refinancingRecommendation3')}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            {t('runScenarioAnalysis')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PropertyFinancialTab;
