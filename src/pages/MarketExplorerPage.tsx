import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Search,
  Map,
  Building,
  Filter,
  X,
  BarChart3,
  TrendingUp,
  Download,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { availableMarkets } from '@/utils/marketHelpers';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import MarketMetricsGrid from '@/components/analysis/MarketMetricsGrid';
import MarketChart from '@/components/analysis/MarketChart';
import { toast } from 'sonner';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';
import { useWorkflow } from '@/hooks/use-workflow';
import { useIsMobile } from '@/hooks/use-mobile';

const MarketExplorerPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const marketFilter = useMarketFilter();
  const userMarket = marketFilter.userMarket;
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('metrics');
  
  // Get the workflow hook for analysis workflow
  const workflow = useWorkflow('analyse');
  
  // Get the market display name
  const marketName = userMarket ? marketFilter.getMarketDisplayName() : '';

  // Handler for market changes
  const handleMarketChange = (value: string) => {
    marketFilter.setUserMarket(value as InvestmentMarket);
    toast.success(language === 'de' 
      ? `Markt gewechselt zu ${value}`
      : `Market changed to ${value}`);
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Mark the step as complete in the workflow
    if (value === 'metrics') {
      workflow.markStepComplete('market');
    }
  };
  
  // Download data handler
  const handleDownload = () => {
    toast.success(language === 'de'
      ? 'Marktdaten werden heruntergeladen...'
      : 'Downloading market data...');
  };

  // Replace goToNextStep with goToStep
  const handleComplete = () => {
    if (currentStep) {
      workflow.markStepComplete(currentStep);
      const steps = workflow.getStepsWithStatus();
      const currentIndex = steps.findIndex(s => s.id === currentStep);
      
      if (currentIndex !== -1 && currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        workflow.goToStep(nextStep.id);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Globe className="mr-2 h-6 w-6" />
            {language === 'de' ? 'Immobilienmarkt-Explorer' : 'Real Estate Market Explorer'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Erkunden Sie Immobilienmärkte weltweit' 
              : 'Explore real estate markets worldwide'}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select defaultValue={userMarket || 'global'} onValueChange={handleMarketChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={language === 'de' ? 'Markt wählen' : 'Choose market'} />
            </SelectTrigger>
            <SelectContent>
              {availableMarkets.map((market) => (
                <SelectItem key={market.id} value={market.id}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {language === 'de' ? 'Marktübersicht' : 'Market Overview'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Aktuelle Entwicklung des Immobilienmarktes' 
                  : 'Current development of the real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketChart />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {language === 'de' ? 'Marktsuche' : 'Market Search'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Finden Sie spezifische Marktdaten' 
                  : 'Find specific market data'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === 'de' ? 'Markt durchsuchen...' : 'Search market...'}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2" 
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  Berlin
                </Button>
                <Button variant="outline" size="sm">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  München
                </Button>
                <Button variant="outline" size="sm">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  Frankfurt
                </Button>
                <Button variant="outline" size="sm">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  Hamburg
                </Button>
              </div>
              <Button className="w-full">
                {language === 'de' ? 'Detaillierte Suche' : 'Detailed Search'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kennzahlen' : 'Metrics'}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Trends' : 'Trends'}
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Karte' : 'Map'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MarketMetricsGrid />
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {language === 'de' ? 'Markttrends & Prognosen' : 'Market Trends & Forecasts'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Langfristige Entwicklung des Immobilienmarktes' 
                  : 'Long-term development of the real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Trendanalyse wird geladen' : 'Trend analysis is loading'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  {language === 'de' 
                    ? 'Detaillierte Trend-Daten werden geladen...' 
                    : 'Detailed trend data is loading...'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Daten aktualisieren' : 'Update Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {language === 'de' ? 'Markt-Gebietskarte' : 'Market Area Map'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Visuelle Darstellung des Immobilienmarktes' 
                  : 'Visual representation of the real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto text-primary/60 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Karte wird geladen' : 'Map is loading'}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                  {language === 'de' 
                    ? 'Interaktive Karte wird geladen...' 
                    : 'Interactive map is loading...'}
                </p>
                <Button variant="outline">
                  {language === 'de' ? 'Karte aktualisieren' : 'Update Map'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Workflow suggestions to continue analytics journey */}
      <WorkflowSuggestions 
        currentTool="market" 
        workflowType="analyse" 
        className="mt-8" 
      />

      <div className="mt-8">
        <Card className="hover:shadow-md transition-all border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              {language === 'de' ? 'Nächster Schritt: Portfolio-Analyse' : 'Next Step: Portfolio Analysis'}
            </CardTitle>
            <CardDescription>
              {language === 'de'
                ? 'Analysieren Sie Ihr Portfolio im Kontext der aktuellen Marktdaten'
                : 'Analyze your portfolio in the context of current market data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'de'
                ? 'Bringen Sie Ihre Marktanalyse und Ihr bestehendes Portfolio zusammen, um die optimale Strategie zu entwickeln.'
                : 'Bring together your market analysis and existing portfolio to develop the optimal strategy.'}
            </p>
            <Button 
              className="group"
              onClick={() => {
                handleComplete();
              }}
            >
              {language === 'de' ? 'Zur Portfolio-Analyse' : 'Go to Portfolio Analysis'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketExplorerPage;
