
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { ArrowRight, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkflowProgressCardProps {
  workflowType: WorkflowType;
  className?: string;
  onNavigate?: (step: string) => void;
}

/**
 * Card showing progress for a specific workflow
 */
const WorkflowProgressCard: React.FC<WorkflowProgressCardProps> = ({
  workflowType,
  className,
  onNavigate
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow(workflowType);
  
  // Get all steps and their status
  const steps = workflow.getStepsWithStatus();
  
  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.isComplete);
  const progress = workflow.getWorkflowProgress();
  
  // Get the current active step
  const currentStep = steps.find(step => step.isActive) || steps[0];
  
  // Find the next uncompleted step, if any
  const nextIncompleteStep = steps.find(step => !step.isComplete);
  
  // Handle navigation to the next step
  const handleNavigate = () => {
    if (nextIncompleteStep) {
      if (onNavigate) {
        onNavigate(nextIncompleteStep.id);
      } else {
        // Default navigation behavior
        navigate(`/${workflowType}/${nextIncompleteStep.id}`);
      }
    }
  };
  
  // Get workflow title based on type
  const getWorkflowTitle = () => {
    switch (workflowType) {
      case 'steuer':
        return language === 'de' ? 'Steueroptimierung' : 'Tax Optimization';
      case 'immobilien':
        return language === 'de' ? 'Immobilienverwaltung' : 'Property Management';
      case 'finanzierung':
        return language === 'de' ? 'Finanzierung' : 'Financing';
      case 'analyse':
        return language === 'de' ? 'Analyse' : 'Analysis';
      default:
        return workflowType;
    }
  };
  
  // Format the step label based on language
  const getStepLabel = (step: any) => {
    return language === 'de' ? (step.label.de || step.label.en) : step.label.en;
  };
  
  const isComplete = completedSteps.length === steps.length;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>{getWorkflowTitle()}</CardTitle>
        <CardDescription>
          {language === 'de' ? 'Fortschritt' : 'Progress'}: {completedSteps.length}/{steps.length} {language === 'de' ? 'Schritte' : 'steps'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          {!isComplete ? (
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">
                {language === 'de' ? 'Nächster Schritt' : 'Next step'}:
              </div>
              <div className="font-medium">
                {nextIncompleteStep ? getStepLabel(nextIncompleteStep) : getStepLabel(currentStep)}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCheck className="h-4 w-4 mr-1" />
              <span>
                {language === 'de' ? 'Alle Schritte abgeschlossen' : 'All steps completed'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleNavigate}
          disabled={isComplete}
        >
          {isComplete
            ? (language === 'de' ? 'Abgeschlossen' : 'Completed')
            : (language === 'de' ? 'Fortfahren' : 'Continue')}
          {!isComplete && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkflowProgressCard;
