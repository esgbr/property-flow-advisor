
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface WorkflowNavigationProps {
  workflowType: WorkflowType;
  currentStep?: string;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
}

/**
 * Navigation component for workflows
 * Provides controls to navigate between steps and visualize progress
 */
const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  workflowType,
  currentStep,
  variant = 'default',
  className,
  onNextStep,
  onPreviousStep
}) => {
  const { language } = useLanguage();
  const workflow = useWorkflow(workflowType);
  
  // Get the steps with their status information
  const steps = workflow.getStepsWithStatus();
  
  // Find the current step's index
  const currentStepIndex = currentStep 
    ? steps.findIndex(step => step.id === currentStep)
    : steps.findIndex(step => step.isActive);
    
  // Determine if there are previous or next steps
  const hasPreviousStep = currentStepIndex > 0;
  const hasNextStep = currentStepIndex < steps.length - 1 && currentStepIndex >= 0;
  
  // Get the previous and next steps if they exist
  const previousStep = hasPreviousStep ? steps[currentStepIndex - 1] : null;
  const nextStep = hasNextStep ? steps[currentStepIndex + 1] : null;
  
  // Check if the next step is blocked
  const isNextStepBlocked = nextStep?.dependencies?.some(
    depId => !steps.find(s => s.id === depId)?.isComplete
  );
  
  // Find the current step
  const currentStepObj = currentStep
    ? steps.find(step => step.id === currentStep)
    : steps.find(step => step.isActive);
  
  // Handle navigation to previous step
  const handlePreviousStep = () => {
    if (!hasPreviousStep) return;
    
    if (onPreviousStep) {
      onPreviousStep();
    } else if (previousStep) {
      workflow.goToStep(previousStep.id);
      toast({
        description: language === 'de'
          ? `Zurück zu ${previousStep.label[language as keyof typeof previousStep.label] || previousStep.label.en}`
          : `Back to ${previousStep.label[language as keyof typeof previousStep.label] || previousStep.label.en}`
      });
    }
  };
  
  // Handle navigation to next step
  const handleNextStep = () => {
    if (!hasNextStep || isNextStepBlocked) return;
    
    if (onNextStep) {
      onNextStep();
    } else if (nextStep) {
      if (currentStepObj?.isComplete) {
        workflow.goToStep(nextStep.id);
        toast({
          description: language === 'de'
            ? `Weiter zu ${nextStep.label[language as keyof typeof nextStep.label] || nextStep.label.en}`
            : `Continue to ${nextStep.label[language as keyof typeof nextStep.label] || nextStep.label.en}`
        });
      } else {
        // Mark current step as complete before moving
        if (currentStep) {
          workflow.markStepComplete(currentStep);
        } else if (currentStepObj) {
          workflow.markStepComplete(currentStepObj.id);
        }
        
        workflow.goToStep(nextStep.id);
        toast({
          title: language === 'de' ? 'Schritt abgeschlossen' : 'Step completed',
          description: language === 'de'
            ? `Weiter zu ${nextStep.label[language as keyof typeof nextStep.label] || nextStep.label.en}`
            : `Continue to ${nextStep.label[language as keyof typeof nextStep.label] || nextStep.label.en}`,
          variant: "default" // Changed from "success" which isn't valid
        });
      }
    }
  };
  
  // For minimal variant, render just the buttons
  if (variant === 'minimal') {
    return (
      <div className={cn("flex justify-between", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousStep}
          disabled={!hasPreviousStep}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
        
        <Button
          size="sm"
          onClick={handleNextStep}
          disabled={!hasNextStep || isNextStepBlocked}
          variant="default" // Changed from "success" which isn't valid
        >
          {language === 'de' ? 'Weiter' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }
  
  // For compact variant, render buttons with step names
  if (variant === 'compact') {
    return (
      <div className={cn("flex justify-between items-center", className)}>
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={!hasPreviousStep}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {hasPreviousStep && previousStep
            ? (language === 'de' 
                ? previousStep.label.de || previousStep.label.en
                : previousStep.label.en)
            : (language === 'de' ? 'Zurück' : 'Back')}
        </Button>
        
        {currentStepObj && currentStepObj.isComplete && (
          <div className="flex items-center text-green-600 mx-2">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {language === 'de' ? 'Abgeschlossen' : 'Completed'}
            </span>
          </div>
        )}
        
        <Button
          onClick={handleNextStep}
          disabled={!hasNextStep || isNextStepBlocked}
          className="flex items-center"
        >
          {hasNextStep && nextStep
            ? (language === 'de'
                ? nextStep.label.de || nextStep.label.en
                : nextStep.label.en)
            : (language === 'de' ? 'Fertigstellen' : 'Complete')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }
  
  // Default variant with progress steps
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between mb-2">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={!hasPreviousStep}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
        
        <Button
          onClick={handleNextStep}
          disabled={!hasNextStep || isNextStepBlocked}
        >
          {language === 'de' ? 'Weiter' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Render step progress indicators */}
      <div className="flex justify-center">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex items-center"
            aria-current={currentStepIndex === index ? 'step' : undefined}
          >
            <div 
              className={cn(
                "h-2 w-2 rounded-full",
                currentStepIndex === index 
                  ? "bg-primary"
                  : step.isComplete
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600",
              )}
            />
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-[2px] w-8",
                  index < currentStepIndex || step.isComplete
                    ? "bg-green-500"
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowNavigation;
