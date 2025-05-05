
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';
import { OnboardingStepProps } from '../types';

const CompleteStep: React.FC<OnboardingStepProps> = ({ data }) => {
  const { t, language } = useLanguage();
  
  const getLocalizedMarketName = (marketId: string): string => {
    switch (marketId) {
      case 'germany': 
        return language === 'de' ? 'Deutschland' : 'Germany';
      case 'usa': 
        return language === 'de' ? 'die USA' : 'the USA';
      case 'austria': 
        return language === 'de' ? 'Österreich' : 'Austria';
      case 'switzerland':
        return language === 'de' ? 'die Schweiz' : 'Switzerland';
      case 'france':
        return language === 'de' ? 'Frankreich' : 'France';
      case 'canada':
        return language === 'de' ? 'Kanada' : 'Canada';
      default:
        return marketId;
    }
  };
  
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
              ? `Spezifische Tools für ${getLocalizedMarketName(data.investmentMarket)} wurden für Sie vorbereitet.` 
              : `Specific tools for ${getLocalizedMarketName(data.investmentMarket)} have been prepared for you.`}
          </span>
        )}
      </p>
    </div>
  );
};

export default CompleteStep;
