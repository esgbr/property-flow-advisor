
import React, { useState } from 'react';
import { OnboardingData } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Building, Globe, TrendingUp } from 'lucide-react';
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
  
  // Initialize OnboardingData with all required fields and correct typing
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
      title: language === 'de' ? 'Willkommen bei PropertyFlow' : 'Welcome to PropertyFlow',
      description: language === 'de' 
        ? 'Ihr persönlicher Assistent für Immobilieninvestitionen' 
        : 'Your personal real estate investment assistant',
      component: (
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <Building className="h-16 w-16 text-primary" />
          </div>
          <p className="text-center text-muted-foreground mb-4">
            {language === 'de' 
              ? 'Beantworten Sie einige Fragen, damit wir Ihr Erlebnis personalisieren können'
              : 'Answer a few questions so we can personalize your experience'}
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{language === 'de' ? 'Wie heißen Sie?' : 'What\'s your name?'}</Label>
              <Input 
                id="name" 
                value={onboardingData.name} 
                onChange={(e) => setOnboardingData({...onboardingData, name: e.target.value})}
                placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
                className="text-lg"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: language === 'de' ? 'Wo möchten Sie investieren?' : 'Where do you want to invest?',
      description: language === 'de' ? 'Wählen Sie einen Immobilienmarkt' : 'Select a real estate market',
      component: (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Globe className="h-12 w-12 text-primary" />
          </div>
          <RadioGroup 
            value={onboardingData.investmentMarket} 
            onValueChange={(value) => setOnboardingData({...onboardingData, investmentMarket: value})}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="germany" id="germany" />
              <Label htmlFor="germany" className="flex-1 cursor-pointer font-medium">
                {language === 'de' ? 'Deutschland' : 'Germany'}
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Fokus auf deutsche Immobilienmärkte' : 'Focus on German real estate markets'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="austria" id="austria" />
              <Label htmlFor="austria" className="flex-1 cursor-pointer font-medium">
                {language === 'de' ? 'Österreich' : 'Austria'}
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Fokus auf österreichische Immobilienmärkte' : 'Focus on Austrian real estate markets'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="usa" id="usa" />
              <Label htmlFor="usa" className="flex-1 cursor-pointer font-medium">
                {language === 'de' ? 'USA' : 'USA'}
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Fokus auf US-amerikanische Immobilienmärkte' : 'Focus on US real estate markets'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="global" id="global" />
              <Label htmlFor="global" className="flex-1 cursor-pointer font-medium">
                {language === 'de' ? 'Global' : 'Global'}
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Investitionen auf verschiedenen internationalen Märkten' : 'Investments across various international markets'}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      title: language === 'de' ? 'Erfahrungslevel' : 'Experience Level',
      description: language === 'de' ? 'Wie erfahren sind Sie mit Immobilieninvestitionen?' : 'How experienced are you with real estate investing?',
      component: (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-primary" />
          </div>
          <RadioGroup 
            value={onboardingData.experienceLevel} 
            onValueChange={(value: "beginner" | "intermediate" | "advanced" | "expert") => 
              setOnboardingData({...onboardingData, experienceLevel: value})
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                <span className="font-medium">{language === 'de' ? 'Anfänger' : 'Beginner'}</span>
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Neu im Bereich Immobilieninvestitionen' : 'New to real estate investing'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="intermediate" id="intermediate" />
              <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                <span className="font-medium">{language === 'de' ? 'Fortgeschritten' : 'Intermediate'}</span>
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Einige Erfahrung mit Immobilieninvestitionen' : 'Some experience with real estate investing'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                <span className="font-medium">{language === 'de' ? 'Erfahren' : 'Advanced'}</span>
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Umfangreiche Erfahrung mit Immobilieninvestitionen' : 'Extensive experience with real estate investing'}</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="expert" id="expert" />
              <Label htmlFor="expert" className="flex-1 cursor-pointer">
                <span className="font-medium">{language === 'de' ? 'Experte' : 'Expert'}</span>
                <span className="text-xs block text-muted-foreground">{language === 'de' ? 'Professioneller Immobilieninvestor' : 'Professional real estate investor'}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      title: language === 'de' ? 'Investitionsziele' : 'Investment Goals',
      description: language === 'de' ? 'Was sind Ihre Hauptziele?' : 'What are your main goals?',
      component: (
        <div className="space-y-4">
          {[
            {id: 'passive-income', label: language === 'de' ? 'Passives Einkommen' : 'Passive Income', description: language === 'de' ? 'Regelmäßige Einnahmen generieren' : 'Generate regular income'},
            {id: 'capital-growth', label: language === 'de' ? 'Kapitalwachstum' : 'Capital Growth', description: language === 'de' ? 'Langfristige Wertsteigerung' : 'Long-term value appreciation'},
            {id: 'tax-benefits', label: language === 'de' ? 'Steuervorteile' : 'Tax Benefits', description: language === 'de' ? 'Steuerliche Optimierung' : 'Tax optimization'},
            {id: 'portfolio-diversification', label: language === 'de' ? 'Portfolio-Diversifikation' : 'Portfolio Diversification', description: language === 'de' ? 'Risikostreuung' : 'Risk spreading'}
          ].map((goal) => (
            <div key={goal.id} className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50">
              <Checkbox 
                id={`goal-${goal.id}`} 
                checked={onboardingData.investmentGoals.includes(goal.label)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setOnboardingData({
                      ...onboardingData, 
                      investmentGoals: [...onboardingData.investmentGoals, goal.label],
                      goals: [...onboardingData.goals, goal.label]
                    });
                  } else {
                    setOnboardingData({
                      ...onboardingData, 
                      investmentGoals: onboardingData.investmentGoals.filter(g => g !== goal.label),
                      goals: onboardingData.goals.filter(g => g !== goal.label)
                    });
                  }
                }}
              />
              <Label htmlFor={`goal-${goal.id}`} className="flex-1 cursor-pointer">
                <span className="font-medium">{goal.label}</span>
                <span className="text-xs block text-muted-foreground">{goal.description}</span>
              </Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: language === 'de' ? 'Fertig!' : 'All Set!',
      description: language === 'de' ? 'Ihr personalisiertes Dashboard steht bereit' : 'Your personalized dashboard is ready',
      component: (
        <div className="text-center space-y-6">
          <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
            <ChevronRight className="h-12 w-12 text-primary" />
          </div>
          <p className="text-xl">
            {language === 'de' 
              ? `Vielen Dank, ${onboardingData.name}! Wir haben Ihr Profil eingerichtet.` 
              : `Thank you, ${onboardingData.name}! We have set up your profile.`}
          </p>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Klicken Sie auf "Dashboard starten", um zu Ihrem personalisierten Dashboard zu gelangen.'
              : 'Click "Launch Dashboard" to access your personalized dashboard.'}
          </p>
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
      
      // Navigate to appropriate dashboard based on user preferences
      if (onboardingData.investmentMarket === 'germany' || onboardingData.investmentMarket === 'austria') {
        navigate('/deutsche-immobilien-tools');
      } else if (onboardingData.investmentMarket === 'usa') {
        navigate('/us-real-estate-tools');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <Card className="w-full max-w-lg animate-fade-in">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-center text-base">{steps[currentStep].description}</CardDescription>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>
        <CardContent className="pt-6">
          {steps[currentStep].component}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
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
            className="gap-2"
          >
            {currentStep === steps.length - 1 
              ? (language === 'de' ? 'Dashboard starten' : 'Launch Dashboard') 
              : (language === 'de' ? 'Weiter' : 'Continue')}
            {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
