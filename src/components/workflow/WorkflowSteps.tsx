import React from 'react';
import { WorkflowType } from '@/hooks/use-workflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkflow } from '@/hooks/use-workflow';
import { useNavigate } from 'react-router-dom';

export interface WorkflowStepsProps {
  workflowType: WorkflowType;
  currentStep?: string;
  showCompleted?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  workflowType,
  currentStep,
  showCompleted = true,
  variant = 'default',
  className
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { getStepsWithStatus, goToStep } = useWorkflow(workflowType);
  
  const steps = getStepsWithStatus();
  
  // Filter steps if needed
  const displaySteps = showCompleted 
    ? steps 
    : steps.filter(step => !step.isComplete || step.id === currentStep);
  
  const handleStepClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-muted/30",
        variant === 'compact' ? "py-2 px-3" : "py-4"
      )}>
        <CardTitle className={cn(
          variant === 'compact' ? "text-base" : "text-lg"
        )}>
          {language === 'de' ? 'Workflow-Schritte' : 'Workflow Steps'}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        variant === 'compact' ? "p-3" : "p-4"
      )}>
        <ol className="space-y-2">
          {displaySteps.map((step) => (
            <li 
              key={step.id}
              className={cn(
                "flex items-center p-2 rounded-md",
                step.isActive ? "bg-primary/10" : "hover:bg-muted/50",
                step.isComplete ? "text-muted-foreground" : "",
                "cursor-pointer transition-colors"
              )}
              onClick={() => handleStepClick(step.path)}
            >
              <div className="mr-3">
                {step.isComplete ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5",
                    step.isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                )}
              </div>
              <div className="flex-grow">
                <div className={cn(
                  "font-medium",
                  step.isActive ? "text-primary" : ""
                )}>
                  {step.label[language as keyof typeof step.label]}
                </div>
                {step.description && variant !== 'compact' && (
                  <div className="text-sm text-muted-foreground">
                    {step.description[language as keyof typeof step.description]}
                  </div>
                )}
              </div>
              {step.progress !== undefined && (
                <div className="ml-2 text-xs font-medium">
                  {step.progress}%
                </div>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default WorkflowSteps;
