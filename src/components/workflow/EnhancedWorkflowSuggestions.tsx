
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getMarketRelevantWorkflows, getRelatedWorkflowsForTool, getCommonNextSteps, findIncompleteWorkflows } from '@/utils/workflowUtils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useScreenReader } from '@/hooks/use-screen-reader';

interface EnhancedWorkflowSuggestionsProps {
  currentTool?: string;
  maxSuggestions?: number;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Suggests related workflows and next steps based on the current context
 * This helps users discover related tools and continue their workflow
 */
const EnhancedWorkflowSuggestions: React.FC<EnhancedWorkflowSuggestionsProps> = ({
  currentTool,
  maxSuggestions = 3,
  className,
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { workflows } = useWorkflowState();
  const { preferences } = useUserPreferences();
  const [suggestions, setSuggestions] = useState<Array<{
    type: 'related' | 'next' | 'incomplete';
    workflow: WorkflowType;
    stepId: string;
    path: string;
    label: string;
    description?: string;
  }>>([]);
  const { announceNavigation } = useScreenReader();

  // Generate suggestions based on current context
  useEffect(() => {
    const newSuggestions: Array<{
      type: 'related' | 'next' | 'incomplete';
      workflow: WorkflowType;
      stepId: string;
      path: string;
      label: string;
      description?: string;
    }> = [];

    // Get user's market
    const userMarket = preferences.investmentMarket || 'germany';

    // 1. Get suggestions based on current tool
    if (currentTool) {
      // Find related workflows for the current tool
      const relatedWorkflows = getRelatedWorkflowsForTool(currentTool);
      
      // Find common next steps across workflows
      const commonNext = getCommonNextSteps(currentTool, []);
      
      // Add common next step suggestions
      commonNext.forEach(nextStep => {
        const labelKey = language as keyof typeof nextStep.step.label;
        const descriptionKey = language as keyof typeof nextStep.step.description;
        
        newSuggestions.push({
          type: 'next',
          workflow: nextStep.workflow as WorkflowType,
          stepId: nextStep.step.id,
          path: nextStep.step.path,
          label: nextStep.step.label[labelKey],
          description: nextStep.step.description ? nextStep.step.description[descriptionKey] : undefined
        });
        
        if (newSuggestions.length >= maxSuggestions) return;
      });
    }
    
    // 2. Get market-specific workflow suggestions
    if (newSuggestions.length < maxSuggestions) {
      const marketWorkflows = getMarketRelevantWorkflows(userMarket);
      
      // For each market-relevant workflow, suggest first uncompleted step
      marketWorkflows.forEach(workflow => {
        if (newSuggestions.length >= maxSuggestions) return;

        const workflowHook = useWorkflow(workflow);
        const steps = workflowHook.getStepsWithStatus();
        const incompleteStep = steps.find(step => !step.isComplete);
        
        if (incompleteStep) {
          const labelKey = language as keyof typeof incompleteStep.label;
          const descriptionKey = language as keyof typeof incompleteStep.description;
          
          // Check if this suggestion is not already in the list
          if (!newSuggestions.some(s => s.workflow === workflow && s.stepId === incompleteStep.id)) {
            newSuggestions.push({
              type: 'related',
              workflow,
              stepId: incompleteStep.id,
              path: incompleteStep.path,
              label: incompleteStep.label[labelKey],
              description: incompleteStep.description ? incompleteStep.description[descriptionKey] : undefined
            });
          }
        }
      });
    }
    
    // 3. Find incomplete workflows
    if (newSuggestions.length < maxSuggestions) {
      const incompleteWorkflowSteps = findIncompleteWorkflows(workflows);
      
      incompleteWorkflowSteps.forEach(item => {
        if (newSuggestions.length >= maxSuggestions) return;
        
        const labelKey = language as keyof typeof item.step.label;
        const descriptionKey = language as keyof typeof item.step.description;
        
        // Check if this suggestion is not already in the list
        if (!newSuggestions.some(s => s.workflow === item.workflow && s.stepId === item.step.id)) {
          newSuggestions.push({
            type: 'incomplete',
            workflow: item.workflow,
            stepId: item.step.id,
            path: item.step.path,
            label: item.step.label[labelKey],
            description: item.step.description ? item.step.description[descriptionKey] : undefined
          });
        }
      });
    }
    
    setSuggestions(newSuggestions.slice(0, maxSuggestions));
  }, [currentTool, language, maxSuggestions, preferences.investmentMarket, workflows]);

  // If no suggestions, don't render anything
  if (suggestions.length === 0) {
    return null;
  }

  const handleNavigate = (path: string, label: string) => {
    announceNavigation(label);
    navigate(path);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn(
        "bg-muted/30",
        variant === 'compact' ? "py-2 px-3" : "py-4"
      )}>
        <CardTitle className={cn(
          "flex items-center",
          variant === 'compact' ? "text-base" : "text-lg"
        )}>
          <Lightbulb className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
          {language === 'de' ? 'Empfehlungen für Sie' : 'Recommendations for you'}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        "grid gap-3", 
        variant === 'compact' ? "p-3" : "p-4",
        variant === 'compact' ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
      )}>
        {suggestions.map((suggestion, index) => (
          <div 
            key={`${suggestion.workflow}-${suggestion.stepId}-${index}`}
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
                onClick={() => handleNavigate(suggestion.path, suggestion.label)}
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

export default EnhancedWorkflowSuggestions;
