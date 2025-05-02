
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, ChevronRight } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface OnboardingData {
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    experienceLevel: 'beginner',
    investmentGoals: [],
    preferredPropertyTypes: []
  });

  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('welcomeToPropertyFlow'),
      description: t('onboardingWelcomeDescription'),
      component: (
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-xl font-medium">{t('welcomeToPropertyFlowAdvisor')}</h3>
          <p className="text-muted-foreground">{t('yourPersonalRealEstateInvestmentCompanion')}</p>
        </div>
      )
    },
    {
      id: 'experience',
      title: t('yourExperienceLevel'),
      description: t('tellUsAboutYourExperience'),
      component: (
        <RadioGroup
          value={data.experienceLevel}
          onValueChange={(value) => setData({ ...data, experienceLevel: value as 'beginner' | 'intermediate' | 'expert' })}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="cursor-pointer">{t('beginner')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="cursor-pointer">{t('intermediate')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert" className="cursor-pointer">{t('expert')}</Label>
          </div>
        </RadioGroup>
      )
    },
    {
      id: 'investment-goals',
      title: t('investmentGoals'),
      description: t('whatAreYourPrimaryInvestmentGoals'),
      component: (
        <div className="space-y-4">
          {['passive-income', 'capital-growth', 'portfolio-diversification', 'tax-benefits'].map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={goal} 
                className="checkbox"
                checked={data.investmentGoals.includes(goal)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData({ ...data, investmentGoals: [...data.investmentGoals, goal] });
                  } else {
                    setData({ 
                      ...data, 
                      investmentGoals: data.investmentGoals.filter(g => g !== goal) 
                    });
                  }
                }}
              />
              <Label htmlFor={goal} className="cursor-pointer">{t(goal)}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'property-types',
      title: t('propertyPreferences'),
      description: t('whatTypesOfPropertiesInterestYou'),
      component: (
        <div className="space-y-4">
          {['residential', 'commercial', 'industrial', 'land', 'vacation-rental'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={type} 
                className="checkbox"
                checked={data.preferredPropertyTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData({ ...data, preferredPropertyTypes: [...data.preferredPropertyTypes, type] });
                  } else {
                    setData({ 
                      ...data, 
                      preferredPropertyTypes: data.preferredPropertyTypes.filter(t => t !== type) 
                    });
                  }
                }}
              />
              <Label htmlFor={type} className="cursor-pointer">{t(type)}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'complete',
      title: t('allSet'),
      description: t('yourProfileIsReady'),
      component: (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium">{t('profileCompleted')}</h3>
          <p className="text-muted-foreground">{t('weveCustomizedYourExperience')}</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: t('setupComplete'),
        description: t('yourPreferencesHaveBeenSaved'),
      });
      onComplete(data);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStepData.component}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep === 0 ? (
            <Button variant="ghost" onClick={onSkip}>{t('skip')}</Button>
          ) : (
            <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
              {t('back')}
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? t('complete') : t('next')}
            {currentStep !== steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
