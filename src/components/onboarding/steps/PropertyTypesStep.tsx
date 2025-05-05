
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  
  const propertyTypes = [
    { id: 'residential', label: t('residential') },
    { id: 'commercial', label: t('commercial') },
    { id: 'industrial', label: t('industrial') },
    { id: 'land', label: t('land') },
    { id: 'vacation-rental', label: t('vacationRental') }
  ];
  
  return (
    <div className="space-y-4">
      {propertyTypes.map((type) => (
        <div key={type.id} className="flex items-center space-x-3">
          <Checkbox 
            id={type.id} 
            checked={data.preferredPropertyTypes.includes(type.id)}
            onCheckedChange={(checked) => handleTypeChange(type.id, checked === true)}
            aria-labelledby={`label-${type.id}`}
          />
          <Label 
            htmlFor={type.id} 
            id={`label-${type.id}`}
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {type.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default PropertyTypesStep;
