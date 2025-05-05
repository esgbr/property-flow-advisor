
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
  
  const experienceLevels = [
    { id: 'beginner', label: t('beginner') },
    { id: 'intermediate', label: t('intermediate') },
    { id: 'advanced', label: t('advanced') },
    { id: 'expert', label: t('expert') }
  ];
  
  return (
    <RadioGroup
      value={data.experienceLevel}
      onValueChange={handleExperienceChange}
      className="space-y-4"
    >
      {experienceLevels.map((level) => (
        <div key={level.id} className="flex items-center space-x-3">
          <RadioGroupItem value={level.id} id={level.id} aria-labelledby={`label-${level.id}`} />
          <Label 
            htmlFor={level.id} 
            id={`label-${level.id}`} 
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {level.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ExperienceStep;
