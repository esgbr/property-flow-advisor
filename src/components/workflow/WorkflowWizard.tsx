
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Check, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { toast } from 'sonner';

interface WizardStep {
  id: string;
  title: { de: string; en: string };
  description?: { de: string; en: string };
  component: React.ReactNode;
  isOptional?: boolean;
  validate?: () => boolean | Promise<boolean>;
}

interface WorkflowWizardProps {
  workflowType: WorkflowType;
  steps: WizardStep[];
  initialStep?: number;
  onComplete?: (data?: any) => void;
  className?: string;
  showSaveButton?: boolean;
  saveButtonLabel?: { de: string; en: string };
  onSave?: (currentStepIndex: number, data?: any) => void;
}

/**
 * WorkflowWizard - A component to create step-by-step guided wizards
 * This enhances usability by breaking down complex processes into manageable steps
 */
const WorkflowWizard: React.FC<WorkflowWizardProps> = ({
  workflowType,
  steps,
  initialStep = 0,
  onComplete,
  className = '',
  showSaveButton = false,
  saveButtonLabel = { de: 'Speichern', en: 'Save' },
  onSave
}) => {
  const { language } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [stepsCompleted, setStepsCompleted] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const workflow = useWorkflow(workflowType);
  
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Initialize completed steps from workflow
  useEffect(() => {
    const completedSteps = workflow.getCompleteSteps().map(step => step.id);
    const completedObject: Record<string, boolean> = {};
    steps.forEach(step => {
      completedObject[step.id] = completedSteps.includes(step.id);
    });
    setStepsCompleted(completedObject);
  }, [workflow, steps]);
  
  const handleNext = async () => {
    if (currentStep.validate) {
      setIsProcessing(true);
      try {
        const isValid = await currentStep.validate();
        if (!isValid) {
          toast.warning(
            language === 'de' 
              ? 'Bitte korrigieren Sie die Fehler, bevor Sie fortfahren' 
              : 'Please fix the errors before proceeding'
          );
          setIsProcessing(false);
          return;
        }
      } catch (error) {
        console.error('Validation error:', error);
        toast.error(
          language === 'de' 
            ? 'Fehler bei der Validierung' 
            : 'Validation error'
        );
        setIsProcessing(false);
        return;
      }
    }
    
    // Mark current step as completed
    setStepsCompleted(prev => ({ ...prev, [currentStep.id]: true }));
    workflow.markStepComplete(currentStep.id);
    
    if (isLastStep) {
      if (onComplete) {
        onComplete();
      }
      toast.success(
        language === 'de' 
          ? 'Workflow abgeschlossen!' 
          : 'Workflow completed!'
      );
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
    setIsProcessing(false);
  };
  
  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(currentStepIndex);
      toast.success(
        language === 'de' 
          ? 'Fortschritt gespeichert' 
          : 'Progress saved'
      );
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>
            {currentStep.title[language as keyof typeof currentStep.title]}
            {currentStep.isOptional && (
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full font-normal">
                {language === 'de' ? 'Optional' : 'Optional'}
              </span>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {language === 'de' 
              ? `Schritt ${currentStepIndex + 1} von ${steps.length}` 
              : `Step ${currentStepIndex + 1} of ${steps.length}`}
          </div>
        </div>
        {currentStep.description && (
          <CardDescription>
            {currentStep.description[language as keyof typeof currentStep.description]}
          </CardDescription>
        )}
        <Progress value={progress} className="h-1 mt-2" />
      </CardHeader>
      
      <CardContent>
        {currentStep.component}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isProcessing}
          className={cn(isFirstStep && "invisible")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
        
        <div className="flex gap-2">
          {showSaveButton && (
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isProcessing}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveButtonLabel[language as keyof typeof saveButtonLabel]}
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={isProcessing}
          >
            {isLastStep ? (
              <>
                {language === 'de' ? 'Abschließen' : 'Complete'} 
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                {language === 'de' ? 'Weiter' : 'Next'} 
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkflowWizard;
