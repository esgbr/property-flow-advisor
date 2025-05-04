
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calculator,
  Building,
  TrendingUp,
  Home,
  LineChart,
  BarChart,
  PercentIcon,
  Coins,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import InvestmentCalculator from '@/components/calculators/InvestmentCalculator';
import RentalYieldCalculator from '@/components/calculators/RentalYieldCalculator';
import CashOnCashCalculator from '@/components/calculators/CashOnCashCalculator';
import AdvancedROICalculator from '@/components/calculators/AdvancedROICalculator';
import PropertyExchangeCalculator from '@/components/calculators/PropertyExchangeCalculator';

const Calculators: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Calculator className="mr-2 h-6 w-6" />
          {t('financialTools')}
        </h1>
        <p className="text-muted-foreground">{t('analyzeInvestmentOpportunities')}</p>
      </div>

      <Tabs defaultValue="investment" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="investment" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            {t('investmentAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="cash-on-cash" className="flex items-center">
            <Coins className="h-4 w-4 mr-2" />
            {t('cashOnCashReturn')}
          </TabsTrigger>
          <TabsTrigger value="rental-yield" className="flex items-center">
            <PercentIcon className="h-4 w-4 mr-2" />
            {t('rentalYield')}
          </TabsTrigger>
          <TabsTrigger value="advanced-roi" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            {t('advancedROI')}
          </TabsTrigger>
          <TabsTrigger value="property-exchange" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('propertyExchange')}
          </TabsTrigger>
          <TabsTrigger value="mortgage" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            {t('mortgage')}
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            {t('taxBenefits')}
          </TabsTrigger>
          <TabsTrigger value="appreciation" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            {t('appreciationForecast')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="investment">
          <InvestmentCalculator />
        </TabsContent>

        <TabsContent value="cash-on-cash">
          <CashOnCashCalculator />
        </TabsContent>
        
        <TabsContent value="rental-yield">
          <RentalYieldCalculator />
        </TabsContent>

        <TabsContent value="advanced-roi">
          <AdvancedROICalculator />
        </TabsContent>
        
        <TabsContent value="property-exchange">
          <PropertyExchangeCalculator />
        </TabsContent>
        
        <TabsContent value="mortgage">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center">
              <Home className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t('mortgageCalculator')}</h3>
              <p className="text-sm text-muted-foreground">{t('comingSoon')}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tax">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center">
              <BarChart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t('taxBenefitsCalculator')}</h3>
              <p className="text-sm text-muted-foreground">{t('comingSoon')}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appreciation">
          <div className="flex items-center justify-center h-64 border rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">{t('appreciationForecastTool')}</h3>
              <p className="text-sm text-muted-foreground">{t('comingSoon')}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculators;
