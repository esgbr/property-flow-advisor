
import React, { useState } from 'react';
import { InvestmentMarket, OnboardingData } from '@/contexts/UserPreferencesContext';
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
import { toast } from 'sonner';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { saveOnboardingData } = useUserPreferences();
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  
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
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onboardingData.name.trim()) {
                    setCurrentStep(1);
                  }
                }}
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
            onValueChange={(value) => setOnboardingData({...onboardingData, investmentMarket: value as InvestmentMarket})}
            className="space-y-3"
          >
            {[
              { id: 'germany', label: language === 'de' ? 'Deutschland' : 'Germany', description: language === 'de' ? 'Fokus auf deutsche Immobilienmärkte' : 'Focus on German real estate markets' },
              { id: 'austria', label: language === 'de' ? 'Österreich' : 'Austria', description: language === 'de' ? 'Fokus auf österreichische Immobilienmärkte' : 'Focus on Austrian real estate markets' },
              { id: 'usa', label: language === 'de' ? 'USA' : 'USA', description: language === 'de' ? 'Fokus auf US-amerikanische Immobilienmärkte' : 'Focus on US real estate markets' },
              { id: 'global', label: language === 'de' ? 'Global' : 'Global', description: language === 'de' ? 'Investitionen auf verschiedenen internationalen Märkten' : 'Investments across various international markets' }
            ].map((market) => (
              <div 
                key={market.id} 
                className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                onClick={() => setOnboardingData({...onboardingData, investmentMarket: market.id as InvestmentMarket})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOnboardingData({...onboardingData, investmentMarket: market.id as InvestmentMarket});
                  }
                }}
                tabIndex={0}
                role="radio"
                aria-checked={onboardingData.investmentMarket === market.id}
              >
                <RadioGroupItem value={market.id} id={market.id} />
                <Label htmlFor={market.id} className="flex-1 cursor-pointer w-full">
                  {market.label}
                  <span className="text-xs block text-muted-foreground">{market.description}</span>
                </Label>
              </div>
            ))}
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
            {[
              { id: 'beginner', label: language === 'de' ? 'Anfänger' : 'Beginner', description: language === 'de' ? 'Neu im Bereich Immobilieninvestitionen' : 'New to real estate investing' },
              { id: 'intermediate', label: language === 'de' ? 'Fortgeschritten' : 'Intermediate', description: language === 'de' ? 'Einige Erfahrung mit Immobilieninvestitionen' : 'Some experience with real estate investing' },
              { id: 'advanced', label: language === 'de' ? 'Erfahren' : 'Advanced', description: language === 'de' ? 'Umfangreiche Erfahrung mit Immobilieninvestitionen' : 'Extensive experience with real estate investing' },
              { id: 'expert', label: language === 'de' ? 'Experte' : 'Expert', description: language === 'de' ? 'Professioneller Immobilieninvestor' : 'Professional real estate investor' }
            ].map((level) => (
              <div 
                key={level.id} 
                className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                onClick={() => setOnboardingData({...onboardingData, experienceLevel: level.id as "beginner" | "intermediate" | "advanced" | "expert"})}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOnboardingData({...onboardingData, experienceLevel: level.id as "beginner" | "intermediate" | "advanced" | "expert"});
                  }
                }}
                tabIndex={0}
                role="radio"
                aria-checked={onboardingData.experienceLevel === level.id}
              >
                <RadioGroupItem value={level.id} id={level.id} />
                <Label htmlFor={level.id} className="flex-1 cursor-pointer w-full">
                  <span className="font-medium">{level.label}</span>
                  <span className="text-xs block text-muted-foreground">{level.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    },
    {
      title: language === 'de' ? 'Investitionsziele' : 'Investment Goals',
      description: language === 'de' ? 'Was sind Ihre Hauptziele?' : 'What are your main goals?',
      component: (
        <div className="space-y-4">
          {formError && (
            <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive">
              {formError}
            </div>
          )}
          {[
            {id: 'passive-income', label: language === 'de' ? 'Passives Einkommen' : 'Passive Income', description: language === 'de' ? 'Regelmäßige Einnahmen generieren' : 'Generate regular income'},
            {id: 'capital-growth', label: language === 'de' ? 'Kapitalwachstum' : 'Capital Growth', description: language === 'de' ? 'Langfristige Wertsteigerung' : 'Long-term value appreciation'},
            {id: 'tax-benefits', label: language === 'de' ? 'Steuervorteile' : 'Tax Benefits', description: language === 'de' ? 'Steuerliche Optimierung' : 'Tax optimization'},
            {id: 'portfolio-diversification', label: language === 'de' ? 'Portfolio-Diversifikation' : 'Portfolio Diversification', description: language === 'de' ? 'Risikostreuung' : 'Risk spreading'}
          ].map((goal) => (
            <div 
              key={goal.id} 
              className="flex items-center space-x-2 border p-4 rounded-lg hover:border-primary/50 hover:bg-muted/50"
              onClick={() => toggleInvestmentGoal(goal.label)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleInvestmentGoal(goal.label);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={onboardingData.investmentGoals.includes(goal.label)}
            >
              <Checkbox 
                id={`goal-${goal.id}`} 
                checked={onboardingData.investmentGoals.includes(goal.label)}
                onCheckedChange={() => toggleInvestmentGoal(goal.label)}
              />
              <Label htmlFor={`goal-${goal.id}`} className="flex-1 cursor-pointer w-full">
                <span className="font-medium">{goal.label}</span>
                <span className="text-xs block text-muted-foreground">{goal.description}</span>
              </Label>
            </div>
          ))}
        </div>
      )
    }
  ];

  const toggleInvestmentGoal = (goal: string) => {
    setOnboardingData(prev => {
      const goals = prev.investmentGoals || [];
      return {
        ...prev,
        investmentGoals: goals.includes(goal) 
          ? goals.filter(g => g !== goal)
          : [...goals, goal]
      };
    });
  };

  const handleSubmit = async () => {
    // Basic validation before saving
    if (currentStep === steps.length - 1) {
      if (onboardingData.investmentGoals.length === 0) {
        setFormError(language === 'de' 
          ? 'Bitte wählen Sie mindestens ein Ziel aus' 
          : 'Please select at least one goal');
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setFormError(null);
    } else {
      try {
        await saveOnboardingData(onboardingData);
        toast.success(language === 'de' 
          ? 'Onboarding abgeschlossen!'
          : 'Onboarding completed!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Onboarding error:', error);
        toast.error(language === 'de' 
          ? 'Es gab einen Fehler. Bitte versuchen Sie es erneut.'
          : 'There was an error. Please try again.');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
    setFormError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.tagName !== 'BUTTON') {
      handleSubmit();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-background p-4"
      onKeyDown={handleKeyDown}
    >
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {steps[currentStep].component}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="w-full flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              {language === 'de' ? 'Zurück' : 'Back'}
            </Button>
            
            <Button
              type="button"
              onClick={handleSubmit}
              className="gap-1"
            >
              {currentStep < steps.length - 1 
                ? (language === 'de' ? 'Weiter' : 'Next') 
                : (language === 'de' ? 'Fertigstellen' : 'Complete')
              }
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Progress 
            value={(currentStep + 1) / steps.length * 100} 
            className="w-full" 
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
