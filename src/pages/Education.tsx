
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  BookOpen, 
  BookText, 
  FileText, 
  GraduationCap, 
  BarChart, 
  Calculator, 
  Building, 
  Scale, 
  Home,
  TrendingUp, 
  DollarSign, 
  PieChart,
  User,
  BuildingIcon,
  HandCoins
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();
  
  // Education categories with icons for better visual organization
  const educationCategories = [
    {
      id: "basics",
      title: t('realEstateBasics'),
      icon: <Book className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BuildingIcon className="h-5 w-5 mr-2 text-primary" />
                {t('understandingPropertyTypes')}
              </CardTitle>
              <CardDescription>{t('propertyTypes')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('residentialProperties')}:</strong> {t('singleFamilyHomeDescription')}</li>
                <li><strong>{t('commercialProperties')}:</strong> {t('commercialPropertiesDescription')}</li>
                <li><strong>{t('mixedUseProperties')}:</strong> {t('mixedUsePropertiesDescription')}</li>
                <li><strong>{t('industrialProperties')}:</strong> {t('industrialPropertiesDescription')}</li>
                <li><strong>{t('land')}:</strong> {t('landDescription')}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                {t('keyTerminology')}
              </CardTitle>
              <CardDescription>{t('essentialTerms')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{t('financingTerms')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>{t('mortgage')}:</strong> {t('mortgageDefinition')}</li>
                    <li><strong>LTV ({t('loanToValue')}):</strong> {t('ltvDefinition')}</li>
                    <li><strong>{t('amortization')}:</strong> {t('amortizationDefinition')}</li>
                    <li><strong>{t('downPayment')}:</strong> {t('downPaymentDefinition')}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">{t('investmentTerms')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>{t('capRate')}:</strong> {t('capRateDefinition')}</li>
                    <li><strong>{t('cashOnCashReturn')}:</strong> {t('cashOnCashReturnDefinition')}</li>
                    <li><strong>{t('roi')}:</strong> {t('roiDefinition')}</li>
                    <li><strong>{t('appreciation')}:</strong> {t('appreciationDefinition')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                {t('beginnerInvestmentAnalysis')}
              </CardTitle>
              <CardDescription>{t('basicAnalysisMetrics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('cashFlowCalculation')}</h4>
                  <p className="text-sm mt-1">{t('cashFlowCalculationDescription')}</p>
                  <div className="bg-muted p-2 rounded mt-2">
                    <code className="text-sm">{t('cashFlowFormula')}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('capRateCalculation')}</h4>
                  <p className="text-sm mt-1">{t('capRateCalculationDescription')}</p>
                  <div className="bg-muted p-2 rounded mt-2">
                    <code className="text-sm">{t('capRateFormula')}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('onePercentRule')}</h4>
                  <p className="text-sm mt-1">{t('onePercentRuleDescription')}</p>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/calculators">
                    {t('tryOurCalculators')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "strategies",
      title: t('investmentStrategies'),
      icon: <BarChart className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                {t('buyAndHoldStrategy')}
              </CardTitle>
              <CardDescription>{t('longTermWealthBuilding')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('buyAndHoldStrategyDescription')}</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>{t('rentalIncome')}:</strong> {t('rentalIncomeDescription')}</li>
                <li><strong>{t('propertyAppreciation')}:</strong> {t('propertyAppreciationDescription')}</li>
                <li><strong>{t('buildingEquity')}:</strong> {t('buildingEquityDescription')}</li>
                <li><strong>{t('taxBenefits')}:</strong> {t('taxBenefitsDescription')}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {t('fixAndFlipStrategy')}
              </CardTitle>
              <CardDescription>{t('shortTermStrategy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('fixAndFlipStrategyDescription')}</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>{t('purchaseUndervaluedProperty')}</li>
                <li>{t('renovateToIncreaseValue')}</li>
                <li>{t('sellQuicklyForProfit')}</li>
                <li>{t('reinvestProfitsNewProjects')}</li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">{t('fixAndFlipStrategyNote')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HandCoins className="h-5 w-5 mr-2 text-primary" />
                {t('brrrStrategy')}
              </CardTitle>
              <CardDescription>{t('buyRenovateRentRefinanceRepeat')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('brrrStrategyDescription')}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('brrrSteps')}</h4>
                  <ol className="list-decimal pl-6 space-y-2 mt-2">
                    <li><strong>Buy:</strong> {t('brrrBuyDescription')}</li>
                    <li><strong>Renovate:</strong> {t('brrrRenovateDescription')}</li>
                    <li><strong>Rent:</strong> {t('brrrRentDescription')}</li>
                    <li><strong>Refinance:</strong> {t('brrrRefinanceDescription')}</li>
                    <li><strong>Repeat:</strong> {t('brrrRepeatDescription')}</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium">{t('brrrAdvantages')}</h4>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>{t('brrrAdvantage1')}</li>
                    <li>{t('brrrAdvantage2')}</li>
                    <li>{t('brrrAdvantage3')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "analysis",
      title: t('financialAnalysis'),
      icon: <Calculator className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                {t('cashFlowAnalysis')}
              </CardTitle>
              <CardDescription>{t('understandingCashFlow')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t('cashFlowAnalysisDescription')}</p>
              
              <div>
                <h4 className="font-medium mb-2">{t('income')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('rentalIncome')}</li>
                  <li>{t('laundryIncome')}</li>
                  <li>{t('parkingIncome')}</li>
                  <li>{t('storageIncome')}</li>
                  <li>{t('otherIncome')}</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('expenses')}</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>{t('mortgage')}</li>
                  <li>{t('propertyTax')}</li>
                  <li>{t('insurance')}</li>
                  <li>{t('maintenance')}</li>
                  <li>{t('propertyManagement')}</li>
                  <li>{t('utilities')}</li>
                  <li>{t('vacancy')}</li>
                  <li>{t('capitalExpenditures')}</li>
                </ul>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-1">{t('formulaForNetCashFlow')}</h4>
                <code className="text-sm">{t('netCashFlowFormula')}</code>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                {t('returnMetrics')}
              </CardTitle>
              <CardDescription>{t('measuringInvestmentPerformance')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('capRate')}</h4>
                  <p className="text-sm mt-1">{t('capRateDetailedDescription')}</p>
                  <div className="bg-muted p-2 rounded mt-2">
                    <code className="text-sm">{t('capRateFormula')}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('cashOnCashReturn')}</h4>
                  <p className="text-sm mt-1">{t('cashOnCashReturnDetailedDescription')}</p>
                  <div className="bg-muted p-2 rounded mt-2">
                    <code className="text-sm">{t('cashOnCashReturnFormula')}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">{t('totalRoi')}</h4>
                  <p className="text-sm mt-1">{t('totalRoiDetailedDescription')}</p>
                  <div className="bg-muted p-2 rounded mt-2">
                    <code className="text-sm">{t('totalRoiFormula')}</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "resources",
      title: t('learningResources'),
      icon: <GraduationCap className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookText className="h-5 w-5 mr-2 text-primary" />
                {t('recommendedReading')}
              </CardTitle>
              <CardDescription>{t('bookRecommendations')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>{t('intelligentInvestorRealEstate')}</strong>
                    <p className="text-sm text-muted-foreground">{t('intelligentInvestorDescription')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>{t('realEstateFinancialAnalysis')}</strong>
                    <p className="text-sm text-muted-foreground">{t('financialAnalysisBookDescription')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>{t('completeGuidePropertyManagement')}</strong>
                    <p className="text-sm text-muted-foreground">{t('propertyManagementBookDescription')}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>{t('taxStrategiesRealEstateInvestors')}</strong>
                    <p className="text-sm text-muted-foreground">{t('taxStrategiesBookDescription')}</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                {t('onlineCourses')}
              </CardTitle>
              <CardDescription>{t('expandYourKnowledge')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{t('realEstateInvestmentMasterclass')}</h4>
                  <p className="text-sm text-muted-foreground">{t('masterclassDescription')}</p>
                  <Button size="sm" variant="outline" className="mt-2">{t('learnMore')}</Button>
                </div>
                <div>
                  <h4 className="font-medium">{t('propertyAnalysisWorkshop')}</h4>
                  <p className="text-sm text-muted-foreground">{t('analysisWorkshopDescription')}</p>
                  <Button size="sm" variant="outline" className="mt-2">{t('learnMore')}</Button>
                </div>
                <div>
                  <h4 className="font-medium">{t('realEstateMarketResearch')}</h4>
                  <p className="text-sm text-muted-foreground">{t('marketResearchCourseDescription')}</p>
                  <Button size="sm" variant="outline" className="mt-2">{t('learnMore')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t('educationHeader')}</h1>
        <p className="text-muted-foreground">{t('educationDescription')}</p>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="mb-4">
          {educationCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center">
              {category.icon}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {educationCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-2">
            {category.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Add missing Link import
import { Link } from 'react-router-dom';

export default Education;
