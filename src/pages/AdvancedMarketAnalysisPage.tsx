
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart3,
  Building,
  MapPin,
  ArrowLeft,
  TrendingUp,
  LineChart,
  Map,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import MarketComparisonAssistant from '@/components/market/MarketComparisonAssistant';

const AdvancedMarketAnalysisPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8" />
            {language === 'de' ? 'Erweiterte Marktanalyse' : 'Advanced Market Analysis'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Detaillierte Analyse und Vergleich von Immobilienmärkten'
              : 'Detailed analysis and comparison of real estate markets'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/market-explorer')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'de' ? 'Zurück zum Marktexplorer' : 'Back to Market Explorer'}
        </Button>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison">
            <BarChart3 className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
          </TabsTrigger>
          <TabsTrigger value="rent-forecast">
            <LineChart className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Mietpreisentwicklung' : 'Rent Price Forecast'}
          </TabsTrigger>
          <TabsTrigger value="location-rating">
            <MapPin className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Standortbewertung' : 'Location Rating'}
          </TabsTrigger>
          <TabsTrigger value="portfolio">
            <Building className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Portfolioanalyse' : 'Portfolio Analysis'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <MarketComparisonAssistant />
        </TabsContent>

        <TabsContent value="rent-forecast">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Regionale Mietpreisentwicklung' : 'Regional Rent Price Development'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Detaillierte Prognosen zur regionalen Mietpreisentwicklung'
                  : 'Detailed forecasts of regional rent price development'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-col p-12">
              <TrendingUp className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'de' ? 'Funktion in Entwicklung' : 'Feature in Development'}
              </h3>
              <p className="text-center text-muted-foreground mb-6 max-w-md">
                {language === 'de'
                  ? 'Die erweiterte Mietpreisprognose wird derzeit entwickelt und steht in Kürze zur Verfügung.'
                  : 'The advanced rent price forecast feature is currently under development and will be available soon.'}
              </p>
              <Button variant="outline" onClick={() => navigate('/market-explorer')}>
                {language === 'de' ? 'Zurück zu Basisanalysen' : 'Return to Basic Analysis'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location-rating">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'KI-basierte Standortbewertung' : 'AI-based Location Rating'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Automatische Bewertung von Standorten nach verschiedenen Faktoren'
                  : 'Automatic rating of locations based on various factors'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-col p-12">
              <Map className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'de' ? 'Funktion in Entwicklung' : 'Feature in Development'}
              </h3>
              <p className="text-center text-muted-foreground mb-6 max-w-md">
                {language === 'de'
                  ? 'Die KI-basierte Standortbewertung wird derzeit entwickelt und steht in Kürze zur Verfügung.'
                  : 'The AI-based location rating feature is currently under development and will be available soon.'}
              </p>
              <Button variant="outline" onClick={() => navigate('/market-explorer')}>
                {language === 'de' ? 'Zurück zu Basisanalysen' : 'Return to Basic Analysis'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Erweiterte Portfoliodiversifikationsanalyse' : 'Advanced Portfolio Diversification Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Analyse der geografischen und Asset-Typ-Verteilung mit Optimierungsvorschlägen'
                  : 'Analysis of geographical and asset type distribution with optimization suggestions'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-col p-12">
              <Clock className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'de' ? 'Funktion in Entwicklung' : 'Feature in Development'}
              </h3>
              <p className="text-center text-muted-foreground mb-6 max-w-md">
                {language === 'de'
                  ? 'Die erweiterte Portfoliodiversifikationsanalyse wird derzeit entwickelt und steht in Kürze zur Verfügung.'
                  : 'The advanced portfolio diversification analysis is currently under development and will be available soon.'}
              </p>
              <Button variant="outline" onClick={() => navigate('/investor-dashboard?tab=portfolio')}>
                {language === 'de' ? 'Zum Investoren-Dashboard' : 'To Investor Dashboard'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMarketAnalysisPage;
