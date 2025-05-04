
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Receipt, Calculator, Clock, FileText, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaxPlanner: React.FC = () => {
  const { t } = useLanguage();
  
  const taxStrategies = [
    {
      name: t('depreciation'),
      description: t('depreciationDescription'),
      icon: <Clock className="h-8 w-8 text-primary/60" />
    },
    {
      name: t('costSegregation'),
      description: t('costSegregationDescription'),
      icon: <Building className="h-8 w-8 text-primary/60" />
    },
    {
      name: t('section1031'),
      description: t('section1031Description'),
      icon: <FileText className="h-8 w-8 text-primary/60" />
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="mr-2 h-5 w-5" />
          {t('taxPlanning')}
        </CardTitle>
        <CardDescription>{t('optimizeTaxStrategyRealEstate')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="strategies">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="strategies">
              <FileText className="h-4 w-4 mr-2" />
              {t('taxStrategies')}
            </TabsTrigger>
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              {t('taxCalculator')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {taxStrategies.map((strategy, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {strategy.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {strategy.description}
                        </p>
                        <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                          {t('learnMore')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('taxSavingOpportunities')}</CardTitle>
                <CardDescription>{t('potentialTaxSavingsProperties')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">123 Main St. Property</h3>
                        <p className="text-sm text-muted-foreground">{t('depreciationOpportunity')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">€8,500</div>
                        <div className="text-xs text-muted-foreground">{t('potentialAnnualSavings')}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3">
                      {t('reviewOpportunity')}
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">456 Oak Ave. Property</h3>
                        <p className="text-sm text-muted-foreground">{t('section1031Opportunity')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">€25,000+</div>
                        <div className="text-xs text-muted-foreground">{t('potentialDeferredTax')}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-3">
                      {t('reviewOpportunity')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <div className="flex items-center justify-center h-64 border rounded-lg">
              <div className="text-center">
                <Calculator className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">{t('realEstateTaxCalculator')}</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
                  {t('taxCalculatorDescription')}
                </p>
                <Button>
                  {t('unlockTaxCalculator')}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxPlanner;
