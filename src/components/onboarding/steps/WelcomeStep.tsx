
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t, language, setLanguage } = useLanguage();
  
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
          onValueChange={(value) => setLanguage(value)}
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="de">Deutsch</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default WelcomeStep;
