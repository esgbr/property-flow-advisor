
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WorkflowStepsProps {
  workflowType: WorkflowType;
  currentStep: string;
  className?: string;
  onStepClick?: (stepId: string) => void;
}

/**
 * WorkflowSteps - A component that displays the steps in a workflow with their completion status
 * This helps users understand where they are in a process and what's coming next
 */
const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  workflowType,
  currentStep,
  className = '',
  onStepClick
}) => {
  const { language } = useLanguage();
  const workflow = useWorkflow(workflowType);
  
  const workflowSteps = workflow.steps.map(step => ({
    ...step,
    isComplete: workflow.getCompleteSteps().some(s => s.id === step.id),
    isCurrent: step.id === currentStep
  }));
  
  const progress = workflow.getWorkflowProgress(currentStep);
  
  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId);
    } else {
      workflow.goToStep(stepId);
    }
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>
            {language === 'de' ? 'Workflow-Fortschritt' : 'Workflow Progress'}
          </span>
          <span className="text-sm font-normal">
            {progress}%
          </span>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-4">
          {workflowSteps.map((step, index) => (
            <li key={step.id}>
              <div className="flex items-start">
                <div className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5",
                  step.isComplete ? "bg-green-100 text-green-600" : 
                    step.isCurrent ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                )}>
                  {step.isComplete ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <Button 
                    variant="link" 
                    className={cn(
                      "p-0 h-auto font-medium mb-0.5 justify-start",
                      step.isCurrent ? "text-primary" : "text-foreground"
                    )}
                    onClick={() => handleStepClick(step.id)}
                  >
                    {step.label[language as keyof typeof step.label]}
                    {step.isCurrent && !step.isComplete && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {language === 'de' ? 'Aktuell' : 'Current'}
                      </span>
                    )}
                  </Button>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">
                      {step.description[language as keyof typeof step.description]}
                    </p>
                  )}
                  {step.estimatedTime && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.estimatedTime} {language === 'de' ? 'Min.' : 'min.'}
                    </div>
                  )}
                </div>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="ml-3 pl-3 border-l border-gray-200 h-4 mt-1"></div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WorkflowSteps;
