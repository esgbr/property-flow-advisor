
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Building, Check } from 'lucide-react';
import { OnboardingData } from '@/contexts/UserPreferencesContext';

const STEPS = ['welcome', 'experience', 'interests', 'markets', 'complete'];

const OnboardingPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { saveOnboardingData } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    experienceLevel: 'beginner',
    interests: [],
    investmentGoals: [],
    preferredPropertyTypes: [],
    investmentMarket: 'germany'
  });
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleValue = (field: keyof OnboardingData, value: string) => {
    setData(prev => {
      const currentArray = prev[field] as string[];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
    });
  };
  
  const completeOnboarding = () => {
    if (saveOnboardingData) {
      saveOnboardingData(data);
    }
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Building className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            {t('onboardingStepTitle_' + STEPS[currentStep])}
          </CardTitle>
          <CardDescription className="text-center">
            {t('onboardingStepDescription_' + STEPS[currentStep])}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {STEPS[currentStep] === 'welcome' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input 
                  id="name" 
                  value={data.name} 
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder={t('enterYourName')}
                />
              </div>
            </div>
          )}
          
          {STEPS[currentStep] === 'experience' && (
            <div className="space-y-4">
              <RadioGroup 
                value={data.experienceLevel}
                onValueChange={(value) => updateData('experienceLevel', value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">{t('beginnerInvestor')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">{t('intermediateInvestor')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">{t('advancedInvestor')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
                  <Label htmlFor="expert">{t('expertInvestor')}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {STEPS[currentStep] === 'interests' && (
            <div className="space-y-4">
              {['cashFlow', 'appreciation', 'equity', 'tax'].map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={interest}
                    checked={data.interests.includes(interest)}
                    onChange={() => toggleValue('interests', interest)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={interest}>{t(interest)}</Label>
                </div>
              ))}
            </div>
          )}
          
          {STEPS[currentStep] === 'markets' && (
            <div className="space-y-4">
              <RadioGroup 
                value={data.investmentMarket}
                onValueChange={(value) => updateData('investmentMarket', value as any)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="germany" id="germany" />
                  <Label htmlFor="germany">{t('germany')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="austria" id="austria" />
                  <Label htmlFor="austria">{t('austria')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="switzerland" id="switzerland" />
                  <Label htmlFor="switzerland">{t('switzerland')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="global" id="global" />
                  <Label htmlFor="global">{t('global')}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {STEPS[currentStep] === 'complete' && (
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <p className="mb-4">{t('onboardingComplete')}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            {t('back')}
          </Button>
          <Button onClick={handleNext}>
            {currentStep < STEPS.length - 1 ? t('next') : t('getStarted')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
