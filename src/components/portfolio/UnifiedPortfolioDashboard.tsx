
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, PieChart, TrendingUp, LineChart, ArrowRight, DollarSign, BarChart3, Search, Receipt } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PortfolioDashboard from './PortfolioDashboard';
import EnhancedPortfolioDashboard from './EnhancedPortfolioDashboard';
import { toast } from 'sonner';

const UnifiedPortfolioDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const isMobile = useIsMobile();

  // Determine which dashboard to display based on user experience level
  const isAdvancedUser = preferences.experienceLevel === 'advanced' || preferences.experienceLevel === 'expert';
  
  // Quick action handlers
  const handleQuickAction = (action: string, path: string) => {
    navigate(path);
    toast.success(
      language === 'de'
        ? `Tool geöffnet: ${action}`
        : `Tool opened: ${action}`
    );
  };
  
  // Investment Shortcuts for common workflows
  const investmentShortcuts = [
    {
      name: language === 'de' ? 'ROI Berechnung' : 'ROI Calculator',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      description: language === 'de' ? 'Rentabilitätsberechnung für Immobilien' : 'Return on investment calculator',
      path: '/calculators?tool=roi',
    },
    {
      name: language === 'de' ? 'Markttrendanalyse' : 'Market Trend Analysis',
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      description: language === 'de' ? 'Aktuelle Markttrends und Prognosen' : 'Current market trends and forecasts',
      path: '/market-explorer',
    },
    {
      name: language === 'de' ? 'Kapitalflussrechnung' : 'Cash Flow Analysis',
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      description: language === 'de' ? 'Analyse der Ein- und Auszahlungen' : 'Analysis of income and expenses',
      path: '/calculators?tool=cash-flow',
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <div className={`flex ${isMobile ? 'overflow-x-auto pb-2' : 'flex-wrap'} gap-2 mb-2`}>
        {investmentShortcuts.map((shortcut) => (
          <Button 
            key={shortcut.name}
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            className={`${isMobile ? 'flex-shrink-0' : ''} group`}
            onClick={() => handleQuickAction(shortcut.name, shortcut.path)}
          >
            {shortcut.icon}
            <span className={`${isMobile ? 'ml-1' : 'ml-2'}`}>{shortcut.name}</span>
            <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </Button>
        ))}
      </div>
      
      {/* Render appropriate dashboard based on user experience */}
      {isAdvancedUser ? <EnhancedPortfolioDashboard /> : <PortfolioDashboard />}
      
      {/* Market Context Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            {language === 'de' ? 'Portfolio im Marktkontext' : 'Portfolio in Market Context'}
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Vergleichen Sie Ihre Investitionen mit aktuellen Marktdaten' 
              : 'Compare your investments with current market data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="performance">
                <LineChart className="mr-1 h-4 w-4" />
                {language === 'de' ? 'Performance' : 'Performance'}
              </TabsTrigger>
              <TabsTrigger value="allocation">
                <PieChart className="mr-1 h-4 w-4" />
                {language === 'de' ? 'Aufteilung' : 'Allocation'}
              </TabsTrigger>
              <TabsTrigger value="trends">
                <TrendingUp className="mr-1 h-4 w-4" />
                {language === 'de' ? 'Trends' : 'Trends'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Performance-Analyse' : 'Performance Analysis'}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {language === 'de' 
                      ? 'Analyse Ihrer Portfolio-Performance im Vergleich zum Markt' 
                      : 'Analysis of your portfolio performance compared to the market'}
                  </p>
                  <Button onClick={() => navigate('/portfolio-analytics')}>
                    {language === 'de' ? 'Vollständige Analyse ansehen' : 'View Full Analysis'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="allocation">
              <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Portfolio-Aufteilung' : 'Portfolio Allocation'}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {language === 'de' 
                      ? 'Analyse Ihrer aktuellen Portfolio-Aufteilung' 
                      : 'Analysis of your current portfolio allocation'}
                  </p>
                  <Button onClick={() => navigate('/portfolio-analytics?tab=allocation')}>
                    {language === 'de' ? 'Zur Allokationsanalyse' : 'Go to Allocation Analysis'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-60 flex items-center justify-center bg-secondary/20 rounded-md">
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Markttrends' : 'Market Trends'}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {language === 'de' 
                      ? 'Aktuelle Trends und deren Einfluss auf Ihre Investitionen' 
                      : 'Current trends and their impact on your investments'}
                  </p>
                  <Button onClick={() => navigate('/market-explorer')}>
                    {language === 'de' ? 'Zu den Markttrends' : 'View Market Trends'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Next Steps Card */}
      <Card className="border-primary/20 hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRight className="h-5 w-5 mr-2 text-primary" />
            {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
          </CardTitle>
          <CardDescription>
            {language === 'de' ? 'Empfohlene Aktionen für Ihre Investitionsstrategie' : 'Recommended actions for your investment strategy'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-full h-auto py-3 px-4 group"
            onClick={() => navigate('/investor-dashboard?tab=market')}
          >
            <div className="flex items-center">
              <Search className="h-5 w-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'de' ? 'Marktanalyse durchführen' : 'Conduct Market Analysis'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Neue Chancen entdecken' : 'Discover new opportunities'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-full h-auto py-3 px-4 group"
            onClick={() => navigate('/investor-dashboard?tab=tax')}
          >
            <div className="flex items-center">
              <Receipt className="h-5 w-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'de' ? 'Steuerplanung optimieren' : 'Optimize Tax Planning'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Steuervorteile maximieren' : 'Maximize tax advantages'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedPortfolioDashboard;
