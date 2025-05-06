
import React from 'react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Calculator, Globe, Home, Map, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const MarketAwareDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  const { preferences } = useUserPreferences();
  
  // Market-specific content
  const marketSpecificContent = {
    germany: {
      title: 'German Real Estate Tools',
      description: 'Tools and resources specifically for the German real estate market',
      featuredTools: [
        { id: 'grunderwerbsteuer', name: 'Property Transfer Tax Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/german-investor?tool=grunderwerbsteuer' },
        { id: 'mietkauf', name: 'Rent-to-Own Calculator', icon: <Home className="h-5 w-5 text-primary" />, path: '/german-investor?tool=mietkauf' },
        { id: 'mietspiegel', name: 'Rental Index Comparator', icon: <Map className="h-5 w-5 text-primary" />, path: '/german-investor?tool=mietspiegel' }
      ]
    },
    usa: {
      title: 'US Real Estate Tools',
      description: 'Tools and resources specifically for the US real estate market',
      featuredTools: [
        { id: '1031exchange', name: '1031 Exchange Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=1031exchange' },
        { id: 'caprate', name: 'Cap Rate Analysis', icon: <TrendingUp className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=caprate' },
        { id: 'markettrends', name: 'Market Trends', icon: <Map className="h-5 w-5 text-primary" />, path: '/us-real-estate-tools?tool=markettrends' }
      ]
    },
    austria: {
      title: 'Austrian Real Estate Tools',
      description: 'Tools and resources specifically for the Austrian real estate market',
      featuredTools: [
        { id: 'grunderwerbsteuer', name: 'Property Transfer Tax Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/german-investor?tool=grunderwerbsteuer' },
        { id: 'immoertragsteuer', name: 'Real Estate Income Tax', icon: <TrendingUp className="h-5 w-5 text-primary" />, path: '/german-investor?tool=immoertragsteuer' },
        { id: 'mietrecht', name: 'Rental Law Guide', icon: <Home className="h-5 w-5 text-primary" />, path: '/german-investor?tool=mietrecht' }
      ]
    },
    default: {
      title: 'Global Real Estate Tools',
      description: 'General tools and resources for real estate investors',
      featuredTools: [
        { id: 'roicalculator', name: 'ROI Calculator', icon: <Calculator className="h-5 w-5 text-primary" />, path: '/calculators?tab=roi' },
        { id: 'portfoliodashboard', name: 'Portfolio Dashboard', icon: <Building className="h-5 w-5 text-primary" />, path: '/investor-dashboard' },
        { id: 'marketcomparison', name: 'Market Comparison Tool', icon: <Globe className="h-5 w-5 text-primary" />, path: '/features?feature=marketcomparison' }
      ]
    }
  };
  
  // Get content based on user market
  const getContent = () => {
    if (userMarket === 'germany' || userMarket === 'austria') {
      return marketSpecificContent[userMarket];
    } else if (userMarket === 'usa' || userMarket === 'canada') {
      return marketSpecificContent.usa;
    } else {
      return marketSpecificContent.default;
    }
  };
  
  const content = getContent();
  const marketDisplay = getMarketDisplayName();

  return (
    <div className="space-y-6">
      {userMarket && (
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
            <div className="grid gap-4 md:grid-cols-3">
              {content.featuredTools.map((tool) => (
                <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => navigate(tool.path)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      {tool.icon}
                      <CardTitle className="text-lg ml-2">{tool.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
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
