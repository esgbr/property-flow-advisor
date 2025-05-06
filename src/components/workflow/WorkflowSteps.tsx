
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/use-accessibility';

interface WorkflowStepsProps {
  workflowType: WorkflowType;
  currentStep?: string;
  className?: string;
  compact?: boolean;
  onStepClick?: (stepId: string) => void;
}

/**
 * Displays the steps of a workflow with their completion status
 */
const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  workflowType,
  currentStep,
  className,
  compact = false,
  onStepClick
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const workflow = useWorkflow(workflowType);
  const { announce } = useAccessibility();
  
  const steps = workflow.getStepsWithStatus();
  const currentStepObj = steps.find(step => step.id === currentStep);
  const progress = workflow.getWorkflowProgress(currentStep);

  // Navigate to a step
  const handleStepClick = (step: (typeof steps)[0]) => {
    if (onStepClick) {
      onStepClick(step.id);
    } else {
      navigate(step.path);
    }
    
    // Announce for screen readers
    const langKey = language as keyof typeof step.label;
    const stepName = step.label[langKey];
    announce(
      language === 'de'
        ? `Navigation zu ${stepName}`
        : `Navigating to ${stepName}`,
      'polite'
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {workflowDefinitions[workflowType].title[language as keyof typeof workflowDefinitions[workflowType].title]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {workflowDefinitions[workflowType].description[language as keyof typeof workflowDefinitions[workflowType].description]}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium">{progress}%</span>
          <Progress value={progress} className="h-2 w-16" />
        </div>
      </div>
      
      <div className="relative">
        {/* Steps connector line */}
        <div className="absolute left-3.5 top-5 h-full w-px bg-border" aria-hidden="true" />
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const langKey = language as keyof typeof step.label;
            const stepName = step.label[langKey];
            const stepDescription = step.description ? step.description[language as keyof typeof step.description] : undefined;
            
            return (
              <Card
                key={step.id}
                className={cn(
                  "p-3 flex items-start gap-3 relative",
                  isActive && "border-primary bg-primary/5",
                  step.isComplete && "border-green-500/30 bg-green-500/5"
                )}
              >
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center border text-xs font-medium",
                  isActive && "bg-primary text-primary-foreground border-primary",
                  step.isComplete && "bg-green-500 text-white border-green-500",
                  !isActive && !step.isComplete && "bg-background border-muted-foreground/20"
                )}>
                  {step.isComplete ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-medium",
                      isActive && "text-primary",
                      step.isComplete && "text-green-700 dark:text-green-400"
                    )}>
                      {stepName}
                    </h4>
                    
                    {!compact && step.estimatedTime && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {language === 'de' ? (
                          <span>{step.estimatedTime} Min.</span>
                        ) : (
                          <span>{step.estimatedTime} min</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!compact && stepDescription && (
                    <p className="text-sm text-muted-foreground mt-1">{stepDescription}</p>
                  )}
                  
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant={isActive ? "default" : (step.isComplete ? "outline" : "ghost")}
                      size="sm"
                      className={cn(
                        step.isComplete && !isActive && "text-green-700 dark:text-green-400"
                      )}
                      onClick={() => handleStepClick(step)}
                    >
                      {isActive ? (
                        language === 'de' ? 'Aktueller Schritt' : 'Current Step'
                      ) : step.isComplete ? (
                        language === 'de' ? 'Ansehen' : 'View'
                      ) : (
                        <>
                          {language === 'de' ? 'Gehe zu' : 'Go to'}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkflowSteps;
