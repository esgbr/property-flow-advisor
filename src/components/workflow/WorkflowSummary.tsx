
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from 'lucide-react';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { cn } from '@/lib/utils';

interface WorkflowSummaryProps {
  workflowType: WorkflowType;
  className?: string;
  showDetails?: boolean;
}

/**
 * Displays a summary of a workflow's progress
 */
const WorkflowSummary: React.FC<WorkflowSummaryProps> = ({
  workflowType,
  className,
  showDetails = true
}) => {
  const { language } = useLanguage();
  const workflow = useWorkflow(workflowType);
  
  const steps = workflow.getStepsWithStatus();
  const completedSteps = steps.filter(step => step.isComplete);
  const progress = workflow.getWorkflowProgress();
  const isComplete = progress === 100;
  
  const langKey = language as keyof typeof workflowDefinitions[workflowType].title;
  const title = workflowDefinitions[workflowType].title[langKey];
  
  return (
    <Card className={cn(
      isComplete ? "border-green-500/30" : "",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          {isComplete && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps.length} / {steps.length} {language === 'de' ? 'Schritte' : 'steps'}
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          {showDetails && completedSteps.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">
                {language === 'de' ? 'Abgeschlossene Schritte' : 'Completed Steps'}
              </h4>
              <ul className="space-y-1">
                {completedSteps.slice(0, 3).map(step => {
                  const stepLangKey = language as keyof typeof step.label;
                  return (
                    <li key={step.id} className="text-xs flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      <span>{step.label[stepLangKey]}</span>
                    </li>
                  );
                })}
                {completedSteps.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    {language === 'de' 
                      ? `+ ${completedSteps.length - 3} weitere`
                      : `+ ${completedSteps.length - 3} more`}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowSummary;
