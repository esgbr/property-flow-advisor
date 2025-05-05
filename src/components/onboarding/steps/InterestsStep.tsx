
import React from 'react';
import { Label } from '@/components/ui/label';
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
  
  const interests = ['market-analysis', 'property-management', 'financing', 'tax-strategies', 'renovation', 'legal'];
  
  return (
    <div className="space-y-4">
      {interests.map((interest) => (
        <div key={interest} className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id={interest} 
            className="checkbox"
            checked={data.interests.includes(interest)}
            onChange={(e) => handleInterestChange(interest, e.target.checked)}
          />
          <Label htmlFor={interest} className="cursor-pointer">{t(interest)}</Label>
        </div>
      ))}
    </div>
  );
};

export default InterestsStep;
