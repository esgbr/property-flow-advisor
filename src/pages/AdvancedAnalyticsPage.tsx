
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { 
  Calculator, 
  Building, 
  ArrowLeftRight, 
  ChartBar, 
  BarChart3, 
  TrendingUp, 
  Map,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import MarketComparisonDashboard from '@/components/market/MarketComparisonDashboard';
import CashFlowSimulator from '@/components/finance/CashFlowSimulator';
import CurrencyConverter from '@/components/internationalization/CurrencyConverter';
import WorkflowProgressVisualization from '@/components/workflow/WorkflowProgressVisualization';

/**
 * Advanced analytics page that integrates multiple advanced tools
 */
const AdvancedAnalyticsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            <BarChart3 className="inline-block mr-2 h-8 w-8" />
            {language === 'de' ? 'Erweiterte Immobilienanalyse' : 'Advanced Real Estate Analytics'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Vertiefte Analyse und Simulation für Immobilieninvestitionen'
              : 'In-depth analysis and simulation for real estate investments'}
          </p>
        </div>
      </div>

      <Tabs defaultValue="market" className="space-y-6">
        <TabsList>
          <TabsTrigger value="market">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
          </TabsTrigger>
          <TabsTrigger value="cashflow">
            <Calculator className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Cash-Flow-Simulation' : 'Cash Flow Simulation'}
          </TabsTrigger>
          <TabsTrigger value="currency">
            <ChartBar className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Währungsumrechner' : 'Currency Converter'}
          </TabsTrigger>
          <TabsTrigger value="workflow">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Workflow-Visualisierung' : 'Workflow Visualization'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <MarketComparisonDashboard />
          
          <Card className="mt-6 hover:shadow-md transition-all border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Umfassendere Marktanalysen' : 'More Comprehensive Market Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Entdecken Sie tiefere Einblicke in verschiedene Immobilienmärkte'
                  : 'Discover deeper insights into different real estate markets'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {language === 'de'
                    ? 'Für detailliertere Marktanalysen, besuchen Sie unsere Market Explorer Seite.'
                    : 'For more detailed market analysis, visit our Market Explorer page.'}
                </p>
                <Button 
                  className="group"
                  onClick={() => navigate('/market-explorer')}
                >
                  {language === 'de' ? 'Zum Market Explorer' : 'Go to Market Explorer'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <CashFlowSimulator />
        </TabsContent>

        <TabsContent value="currency">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CurrencyConverter />
            
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Internationale Investitionen' : 'International Investments'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Tipps und Werkzeuge für internationale Immobilieninvestitionen'
                    : 'Tips and tools for international real estate investments'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    {language === 'de' ? 'Währungsrisiken verstehen' : 'Understanding Currency Risks'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Wechselkursschwankungen können einen erheblichen Einfluss auf die Rendite internationaler Immobilieninvestitionen haben.'
                      : 'Exchange rate fluctuations can have a significant impact on the returns of international real estate investments.'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">
                    {language === 'de' ? 'Ländervergleich' : 'Country Comparison'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Verschiedene Länder haben unterschiedliche Gesetze, Steuern und Marktdynamiken für Immobilieninvestitionen.'
                      : 'Different countries have different laws, taxes, and market dynamics for real estate investments.'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/market-explorer')}
                  >
                    {language === 'de' ? 'Internationale Märkte erkunden' : 'Explore International Markets'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <div className="grid grid-cols-1 gap-6">
            <WorkflowProgressVisualization 
              workflowTypes={['steuer', 'immobilien', 'finanzierung', 'analyse']}
            />
            
            <Card className="hover:shadow-md transition-all border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary" />
                  {language === 'de' ? 'Workflow-Management' : 'Workflow Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Verwalten und optimieren Sie Ihre Immobilien-Workflows'
                    : 'Manage and optimize your real estate workflows'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {language === 'de'
                      ? 'Für detaillierte Workflow-Verwaltung, besuchen Sie unsere Workflow-Seite.'
                      : 'For detailed workflow management, visit our Workflows page.'}
                  </p>
                  <Button 
                    className="group"
                    onClick={() => navigate('/workflows')}
                  >
                    {language === 'de' ? 'Zu den Workflows' : 'Go to Workflows'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsPage;
