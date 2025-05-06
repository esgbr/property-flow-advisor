
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface WorkflowStepsListProps {
  workflowType: WorkflowType;
  className?: string;
}

/**
 * Displays the steps of a workflow with their completion status
 */
const WorkflowStepsList: React.FC<WorkflowStepsListProps> = ({
  workflowType,
  className
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const workflow = useWorkflow(workflowType);
  
  const steps = workflow.getStepsWithStatus();
  const progress = workflow.getWorkflowProgress();

  // Navigate to a step
  const handleStepClick = (stepPath: string) => {
    navigate(stepPath);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {language === 'de' ? 
              workflow.workflow.title.de :
              workflow.workflow.title.en
            }
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === 'de' ? 
              workflow.workflow.description.de :
              workflow.workflow.description.en
            }
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Steps connector line */}
        <div className="absolute left-3.5 top-5 h-full w-px bg-border" aria-hidden="true" />
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = false; // Could be controlled by parent
            const stepName = language === 'de' ? step.label.de : step.label.en;
            const stepDescription = step.description 
              ? (language === 'de' ? step.description.de : step.description.en)
              : undefined;
            
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
                    
                    {step.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        {step.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                      </Badge>
                    )}
                  </div>
                  
                  {stepDescription && (
                    <p className="text-sm text-muted-foreground mt-1">{stepDescription}</p>
                  )}
                  
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant={isActive ? "default" : (step.isComplete ? "outline" : "ghost")}
                      size="sm"
                      className={cn(
                        step.isComplete && !isActive && "text-green-700 dark:text-green-400"
                      )}
                      onClick={() => handleStepClick(step.path)}
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

export default WorkflowStepsList;
