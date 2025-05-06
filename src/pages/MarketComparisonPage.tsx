import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnhancedMarket } from '@/hooks/use-enhanced-market';
import { getLocalizedMarketName } from '@/utils/marketHelpers';

const MarketComparisonPage: React.FC = () => {
  const { language } = useLanguage();
  const marketData = useEnhancedMarket();
  
  const currentMarketName = getLocalizedMarketName(marketData.userMarket, language);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'de' ? 'Marktvergleich' : 'Market Comparison'}
      </h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-lg">
            {language === 'de'
              ? `Aktueller Markt: ${currentMarketName}`
              : `Current Market: ${currentMarketName}`}
          </p>
          <p className="text-muted-foreground mt-2">
            {language === 'de'
              ? 'Vergleichen Sie verschiedene Immobilienmärkte und ihre Leistungskennzahlen.'
              : 'Compare different real estate markets and their performance metrics.'}
          </p>
        </CardContent>
      </Card>
      
      {/* More comparison content will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market comparison cards will go here */}
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              {language === 'de'
                ? 'Marktvergleichskomponenten werden in Kürze hinzugefügt.'
                : 'Market comparison components will be added soon.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketComparisonPage;
