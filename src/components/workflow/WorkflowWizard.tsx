
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Progress } from '@/components/ui/progress';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';

interface WorkflowWizardProps {
  workflowType: WorkflowType;
  onComplete?: () => void;
  className?: string;
}

/**
 * WorkflowWizard component - Guides users step-by-step through a complete workflow
 * with progress tracking and data collection
 */
const WorkflowWizard: React.FC<WorkflowWizardProps> = ({
  workflowType,
  onComplete,
  className
}) => {
  const { language } = useLanguage();
  const { workflow, goToStep, getWorkflowProgress } = useWorkflow(workflowType);
  const { getCurrentWorkflowStep, markStepComplete } = useWorkflowState();
  
  // Set initial step
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = workflow.steps[currentStepIndex];
  
  // Track progress
  const progress = getWorkflowProgress(currentStep.id);
  
  // Navigation
  const handleNext = () => {
    // Mark current step as complete
    markStepComplete(workflowType, currentStep.id);
    
    // Check if we're on the last step
    if (currentStepIndex === workflow.steps.length - 1) {
      // Workflow completed
      if (onComplete) {
        onComplete();
      }
      return;
    }
    
    // Move to next step
    setCurrentStepIndex(currentStepIndex + 1);
  };
  
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleGoToStep = (step: string) => {
    goToStep(step);
  };
  
  const isLastStep = currentStepIndex === workflow.steps.length - 1;
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{workflow.title[language as keyof typeof workflow.title]}</CardTitle>
        <CardDescription>
          {workflow.description[language as keyof typeof workflow.description]}
        </CardDescription>
        
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'de' ? 'Fortschritt' : 'Progress'}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 mt-1" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {currentStep.label[language as keyof typeof currentStep.label]}
          </h3>
          
          {currentStep.description && (
            <p className="text-muted-foreground">
              {currentStep.description[language as keyof typeof currentStep.description]}
            </p>
          )}
          
          <div className="border rounded-md p-4 bg-muted/30">
            <p className="text-sm">
              {language === 'de' 
                ? 'Hier würde der Inhalt des aktuellen Schritts angezeigt werden.'
                : 'This is where the content of the current step would be displayed.'
              }
            </p>
            <Button
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => handleGoToStep(currentStep.id)}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Tool öffnen' : 'Open tool'}
            </Button>
          </div>
          
          {/* Step indicator */}
          <div className="flex justify-center mt-4">
            {workflow.steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStepIndex
                    ? 'bg-primary'
                    : index < currentStepIndex
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Zurück' : 'Previous'}
        </Button>
        
        <Button onClick={handleNext}>
          {isLastStep ? (
            <>
              {language === 'de' ? 'Fertigstellen' : 'Complete'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              {language === 'de' ? 'Weiter' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkflowWizard;
