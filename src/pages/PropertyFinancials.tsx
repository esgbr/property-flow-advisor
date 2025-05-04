
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, TrendingUp, BarChart } from 'lucide-react';

const PropertyFinancials = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  // Dummy property data - in a real app, this would be fetched based on the ID
  const property = {
    id: Number(id),
    name: 'City Center Apartment',
    address: '123 Main St, Downtown',
    purchasePrice: 375000,
    currentValue: 410000,
    monthlyRent: 2200,
    monthlyExpenses: 950,
    annualAppreciation: 4.2,
    capRate: 6.8,
    cashOnCashReturn: 8.5,
    mortgageDetails: {
      loanAmount: 300000,
      interestRate: 4.5,
      monthlyPayment: 1520,
      term: 30
    },
    expenses: {
      propertyTax: 3600,
      insurance: 1200,
      maintenance: 2400,
      management: 2640,
      utilities: 0,
      vacancy: 1320
    }
  };

  const monthlyCashFlow = property.monthlyRent - property.monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  // Cash flow data for the chart
  const cashFlowData = [
    { month: 'Jan', income: property.monthlyRent, expenses: property.monthlyExpenses },
    { month: 'Feb', income: property.monthlyRent, expenses: property.monthlyExpenses },
    { month: 'Mar', income: property.monthlyRent, expenses: property.monthlyExpenses },
    { month: 'Apr', income: property.monthlyRent, expenses: property.monthlyExpenses },
    { month: 'May', income: property.monthlyRent, expenses: property.monthlyExpenses },
    { month: 'Jun', income: property.monthlyRent, expenses: property.monthlyExpenses }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <Calculator className="inline-block mr-2 h-8 w-8" />
          {t('financialAnalysis')}
        </h1>
        <p className="text-muted-foreground">{property.name} - {property.address}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('cashFlow')}</CardTitle>
            <CardDescription>{t('monthlyNetIncome')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{monthlyCashFlow}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('monthly')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('capRate')}</CardTitle>
            <CardDescription>{t('returnOnPropertyValue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{property.capRate}%</div>
            <p className="text-sm text-muted-foreground mt-1">{t('annual')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('cashOnCashReturn')}</CardTitle>
            <CardDescription>{t('returnOnInvestedCapital')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{property.cashOnCashReturn}%</div>
            <p className="text-sm text-muted-foreground mt-1">{t('annual')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <Calculator className="h-4 w-4 mr-2" />
            {t('overview')}
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <BarChart className="h-4 w-4 mr-2" />
            {t('expenses')}
          </TabsTrigger>
          <TabsTrigger value="projection">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('projection')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('financialSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{t('property')}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('purchasePrice')}</span>
                      <span>€{property.purchasePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('currentValue')}</span>
                      <span>€{property.currentValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('appreciationRate')}</span>
                      <span>{property.annualAppreciation}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t('mortgage')}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('loanAmount')}</span>
                      <span>€{property.mortgageDetails.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('interestRate')}</span>
                      <span>{property.mortgageDetails.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('monthlyPayment')}</span>
                      <span>€{property.mortgageDetails.monthlyPayment}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h3 className="font-medium mb-2">{t('cashflow')}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('monthlyRent')}</span>
                    <span>€{property.monthlyRent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('monthlyExpenses')}</span>
                    <span>€{property.monthlyExpenses}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>{t('monthlyCashFlow')}</span>
                    <span className="text-green-600">€{monthlyCashFlow}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>{t('annualCashFlow')}</span>
                    <span className="text-green-600">€{annualCashFlow}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('expenseBreakdown')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>{t('propertyTax')}</span>
                  <span>€{property.expenses.propertyTax} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('insurance')}</span>
                  <span>€{property.expenses.insurance} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('maintenance')}</span>
                  <span>€{property.expenses.maintenance} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('managementFee')}</span>
                  <span>€{property.expenses.management} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('vacancyAllowance')}</span>
                  <span>€{property.expenses.vacancy} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-medium">
                  <span>{t('totalExpenses')}</span>
                  <span>€{Object.values(property.expenses).reduce((a, b) => a + b, 0)} / {t('year')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-medium">
                  <span>{t('monthlyExpenses')}</span>
                  <span>€{property.monthlyExpenses} / {t('month')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projection" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('fiveYearProjection')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-medium">{t('year')}</th>
                      <th className="text-right font-medium">{t('propertyValue')}</th>
                      <th className="text-right font-medium">{t('annualCashFlow')}</th>
                      <th className="text-right font-medium">{t('roi')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((year) => {
                      const projectedValue = property.currentValue * Math.pow(1 + property.annualAppreciation / 100, year);
                      const projectedCashFlow = annualCashFlow * Math.pow(1 + 0.02, year - 1); // Assuming 2% annual rent increase
                      const projectedROI = (projectedCashFlow / (property.purchasePrice - property.mortgageDetails.loanAmount)) * 100;
                      
                      return (
                        <tr key={year} className="border-b last:border-0">
                          <td className="py-2">{year}</td>
                          <td className="py-2 text-right">€{Math.round(projectedValue).toLocaleString()}</td>
                          <td className="py-2 text-right">€{Math.round(projectedCashFlow).toLocaleString()}</td>
                          <td className="py-2 text-right">{projectedROI.toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyFinancials;
