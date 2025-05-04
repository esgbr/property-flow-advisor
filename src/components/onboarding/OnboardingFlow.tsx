
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, ChevronRight, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export interface OnboardingData {
  name?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  investmentGoals: string[];
  preferredPropertyTypes: string[];
  interests: string[];
  investmentMarket: InvestmentMarket;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
  initialData?: Partial<OnboardingData>;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip, initialData }) => {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: initialData?.name || '',
    experienceLevel: initialData?.experienceLevel || 'beginner',
    investmentGoals: initialData?.investmentGoals || [],
    preferredPropertyTypes: initialData?.preferredPropertyTypes || [],
    interests: initialData?.interests || [],
    investmentMarket: initialData?.investmentMarket || ''
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
          <div className="w-full">
            <Label htmlFor="name">{t('yourName')}</Label>
            <Input
              id="name"
              placeholder={t('enterYourName')}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          <div className="w-full mt-4">
            <Label>{t('chooseLanguage')}</Label>
            <Tabs 
              defaultValue={language} 
              className="mt-1" 
              onValueChange={(value) => setLanguage(value as 'en' | 'de')}
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="de">Deutsch</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )
    },
    {
      id: 'market',
      title: t('investmentMarket'),
      description: t('whereDoYouPlanToInvest'),
      component: (
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <Globe className="h-16 w-16 text-primary opacity-80" />
          </div>
          
          <Select
            value={data.investmentMarket}
            onValueChange={(value: InvestmentMarket) => 
              setData({ ...data, investmentMarket: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectAMarket')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="germany">{t('germany')}</SelectItem>
              <SelectItem value="austria">{t('austria')}</SelectItem>
              <SelectItem value="switzerland">{t('switzerland')}</SelectItem>
              <SelectItem value="france">{t('france')}</SelectItem>
              <SelectItem value="usa">{t('unitedStates')}</SelectItem>
              <SelectItem value="canada">{t('canada')}</SelectItem>
              <SelectItem value="other">{t('otherMarket')}</SelectItem>
            </SelectContent>
          </Select>
          
          {data.investmentMarket === 'germany' && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm text-center">
                {language === 'de' 
                  ? 'Wir haben spezielle Tools für den deutschen Immobilienmarkt, die für Sie angepasst werden.'
                  : 'We have specialized tools for the German real estate market that will be customized for you.'}
              </p>
            </div>
          )}
          
          {data.investmentMarket === 'usa' && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm text-center">
                {language === 'de' 
                  ? 'US-spezifische Tools wie 1031 Exchange und andere werden für Sie verfügbar sein.'
                  : 'US-specific tools like 1031 Exchange and others will be available to you.'}
              </p>
            </div>
          )}
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
      id: 'interests',
      title: t('yourInterests'),
      description: t('whatTopicsInterestYou'),
      component: (
        <div className="space-y-4">
          {['market-analysis', 'property-management', 'financing', 'tax-strategies', 'renovation', 'legal'].map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={interest} 
                className="checkbox"
                checked={data.interests.includes(interest)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData({ ...data, interests: [...data.interests, interest] });
                  } else {
                    setData({ 
                      ...data, 
                      interests: data.interests.filter(i => i !== interest) 
                    });
                  }
                }}
              />
              <Label htmlFor={interest} className="cursor-pointer">{t(interest)}</Label>
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
          <p className="text-muted-foreground">
            {t('weveCustomizedYourExperience')}
            {data.investmentMarket && (
              <span className="block mt-2">
                {language === 'de' 
                  ? `Spezifische Tools für ${data.investmentMarket === 'germany' ? 'Deutschland' : 
                      data.investmentMarket === 'usa' ? 'die USA' : 
                      data.investmentMarket === 'austria' ? 'Österreich' : 
                      data.investmentMarket} wurden für Sie vorbereitet.` 
                  : `Specific tools for ${data.investmentMarket === 'germany' ? 'Germany' : 
                      data.investmentMarket === 'usa' ? 'the USA' : 
                      data.investmentMarket} have been prepared for you.`}
              </span>
            )}
          </p>
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
