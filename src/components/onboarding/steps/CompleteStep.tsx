
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';
import { OnboardingStepProps } from '../types';
import { getLocalizedMarketName } from '@/utils/marketHelpers';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

const CompleteStep: React.FC<OnboardingStepProps> = ({ data }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="rounded-full bg-primary/10 p-3">
        <Check className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-medium">{t('profileCompleted')}</h3>
      <p className="text-muted-foreground">
        {t('weveCustomizedYourExperience')}
        {data.investmentMarket && (
          <span className="block mt-2">
            {language === 'de' 
              ? `Spezifische Tools für ${getLocalizedMarketName(data.investmentMarket as InvestmentMarket, 'de')} wurden für Sie vorbereitet.` 
              : `Specific tools for ${getLocalizedMarketName(data.investmentMarket as InvestmentMarket, 'en')} have been prepared for you.`}
          </span>
        )}
      </p>
    </div>
  );
};

export default CompleteStep;
