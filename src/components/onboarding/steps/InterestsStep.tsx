
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const InterestsStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();
  
  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      updateData({ 
        ...data, 
        interests: [...data.interests, interest] 
      });
    } else {
      updateData({
        ...data,
        interests: data.interests.filter(i => i !== interest)
      });
    }
  };
  
  const interests = [
    { id: 'market-analysis', label: t('marketAnalysis') },
    { id: 'property-management', label: t('propertyManagement') },
    { id: 'financing', label: t('financing') },
    { id: 'tax-strategies', label: t('taxStrategies') },
    { id: 'renovation', label: t('renovation') },
    { id: 'legal', label: t('legal') }
  ];
  
  return (
    <div className="space-y-4">
      {interests.map((interest) => (
        <div key={interest.id} className="flex items-center space-x-3">
          <Checkbox 
            id={interest.id} 
            checked={data.interests.includes(interest.id)}
            onCheckedChange={(checked) => handleInterestChange(interest.id, checked === true)}
            aria-labelledby={`label-${interest.id}`}
          />
          <Label 
            htmlFor={interest.id} 
            id={`label-${interest.id}`}
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {interest.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default InterestsStep;
