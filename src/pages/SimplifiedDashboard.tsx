
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  ChevronRight, 
  BarChart3, 
  Calculator, 
  PieChart, 
  MapPin, 
  FileText,
  TrendingUp
} from 'lucide-react';

const SimplifiedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'de' ? 'Guten Morgen' : 'Good Morning';
    } else if (hour < 18) {
      return language === 'de' ? 'Guten Tag' : 'Good Afternoon';
    } else {
      return language === 'de' ? 'Guten Abend' : 'Good Evening';
    }
  };

  // Generate quick action buttons based on user experience level
  const getQuickActions = () => {
    const actions = [];
    
    // Common actions for all users
    actions.push({
      id: 'explore',
      title: language === 'de' ? 'Markt erkunden' : 'Explore Market',
      icon: <MapPin className="h-5 w-5 text-primary" />,
      action: () => navigate('/market-explorer')
    });
    
    actions.push({
      id: 'calculator',
      title: language === 'de' ? 'Investitionsrechner' : 'Investment Calculator',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      action: () => navigate('/calculators')
    });
    
    // Add experience-specific actions
    if (preferences.experienceLevel === 'beginner') {
      actions.push({
        id: 'education',
        title: language === 'de' ? 'Lernen' : 'Education',
        icon: <FileText className="h-5 w-5 text-primary" />,
        action: () => navigate('/education')
      });
    }
    
    if (preferences.experienceLevel === 'intermediate' || preferences.experienceLevel === 'advanced' || preferences.experienceLevel === 'expert') {
      actions.push({
        id: 'portfolio',
        title: language === 'de' ? 'Portfolio' : 'Portfolio',
        icon: <PieChart className="h-5 w-5 text-primary" />,
        action: () => navigate('/investor-dashboard')
      });
    }
    
    if (preferences.experienceLevel === 'advanced' || preferences.experienceLevel === 'expert') {
      actions.push({
        id: 'analytics',
        title: language === 'de' ? 'Analysen' : 'Analytics',
        icon: <BarChart3 className="h-5 w-5 text-primary" />,
        action: () => navigate('/advanced-analytics')
      });
    }
    
    return actions;
  };

  // Get market-specific content
  const getMarketContent = () => {
    switch(preferences.investmentMarket) {
      case 'germany':
      case 'austria':
        return {
          title: language === 'de' ? 'Deutsche Immobilientools' : 'German Real Estate Tools',
          description: language === 'de' 
            ? 'Spezialisierte Tools für den deutschen Immobilienmarkt'
            : 'Specialized tools for the German real estate market',
          action: () => navigate('/deutsche-immobilien-tools')
        };
      case 'usa':
        return {
          title: language === 'de' ? 'US-Immobilientools' : 'US Real Estate Tools',
          description: language === 'de'
            ? 'Spezialisierte Tools für den US-amerikanischen Immobilienmarkt'
            : 'Specialized tools for the US real estate market',
          action: () => navigate('/us-real-estate-tools')
        };
      default:
        return {
          title: language === 'de' ? 'Globale Immobilientools' : 'Global Real Estate Tools',
          description: language === 'de'
            ? 'Tools für internationale Immobilienmärkte'
            : 'Tools for international real estate markets',
          action: () => navigate('/market-explorer')
        };
    }
  };

  const marketContent = getMarketContent();
  const quickActions = getQuickActions();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-8 w-8 text-primary" />
          {getGreeting()}, {preferences.name || t('Investor')}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' ? 'Hier ist Ihr personalisiertes Investment-Dashboard' : 'Here\'s your personalized investment dashboard'}
        </p>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            {language === 'de' ? 'Übersicht' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="tools">
            {language === 'de' ? 'Tools' : 'Tools'}
          </TabsTrigger>
          <TabsTrigger value="market">
            {language === 'de' ? 'Markt' : 'Market'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-medium mb-4">
              {language === 'de' ? 'Schnellzugriff' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Card key={action.id} className="cursor-pointer hover:shadow-md transition-all" onClick={action.action}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      {action.icon}
                    </div>
                    <p className="font-medium">{action.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Market-specific recommendation */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {marketContent.title}
              </CardTitle>
              <CardDescription>{marketContent.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button onClick={marketContent.action} className="w-full group">
                {language === 'de' ? 'Erkunden' : 'Explore'} 
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Most relevant tools based on experience */}
          {preferences.experienceLevel === 'beginner' && (
            <section className="space-y-4">
              <h2 className="text-xl font-medium">
                {language === 'de' ? 'Empfohlen für Anfänger' : 'Recommended for Beginners'}
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{language === 'de' ? 'Grundlagen verstehen' : 'Understanding Basics'}</h3>
                        <p className="text-sm text-muted-foreground">{language === 'de' ? 'Lernen Sie die Grundlagen von Immobilieninvestitionen' : 'Learn the basics of real estate investing'}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/education')}>
                      {language === 'de' ? 'Zum Lernbereich' : 'Go to Education'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Calculator className="h-5 w-5 inline-block mr-2" />
                  {language === 'de' ? 'Finanztools' : 'Financial Tools'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Berechnen Sie Rendite, Kredite und mehr' : 'Calculate ROI, loans and more'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/calculators')}>
                  {language === 'de' ? 'Investitionsrechner' : 'Investment Calculator'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/financing-plans')}>
                  {language === 'de' ? 'Finanzierungsplaner' : 'Financing Planner'}
                </Button>
                {(preferences.investmentMarket === 'germany' || preferences.investmentMarket === 'austria') && (
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/grunderwerbsteuer')}>
                    {language === 'de' ? 'Grunderwerbsteuerrechner' : 'Property Transfer Tax Calculator'}
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  <BarChart3 className="h-5 w-5 inline-block mr-2" />
                  {language === 'de' ? 'Marktanalyse' : 'Market Analysis'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Entdecken und analysieren Sie Immobilienmärkte' : 'Explore and analyze real estate markets'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/market-explorer')}>
                  {language === 'de' ? 'Marktexplorer' : 'Market Explorer'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/market-comparison')}>
                  {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/property-search')}>
                  {language === 'de' ? 'Immobiliensuche' : 'Property Search'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp className="h-5 w-5 inline-block mr-2" />
                  {language === 'de' ? 'Portfolio' : 'Portfolio'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Verwalten Sie Ihre Immobilieninvestitionen' : 'Manage your real estate investments'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/investor-dashboard')}>
                  {language === 'de' ? 'Portfolio-Dashboard' : 'Portfolio Dashboard'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/portfolio-analytics')}>
                  {language === 'de' ? 'Portfolio-Analysen' : 'Portfolio Analytics'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText className="h-5 w-5 inline-block mr-2" />
                  {language === 'de' ? 'Bildung & Ressourcen' : 'Education & Resources'}
                </CardTitle>
                <CardDescription>
                  {language === 'de' ? 'Lernen und recherchieren Sie' : 'Learn and research'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/education')}>
                  {language === 'de' ? 'Lernressourcen' : 'Educational Resources'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/documents')}>
                  {language === 'de' ? 'Dokumentencenter' : 'Document Center'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Marktübersicht' : 'Market Overview'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? `Aktueller Fokus: ${preferences.investmentMarket === 'germany' ? 'Deutschland' : preferences.investmentMarket === 'austria' ? 'Österreich' : preferences.investmentMarket === 'usa' ? 'USA' : 'Global'}`
                  : `Current focus: ${preferences.investmentMarket === 'germany' ? 'Germany' : preferences.investmentMarket === 'austria' ? 'Austria' : preferences.investmentMarket === 'usa' ? 'USA' : 'Global'}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/market-explorer')}>
                {language === 'de' ? 'Markt erkunden' : 'Explore Market'}
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'de' ? 'Marktspezifische Tools' : 'Market-Specific Tools'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preferences.investmentMarket === 'germany' || preferences.investmentMarket === 'austria' ? (
                  <>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/deutsche-immobilien-tools')}>
                      {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/grunderwerbsteuer')}>
                      {language === 'de' ? 'Grunderwerbsteuerrechner' : 'Property Transfer Tax Calculator'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/afa-calculator')}>
                      {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
                    </Button>
                  </>
                ) : preferences.investmentMarket === 'usa' ? (
                  <>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/us-real-estate-tools')}>
                      {language === 'de' ? 'US-Immobilien-Tools' : 'US Real Estate Tools'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/property-exchange')}>
                      {language === 'de' ? 'Property Exchange (1031)' : 'Property Exchange (1031)'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/market-comparison')}>
                      {language === 'de' ? 'Globaler Marktvergleich' : 'Global Market Comparison'}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/currency-converter')}>
                      {language === 'de' ? 'Währungsrechner' : 'Currency Converter'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'de' ? 'Marktanalysen' : 'Market Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/market-trends')}>
                  {language === 'de' ? 'Markttrends' : 'Market Trends'}
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/rental-yield-map')}>
                  {language === 'de' ? 'Renditekarte' : 'Rental Yield Map'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedDashboard;
