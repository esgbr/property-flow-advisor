
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const ExperienceStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();
  
  const handleExperienceChange = (value: string) => {
    updateData({ 
      ...data, 
      experienceLevel: value as 'beginner' | 'intermediate' | 'advanced' | 'expert' 
    });
  };
  
  return (
    <RadioGroup
      value={data.experienceLevel}
      onValueChange={handleExperienceChange}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="beginner" id="beginner" />
        <Label htmlFor="beginner" className="cursor-pointer">{t('beginner')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="intermediate" id="intermediate" />
        <Label htmlFor="intermediate" className="cursor-pointer">{t('intermediate')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="advanced" id="advanced" />
        <Label htmlFor="advanced" className="cursor-pointer">{t('advanced')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="expert" id="expert" />
        <Label htmlFor="expert" className="cursor-pointer">{t('expert')}</Label>
      </div>
    </RadioGroup>
  );
};

export default ExperienceStep;
