
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Calculator, 
  Search, 
  Star, 
  Clock, 
  Filter, 
  X, 
  Euro, 
  Briefcase, 
  Map,
  BarChart3,
  FileText,
  Home
} from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';

// Unified tool interface
interface Tool {
  id: string;
  titleEn: string;
  titleDe: string;
  descriptionEn: string;
  descriptionDe: string;
  path: string;
  icon: React.ReactNode;
  markets?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

const ToolsPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { userMarket } = useMarketFilter();
  
  // Combined tools from all categories
  const allTools: Tool[] = [
    // German market tools
    {
      id: 'grunderwerbsteuer',
      titleEn: 'Real Estate Transfer Tax',
      titleDe: 'Grunderwerbsteuer',
      descriptionEn: 'Calculate real estate transfer tax for German properties',
      descriptionDe: 'Berechnen Sie die Grunderwerbsteuer für deutsche Immobilien',
      path: '/calculators?tool=transfer-tax',
      icon: <Euro className="h-5 w-5" />,
      markets: ['germany', 'austria'],
      isFeatured: true
    },
    {
      id: 'mietspiegel',
      titleEn: 'Rent Index',
      titleDe: 'Mietspiegel',
      descriptionEn: 'Check official rent index for German cities',
      descriptionDe: 'Prüfen Sie den offiziellen Mietspiegel für deutsche Städte',
      path: '/calculators?tool=rent-index',
      icon: <Map className="h-5 w-5" />,
      markets: ['germany']
    },
    {
      id: 'afa',
      titleEn: 'Depreciation Calculator',
      titleDe: 'AfA-Rechner',
      descriptionEn: 'Calculate depreciation for tax purposes',
      descriptionDe: 'Berechnen Sie die steuerliche Abschreibung',
      path: '/calculators?tool=depreciation',
      icon: <Calculator className="h-5 w-5" />,
      markets: ['germany', 'austria']
    },
    
    // Common tools
    {
      id: 'roi-calculator',
      titleEn: 'ROI Calculator',
      titleDe: 'ROI-Rechner',
      descriptionEn: 'Calculate return on investment for properties',
      descriptionDe: 'Berechnen Sie die Rendite für Immobilieninvestitionen',
      path: '/calculators?tool=roi',
      icon: <BarChart3 className="h-5 w-5" />,
      isFeatured: true
    },
    {
      id: 'mortgage',
      titleEn: 'Mortgage Calculator',
      titleDe: 'Hypothekenrechner',
      descriptionEn: 'Calculate mortgage payments and amortization',
      descriptionDe: 'Berechnen Sie Hypothekenzahlungen und Amortisation',
      path: '/calculators?tool=mortgage',
      icon: <Home className="h-5 w-5" />,
      isFeatured: true
    },
    {
      id: 'cash-flow',
      titleEn: 'Cash Flow Analyzer',
      titleDe: 'Cashflow-Analyse',
      descriptionEn: 'Analyze cash flow for property investments',
      descriptionDe: 'Analysieren Sie den Cashflow für Immobilieninvestitionen',
      path: '/calculators?tool=cash-flow',
      icon: <BarChart3 className="h-5 w-5" />
    },
    
    // US-specific tools
    {
      id: '1031-exchange',
      titleEn: '1031 Exchange Calculator',
      titleDe: '1031 Exchange Rechner',
      descriptionEn: 'Calculate tax-deferred exchanges in the US',
      descriptionDe: 'Berechnen Sie steuerbegünstigte Immobilientausche in den USA',
      path: '/calculators?tool=1031-exchange',
      icon: <FileText className="h-5 w-5" />,
      markets: ['usa'],
      isNew: true
    }
  ];
  
  // Filter tools based on search query
  const filteredTools = searchQuery 
    ? allTools.filter(tool => 
        (language === 'de' ? tool.titleDe.toLowerCase() : tool.titleEn.toLowerCase())
          .includes(searchQuery.toLowerCase()) ||
        (language === 'de' ? tool.descriptionDe.toLowerCase() : tool.descriptionEn.toLowerCase())
          .includes(searchQuery.toLowerCase())
      )
    : allTools;
    
  // Filter tools by market relevance
  const getMarketSpecificTools = () => {
    return filteredTools.filter(tool => 
      !tool.markets || tool.markets.includes(userMarket) || tool.markets.includes('global')
    );
  };
  
  const getFeaturedTools = () => {
    return filteredTools.filter(tool => tool.isFeatured);
  };
  
  // Mock recently used tools
  const recentTools = ['mortgage', 'roi-calculator', 'grunderwerbsteuer'].map(id => 
    allTools.find(tool => tool.id === id)
  ).filter(Boolean) as Tool[];
  
  // Mock favorite tools
  const favoriteTools = ['mortgage', 'grunderwerbsteuer'].map(id => 
    allTools.find(tool => tool.id === id)
  ).filter(Boolean) as Tool[];

  // Render a tool card
  const renderToolCard = (tool: Tool, variant: 'grid' | 'list' = 'grid') => {
    const title = language === 'de' ? tool.titleDe : tool.titleEn;
    const description = language === 'de' ? tool.descriptionDe : tool.descriptionEn;
    
    if (variant === 'list') {
      return (
        <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-4 bg-primary/10 flex items-center justify-center">
              {tool.icon}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-medium flex items-center">
                {title}
                {tool.isNew && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                  {language === 'de' ? 'Neu' : 'New'}
                </span>}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="p-4">
              <Button variant="default" size="sm" asChild>
                <a href={tool.path}>{language === 'de' ? 'Öffnen' : 'Open'}</a>
              </Button>
            </div>
          </div>
        </Card>
      );
    }
    
    return (
      <Card key={tool.id} className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            {tool.icon}
          </div>
          <div>
            <h3 className="font-medium flex items-center">
              {title}
              {tool.isNew && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {language === 'de' ? 'Neu' : 'New'}
              </span>}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="p-4">
          <Button variant="default" className="w-full" asChild>
            <a href={tool.path}>{language === 'de' ? 'Tool öffnen' : 'Open Tool'}</a>
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'de' ? 'Investment Tools' : 'Investment Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Alle Tools für Ihre Immobilieninvestitionen an einem Ort'
            : 'All tools for your real estate investments in one place'}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={language === 'de' ? 'Tools durchsuchen...' : 'Search tools...'}
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
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title={language === 'de' ? 'Filter' : 'Filter'}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title={language === 'de' ? 'Favoriten' : 'Favorites'}>
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {language === 'de' ? 'Alle Tools' : 'All Tools'}
          </TabsTrigger>
          <TabsTrigger value="market">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Marktrelevant' : 'Market Relevant'}
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Zuletzt verwendet' : 'Recently Used'}
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Favoriten' : 'Favorites'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">
                {language === 'de' ? 'Keine Tools gefunden' : 'No tools found'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === 'de' 
                  ? `Es wurden keine Tools für "${searchQuery}" gefunden` 
                  : `No tools found matching "${searchQuery}"`
                }
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                {language === 'de' ? 'Suche zurücksetzen' : 'Clear search'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => renderToolCard(tool))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="market">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {language === 'de' ? `Relevante Tools für ${userMarket.toUpperCase()}` : `Relevant Tools for ${userMarket.toUpperCase()}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getMarketSpecificTools().map(tool => renderToolCard(tool))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {language === 'de' ? 'Zuletzt verwendete Tools' : 'Recently Used Tools'}
            </h2>
            <div className="space-y-4">
              {recentTools.map(tool => renderToolCard(tool, 'list'))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {language === 'de' ? 'Ihre Favoriten' : 'Your Favorites'}
            </h2>
            <div className="space-y-4">
              {favoriteTools.map(tool => renderToolCard(tool, 'list'))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-medium mb-2">
          {language === 'de' ? 'Empfohlene Tools' : 'Featured Tools'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {getFeaturedTools().map(tool => (
            <Button 
              key={tool.id}
              variant="outline" 
              className="justify-start bg-card hover:bg-accent" 
              asChild
            >
              <a href={tool.path}>
                <div className="mr-2 bg-primary/10 p-1 rounded">
                  {tool.icon}
                </div>
                <span>{language === 'de' ? tool.titleDe : tool.titleEn}</span>
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
