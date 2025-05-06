import React, { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Euro, DollarSign, Building, ChartBar, Home, AlertCircle } from 'lucide-react';
import { useUserPreferences, InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { cn } from '@/lib/utils';

interface MarketFeature {
  id: string;
  title: { en: string; de: string };
  description: { en: string; de: string };
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'outline' | 'secondary';
}

interface MarketSpecificFeaturesProps {
  className?: string;
  compact?: boolean;
}

// Market-specific feature collections
const marketFeatures: Record<InvestmentMarket, MarketFeature[]> = {
  'global': [
    {
      id: 'global-trends',
      title: { en: 'Global Trends', de: 'Globale Trends' },
      description: {
        en: 'Access insights on global real estate market trends',
        de: 'Zugriff auf Erkenntnisse zu globalen Immobilienmarkttrends'
      },
      icon: <Map className="h-4 w-4" />
    },
    {
      id: 'multi-currency',
      title: { en: 'Multi-Currency', de: 'Mehrwährung' },
      description: {
        en: 'Convert and compare investments across different currencies',
        de: 'Konvertieren und vergleichen Sie Investitionen in verschiedenen Währungen'
      },
      icon: <DollarSign className="h-4 w-4" />
    }
  ],
  'germany': [
    {
      id: 'grunderwerbsteuer',
      title: { en: 'Real Estate Transfer Tax', de: 'Grunderwerbsteuer' },
      description: {
        en: 'Calculate German real estate transfer tax by federal state',
        de: 'Berechnen Sie die Grunderwerbsteuer nach Bundesland'
      },
      icon: <Euro className="h-4 w-4" />,
      badge: 'DE'
    },
    {
      id: 'afa',
      title: { en: 'AfA Calculator', de: 'AfA-Rechner' },
      description: {
        en: 'German-specific depreciation calculations for properties',
        de: 'Deutsche spezifische Abschreibungsberechnungen für Immobilien'
      },
      icon: <Building className="h-4 w-4" />,
      badge: 'DE'
    }
  ],
  'usa': [
    {
      id: 'property-tax',
      title: { en: 'Property Tax', de: 'Grundsteuer' },
      description: {
        en: 'Calculate US property taxes based on state and county',
        de: 'Berechnen Sie US-Grundsteuern nach Bundesstaat und Bezirk'
      },
      icon: <Home className="h-4 w-4" />,
      badge: 'US'
    },
    {
      id: '1031-exchange',
      title: { en: '1031 Exchange', de: '1031 Exchange' },
      description: {
        en: 'Calculate potential tax savings with 1031 exchanges',
        de: 'Berechnen Sie potenzielle Steuerersparnisse mit 1031-Tauschgeschäften'
      },
      icon: <ChartBar className="h-4 w-4" />,
      badge: 'US'
    }
  ],
  'austria': [
    {
      id: 'immo-est',
      title: { en: 'ImmoESt Calculator', de: 'ImmoESt-Rechner' },
      description: {
        en: 'Calculate Austrian real estate income tax',
        de: 'Berechnen Sie die österreichische Immobilienertragsteuer'
      },
      icon: <Euro className="h-4 w-4" />,
      badge: 'AT'
    }
  ],
  'switzerland': [
    {
      id: 'lex-koller',
      title: { en: 'Lex Koller Check', de: 'Lex Koller Prüfung' },
      description: {
        en: 'Check if Lex Koller restrictions apply to your investment',
        de: 'Prüfen Sie, ob Lex Koller-Beschränkungen für Ihre Investition gelten'
      },
      icon: <AlertCircle className="h-4 w-4" />,
      badge: 'CH'
    }
  ],
  'canada': [
    {
      id: 'non-resident-tax',
      title: { en: 'Non-Resident Tax', de: 'Nichtansässigen-Steuer' },
      description: {
        en: 'Calculate Canadian non-resident speculation tax',
        de: 'Berechnen Sie die kanadische Spekulationssteuer für Nichtansässige'
      },
      icon: <Home className="h-4 w-4" />,
      badge: 'CA'
    }
  ],
  'france': [
    {
      id: 'french-tax',
      title: { en: 'French Property Tax', de: 'Französische Grundsteuer' },
      description: {
        en: 'Calculate French property taxes and fees',
        de: 'Berechnen Sie französische Immobiliensteuern und Gebühren'
      },
      icon: <Euro className="h-4 w-4" />,
      badge: 'FR'
    }
  ]
};

const MarketSpecificFeatures: React.FC<MarketSpecificFeaturesProps> = ({ 
  className = '',
  compact = false
}) => {
  const { preferences } = useUserPreferences();
  const { language } = useLanguage();
  const { getCurrentMarket } = useMarketFilter();
  
  const currentMarket = getCurrentMarket();
  
  // Get features for the current market
  const features = useMemo(() => {
    // Always include global features
    const globalFeatures = marketFeatures['global'];
    
    // If not on global, add market-specific features
    if (currentMarket !== 'global') {
      return [...globalFeatures, ...marketFeatures[currentMarket]];
    }
    
    return globalFeatures;
  }, [currentMarket]);
  
  if (features.length === 0) {
    return null;
  }
  
  if (compact) {
    return (
      <div className={cn("grid gap-3", className)}>
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center p-2 bg-muted/40 rounded-md hover:bg-muted transition-colors"
          >
            <div className="mr-3 p-2 bg-primary/10 rounded-md text-primary">
              {feature.icon}
            </div>
            <div>
              <div className="font-medium text-sm">
                {feature.title[language as keyof typeof feature.title]}
              </div>
            </div>
            {feature.badge && (
              <Badge
                variant={feature.badgeVariant || 'outline'}
                className="ml-auto text-xs"
              >
                {feature.badge}
              </Badge>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Map className="h-5 w-5 mr-2" />
          {language === 'de' ? 'Marktspezifische Funktionen' : 'Market-Specific Features'}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col sm:flex-row sm:items-center p-3 bg-muted/40 rounded-md hover:bg-muted transition-colors"
          >
            <div className="mr-3 p-2 bg-primary/10 rounded-md text-primary mb-2 sm:mb-0 self-start">
              {feature.icon}
            </div>
            <div>
              <div className="font-medium mb-1 flex items-center">
                {feature.title[language as keyof typeof feature.title]}
                {feature.badge && (
                  <Badge
                    variant={feature.badgeVariant || 'outline'}
                    className="ml-2 text-xs"
                  >
                    {feature.badge}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {feature.description[language as keyof typeof feature.description]}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MarketSpecificFeatures;
