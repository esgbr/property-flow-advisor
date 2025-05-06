
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const PropertyTypesStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();
  
  const propertyTypes = [
    { id: 'single-family', label: language === 'de' ? 'Einfamilienhäuser' : 'Single-Family Homes' },
    { id: 'multi-family', label: language === 'de' ? 'Mehrfamilienhäuser' : 'Multi-Family Properties' },
    { id: 'apartment-buildings', label: language === 'de' ? 'Wohnanlagen' : 'Apartment Buildings' },
    { id: 'commercial', label: language === 'de' ? 'Gewerbeimmobilien' : 'Commercial Properties' },
    { id: 'vacation', label: language === 'de' ? 'Ferienimmobilien' : 'Vacation Properties' },
    { id: 'land', label: language === 'de' ? 'Grundstücke' : 'Land' },
    { id: 'reit', label: language === 'de' ? 'Immobilienaktien (REITs)' : 'Real Estate Investment Trusts (REITs)' }
  ];
  
  const togglePropertyType = (typeId: string) => {
    const currentTypes = [...(data.preferredPropertyTypes || [])];
    const index = currentTypes.indexOf(typeId);
    
    if (index === -1) {
      updateData('preferredPropertyTypes', [...currentTypes, typeId]);
    } else {
      currentTypes.splice(index, 1);
      updateData('preferredPropertyTypes', currentTypes);
    }
  };
  
  const handleContinue = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {propertyTypes.map((type) => (
          <div key={type.id} className="flex items-center space-x-2 hover:bg-accent p-2 rounded-md cursor-pointer">
            <Checkbox 
              id={type.id} 
              checked={(data.preferredPropertyTypes || []).includes(type.id)}
              onCheckedChange={() => togglePropertyType(type.id)}
            />
            <Label htmlFor={type.id} className="cursor-pointer">{type.label}</Label>
          </div>
        ))}
      </div>
      
      <Button onClick={handleContinue} className="w-full">
        {language === 'de' ? 'Fortfahren' : 'Continue'}
      </Button>
    </div>
  );
};

export default PropertyTypesStep;
