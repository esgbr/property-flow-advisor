
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getRelatedWorkflowsForTool } from '@/utils/workflowUtils';

interface WorkflowSuggestionsProps {
  currentTool?: string;
  workflowType?: WorkflowType;
  maxSuggestions?: number;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Component that suggests next steps in a workflow based on current context
 */
const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  workflowType = 'steuer',
  maxSuggestions = 3,
  className,
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Use the workflow hook to get current status
  const workflow = useWorkflow(workflowType);
  const currentStep = workflow.getCurrentStep();
  
  // Get suggestions based on the current tool or step
  const suggestions = React.useMemo(() => {
    const result = [];
    
    // Add next steps from the current workflow
    if (currentStep) {
      const nextSteps = workflow.getNextSteps(currentStep.id, maxSuggestions);
      
      nextSteps.forEach(step => {
        if (!workflow.isStepBlocked(step.id)) {
          result.push({
            type: 'next',
            workflowType,
            stepId: step.id,
            path: step.path,
            label: step.label[language as keyof typeof step.label],
            description: step.description ? step.description[language as keyof typeof step.description] : undefined
          });
        }
      });
    }
    
    // If we have a specific tool ID, add related workflows
    if (currentTool && result.length < maxSuggestions) {
      const relatedWorkflows = getRelatedWorkflowsForTool(currentTool);
      
      // Only add suggestions from other workflows
      relatedWorkflows
        .filter(wf => wf !== workflowType)
        .forEach(wf => {
          if (result.length >= maxSuggestions) return;
          
          const relatedWorkflow = useWorkflow(wf);
          const steps = relatedWorkflow.getStepsWithStatus();
          const firstIncompleteStep = steps.find(step => !step.isComplete);
          
          if (firstIncompleteStep) {
            const labelKey = language as keyof typeof firstIncompleteStep.label;
            const descriptionKey = language as keyof typeof firstIncompleteStep.description;
            
            result.push({
              type: 'related',
              workflowType: wf,
              stepId: firstIncompleteStep.id,
              path: firstIncompleteStep.path,
              label: firstIncompleteStep.label[labelKey],
              description: firstIncompleteStep.description ? 
                firstIncompleteStep.description[descriptionKey] : undefined
            });
          }
        });
    }
    
    return result.slice(0, maxSuggestions);
  }, [workflow, currentStep, currentTool, workflowType, language, maxSuggestions]);
  
  // If no suggestions, don't render anything
  if (suggestions.length === 0) {
    return null;
  }
  
  const isCompact = variant === 'compact';
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-muted/30",
        isCompact ? "py-2 px-3" : "py-4"
      )}>
        <CardTitle className={cn(
          "flex items-center",
          isCompact ? "text-base" : "text-lg"
        )}>
          <Lightbulb className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
          {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
        </CardTitle>
        {!isCompact && (
          <CardDescription>
            {language === 'de' 
              ? 'Empfohlene Schritte für Ihren Workflow' 
              : 'Suggested steps for your workflow'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn(
        "grid gap-3", 
        isCompact ? "p-3" : "p-4",
        isCompact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {suggestions.map((suggestion, index) => (
          <div 
            key={`${suggestion.workflowType}-${suggestion.stepId}-${index}`}
            className="bg-card border rounded-md p-3 flex flex-col h-full"
          >
            <div className="flex-1">
              <h3 className="font-medium mb-1">{suggestion.label}</h3>
              {suggestion.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {suggestion.description}
                </p>
              )}
            </div>
            <div className="flex justify-end mt-auto">
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2"
                onClick={() => navigate(suggestion.path)}
              >
                {language === 'de' ? 'Öffnen' : 'Open'} 
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkflowSuggestions;
