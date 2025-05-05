
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Building,
  Calculator,
  Euro,
  PiggyBank,
  Map
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkflowStep {
  id: string;
  label: {
    de: string;
    en: string;
  };
  path: string;
  icon: React.ReactNode;
}

interface WorkflowProps {
  currentStep: string;
  workflow: 'immobilien' | 'finanzierung' | 'steuern' | 'analyse';
  className?: string;
}

const workflowDefinitions: Record<string, WorkflowStep[]> = {
  immobilien: [
    { 
      id: 'overview', 
      label: { de: 'Übersicht', en: 'Overview' }, 
      path: '/deutsche-immobilien', 
      icon: <Building className="h-4 w-4" /> 
    },
    { 
      id: 'calculator', 
      label: { de: 'Rechner', en: 'Calculators' }, 
      path: '/deutsche-immobilien-tools', 
      icon: <Calculator className="h-4 w-4" /> 
    },
    { 
      id: 'grunderwerbsteuer', 
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' }, 
      path: '/calculators/grunderwerbsteuer', 
      icon: <Euro className="h-4 w-4" /> 
    },
    { 
      id: 'afa', 
      label: { de: 'AfA-Rechner', en: 'Depreciation' }, 
      path: '/calculators/afa', 
      icon: <PiggyBank className="h-4 w-4" /> 
    }
  ],
  finanzierung: [
    { 
      id: 'overview', 
      label: { de: 'Übersicht', en: 'Overview' }, 
      path: '/financing-overview', 
      icon: <Euro className="h-4 w-4" /> 
    },
    { 
      id: 'calculator', 
      label: { de: 'Finanzierungsrechner', en: 'Financing Calculator' }, 
      path: '/financing-calculator', 
      icon: <Calculator className="h-4 w-4" /> 
    }
  ],
  steuern: [
    { 
      id: 'overview', 
      label: { de: 'Übersicht', en: 'Overview' }, 
      path: '/tax-overview', 
      icon: <Euro className="h-4 w-4" /> 
    },
    { 
      id: 'grunderwerbsteuer', 
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' }, 
      path: '/calculators/grunderwerbsteuer', 
      icon: <Euro className="h-4 w-4" /> 
    },
    { 
      id: 'afa', 
      label: { de: 'AfA-Rechner', en: 'Depreciation' }, 
      path: '/calculators/afa', 
      icon: <PiggyBank className="h-4 w-4" /> 
    }
  ],
  analyse: [
    { 
      id: 'overview', 
      label: { de: 'Marktübersicht', en: 'Market Overview' }, 
      path: '/market-explorer', 
      icon: <Map className="h-4 w-4" /> 
    },
    { 
      id: 'portfolio', 
      label: { de: 'Portfolio-Analyse', en: 'Portfolio Analysis' }, 
      path: '/portfolio-analytics', 
      icon: <Building className="h-4 w-4" /> 
    }
  ]
};

const WorkflowNavigation: React.FC<WorkflowProps> = ({
  currentStep,
  workflow,
  className
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const steps = workflowDefinitions[workflow] || [];
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  if (steps.length === 0) return null;

  const goToStep = (path: string) => {
    navigate(path);
  };

  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;

  return (
    <div className={cn("mb-6", className)}>
      {!isMobile ? (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate('/')}>
            <Home className="h-3.5 w-3.5 mr-1" />
            <span>{language === 'de' ? 'Start' : 'Home'}</span>
          </Button>
          <ChevronRight className="h-4 w-4" />
          {steps.slice(0, currentIndex + 1).map((step, index) => (
            <React.Fragment key={step.id}>
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <Button 
                variant={index === currentIndex ? "secondary" : "ghost"}
                size="sm"
                className="h-8"
                onClick={() => goToStep(step.path)}
              >
                {step.icon}
                <span className="ml-1">{step.label[language as keyof typeof step.label]}</span>
              </Button>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          {prevStep ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToStep(prevStep.path)}
              className="flex items-center"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              <span>{prevStep.label[language as keyof typeof prevStep.label]}</span>
            </Button>
          ) : <div />}
          
          {nextStep && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => goToStep(nextStep.path)}
              className="flex items-center"
            >
              <span>{nextStep.label[language as keyof typeof nextStep.label]}</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )}

      {isMobile && nextStep && (
        <Card className="bg-primary/5 p-2 flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">
              {language === 'de' ? 'Nächster Schritt:' : 'Next Step:'}
            </span>
            <span className="font-medium ml-1">{nextStep.label[language as keyof typeof nextStep.label]}</span>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => goToStep(nextStep.path)}
          >
            {language === 'de' ? 'Weiter' : 'Continue'}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default WorkflowNavigation;
