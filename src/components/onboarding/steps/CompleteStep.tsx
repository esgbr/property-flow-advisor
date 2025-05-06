
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { OnboardingStepProps } from '../types';
import { CheckCircle } from 'lucide-react';

const CompleteStep: React.FC<OnboardingStepProps> = ({ data, onNext }) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">
          {language === 'de' 
            ? `Wunderbar, ${data.name}!` 
            : `Great job, ${data.name}!`}
        </h3>
        <p className="text-muted-foreground mt-1">
          {language === 'de'
            ? 'Ihr Profil wurde erstellt. Sie können jetzt loslegen!'
            : 'Your profile has been created. You can now get started!'}
        </p>
      </div>
      
      <Button onClick={onNext} className="w-full">
        {language === 'de' ? 'Zum Dashboard' : 'Go to Dashboard'}
      </Button>
    </div>
  );
};

export default CompleteStep;
