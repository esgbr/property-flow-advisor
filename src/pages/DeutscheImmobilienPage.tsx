
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GermanPropertyRecommendations } from '@/components/german/GermanPropertyRecommendations';
import { Separator } from '@/components/ui/separator';
import SkipToContent from '@/components/accessibility/SkipToContent';
import GermanInvestorNavigation from '@/components/navigation/GermanInvestorNavigation';
import GermanInvestorToolbar from '@/components/navigation/GermanInvestorToolbar';
import {
  Building,
  Euro,
  Calculator,
  Map,
  Search,
  Star,
  Clock,
  Filter,
  X,
  FileText,
  BarChart3,
  TrendingUp,
  PiggyBank,
  Landmark
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import MarketSpecificFeatures from '@/components/market/MarketSpecificFeatures';

const DeutscheImmobilienPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { userMarket, setUserMarket } = useMarketFilter();
  
  // Beim Laden der Seite den Markt auf Deutschland setzen
  React.useEffect(() => {
    if (userMarket !== 'germany') {
      setUserMarket('germany');
    }
  }, [userMarket, setUserMarket]);

  const steuerTipps = [
    {
      title: 'AfA optimal nutzen',
      description: 'Wie Sie die Abschreibung für Abnutzung steuerlich optimal einsetzen',
      icon: <Calculator className="h-10 w-10 text-primary/80" />,
      path: '/guides/afa-optimierung'
    },
    {
      title: 'Grunderwerbsteuer sparen',
      description: 'Legale Möglichkeiten zur Reduzierung der Grunderwerbsteuer',
      icon: <Euro className="h-10 w-10 text-primary/80" />,
      path: '/guides/grunderwerbsteuer-sparen'
    },
    {
      title: 'Vermietung & Steuern',
      description: 'Steuerliche Aspekte bei der Vermietung von Immobilien',
      icon: <FileText className="h-10 w-10 text-primary/80" />,
      path: '/guides/vermietung-steuern'
    }
  ];

  const marktAnalysen = [
    {
      title: 'Deutsche A-Städte',
      description: 'Aktuelle Marktanalyse der größten deutschen Immobilienmärkte',
      value: '+3.5%',
      trend: 'steigend',
      icon: <Building className="h-5 w-5 text-primary" />
    },
    {
      title: 'Mietrenditen 2025',
      description: 'Prognose der Mietrenditen für verschiedene Standorte',
      value: '4.2% - 5.8%',
      trend: 'stabil',
      icon: <BarChart3 className="h-5 w-5 text-primary" />
    },
    {
      title: 'Kaufpreismultiplikatoren',
      description: 'Entwicklung der Kaufpreismultiplikatoren nach Regionen',
      value: '22.5x - 31.2x',
      trend: 'fallend',
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <SkipToContent contentId="hauptinhalt" />
      
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Landmark className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-3xl font-bold">
            {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Spezialisierte Tools für den deutschen Immobilienmarkt' 
            : 'Specialized tools for the German real estate market'}
        </p>
      </div>
      
      <div className="relative flex-grow mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={language === 'de' ? 'Immobilien-Tools durchsuchen...' : 'Search real estate tools...'}
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
      
      <div id="hauptinhalt">
        <GermanInvestorToolbar className="mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Beliebte Deutsche Immobilien-Tools' : 'Popular German Real Estate Tools'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Häufig genutzte Tools für deutsche Immobilieninvestoren'
                  : 'Frequently used tools for German real estate investors'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GermanInvestorNavigation variant="grid" maxItems={6} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/deutsche-immobilien-tools')}>
                {language === 'de' ? 'Alle Tools anzeigen' : 'View all tools'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Marktanalysen' : 'Market Analysis'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Aktuelle Kennzahlen zum deutschen Immobilienmarkt'
                  : 'Current metrics for the German real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marktAnalysen.map((item, index) => (
                  <div key={index} className="flex space-x-4 items-start">
                    <div className="rounded-full p-2 bg-primary/10">
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center">
                        <span className="font-semibold">{item.value}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.trend})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/markt-analysen/deutschland')}>
                {language === 'de' ? 'Detaillierte Analyse' : 'Detailed Analysis'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'de' ? 'Steuertipps für Immobilieninvestoren' : 'Tax Tips for Real Estate Investors'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steuerTipps.map((tip, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(tip.path)}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {tip.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <GermanPropertyRecommendations />
        
        <Separator className="my-8" />
        
        <MarketSpecificFeatures showTitle={true} limit={6} showViewAll={true} />
      </div>
    </div>
  );
};

export default DeutscheImmobilienPage;
