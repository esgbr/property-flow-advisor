
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { WorkflowStepWithStatus, WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface WorkflowStepsProps {
  steps: WorkflowStepWithStatus[];
  activeStep: string | null;
  onSelectStep: (stepId: string) => void;
  workflowType: WorkflowType;
  className?: string;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  steps,
  activeStep,
  onSelectStep,
  workflowType,
  className
}) => {
  const { language } = useLanguage();
  const currentLang = language as 'en' | 'de';

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col divide-y">
          {steps.map((step, index) => {
            // Check if step is blocked by dependencies
            const isBlocked = step.dependencies?.some(
              depId => !steps.find(s => s.id === depId)?.isComplete
            );

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center p-4 transition-colors",
                  step.isActive && "bg-primary/10",
                  isBlocked && "opacity-60"
                )}
              >
                <div className="flex-shrink-0 mr-4">
                  {step.isComplete ? (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border-2",
                      step.isActive ? "border-primary text-primary" : "border-muted"
                    )}>
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="text-sm font-medium">
                    {step.label[currentLang] || step.label.en}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description[currentLang] || step.description.en}
                    </p>
                  )}
                </div>

                {step.isComplete && !step.isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => onSelectStep(step.id)}
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">View step</span>
                  </Button>
                )}

                {!step.isComplete && !step.isActive && !isBlocked && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-xs"
                    onClick={() => onSelectStep(step.id)}
                  >
                    Start
                  </Button>
                )}

                {isBlocked && (
                  <div className="ml-2 text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowSteps;
