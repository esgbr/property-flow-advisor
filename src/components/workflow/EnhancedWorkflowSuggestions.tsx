
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Clock, Star, CheckCircle, Trello } from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { WorkflowType } from '@/hooks/use-workflow';
import { cn } from '@/lib/utils';
import { getRelatedWorkflowsForTool, getCommonNextSteps } from '@/utils/workflowUtils';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';

interface EnhancedWorkflowSuggestionsProps {
  className?: string;
  currentTool?: string;
  currentWorkflow?: WorkflowType;
  maxSuggestions?: number;
}

/**
 * Enhanced workflow suggestions with more personalized recommendations
 * Recommends workflows and tools based on user's current task, market, and history
 */
export const EnhancedWorkflowSuggestions: React.FC<EnhancedWorkflowSuggestionsProps> = ({
  className,
  currentTool,
  currentWorkflow,
  maxSuggestions = 3
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { getCurrentMarket } = useMarketFilter();
  const { announce } = useAccessibility();
  const { getAllWorkflowsProgress } = useWorkflowState();
  const [suggestions, setSuggestions] = useState<Array<{
    workflow: WorkflowType;
    stepId: string;
    path: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    type: 'related' | 'popular' | 'next' | 'incomplete';
  }>>([]);

  const currentMarket = getCurrentMarket();
  const workflowsProgress = getAllWorkflowsProgress();
  
  // Generate suggestions based on current context
  useEffect(() => {
    const allSuggestions = [];
    
    // 1. Add suggestions from related workflows based on current tool
    if (currentTool) {
      const relatedWorkflows = getRelatedWorkflowsForTool(currentTool);
      
      // Filter out current workflow
      const filteredWorkflows = relatedWorkflows.filter(wf => wf !== currentWorkflow);
      
      filteredWorkflows.forEach(workflow => {
        const workflowDef = workflowDefinitions[workflow];
        const firstStep = workflowDef.steps[0];
        
        allSuggestions.push({
          workflow,
          stepId: firstStep.id,
          path: firstStep.path,
          title: workflowDef.title[language as keyof typeof workflowDef.title],
          description: workflowDef.description[language as keyof typeof workflowDef.description],
          icon: workflowDef.steps[0].icon,
          type: 'related' as const
        });
      });
    }
    
    // 2. Add suggestions for next steps across workflows
    if (currentTool) {
      const nextSteps = getCommonNextSteps(currentTool, currentWorkflow ? [currentWorkflow] : []);
      
      nextSteps.forEach(({ step, workflow }) => {
        const workflowDef = workflowDefinitions[workflow];
        
        allSuggestions.push({
          workflow,
          stepId: step.id,
          path: step.path,
          title: step.label[language as keyof typeof step.label],
          description: step.description?.[language as keyof typeof step.description] || '',
          icon: step.icon,
          type: 'next' as const
        });
      });
    }
    
    // 3. Add incomplete workflows
    const incompleteWorkflows = findIncompleteWorkflows();
    if (incompleteWorkflows.length > 0) {
      incompleteWorkflows.forEach(item => {
        const workflowDef = workflowDefinitions[item.workflow];
        
        allSuggestions.push({
          workflow: item.workflow,
          stepId: item.step.id,
          path: item.step.path,
          title: `${language === 'de' ? 'Fortfahren mit: ' : 'Continue: '} ${
            workflowDef.title[language as keyof typeof workflowDef.title]
          }`,
          description: item.step.description?.[language as keyof typeof item.step.description] || '',
          icon: item.step.icon,
          type: 'incomplete' as const
        });
      });
    }
    
    // Remove duplicates and limit suggestions
    const uniqueSuggestions = allSuggestions.filter((item, index, self) =>
      index === self.findIndex(t => t.path === item.path)
    ).slice(0, maxSuggestions);
    
    setSuggestions(uniqueSuggestions);
  }, [currentTool, currentWorkflow, language, maxSuggestions]);
  
  // Helper function to find incomplete workflows
  const findIncompleteWorkflows = () => {
    const incomplete = [];
    
    Object.keys(workflowsProgress).forEach(key => {
      if (!key.startsWith('workflow_')) return;
      
      const workflowType = key.replace('workflow_', '') as WorkflowType;
      if (workflowType === currentWorkflow) return;
      
      const progress = workflowsProgress[key];
      const workflowDef = workflowDefinitions[workflowType];
      
      if (progress && workflowDef) {
        const completedSteps = progress.completedSteps || [];
        const totalSteps = workflowDef.steps.length;
        
        if (completedSteps.length > 0 && completedSteps.length < totalSteps) {
          // Find first uncompleted step
          const nextStep = workflowDef.steps.find(step => !completedSteps.includes(step.id));
          
          if (nextStep) {
            incomplete.push({
              workflow: workflowType,
              step: nextStep
            });
          }
        }
      }
    });
    
    return incomplete;
  };
  
  // Handle navigation to a workflow step
  const handleStepClick = (workflow: WorkflowType, path: string, title: string) => {
    navigate(path);
    
    announce(
      language === 'de'
        ? `Navigation zu ${title}`
        : `Navigating to ${title}`,
      'polite'
    );
  };
  
  // If there are no suggestions, don't render anything
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{t('relatedWorkflows')}</CardTitle>
        <CardDescription>{t('otherUsefulTools')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <div key={`${suggestion.workflow}-${suggestion.stepId}-${index}`} className="flex justify-between items-center">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-1.5 rounded-lg mt-0.5">
                {suggestion.icon || (
                  suggestion.type === 'related' ? <Trello className="h-5 w-5 text-primary" /> :
                  suggestion.type === 'next' ? <ArrowRight className="h-5 w-5 text-primary" /> :
                  suggestion.type === 'incomplete' ? <Clock className="h-5 w-5 text-primary" /> :
                  <Star className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-base font-medium">
                  {suggestion.title}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {language === 'de' ? (
                      suggestion.type === 'related' ? 'Verwandt' :
                      suggestion.type === 'next' ? 'Nächster Schritt' :
                      suggestion.type === 'incomplete' ? 'Fortsetzen' : 'Beliebt'
                    ) : (
                      suggestion.type === 'related' ? 'Related' :
                      suggestion.type === 'next' ? 'Next Step' :
                      suggestion.type === 'incomplete' ? 'Continue' : 'Popular'
                    )}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-2"
                    onClick={() => handleStepClick(suggestion.workflow, suggestion.path, suggestion.title)}
                  >
                    {suggestion.type === 'incomplete' ? (
                      language === 'de' ? 'Fortsetzen' : 'Continue'
                    ) : (
                      language === 'de' ? 'Starten' : 'Start'
                    )}
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {language === 'de' ? `Zu ${suggestion.title} wechseln` : `Navigate to ${suggestion.title}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EnhancedWorkflowSuggestions;
