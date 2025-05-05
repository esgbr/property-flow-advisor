
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { OnboardingStepProps } from '../types';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';
import { availableMarkets } from '@/utils/marketHelpers';

const MarketStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t, language } = useLanguage();
  
  const handleMarketChange = (value: string) => {
    updateData({ 
      ...data, 
      investmentMarket: value as InvestmentMarket 
    });
  };
  
  const marketSpecificInfoText = {
    germany: {
      de: 'Wir haben spezielle Tools für den deutschen Immobilienmarkt, die für Sie angepasst werden.',
      en: 'We have specialized tools for the German real estate market that will be customized for you.'
    },
    usa: {
      de: 'US-spezifische Tools wie 1031 Exchange und andere werden für Sie verfügbar sein.',
      en: 'US-specific tools like 1031 Exchange and others will be available to you.'
    }
  };
  
  const getMarketInfoText = (marketId: string) => {
    if (marketId in marketSpecificInfoText) {
      return marketSpecificInfoText[marketId as keyof typeof marketSpecificInfoText][language === 'de' ? 'de' : 'en'];
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-4">
        <Globe className="h-16 w-16 text-primary opacity-80" aria-hidden="true" />
      </div>
      
      <Select
        value={data.investmentMarket}
        onValueChange={handleMarketChange}
        aria-label={t('selectAMarket')}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('selectAMarket')} />
        </SelectTrigger>
        <SelectContent>
          {availableMarkets.map(market => (
            <SelectItem key={market.id} value={market.id}>
              {t(market.id) || market.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {data.investmentMarket && getMarketInfoText(data.investmentMarket) && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <p className="text-sm text-center">
            {getMarketInfoText(data.investmentMarket)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketStep;
