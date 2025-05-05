
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t, language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    // Only set language if it's a valid SupportedLanguage
    if (value === 'en' || value === 'de' || value === 'fr' || value === 'es' || value === 'it') {
      setLanguage(value as SupportedLanguage);
    }
  };
  
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <h3 className="text-xl font-medium">{t('welcomeToPropertyFlowAdvisor')}</h3>
      <p className="text-muted-foreground">{t('yourPersonalRealEstateInvestmentCompanion')}</p>
      <div className="w-full">
        <Label htmlFor="name">{t('yourName')}</Label>
        <Input
          id="name"
          placeholder={t('enterYourName')}
          value={data.name}
          onChange={(e) => updateData({ ...data, name: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div className="w-full mt-4">
        <Label>{t('chooseLanguage')}</Label>
        <Tabs 
          defaultValue={language} 
          className="mt-1" 
          onValueChange={handleLanguageChange}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="de">Deutsch</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default WelcomeStep;
