
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

// Import step components
import WelcomeStep from './steps/WelcomeStep';
import MarketStep from './steps/MarketStep';
import ExperienceStep from './steps/ExperienceStep';
import GoalsStep from './steps/GoalsStep';
import PropertyTypesStep from './steps/PropertyTypesStep';
import InterestsStep from './steps/InterestsStep';
import CompleteStep from './steps/CompleteStep';

// Import types
import { OnboardingData, OnboardingStep } from './types';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  initialData?: Partial<OnboardingData>;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip, initialData }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: initialData?.name || '',
    experienceLevel: initialData?.experienceLevel || 'beginner',
    investmentGoals: initialData?.investmentGoals || [],
    preferredPropertyTypes: initialData?.preferredPropertyTypes || [],
    interests: initialData?.interests || [],
    investmentMarket: initialData?.investmentMarket || '' as InvestmentMarket
  });

  // Define the onboarding steps
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: t('welcomeToPropertyFlow'),
      description: t('onboardingWelcomeDescription'),
      component: <WelcomeStep data={data} updateData={setData} />
    },
    {
      id: 'market',
      title: t('investmentMarket'),
      description: t('whereDoYouPlanToInvest'),
      component: <MarketStep data={data} updateData={setData} />
    },
    {
      id: 'experience',
      title: t('yourExperienceLevel'),
      description: t('tellUsAboutYourExperience'),
      component: <ExperienceStep data={data} updateData={setData} />
    },
    {
      id: 'investment-goals',
      title: t('investmentGoals'),
      description: t('whatAreYourPrimaryInvestmentGoals'),
      component: <GoalsStep data={data} updateData={setData} />
    },
    {
      id: 'property-types',
      title: t('propertyPreferences'),
      description: t('whatTypesOfPropertiesInterestYou'),
      component: <PropertyTypesStep data={data} updateData={setData} />
    },
    {
      id: 'interests',
      title: t('yourInterests'),
      description: t('whatTopicsInterestYou'),
      component: <InterestsStep data={data} updateData={setData} />
    },
    {
      id: 'complete',
      title: t('allSet'),
      description: t('yourProfileIsReady'),
      component: <CompleteStep data={data} updateData={setData} />
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
