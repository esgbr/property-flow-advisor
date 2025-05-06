
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import MarketAnalysis from '@/components/market/MarketAnalysis';
import { Building, BarChart3, Map, Globe, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import MarketTrendsAnalysis from '@/components/market/MarketTrendsAnalysis';
import GermanMarketInsights from '@/components/german/GermanMarketInsights';
import ImprovedMarketSelector from '@/components/market/ImprovedMarketSelector';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import MarketComparisonTool from '@/components/market/MarketComparisonTool';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MarketExplorerPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const navigate = useNavigate();

  const handleMarketChange = (market: InvestmentMarket) => {
    updatePreferences({ investmentMarket: market });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            <Globe className="inline-block mr-2 h-8 w-8" />
            {t('marketExplorer')}
          </h1>
          <p className="text-muted-foreground">
            {t('exploreAnalyzeMarkets')}
          </p>
        </div>
        <ImprovedMarketSelector onMarketChange={handleMarketChange} />
      </div>
      
      {/* Advanced Analytics Promotion Card */}
      <Card className="bg-primary/5 hover:bg-primary/10 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                {language === 'de' ? 'Erweiterte Marktanalyse-Tools' : 'Advanced Market Analysis Tools'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                {language === 'de' 
                  ? 'Nutzen Sie unsere neuen erweiterten Marktanalyse-Tools für direkten Marktvergleich und detaillierte Prognosen.' 
                  : 'Use our new advanced market analysis tools for direct market comparison and detailed forecasts.'}
              </p>
            </div>
            <Button 
              className="group"
              onClick={() => navigate('/advanced-market-analysis')}
            >
              {language === 'de' ? 'Zu den erweiterten Tools' : 'Go to Advanced Tools'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('analysis')}
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('trends')}
          </TabsTrigger>
          <TabsTrigger value="germanMarket">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Deutscher Markt' : 'German Market'}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <Map className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <MarketAnalysis />
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>{t('marketTrends')}</CardTitle>
              <CardDescription>{t('marketTrendsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketTrendsAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="germanMarket">
          <GermanMarketInsights />
        </TabsContent>
        
        <TabsContent value="comparison">
          <MarketComparisonTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketExplorerPage;
