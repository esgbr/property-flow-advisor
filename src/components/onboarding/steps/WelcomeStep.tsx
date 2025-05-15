
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const WelcomeStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();
  const [name, setName] = useState(data.name || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError(language === 'de' ? 'Bitte geben Sie Ihren Namen ein' : 'Please enter your name');
      return;
    }
    
    updateData('name', name);
    
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          {language === 'de' ? 'Wie dürfen wir Sie nennen?' : 'What may we call you?'}
        </Label>
        <Input
          id="name"
          placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <Button onClick={handleContinue} className="w-full">
        {language === 'de' ? 'Fortfahren' : 'Continue'}
      </Button>
    </div>
  );
};

export default WelcomeStep;
