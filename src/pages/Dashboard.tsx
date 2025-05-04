
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, Euro, PieChart, BarChart3, Globe, FileText, Map, Landmark, Receipt } from 'lucide-react';
import { GermanPropertyRecommendations } from '@/components/german/GermanPropertyRecommendations';
import { GermanRealEstateNavigation } from '@/components/navigation/GermanRealEstateNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Quick access tools for dashboard
  const quickTools = [
    {
      title: language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax',
      icon: <Euro className="h-6 w-6 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer',
      description: language === 'de' 
        ? 'Berechnen Sie die Grunderwerbsteuer für verschiedene Bundesländer' 
        : 'Calculate transfer tax for different German states'
    },
    {
      title: t('calculators'),
      icon: <Calculator className="h-6 w-6 text-primary" />,
      path: '/calculators',
      description: language === 'de' 
        ? 'Zugriff auf alle verfügbaren Immobilien-Rechner' 
        : 'Access all available real estate calculators'
    },
    {
      title: t('portfolio'),
      icon: <Building className="h-6 w-6 text-primary" />,
      path: '/properties',
      description: language === 'de' 
        ? 'Verwalten Sie Ihr Immobilienportfolio' 
        : 'Manage your property portfolio'
    },
    {
      title: language === 'de' ? 'Deutsche Immobilien' : 'German Real Estate',
      icon: <Globe className="h-6 w-6 text-primary" />,
      path: '/german-investor',
      description: language === 'de' 
        ? 'Spezielle Tools für den deutschen Markt' 
        : 'Specialized tools for the German market'
    }
  ];

  const germanSpecificTools = [
    { 
      title: language === 'de' ? 'Grunderwerbsteuer' : 'Transfer Tax', 
      icon: <Euro className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer',
      description: language === 'de' 
        ? 'Steuerberechnung für jedes Bundesland' 
        : 'Tax calculation for each German state'
    },
    { 
      title: language === 'de' ? 'Mietkauf' : 'Rent-to-Own', 
      icon: <Landmark className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=mietkauf',
      description: language === 'de'
        ? 'Berechnung für Mietkauf-Optionen'
        : 'Calculation for rent-to-own options'
    },
    { 
      title: language === 'de' ? 'AfA-Rechner' : 'Depreciation', 
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=afa',
      description: language === 'de'
        ? 'Steuerabschreibungen berechnen'
        : 'Calculate tax depreciation'
    },
    { 
      title: language === 'de' ? 'Mietspiegel' : 'Rent Index', 
      icon: <Map className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=mietspiegel', 
      description: language === 'de'
        ? 'Mietpreise in deutschen Städten vergleichen'
        : 'Compare rental prices in German cities'
    },
    { 
      title: language === 'de' ? 'Energieausweis' : 'Energy Certificate', 
      icon: <FileText className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=energieausweis',
      description: language === 'de'
        ? 'Energieeffizienz analysieren'
        : 'Analyze energy efficiency'
    },
    { 
      title: language === 'de' ? 'Nebenkosten' : 'Additional Costs', 
      icon: <Receipt className="h-5 w-5 text-primary" />,
      path: '/deutsche-immobilien-tools?tab=nebenkosten',
      description: language === 'de'
        ? 'Nebenkosten und Betriebskosten berechnen'
        : 'Calculate additional costs and operating expenses'
    }
  ];

  return (
    <div className="container mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate('/german-investor')}>
            {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
          </Button>
        </div>
      </div>

      {isMobile ? (
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tools">
              <Calculator className="h-4 w-4 mr-2" />
              {t('tools')}
            </TabsTrigger>
            <TabsTrigger value="german">
              <Euro className="h-4 w-4 mr-2" />
              {language === 'de' ? 'DE Tools' : 'DE Tools'}
            </TabsTrigger>
            <TabsTrigger value="properties">
              <Building className="h-4 w-4 mr-2" />
              {t('properties')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 gap-4">
              {quickTools.map((tool, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(tool.path)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      {tool.icon}
                      <CardTitle className="ml-2 text-lg">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="german">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}</CardTitle>
                <CardDescription>
                  {language === 'de' 
                    ? 'Spezielle Tools für den deutschen Immobilienmarkt' 
                    : 'Specialized tools for the German real estate market'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GermanRealEstateNavigation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties">
            <GermanPropertyRecommendations />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(tool.path)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    {tool.icon}
                    <CardTitle className="ml-2 text-lg">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}</CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Spezielle Tools für den deutschen Immobilienmarkt' 
                  : 'Specialized tools for the German real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {germanSpecificTools.map((tool, index) => (
                  <Card 
                    key={index}
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(tool.path)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center">
                        {tool.icon}
                        <CardTitle className="ml-2 text-md">{tool.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <GermanPropertyRecommendations />
          
          <Card>
            <CardHeader>
              <CardTitle>{t('yourPortfolio')}</CardTitle>
              <CardDescription>{t('propertyOverview')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-10">
                <Button onClick={() => navigate('/properties')}>
                  {t('viewProperties')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
