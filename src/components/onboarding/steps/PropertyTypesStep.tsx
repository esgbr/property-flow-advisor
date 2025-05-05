
import React from 'react';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const PropertyTypesStep: React.FC<OnboardingStepProps> = ({ data, updateData }) => {
  const { t } = useLanguage();
  
  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      updateData({ 
        ...data, 
        preferredPropertyTypes: [...data.preferredPropertyTypes, type] 
      });
    } else {
      updateData({
        ...data,
        preferredPropertyTypes: data.preferredPropertyTypes.filter(t => t !== type)
      });
    }
  };
  
  const propertyTypes = ['residential', 'commercial', 'industrial', 'land', 'vacation-rental'];
  
  return (
    <div className="space-y-4">
      {propertyTypes.map((type) => (
        <div key={type} className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id={type} 
            className="checkbox"
            checked={data.preferredPropertyTypes.includes(type)}
            onChange={(e) => handleTypeChange(type, e.target.checked)}
          />
          <Label htmlFor={type} className="cursor-pointer">{t(type)}</Label>
        </div>
      ))}
    </div>
  );
};

export default PropertyTypesStep;
