import React, { useMemo } from 'react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, Globe, Home, Map, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { LazyLoad } from '@/hooks/use-lazy-loading';

// Define typed interfaces for better organization
interface ToolItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  marketSpecific?: string[];
  description?: string;
}

interface MarketContent {
  title: string;
  description: string;
  featuredTools: ToolItem[];
}

const MarketAwareDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  const { preferences } = useUserPreferences();
  
  // Market-specific content with enhanced descriptions
  const marketSpecificContent: Record<string, MarketContent> = {
    germany: {
      title: 'German Real Estate Tools',
      description: 'Tools and resources specifically for the German real estate market',
      featuredTools: [
        { 
          id: 'grunderwerbsteuer', 
          name: 'Property Transfer Tax Calculator', 
          icon: <Calculator className="h-5 w-5 text-primary" />, 
          path: '/german-investor?tool=grunderwerbsteuer', 
          marketSpecific: ['germany', 'austria'],
          description: 'Calculate the Grunderwerbsteuer (property transfer tax) for your German property purchase' 
        },
        { 
          id: 'mietkauf', 
          name: 'Rent-to-Own Calculator', 
          icon: <Home className="h-5 w-5 text-primary" />, 
          path: '/german-investor?tool=mietkauf', 
          marketSpecific: ['germany'],
          description: 'Analyze rent-to-own arrangements in the German market'
        },
        { 
          id: 'mietspiegel', 
          name: 'Rental Index Comparator', 
          icon: <Map className="h-5 w-5 text-primary" />, 
          path: '/german-investor?tool=mietspiegel', 
          marketSpecific: ['germany'],
          description: 'Compare rental rates against the local Mietspiegel (rent index)'
        },
        {
          id: 'afa', 
          name: 'Depreciation Calculator', 
          icon: <TrendingUp className="h-5 w-5 text-primary" />, 
          path: '/german-investor?tool=afa', 
          marketSpecific: ['germany'],
          description: 'Calculate AfA depreciation benefits for German property investments'
        }
      ]
    },
    austria: {
      title: 'Austrian Real Estate Tools',
      description: 'Tools and resources specifically for the Austrian real estate market',
      featuredTools: [
        { id: 'grunderwerbsteuer', name: 'Property Transfer Tax Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/german-investor?tool=grunderwerbsteuer', marketSpecific: ['germany', 'austria'] },
        { id: 'immoertragsteuer', name: 'Real Estate Income Tax', icon: <TrendingUp className="h-5 w-5 text-primary" />, path: '/german-investor?tool=immoertragsteuer', marketSpecific: ['austria'] },
        { id: 'mietrecht', name: 'Rental Law Guide', icon: <Home className="h-5 w-5 text-primary" />, path: '/german-investor?tool=mietrecht', marketSpecific: ['austria'] }
      ]
    },
    usa: {
      title: 'US Real Estate Tools',
      description: 'Tools and resources specifically for the US real estate market',
      featuredTools: [
        { id: '1031exchange', name: '1031 Exchange Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=1031exchange', marketSpecific: ['usa'] },
        { id: 'caprate', name: 'Cap Rate Analysis', icon: <TrendingUp className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=caprate', marketSpecific: ['usa'] },
        { id: 'markettrends', name: 'Market Trends', icon: <Map className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=markettrends', marketSpecific: ['usa'] }
      ]
    },
    default: {
      title: 'Global Real Estate Tools',
      description: 'General tools and resources for real estate investors',
      featuredTools: [
        { id: 'roicalculator', name: 'ROI Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/calculators?tab=roi', marketSpecific: ['global'] },
        { id: 'portfoliodashboard', name: 'Portfolio Dashboard', icon: <Building className="h-5 w-5 text-primary" />, path: '/investor-dashboard', marketSpecific: ['global'] },
        { id: 'marketcomparison', name: 'Market Comparison Tool', icon: <Globe className="h-5 w-5 text-primary" />, path: '/features?feature=marketcomparison', marketSpecific: ['global'] }
      ]
    }
  };
  
  // Get content based on user market
  const getContent = () => {
    if (userMarket === 'germany') {
      return marketSpecificContent.germany;
    } else if (userMarket === 'austria') {
      return marketSpecificContent.austria;
    } else if (userMarket === 'usa' || userMarket === 'canada') {
      return marketSpecificContent.usa;
    } else {
      return marketSpecificContent.default;
    }
  };
  
  const content = getContent();
  const marketDisplay = getMarketDisplayName();
  
  // Filter tools to only show those relevant to the current market
  const filteredTools = useMemo(() => {
    return content.featuredTools.filter(tool => {
      if (!tool.marketSpecific) return true;
      return tool.marketSpecific.includes(userMarket) || tool.marketSpecific.includes('global');
    });
  }, [content, userMarket]);
  
  return (
    <div className="space-y-6">
      {userMarket && (
        <LazyLoad>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                {marketDisplay} {t('marketSelected')}
              </CardTitle>
              <CardDescription>
                {t('showingRelevantTools')} {marketDisplay.toLowerCase()} {t('market')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => navigate(tool.path)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        {tool.icon}
                        <CardTitle className="text-lg ml-2">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {tool.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                      )}
                      <Button variant="ghost" size="sm" className="text-primary">
                        {t('open')} →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button onClick={() => navigate(userMarket === 'germany' || userMarket === 'austria' ? 
                  '/deutsche-immobilien-tools' : 
                  userMarket === 'usa' || userMarket === 'canada' ? 
                  '/us-real-estate-tools' : 
                  '/features')}>
                  {t('viewAllTools')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </LazyLoad>
      )}
      
      {!userMarket && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              {t('selectInvestmentMarket')}
            </CardTitle>
            <CardDescription>
              {t('customizeExperience')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/settings')}>
              {t('setPreferences')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketAwareDashboard;
