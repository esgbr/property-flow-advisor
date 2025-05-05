
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, BarChart3, Calculator, Landmark, Globe, ArrowRight, PiggyBank, Euro, FileText, Map } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useUserPreferences();
  const isMobile = useIsMobile();
  
  const deutscheTools = [
    {
      title: 'Grunderwerbsteuer-Rechner',
      description: 'Berechnen Sie die Grunderwerbsteuer in allen deutschen Bundesländern',
      icon: <Euro className="h-10 w-10 text-primary" />,
      path: '/calculators/grunderwerbsteuer'
    },
    {
      title: 'AfA-Rechner',
      description: 'Optimale Berechnung der Abschreibung für Immobilien',
      icon: <Calculator className="h-10 w-10 text-primary" />,
      path: '/calculators/afa'
    },
    {
      title: 'Deutsche Immobilienmarkt-Trends',
      description: 'Aktuelle Marktdaten und Trends für deutsche Städte',
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      path: '/deutsche-immobilien'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <SkipToContent contentId="main-content" />
      
      <div id="main-content" className="text-center mb-12">
        <Building className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('propertyFlow')}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('investmentPlatform')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
          >
            {isAuthenticated ? t('dashboard') : t('login')}
          </Button>
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth?mode=register')}
            >
              {t('createAccount')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Featured German Tools - Prominent Display */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'de' 
              ? 'Spezialisierte Tools für den deutschen Immobilienmarkt' 
              : 'Specialized tools for the German real estate market'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deutscheTools.map((tool, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(tool.path)}
            >
              <CardContent className="pt-6">
                <div className="rounded-full p-4 bg-primary/10 inline-flex mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="ghost" className="gap-1">
                  {language === 'de' ? 'Öffnen' : 'Open'} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button onClick={() => navigate('/deutsche-immobilien-tools')} size="lg">
            {language === 'de' ? 'Alle deutschen Immobilien-Tools anzeigen' : 'View all German real estate tools'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('analytics')}</h3>
          <p className="text-muted-foreground mb-4">{t('cashFlowAnalysisDescription')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('properties')}</h3>
          <p className="text-muted-foreground mb-4">{t('portfolioProjections')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 text-center">
          <Calculator className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('calculators')}</h3>
          <p className="text-muted-foreground mb-4">{t('cashFlowAnalysisDescription')}</p>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto bg-primary/5 rounded-lg p-6 md:p-8 border border-primary/10 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="rounded-full bg-primary/10 p-6">
            <Landmark className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {language === 'de' 
                ? 'Spezialisierte Tools und Rechner für den deutschen Immobilienmarkt' 
                : 'Specialized tools and calculators for the German real estate market'}
            </p>
            <Button onClick={() => navigate('/deutsche-immobilien')}>
              {language === 'de' ? 'Zu den deutschen Tools' : 'Go to German tools'} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {language === 'de' ? 'Internationale Tools' : 'International Tools'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          {language === 'de' 
            ? 'Unsere Plattform unterstützt auch Investitionen in anderen Märkten weltweit' 
            : 'Our platform also supports investments in other markets worldwide'}
        </p>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-4'} max-w-3xl mx-auto`}>
          <Button variant="outline" onClick={() => navigate('/deutsche-immobilien')}>Deutschland</Button>
          <Button variant="outline" onClick={() => navigate('/markets/austria')}>Österreich</Button>
          <Button variant="outline" onClick={() => navigate('/markets/switzerland')}>Schweiz</Button>
          <Button variant="outline" onClick={() => navigate('/markets/united-states')}>USA</Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
