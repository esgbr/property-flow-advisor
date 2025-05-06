
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
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import UnifiedPortfolioDashboard from '@/components/portfolio/UnifiedPortfolioDashboard';
import MortgageCalculator from '@/components/financing/MortgageCalculator';
import TaxPlanner from '@/components/tax/TaxPlanner';
import MarketAnalysisTools from '@/components/market/MarketAnalysisTools';
import DueDiligenceChecklist from '@/components/due-diligence/DueDiligenceChecklist';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '@/hooks/use-workflow';
import { useMarketFilter } from '@/hooks/use-market-filter';
import WorkflowProgressCard from '@/components/workflow/WorkflowProgressCard';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';

const InvestorDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const marketFilter = useMarketFilter();
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const analyseWorkflow = useWorkflow('analyse');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  
  // Parse the query parameters to determine active tab
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('tab') || 'portfolio';

  // Handle tab changes - update URL for bookmarking and sharing
  const handleTabChange = (value: string) => {
    navigate(`/investor-dashboard?tab=${value}`, { replace: true });
    
    // Mark progression in different workflows based on tab
    if (value === 'portfolio') {
      analyseWorkflow.markStepComplete('portfolio');
    } else if (value === 'financing') {
      finanzierungWorkflow.markStepComplete('calculator');
    }
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
  }, [defaultTab, preferences.name, preferences.visitedInvestorDashboard, updatePreferences, t]);

  // Currency formatter based on user language
  const getCurrencySymbol = () => {
    // Using type-safe language comparison by checking language directly
    if (language === 'de') return '€';
    
    // For all other cases (including 'en'), return '$'
    return '$';
  };
  
  // Handle navigation to related tools
  const navigateToRelatedTool = (path: string) => {
    navigate(path);
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

      {/* Active Workflow Progress Card */}
      {defaultTab === 'portfolio' && (
        <WorkflowProgressCard
          workflowType="analyse"
          currentStep="portfolio"
          className="mb-4"
          showProgress={true}
        />
      )}
      
      {defaultTab === 'financing' && (
        <WorkflowProgressCard
          workflowType="finanzierung"
          currentStep="calculator"
          className="mb-4"
          showProgress={true}
        />
      )}
      
      {defaultTab === 'tax' && (
        <WorkflowProgressCard
          workflowType="steuer"
          currentStep="planning"
          className="mb-4"
          showProgress={true}
        />
      )}

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
          <UnifiedPortfolioDashboard />
          
          {/* Workflow Suggestions for better transitions between tools */}
          <WorkflowSuggestions
            currentTool="portfolio"
            workflowType="analyse"
            maxSuggestions={2}
            className="mt-6 mb-4"
          />
          
          {/* Intelligente Workflow-Empfehlung */}
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Nächster Schritt: Marktanalyse' : 'Next Step: Market Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Analysieren Sie den Markt, um Ihre Portfolio-Strategie zu optimieren'
                  : 'Analyze the market to optimize your portfolio strategy'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Vergleichen Sie Ihre Portfolioperformance mit den aktuellen Markttrends.'
                  : 'Compare your portfolio performance with current market trends.'}
              </p>
              <Button 
                className="group"
                onClick={() => navigate('/investor-dashboard?tab=market')}
              >
                {language === 'de' ? 'Zur Marktanalyse' : 'Go to Market Analysis'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="mt-6">
          <MarketAnalysisTools />
          
          {/* Workflow Suggestions for better transitions between tools */}
          <WorkflowSuggestions
            currentTool="market"
            workflowType="analyse"
            maxSuggestions={2}
            className="mt-6 mb-4"
          />
          
          {/* Intelligente Workflow-Empfehlung */}
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Nächster Schritt: Finanzierung' : 'Next Step: Financing'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Berechnen Sie Finanzierungsoptionen für potenzielle Investitionen'
                  : 'Calculate financing options for potential investments'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Basierend auf Ihrer Marktanalyse, kalkulieren Sie nun die Finanzierung.'
                  : 'Based on your market analysis, now calculate the financing.'}
              </p>
              <Button 
                className="group"
                onClick={() => navigate('/investor-dashboard?tab=financing')}
              >
                {language === 'de' ? 'Zur Finanzierung' : 'Go to Financing'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financing" className="mt-6">
          <MortgageCalculator />
          
          {/* Workflow Suggestions for better transitions between tools */}
          <WorkflowSuggestions
            currentTool="calculator"
            workflowType="finanzierung"
            maxSuggestions={2}
            className="mt-6 mb-4"
          />
          
          {/* Intelligente Workflow-Empfehlung */}
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Nächster Schritt: Steuerplanung' : 'Next Step: Tax Planning'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Optimieren Sie Ihre Steuersituation für Ihre Immobilieninvestitionen'
                  : 'Optimize your tax situation for your real estate investments'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Maximieren Sie Ihren ROI durch intelligente Steuerplanung.'
                  : 'Maximize your ROI through smart tax planning.'}
              </p>
              <Button 
                className="group"
                onClick={() => navigate('/investor-dashboard?tab=tax')}
              >
                {language === 'de' ? 'Zur Steuerplanung' : 'Go to Tax Planning'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxPlanner />
          
          {/* Workflow Suggestions for better transitions between tools */}
          <WorkflowSuggestions
            currentTool="planning"
            workflowType="steuer"
            maxSuggestions={2}
            className="mt-6 mb-4"
          />
          
          {/* Intelligente Workflow-Empfehlung */}
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Nächster Schritt: Due Diligence' : 'Next Step: Due Diligence'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Führen Sie eine gründliche Due Diligence durch, bevor Sie investieren'
                  : 'Conduct thorough due diligence before investing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Stellen Sie sicher, dass Ihre Investition auf soliden Grundlagen steht.'
                  : 'Ensure your investment is based on solid foundations.'}
              </p>
              <Button 
                className="group"
                onClick={() => navigate('/investor-dashboard?tab=duediligence')}
              >
                {language === 'de' ? 'Zur Due Diligence' : 'Go to Due Diligence'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="duediligence" className="mt-6">
          <DueDiligenceChecklist />
          
          {/* Workflow Suggestions for better transitions between tools */}
          <WorkflowSuggestions
            currentTool="duediligence"
            workflowType="analyse"
            maxSuggestions={2}
            className="mt-6 mb-4"
          />
          
          {/* Intelligente Workflow-Empfehlung */}
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Workflow abschließen: Portfolio Review' : 'Complete Workflow: Portfolio Review'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Überprüfen Sie Ihr bestehendes Portfolio mit den neuen Erkenntnissen'
                  : 'Review your existing portfolio with new insights'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'de'
                  ? 'Schließen Sie den Analyse-Workflow ab und wenden Sie Ihre neuen Erkenntnisse auf Ihr bestehendes Portfolio an.'
                  : 'Complete the analysis workflow and apply your new insights to your existing portfolio.'}
              </p>
              <Button 
                className="group"
                onClick={() => navigate('/investor-dashboard?tab=portfolio')}
              >
                {language === 'de' ? 'Zum Portfolio Review' : 'Go to Portfolio Review'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestorDashboard;
