
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Building, Calculator as CalculatorIcon, TrendingUp, Scale, BadgePercent, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import InvestmentCalculator from '@/components/calculators/InvestmentCalculator';

const Calculators = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <Calculator className="inline-block mr-2 h-8 w-8" /> 
          {t('investmentCalculators')}
        </h1>
        <p className="text-muted-foreground">{t('analyticalToolsForInvestors')}</p>
      </div>

      <Tabs defaultValue="investment" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="investment">
            <CalculatorIcon className="h-4 w-4 mr-2" />
            {t('investment')}
          </TabsTrigger>
          <TabsTrigger value="mortgage">
            <Building className="h-4 w-4 mr-2" />
            {t('mortgage')}
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Scale className="h-4 w-4 mr-2" />
            {t('taxPlanning')}
          </TabsTrigger>
          <TabsTrigger value="research">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('marketResearch')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investment" className="mt-6">
          <InvestmentCalculator />
        </TabsContent>

        <TabsContent value="mortgage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                {t('mortgageCalculator')}
              </CardTitle>
              <CardDescription>
                {t('mortgageCalculatorDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <BadgePercent className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">{t('comingSoon')}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t('mortgageCalculatorComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                {t('taxPlanningTools')}
              </CardTitle>
              <CardDescription>
                {t('taxPlanningToolsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <BadgePercent className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">{t('comingSoon')}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t('taxPlanningToolsComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                {t('marketResearchTools')}
              </CardTitle>
              <CardDescription>
                {t('marketResearchToolsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <BadgePercent className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">{t('comingSoon')}</h3>
                <p className="text-muted-foreground max-w-md">
                  {t('marketResearchToolsComingSoon')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              {t('saveYourCalculations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('saveCalculationsDescription')}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('createAccount')}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              {t('needHelp')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('expertConsultationDescription')}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('bookConsultation')}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              {t('advancedAnalysisTools')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('unlockPremiumAnalysisTools')}
            </p>
            <ul className="mt-2 space-y-1">
              <li className="text-xs flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                {t('sensitivityAnalysis')}
              </li>
              <li className="text-xs flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                {t('comparativePropertyAnalysis')}
              </li>
              <li className="text-xs flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                {t('advancedTaxStrategies')}
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('upgradeToPremium')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Calculators;
