
import React from 'react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, Building, FileText, FileSpreadsheet, BarChartHorizontal, ArrowRight } from 'lucide-react';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Market-specific feature type
interface MarketFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  beta?: boolean;
}

// Defines features specific to each market
const marketSpecificFeatures: Record<InvestmentMarket, MarketFeature[]> = {
  'germany': [
    {
      id: 'grunderwerbsteuer',
      title: 'Grunderwerbsteuer-Rechner',
      description: 'Berechnen Sie die Grunderwerbsteuer für verschiedene Bundesländer in Deutschland',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/grunderwerbsteuer'
    },
    {
      id: 'afaRechner',
      title: 'AfA-Rechner',
      description: 'Abschreibungen für deutsche Immobilien berechnen',
      icon: <FileSpreadsheet className="h-5 w-5 text-primary" />,
      path: '/calculators/afa'
    },
    {
      id: 'mietrecht',
      title: 'Mietrecht-Guide',
      description: 'Praxisorientierter Leitfaden zum deutschen Mietrecht',
      icon: <FileText className="h-5 w-5 text-primary" />,
      path: '/guides/mietrecht',
      beta: true
    }
  ],
  'austria': [
    {
      id: 'grunderwerbsteuer-at',
      title: 'Grunderwerbsteuer-Rechner',
      description: 'Berechnen Sie die Grunderwerbsteuer für Immobilien in Österreich',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/grunderwerbsteuer-at'
    },
    {
      id: 'immoErtragsteuer',
      title: 'ImmoESt-Rechner',
      description: 'Immobilienertragsteuer für Österreich berechnen',
      icon: <FileSpreadsheet className="h-5 w-5 text-primary" />,
      path: '/calculators/immobilienertragsteuer'
    }
  ],
  'switzerland': [
    {
      id: 'liegenschaftssteuer',
      title: 'Liegenschaftssteuer-Rechner',
      description: 'Berechnung der Liegenschaftssteuer für verschiedene Kantone',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/liegenschaftssteuer'
    },
    {
      id: 'eigenmietwert',
      title: 'Eigenmietwert-Rechner',
      description: 'Berechnung des steuerbaren Eigenmietwerts',
      icon: <Building className="h-5 w-5 text-primary" />,
      path: '/calculators/eigenmietwert'
    }
  ],
  'usa': [
    {
      id: '1031-exchange',
      title: '1031 Exchange Calculator',
      description: 'Calculate tax deferral through a 1031 property exchange',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/1031-exchange'
    },
    {
      id: 'property-tax',
      title: 'Property Tax Estimator',
      description: 'Estimate property taxes across different US states',
      icon: <BarChartHorizontal className="h-5 w-5 text-primary" />,
      path: '/calculators/property-tax'
    },
    {
      id: 'depreciation-us',
      title: 'US Depreciation Calculator',
      description: 'Calculate depreciation for US real estate investments',
      icon: <FileSpreadsheet className="h-5 w-5 text-primary" />,
      path: '/calculators/depreciation-us',
      beta: true
    }
  ],
  'canada': [
    {
      id: 'capital-gains-tax',
      title: 'Capital Gains Tax Calculator',
      description: 'Calculate capital gains tax for Canadian real estate',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/capital-gains-ca'
    },
    {
      id: 'foreign-buyer-tax',
      title: 'Foreign Buyer Tax Calculator',
      description: 'Calculate additional taxes for non-resident buyers',
      icon: <FileSpreadsheet className="h-5 w-5 text-primary" />,
      path: '/calculators/foreign-buyer-tax'
    }
  ],
  'france': [
    {
      id: 'frais-de-notaire',
      title: 'Frais de Notaire Calculator',
      description: 'Calculate notary fees for French real estate transactions',
      icon: <Calculator className="h-5 w-5 text-primary" />,
      path: '/calculators/frais-de-notaire'
    },
    {
      id: 'taxe-fonciere',
      title: 'Taxe Foncière Estimator',
      description: 'Estimate property tax (taxe foncière) for French properties',
      icon: <Building className="h-5 w-5 text-primary" />,
      path: '/calculators/taxe-fonciere'
    }
  ],
  'global': [],
  'other': [],
  '': []
};

interface MarketSpecificFeaturesProps {
  limit?: number;
  showTitle?: boolean;
  showViewAll?: boolean;
}

const MarketSpecificFeatures: React.FC<MarketSpecificFeaturesProps> = ({ 
  limit = 3, 
  showTitle = true,
  showViewAll = true
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { userMarket, getMarketDisplayName } = useMarketFilter();
  
  // Get features for current market
  const features = userMarket ? marketSpecificFeatures[userMarket as InvestmentMarket] || [] : [];
  
  // Limit the number of features shown
  const displayedFeatures = features.slice(0, limit);
  
  // If no market-specific features or not a supported market, don't show anything
  if (!userMarket || displayedFeatures.length === 0) {
    return null;
  }
  
  const marketName = getMarketDisplayName();

  return (
    <Card className="border-primary/20 bg-primary/5">
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{marketName} {t('marketSpecificTools')}</CardTitle>
              <CardDescription>
                {t('toolsForSpecificMarket', { market: marketName })}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {marketName}
            </Badge>
          </div>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayedFeatures.map((feature) => (
            <Card key={feature.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate(feature.path)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {feature.icon}
                    <CardTitle className="text-lg ml-2">{feature.title}</CardTitle>
                  </div>
                  {feature.beta && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">Beta</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <Button variant="ghost" size="sm" className="text-primary">
                  {t('open')} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {showViewAll && features.length > limit && (
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate(`/market-tools/${userMarket}`)}>
              {t('viewMarketSpecificTools')} ({features.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketSpecificFeatures;
