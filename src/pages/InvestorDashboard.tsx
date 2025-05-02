
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, ClipboardCheck, FileText, Receipt, Search } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import PortfolioDashboard from '@/components/portfolio/PortfolioDashboard';
import MortgageCalculator from '@/components/financing/MortgageCalculator';
import TaxPlanner from '@/components/tax/TaxPlanner';
import MarketAnalysisTools from '@/components/market/MarketAnalysisTools';
import DueDiligenceChecklist from '@/components/due-diligence/DueDiligenceChecklist';
import { useLocation } from 'react-router-dom';

const InvestorDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const location = useLocation();
  
  // Parse the query parameters to determine active tab
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'portfolio';

  // Track page view
  useEffect(() => {
    // You could add analytics tracking here
    console.log('Investor Dashboard viewed:', defaultTab);
  }, [defaultTab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          {t('investorDashboard')}
          {preferences.name && (
            <span className="ml-2">
              {t('welcome')}, {preferences.name}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground">{t('completeInvestmentToolsuite')}</p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="portfolio">
            <Building className="h-4 w-4 mr-2" />
            {t('portfolio')}
          </TabsTrigger>
          <TabsTrigger value="market">
            <Search className="h-4 w-4 mr-2" />
            {t('marketAnalysis')}
          </TabsTrigger>
          <TabsTrigger value="financing">
            <Calculator className="h-4 w-4 mr-2" />
            {t('financing')}
          </TabsTrigger>
          <TabsTrigger value="tax">
            <Receipt className="h-4 w-4 mr-2" />
            {t('taxPlanning')}
          </TabsTrigger>
          <TabsTrigger value="duediligence">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {t('dueDiligence')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6">
          <PortfolioDashboard />
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <MarketAnalysisTools />
        </TabsContent>

        <TabsContent value="financing" className="mt-6">
          <MortgageCalculator />
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxPlanner />
        </TabsContent>

        <TabsContent value="duediligence" className="mt-6">
          <DueDiligenceChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestorDashboard;
