
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const InterestsStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();
  
  const interests = [
    { id: 'market-analysis', label: language === 'de' ? 'Marktanalyse' : 'Market Analysis' },
    { id: 'property-management', label: language === 'de' ? 'Immobilienverwaltung' : 'Property Management' },
    { id: 'financing', label: language === 'de' ? 'Finanzierung' : 'Financing Options' },
    { id: 'tax-strategies', label: language === 'de' ? 'Steuerstrategien' : 'Tax Strategies' },
    { id: 'renovation', label: language === 'de' ? 'Renovierung & Sanierung' : 'Renovation & Rehab' },
    { id: 'rental-strategies', label: language === 'de' ? 'Vermietungsstrategien' : 'Rental Strategies' },
    { id: 'legal', label: language === 'de' ? 'Rechtliche Aspekte' : 'Legal Considerations' }
  ];
  
  const toggleInterest = (interestId: string) => {
    const currentInterests = [...(data.interests || [])];
    const index = currentInterests.indexOf(interestId);
    
    if (index === -1) {
      updateData('interests', [...currentInterests, interestId]);
    } else {
      currentInterests.splice(index, 1);
      updateData('interests', currentInterests);
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
        {interests.map((interest) => (
          <div key={interest.id} className="flex items-center space-x-2 hover:bg-accent p-2 rounded-md cursor-pointer">
            <Checkbox 
              id={interest.id} 
              checked={(data.interests || []).includes(interest.id)}
              onCheckedChange={() => toggleInterest(interest.id)}
            />
            <Label htmlFor={interest.id} className="cursor-pointer">{interest.label}</Label>
          </div>
        ))}
      </div>
      
      <Button onClick={handleContinue} className="w-full">
        {language === 'de' ? 'Fortfahren' : 'Continue'}
      </Button>
    </div>
  );
};

export default InterestsStep;
