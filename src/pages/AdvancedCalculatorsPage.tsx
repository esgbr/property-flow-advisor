import React from 'react';
// Update import to use type import for MarketSpecificFeature
import { useMarketFilter } from '@/hooks/use-market-filter';
import type { MarketSpecificFeature } from '@/hooks/use-market-filter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AdvancedCalculatorsPage: React.FC = () => {
  const { language } = useLanguage();
  const marketFilter = useMarketFilter();

  // Example market-specific feature configuration
  const features: MarketSpecificFeature[] = [
    {
      id: 'calculator1',
      title: language === 'de' ? 'Hypothekenrechner' : 'Mortgage Calculator',
      description: language === 'de' ? 'Berechnen Sie Ihre monatlichen Hypothekenzahlungen.' : 'Calculate your monthly mortgage payments.',
      markets: ['usa', 'canada']
    },
    {
      id: 'calculator2',
      title: language === 'de' ? 'Mietrenditerechner' : 'Rental Yield Calculator',
      description: language === 'de' ? 'Ermitteln Sie die Rendite Ihrer Mietimmobilien.' : 'Determine the yield of your rental properties.',
      markets: ['germany', 'austria', 'switzerland']
    },
    {
      id: 'calculator3',
      title: language === 'de' ? 'Immobilienwertrechner' : 'Property Value Calculator',
      description: language === 'de' ? 'Schätzen Sie den Wert Ihrer Immobilie.' : 'Estimate the value of your property.',
      markets: ['usa', 'canada', 'germany', 'austria', 'switzerland']
    }
  ];

  // Filter features based on the user's market
  const filteredFeatures = marketFilter.filterFeaturesByMarket(features);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'de' ? 'Erweiterte Rechner' : 'Advanced Calculators'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {language === 'de'
                  ? 'Dieser Rechner hilft Ihnen, fundierte Entscheidungen zu treffen.'
                  : 'This calculator helps you make informed decisions.'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedCalculatorsPage;
