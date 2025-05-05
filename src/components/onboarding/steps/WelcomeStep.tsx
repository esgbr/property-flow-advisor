
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    // Only set language if it's a valid SupportedLanguage
    if (value === 'en' || value === 'de' || value === 'fr' || value === 'es' || value === 'it') {
      setLanguage(value as SupportedLanguage);
    }
  };
  
  // Get only enabled languages for the tab list
  const enabledLanguages = availableLanguages.filter(lang => lang.enabled);
  
  return (
    <div className="flex flex-col items-center text-center space-y-6 overflow-y-auto max-h-[70vh] p-4">
      <h2 className="text-2xl font-medium">{t('welcomeToPropertyFlowAdvisor')}</h2>
      <p className="text-muted-foreground">{t('yourPersonalRealEstateInvestmentCompanion')}</p>
      
      <div className="w-full">
        <Label htmlFor="name" className="mb-1 block">{t('yourName')}</Label>
        <Input
          id="name"
          placeholder={t('enterYourName')}
          value={data.name}
          onChange={(e) => updateData({ ...data, name: e.target.value })}
          className="mt-1"
          aria-required="true"
          autoFocus
          autoComplete="name"
        />
      </div>
      
      <div className="w-full mt-2">
        <Label htmlFor="language-selector" className="mb-1 block">{t('chooseLanguage')}</Label>
        <Tabs 
          defaultValue={language} 
          className="mt-1" 
          onValueChange={handleLanguageChange}
          id="language-selector"
        >
          <TabsList className="grid grid-cols-3 w-full">
            {enabledLanguages.slice(0, 3).map(lang => (
              <TabsTrigger 
                key={lang.code} 
                value={lang.code}
                aria-label={`${lang.name} (${lang.nativeName})`}
              >
                <span className="mr-1" aria-hidden="true">{lang.flag}</span> {lang.nativeName}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <p className="text-sm text-muted-foreground mt-4">
        {t('selectYourPreferredLanguage')}
      </p>
    </div>
  );
};

export default WelcomeStep;
