
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  Home, 
  Building,
  Calculator,
  Euro,
  PiggyBank,
  Map,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';

interface WorkflowProps {
  currentStep: string;
  workflow: 'immobilien' | 'finanzierung' | 'steuern' | 'analyse';
  className?: string;
  showProgress?: boolean;
}

// Map from UI workflow param to internal WorkflowType
const workflowTypeMap: Record<string, WorkflowType> = {
  'immobilien': 'immobilien',
  'finanzierung': 'finanzierung',
  'steuern': 'steuer',
  'analyse': 'analyse'
};

const WorkflowNavigation: React.FC<WorkflowProps> = ({
  currentStep,
  workflow,
  className,
  showProgress = true
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Convert UI workflow type to internal type
  const workflowType = workflowTypeMap[workflow] || 'steuer';
  
  // Use the workflow hook
  const { 
    steps, 
    goToStep, 
    goToNextStep, 
    goToPreviousStep, 
    getWorkflowProgress 
  } = useWorkflow(workflowType);
  
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const progress = getWorkflowProgress(currentStep);

  if (steps.length === 0) return null;

  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;

  return (
    <div className={cn("mb-6", className)}>
      {!isMobile ? (
        <>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
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
                  onClick={() => goToStep(step.id)}
                >
                  <span className="ml-1">{step.label[language as keyof typeof step.label]}</span>
                </Button>
              </React.Fragment>
            ))}
          </div>
          
          {showProgress && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{language === 'de' ? 'Fortschritt' : 'Progress'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {prevStep ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToStep(prevStep.id)}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>{prevStep.label[language as keyof typeof prevStep.label]}</span>
              </Button>
            ) : <div />}
            
            {nextStep && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToStep(nextStep.id)}
                className="flex items-center"
              >
                <span>{nextStep.label[language as keyof typeof nextStep.label]}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {showProgress && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{language === 'de' ? 'Fortschritt' : 'Progress'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            {prevStep ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToStep(prevStep.id)}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>{prevStep.label[language as keyof typeof prevStep.label]}</span>
              </Button>
            ) : <div />}
            
            {nextStep && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => goToStep(nextStep.id)}
                className="flex items-center"
              >
                <span>{nextStep.label[language as keyof typeof nextStep.label]}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {nextStep && (
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
                onClick={() => goToStep(nextStep.id)}
              >
                {language === 'de' ? 'Weiter' : 'Continue'}
              </Button>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default WorkflowNavigation;
