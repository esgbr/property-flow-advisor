
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { Progress } from '@/components/ui/progress';

interface WorkflowProgressCardProps {
  workflowType: WorkflowType;
  currentStep: string;
  className?: string;
  showProgress?: boolean;
  showNextStep?: boolean;
  onNext?: (nextStep: string) => void;
}

/**
 * Ein wiederverwendbares Workflow-Fortschritts-Card zur Verbesserung der Benutzerführung
 * zwischen verschiedenen Funktionen und zur Anzeige des aktuellen Status
 */
const WorkflowProgressCard: React.FC<WorkflowProgressCardProps> = ({
  workflowType,
  currentStep,
  className = '',
  showProgress = true,
  showNextStep = true,
  onNext
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow(workflowType);
  
  // Berechne den aktuellen Fortschritt
  const progress = workflow.getWorkflowProgress(currentStep);
  
  // Hole den nächsten Schritt
  const nextSteps = workflow.getNextSteps(currentStep, 1);
  const nextStep = nextSteps.length > 0 ? nextSteps[0] : null;
  
  // Hole den aktuellen Schritt
  const currentStepObj = workflow.getCurrentStep(currentStep);
  
  // Wenn wir keinen nächsten Schritt haben und nicht explizit anzeigen sollen, zeigen wir nichts an
  if (!nextStep && !showNextStep) return null;
  
  const handleNext = () => {
    if (nextStep) {
      workflow.markStepComplete(currentStep);
      workflow.goToStep(nextStep.id);
      
      if (onNext) {
        onNext(nextStep.id);
      }
    }
  };
  
  return (
    <Card className={`hover:shadow-md transition-all border-primary/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {currentStepObj?.icon}
            <span className="ml-2">
              {language === 'de' 
                ? `${workflow.getStepLabel(currentStep)} - ${progress.toFixed(0)}% abgeschlossen` 
                : `${workflow.getStepLabel(currentStep)} - ${progress.toFixed(0)}% completed`}
            </span>
          </div>
          {currentStepObj?.isComplete && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
        </CardTitle>
        <CardDescription>
          {currentStepObj?.description 
            ? currentStepObj.description[language as keyof typeof currentStepObj.description]
            : (language === 'de' ? 'Aktueller Schritt im Workflow' : 'Current step in workflow')}
        </CardDescription>
        
        {showProgress && (
          <Progress value={progress} className="h-2 mt-3" />
        )}
      </CardHeader>
      
      {nextStep && showNextStep && (
        <CardContent className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {language === 'de' ? 'Nächster Schritt:' : 'Next step:'}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextStep.label[language as keyof typeof nextStep.label]}
              </p>
            </div>
            <Button 
              size="sm" 
              className="group"
              onClick={handleNext}
            >
              {language === 'de' ? 'Fortfahren' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      )}
      
      {!nextStep && showNextStep && (
        <CardFooter className="pt-0">
          <div className="w-full">
            <p className="text-center text-sm text-muted-foreground">
              {language === 'de' 
                ? 'Workflow abgeschlossen' 
                : 'Workflow completed'}
            </p>
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={() => workflow.resetWorkflow()}
            >
              {language === 'de' ? 'Workflow neu starten' : 'Restart workflow'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkflowProgressCard;
