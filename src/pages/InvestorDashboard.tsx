
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, 
  Calculator, 
  ClipboardCheck, 
  FileText, 
  Receipt, 
  Search, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import EnhancedPortfolioDashboard from '@/components/portfolio/EnhancedPortfolioDashboard';
import MortgageCalculator from '@/components/financing/MortgageCalculator';
import TaxPlanner from '@/components/tax/TaxPlanner';
import MarketAnalysisTools from '@/components/market/MarketAnalysisTools';
import DueDiligenceChecklist from '@/components/due-diligence/DueDiligenceChecklist';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const InvestorDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  
  // Parse the query parameters to determine active tab
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'portfolio';

  // Handle tab changes - update URL for bookmarking and sharing
  const handleTabChange = (value: string) => {
    navigate(`/investor-dashboard?tab=${value}`, { replace: true });
  };

  // Track page view and show welcome message if first visit
  useEffect(() => {
    console.log('Investor Dashboard viewed:', defaultTab);
    
    // Welcome user if first visit to this dashboard
    if (preferences.name && !preferences.visitedInvestorDashboard) {
      toast.success(`${t('welcome')} ${t('toThe')} ${t('investorDashboard')}, ${preferences.name}!`, {
        description: t('accessComprehensiveInvestmentTools')
      });
      
      // Mark as visited
      updatePreferences({ visitedInvestorDashboard: true });
    } else if (preferences.name && !showWelcomeBack) {
      // Show welcome back message for returning users
      setShowWelcomeBack(true);
    }
  }, [defaultTab, preferences.name, preferences.visitedInvestorDashboard]);

  // Currency formatter based on user language
  const getCurrencySymbol = () => {
    switch (language) {
      case 'de':
      case 'fr':
      case 'it':
      case 'es':
        return '€';
      default:
        return '$';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {showWelcomeBack && (
        <Alert className="bg-primary/10 border-primary/20">
          <TrendingUp className="h-4 w-4" />
          <AlertTitle>{t('welcomeBack')}, {preferences.name}!</AlertTitle>
          <AlertDescription>
            {t('continueMakingSmartInvestments')}
          </AlertDescription>
        </Alert>
      )}

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
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1 mb-2' : 'md:w-auto md:inline-grid grid-cols-5'}`}>
          <TabsTrigger value="portfolio" className={isMobile ? "text-xs px-1" : ""}>
            <Building className="h-4 w-4 mr-2" />
            {!isMobile && t('portfolio')}
            {isMobile && <span className="sr-only">{t('portfolio')}</span>}
          </TabsTrigger>
          <TabsTrigger value="market" className={isMobile ? "text-xs px-1" : ""}>
            <Search className="h-4 w-4 mr-2" />
            {!isMobile && t('marketAnalysis')}
            {isMobile && <span className="sr-only">{t('marketAnalysis')}</span>}
          </TabsTrigger>
          <TabsTrigger value="financing" className={isMobile ? "text-xs px-1" : ""}>
            <Calculator className="h-4 w-4 mr-2" />
            {!isMobile && t('financing')}
            {isMobile && <span className="sr-only">{t('financing')}</span>}
          </TabsTrigger>
          <TabsTrigger value="tax" className={isMobile ? "text-xs px-1" : ""}>
            <Receipt className="h-4 w-4 mr-2" />
            {!isMobile && t('taxPlanning')}
            {isMobile && <span className="sr-only">{t('taxPlanning')}</span>}
          </TabsTrigger>
          <TabsTrigger value="duediligence" className={isMobile ? "text-xs px-1" : ""}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {!isMobile && t('dueDiligence')}
            {isMobile && <span className="sr-only">{t('dueDiligence')}</span>}
          </TabsTrigger>
        </TabsList>

        {isMobile && (
          <div className="flex overflow-x-auto pb-2 mb-4">
            {defaultTab === 'portfolio' && <div className="text-sm font-medium">{t('portfolio')}</div>}
            {defaultTab === 'market' && <div className="text-sm font-medium">{t('marketAnalysis')}</div>}
            {defaultTab === 'financing' && <div className="text-sm font-medium">{t('financing')}</div>}
            {defaultTab === 'tax' && <div className="text-sm font-medium">{t('taxPlanning')}</div>}
            {defaultTab === 'duediligence' && <div className="text-sm font-medium">{t('dueDiligence')}</div>}
          </div>
        )}

        <TabsContent value="portfolio" className="mt-6">
          <EnhancedPortfolioDashboard />
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
