
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';

const ExperienceStep: React.FC<OnboardingStepProps> = ({ data, updateData, onNext }) => {
  const { language } = useLanguage();

  const handleSelection = (value: string) => {
    updateData('experienceLevel', value);
    
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup 
        value={data.experienceLevel} 
        onValueChange={handleSelection} 
        className="grid gap-4"
      >
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="beginner" id="beginner" />
          <Label htmlFor="beginner" className="cursor-pointer flex-grow">
            <div className="font-medium">
              {language === 'de' ? 'Anfänger' : 'Beginner'}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Ich bin neu in der Immobilienwelt und lerne noch die Grundlagen'
                : 'I\'m new to real estate and still learning the basics'}
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="intermediate" id="intermediate" />
          <Label htmlFor="intermediate" className="cursor-pointer flex-grow">
            <div className="font-medium">
              {language === 'de' ? 'Fortgeschritten' : 'Intermediate'}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Ich habe etwas Erfahrung und verstehe die wichtigsten Konzepte'
                : 'I have some experience and understand key concepts'}
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="advanced" id="advanced" />
          <Label htmlFor="advanced" className="cursor-pointer flex-grow">
            <div className="font-medium">
              {language === 'de' ? 'Erfahren' : 'Advanced'}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Ich habe mehrere Immobilientransaktionen durchgeführt'
                : 'I\'ve completed multiple real estate transactions'}
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent">
          <RadioGroupItem value="expert" id="expert" />
          <Label htmlFor="expert" className="cursor-pointer flex-grow">
            <div className="font-medium">
              {language === 'de' ? 'Experte' : 'Expert'}
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Ich bin ein professioneller Immobilieninvestor oder -berater'
                : 'I\'m a professional real estate investor or advisor'}
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ExperienceStep;
