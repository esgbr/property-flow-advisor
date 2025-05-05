
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { OnboardingStepProps } from '../types';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

const MarketStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t, language } = useLanguage();
  
  const handleMarketChange = (value: string) => {
    updateData({ 
      ...data, 
      investmentMarket: value as InvestmentMarket 
    });
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
          <SelectItem value="germany">{t('germany')}</SelectItem>
          <SelectItem value="austria">{t('austria')}</SelectItem>
          <SelectItem value="switzerland">{t('switzerland')}</SelectItem>
          <SelectItem value="france">{t('france')}</SelectItem>
          <SelectItem value="usa">{t('unitedStates')}</SelectItem>
          <SelectItem value="canada">{t('canada')}</SelectItem>
          <SelectItem value="other">{t('otherMarket')}</SelectItem>
        </SelectContent>
      </Select>
      
      {data.investmentMarket === 'germany' && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <p className="text-sm text-center">
            {language === 'de' 
              ? 'Wir haben spezielle Tools für den deutschen Immobilienmarkt, die für Sie angepasst werden.'
              : 'We have specialized tools for the German real estate market that will be customized for you.'}
          </p>
        </div>
      )}
      
      {data.investmentMarket === 'usa' && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <p className="text-sm text-center">
            {language === 'de' 
              ? 'US-spezifische Tools wie 1031 Exchange und andere werden für Sie verfügbar sein.'
              : 'US-specific tools like 1031 Exchange and others will be available to you.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketStep;
