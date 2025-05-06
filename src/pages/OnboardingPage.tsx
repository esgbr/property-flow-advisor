import React, { useState } from 'react';
import { OnboardingData } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveOnboardingData } = useUserPreferences();
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize OnboardingData with all required fields
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: '',
    experienceLevel: 'beginner',
    interests: [],
    investmentGoals: [],
    preferredPropertyTypes: [],
    investmentMarket: 'germany',
    investmentPreference: 'balanced',
    goals: [],
    propertyTypes: []
  });

  const steps = [
    {
      title: language === 'de' ? 'Willkommen' : 'Welcome',
      description: language === 'de' ? 'Erzählen Sie uns etwas über sich' : 'Tell us about yourself',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{language === 'de' ? 'Name' : 'Name'}</Label>
            <Input 
              id="name" 
              value={onboardingData.name} 
              onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
              placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
            />
          </div>
        </div>
      )
    },
    {
      title: language === 'de' ? 'Erfahrungslevel' : 'Experience Level',
      description: language === 'de' ? 'Wie erfahren sind Sie mit Immobilieninvestitionen?' : 'How experienced are you with real estate investing?',
      component: (
        <RadioGroup 
          value={onboardingData.experienceLevel} 
          onValueChange={(value) => setOnboardingData({...onboardingData, experienceLevel: value})}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">{language === 'de' ? 'Anfänger' : 'Beginner'}</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">{language === 'de' ? 'Fortgeschritten' : 'Intermediate'}</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced">{language === 'de' ? 'Erfahren' : 'Advanced'}</Label>
          </div>
          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <RadioGroupItem value="expert" id="expert" />
            <Label htmlFor="expert">{language === 'de' ? 'Experte' : 'Expert'}</Label>
          </div>
        </RadioGroup>
      )
    },
    {
      title: language === 'de' ? 'Investitionsziele' : 'Investment Goals',
      description: language === 'de' ? 'Was sind Ihre Hauptziele?' : 'What are your main goals?',
      component: (
        <div className="space-y-3">
          {['Passive Income', 'Capital Growth', 'Tax Benefits', 'Portfolio Diversification'].map((goal) => (
            <div key={goal} className="flex items-center space-x-2 border p-3 rounded-md">
              <Checkbox 
                id={`goal-${goal}`} 
                checked={onboardingData.investmentGoals.includes(goal)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setOnboardingData({
                      ...onboardingData, 
                      investmentGoals: [...onboardingData.investmentGoals, goal],
                      goals: [...onboardingData.goals, goal]
                    });
                  } else {
                    setOnboardingData({
                      ...onboardingData, 
                      investmentGoals: onboardingData.investmentGoals.filter(g => g !== goal),
                      goals: onboardingData.goals.filter(g => g !== goal)
                    });
                  }
                }}
              />
              <Label htmlFor={`goal-${goal}`}>{goal}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: language === 'de' ? 'Immobilientypen' : 'Property Types',
      description: language === 'de' ? 'Welche Arten von Immobilien interessieren Sie?' : 'What types of properties are you interested in?',
      component: (
        <div className="space-y-3">
          {['Residential', 'Commercial', 'Industrial', 'Land', 'REITs'].map((type) => (
            <div key={type} className="flex items-center space-x-2 border p-3 rounded-md">
              <Checkbox 
                id={`type-${type}`} 
                checked={onboardingData.preferredPropertyTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setOnboardingData({
                      ...onboardingData, 
                      preferredPropertyTypes: [...onboardingData.preferredPropertyTypes, type],
                      propertyTypes: [...onboardingData.propertyTypes, type]
                    });
                  } else {
                    setOnboardingData({
                      ...onboardingData, 
                      preferredPropertyTypes: onboardingData.preferredPropertyTypes.filter(t => t !== type),
                      propertyTypes: onboardingData.propertyTypes.filter(t => t !== type)
                    });
                  }
                }}
              />
              <Label htmlFor={`type-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: language === 'de' ? 'Fertig!' : 'Complete!',
      description: language === 'de' ? 'Ihr Profil ist eingerichtet' : 'Your profile is set up',
      component: (
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <ChevronRight className="h-10 w-10 text-primary" />
          </div>
          <p>{language === 'de' ? 'Vielen Dank! Wir haben Ihr Profil eingerichtet.' : 'Thank you! We have set up your profile.'}</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (saveOnboardingData) {
        saveOnboardingData(onboardingData);
      }
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          {steps[currentStep].component}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentStep === 0 && !onboardingData.name}
          >
            {currentStep === steps.length - 1 
              ? (language === 'de' ? 'Abschließen' : 'Complete') 
              : (language === 'de' ? 'Weiter' : 'Next')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
