
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Check, ChevronRight, Globe, Lightbulb, UserCheck } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { InvestmentMarket, OnboardingData } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAccessibility } from '@/components/accessibility/A11yProvider';

interface OnboardingStep {
  title: string;
  description: string;
  component: React.ReactNode;
}

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { saveOnboardingData, updatePreferences } = useUserPreferences();
  const { setLanguage } = useLanguage();
  const { largeText } = useAccessibility();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    name: '',
    experienceLevel: 'beginner',
    investmentMarket: 'global',
    interests: [],
    investmentGoals: [],
    preferredPropertyTypes: []
  });
  
  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // Final step - complete onboarding
      saveOnboardingData?.(onboardingData);
      toast.success("Welcome to PropertyFlow!", {
        description: "Your personalized dashboard is ready"
      });
      navigate('/dashboard');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  const updateData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };
  
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Also store in preferences
    updatePreferences({ language: lang });
  };
  
  const steps: OnboardingStep[] = [
    {
      title: "Welcome to PropertyFlow",
      description: "Let's set up your personalized real estate investment dashboard",
      component: (
        <div className="space-y-6 py-8">
          <div className="flex justify-center">
            <Building className="h-20 w-20 text-primary" />
          </div>
          <div className="text-center space-y-4">
            <h1 className={`text-3xl font-bold ${largeText ? 'text-4xl' : ''}`}>Welcome to PropertyFlow</h1>
            <p className="text-muted-foreground text-lg">
              Your complete real estate investment platform
            </p>
            <p className="text-sm">
              This wizard will help us customize your experience based on your investment profile.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                value={onboardingData.name} 
                onChange={(e) => updateData('name', e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select your preferred language</Label>
              <RadioGroup 
                value={localStorage.getItem('language') || 'en'} 
                onValueChange={handleLanguageChange}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="en" id="language-en" />
                  <Label htmlFor="language-en" className="flex-1 cursor-pointer">English</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="de" id="language-de" />
                  <Label htmlFor="language-de" className="flex-1 cursor-pointer">Deutsch</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your Investment Profile",
      description: "Tell us about your real estate experience and market focus",
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Label>Your experience level in real estate investing</Label>
            <RadioGroup 
              value={onboardingData.experienceLevel} 
              onValueChange={(val) => updateData('experienceLevel', val)}
              className="grid gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="beginner" id="experience-beginner" />
                <Label htmlFor="experience-beginner" className="flex-1 cursor-pointer">
                  <div className="font-medium">Beginner</div>
                  <div className="text-sm text-muted-foreground">New to real estate investing</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="intermediate" id="experience-intermediate" />
                <Label htmlFor="experience-intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Intermediate</div>
                  <div className="text-sm text-muted-foreground">Have some properties or investment experience</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="advanced" id="experience-advanced" />
                <Label htmlFor="experience-advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Advanced</div>
                  <div className="text-sm text-muted-foreground">Experienced investor with multiple properties</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="expert" id="experience-expert" />
                <Label htmlFor="experience-expert" className="flex-1 cursor-pointer">
                  <div className="font-medium">Expert</div>
                  <div className="text-sm text-muted-foreground">Professional investor or real estate specialist</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    },
    {
      title: "Investment Market",
      description: "Select your primary investment market for tailored tools and insights",
      component: (
        <div className="space-y-6 py-4">
          <RadioGroup 
            value={onboardingData.investmentMarket} 
            onValueChange={(val: InvestmentMarket) => updateData('investmentMarket', val)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="germany" id="market-germany" />
              <Label htmlFor="market-germany" className="flex-1 cursor-pointer">
                <div className="font-medium">Germany</div>
                <div className="text-sm text-muted-foreground">Focus on German real estate market</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="usa" id="market-usa" />
              <Label htmlFor="market-usa" className="flex-1 cursor-pointer">
                <div className="font-medium">USA</div>
                <div className="text-sm text-muted-foreground">Focus on US real estate market</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="austria" id="market-austria" />
              <Label htmlFor="market-austria" className="flex-1 cursor-pointer">
                <div className="font-medium">Austria</div>
                <div className="text-sm text-muted-foreground">Focus on Austrian real estate market</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="switzerland" id="market-switzerland" />
              <Label htmlFor="market-switzerland" className="flex-1 cursor-pointer">
                <div className="font-medium">Switzerland</div>
                <div className="text-sm text-muted-foreground">Focus on Swiss real estate market</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="global" id="market-global" />
              <Label htmlFor="market-global" className="flex-1 cursor-pointer">
                <div className="font-medium">Global</div>
                <div className="text-sm text-muted-foreground">Interested in multiple markets</div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              This selection will help us customize tools, tax calculations, and insights most relevant to your investment region.
              You can change this later in your settings.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Investment Interests",
      description: "Select the property types and investment strategies you're interested in",
      component: (
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Property Types</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Residential", "Commercial", "Industrial", "Mixed-Use", "Vacation Rentals", "REITs"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={onboardingData.preferredPropertyTypes?.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateData('preferredPropertyTypes', [...(onboardingData.preferredPropertyTypes || []), type]);
                      } else {
                        updateData('preferredPropertyTypes', 
                          onboardingData.preferredPropertyTypes?.filter(t => t !== type) || []);
                      }
                    }}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 pt-4">
            <Label>Investment Goals</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Cash Flow", "Appreciation", "Tax Benefits", "Portfolio Diversification", "Passive Income", "Wealth Building"].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`goal-${goal}`} 
                    checked={onboardingData.investmentGoals?.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateData('investmentGoals', [...(onboardingData.investmentGoals || []), goal]);
                      } else {
                        updateData('investmentGoals', 
                          onboardingData.investmentGoals?.filter(g => g !== goal) || []);
                      }
                    }}
                  />
                  <Label htmlFor={`goal-${goal}`}>{goal}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Go!",
      description: "Your personalized dashboard awaits",
      component: (
        <div className="space-y-6 py-8 text-center">
          <div className="flex justify-center">
            <Check className="h-16 w-16 text-primary p-2 bg-primary/20 rounded-full" />
          </div>
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${largeText ? 'text-3xl' : ''}`}>You're all set!</h2>
            <p className="text-muted-foreground">
              Thanks {onboardingData.name}! We've customized PropertyFlow based on your preferences.
            </p>
          </div>
          <div className="space-y-2 border rounded-lg p-4 text-left">
            <div className="space-y-1">
              <p className="font-medium">Your Profile Summary:</p>
              <p className="text-sm">Experience: <span className="font-medium">{onboardingData.experienceLevel}</span></p>
              <p className="text-sm">Market: <span className="font-medium">{onboardingData.investmentMarket}</span></p>
              {onboardingData.preferredPropertyTypes && onboardingData.preferredPropertyTypes.length > 0 && (
                <p className="text-sm">Property Types: {onboardingData.preferredPropertyTypes.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];
  
  const currentStepData = steps[currentStep];
  const progress = Math.round((currentStep / (steps.length - 1)) * 100);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          {currentStepData.component}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={(currentStep === 0 && !onboardingData.name)}
            className="ml-auto"
          >
            {currentStep === steps.length - 1 ? (
              <span className="flex items-center">
                Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            ) : (
              <span className="flex items-center">
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
