
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, BuildingIcon, TrendingUp, ChevronRight, Search } from 'lucide-react';
import InvestmentCalculator from '@/components/calculators/InvestmentCalculator';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Calculators = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <Calculator className="inline-block mr-2 h-8 w-8" />
          {t('investmentCalculators')}
        </h1>
        <p className="text-muted-foreground">{t('analyticalToolsForInvestors')}</p>
      </div>

      <Tabs defaultValue="investment" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="investment">
            <BuildingIcon className="h-4 w-4 mr-2" />
            {t('investment')}
          </TabsTrigger>
          <TabsTrigger value="mortgage">
            <Calculator className="h-4 w-4 mr-2" />
            {t('mortgage')}
          </TabsTrigger>
          <TabsTrigger value="tax">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('taxPlanning')}
          </TabsTrigger>
          <TabsTrigger value="market">
            <Search className="h-4 w-4 mr-2" />
            {t('marketResearch')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="investment" className="space-y-6">
          <InvestmentCalculator />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('advancedAnalysisTools')}</CardTitle>
                <CardDescription>{t('unlockPremiumAnalysisTools')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 text-primary">✓</div>
                    <span>{t('sensitivityAnalysis')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 text-primary">✓</div>
                    <span>{t('comparativePropertyAnalysis')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 h-5 w-5 text-primary">✓</div>
                    <span>{t('advancedTaxStrategies')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/premium">
                    {t('upgradeToPremium')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('savePreviousCalculations')}</CardTitle>
                <CardDescription>{t('trackYourScenarios')}</CardDescription>
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
                <CardTitle>{t('needHelp')}</CardTitle>
                <CardDescription>{t('consultWithExperts')}</CardDescription>
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
          </div>
        </TabsContent>
        
        <TabsContent value="mortgage">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t('comingSoon')}</CardTitle>
              <CardDescription>{t('mortgageCalculatorDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('mortgageCalculatorComingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tax">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t('comingSoon')}</CardTitle>
              <CardDescription>{t('taxPlanningToolsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('taxPlanningToolsComingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="market">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t('comingSoon')}</CardTitle>
              <CardDescription>{t('marketResearchToolsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t('marketResearchToolsComingSoon')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;
