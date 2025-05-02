
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
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const InvestorDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse the query parameters to determine active tab
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'portfolio';

  // Handle tab changes - update URL for bookmarking and sharing
  const handleTabChange = (value: string) => {
    navigate(`/investor-dashboard?tab=${value}`, { replace: true });
  };

  // Track page view
  useEffect(() => {
    console.log('Investor Dashboard viewed:', defaultTab);
    // Welcome user if first visit to this dashboard
    if (preferences.name && !preferences.visitedInvestorDashboard) {
      toast.success(`Welcome to the Investor Dashboard, ${preferences.name}!`, {
        description: "Access comprehensive investment tools and analysis."
      });
    }
  }, [defaultTab, preferences.name, preferences.visitedInvestorDashboard]);

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

      <Tabs defaultValue={defaultTab} value={defaultTab} onValueChange={handleTabChange} className="w-full">
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
