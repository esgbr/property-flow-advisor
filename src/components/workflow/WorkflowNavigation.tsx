
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkflowNavigationProps {
  workflowType: WorkflowType;
  currentStep: string;
  showPrevious?: boolean;
  showNext?: boolean;
  className?: string;
  variant?: 'compact' | 'default' | 'breadcrumb';
  onStepChange?: (stepId: string) => void;
}

/**
 * WorkflowNavigation - A component that provides navigation controls for workflows
 * Enhances user experience by providing clear next/previous steps
 */
const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  workflowType,
  currentStep,
  showPrevious = true,
  showNext = true,
  className = '',
  variant = 'default',
  onStepChange
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow(workflowType);
  const isMobile = useIsMobile();
  
  // Get current workflow step
  const currentStepObj = workflow.getCurrentStep(currentStep);
  
  // Get previous and next steps
  const previousStep = workflow.getPreviousStep(currentStep);
  const nextSteps = workflow.getNextSteps(currentStep, 1);
  const nextStep = nextSteps.length > 0 ? nextSteps[0] : null;
  
  // Handle navigation between steps
  const navigateToStep = (stepId: string) => {
    if (onStepChange) {
      onStepChange(stepId);
    } else {
      workflow.goToStep(stepId);
    }
  };
  
  if (variant === 'breadcrumb') {
    // Create an array of steps from start to current step
    const pathToCurrentStep = workflow.getPathToStep(currentStep);
    
    return (
      <div className={cn("flex items-center overflow-x-auto hide-scrollbar py-2", className)}>
        {pathToCurrentStep.map((step, index) => (
          <React.Fragment key={step.id}>
            <Button
              variant={step.id === currentStep ? "default" : "ghost"}
              size="sm"
              className={cn(
                "whitespace-nowrap text-sm",
                step.isComplete && "text-green-600",
              )}
              onClick={() => navigateToStep(step.id)}
            >
              {step.isComplete && <CheckCircle className="h-3 w-3 mr-1" />}
              {step.label[language as keyof typeof step.label]}
            </Button>
            {index < pathToCurrentStep.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        {showPrevious && previousStep && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToStep(previousStep.id)}
            className="text-sm"
          >
            ← {isMobile ? '' : (language === 'de' ? 'Zurück' : 'Back')}
          </Button>
        )}
        
        {showNext && nextStep && (
          <Button
            variant="default"
            size="sm"
            onClick={() => navigateToStep(nextStep.id)}
            className="text-sm ml-auto"
          >
            {isMobile ? '' : (language === 'de' ? 'Weiter' : 'Next')} →
          </Button>
        )}
      </div>
    );
  }
  
  // Default variant with cards for previous and next steps
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {showPrevious && previousStep && (
        <Card 
          className="cursor-pointer hover:shadow-md transition-all border-slate-200"
          onClick={() => navigateToStep(previousStep.id)}
        >
          <CardContent className="p-4 flex items-center">
            <div className="mr-2 text-muted-foreground">←</div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Vorheriger Schritt' : 'Previous Step'}
              </p>
              <p className="font-medium">
                {previousStep.label[language as keyof typeof previousStep.label]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showNext && nextStep && (
        <Card 
          className="cursor-pointer hover:shadow-md transition-all border-primary/30 bg-primary/5"
          onClick={() => navigateToStep(nextStep.id)}
        >
          <CardContent className="p-4 flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {language === 'de' ? 'Nächster Schritt' : 'Next Step'}
              </p>
              <p className="font-medium">
                {nextStep.label[language as keyof typeof nextStep.label]}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 ml-2 text-primary" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowNavigation;
