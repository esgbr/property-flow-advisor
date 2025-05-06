
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWorkflow, WorkflowType, workflowDefinitions } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { BadgeInfo, ArrowRight, Sparkles, Clock, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useMarketFilter } from '@/hooks/use-market-filter';

interface EnhancedWorkflowSuggestionProps {
  currentTool: string;
  workflowType?: WorkflowType;
  className?: string;
  maxSuggestions?: number;
  variant?: 'default' | 'compact' | 'minimal';
  showAIRecommendations?: boolean;
}

/**
 * EnhancedWorkflowSuggestions - An intelligent component that provides contextual
 * suggestions for next steps in workflows. It can analyze across different workflows
 * to provide the most relevant recommendations.
 */
const EnhancedWorkflowSuggestions: React.FC<EnhancedWorkflowSuggestionProps> = ({
  currentTool,
  workflowType,
  className,
  maxSuggestions = 3,
  variant = 'default',
  showAIRecommendations = true
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { userMarket } = useMarketFilter();
  const { preferences } = useUserPreferences();
  
  // If a specific workflow is provided, use it; otherwise, we'll look across workflows
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    path: string;
    label: { de: string; en: string };
    description?: { de: string; en: string };
    workflow: WorkflowType;
    priority: number;
    estimatedTime?: number;
  }>>([]);
  
  // Get recommendations based on user history, current tool, and other contexts
  useEffect(() => {
    // Start with direct next steps from the current workflow if provided
    const allSuggestions = [];
    
    // First priority: If we have a specific workflow, get the next steps in that workflow
    if (workflowType) {
      const workflow = useWorkflow(workflowType);
      const nextSteps = workflow.getNextSteps(currentTool);
      
      nextSteps.forEach(step => {
        allSuggestions.push({
          ...step,
          workflow: workflowType,
          priority: 10 // Highest priority
        });
      });
    }
    
    // Second priority: Look at related workflows based on the current tool
    // Map tools to potential related workflows
    const relatedWorkflows: Record<string, WorkflowType[]> = {
      'grunderwerbsteuer': ['steuer', 'finanzierung'],
      'rendite': ['immobilien', 'analyse'],
      'portfolio': ['immobilien', 'analyse', 'steuer'],
      // Add more mappings as needed
    };
    
    const toolRelatedWorkflows = relatedWorkflows[currentTool] || [];
    
    toolRelatedWorkflows.forEach(wfType => {
      // Skip the current workflow as we've already processed it
      if (wfType === workflowType) return;
      
      const workflow = useWorkflow(wfType);
      const relatedSteps = workflow.getWorkflowSteps().slice(0, 2); // First 2 steps
      
      relatedSteps.forEach(step => {
        // Only add steps that aren't already in the list
        if (!allSuggestions.some(s => s.id === step.id)) {
          allSuggestions.push({
            ...step,
            workflow: wfType,
            priority: 5 // Medium priority
          });
        }
      });
    });
    
    // Third priority: User history based suggestions
    // Look at the user's completed steps across workflows to find potential next steps
    Object.keys(workflowDefinitions).forEach(wfType => {
      // Skip the current workflow as we've already processed it
      if (wfType === workflowType) continue;
      
      const workflow = useWorkflow(wfType as WorkflowType);
      const completedSteps = workflow.getCompleteSteps();
      
      // If the user has completed steps in this workflow, suggest the next steps
      if (completedSteps.length > 0) {
        const lastCompletedStep = completedSteps[completedSteps.length - 1];
        const nextSteps = workflow.getNextSteps(lastCompletedStep.id, 1);
        
        nextSteps.forEach(step => {
          // Only add steps that aren't already in the list
          if (!allSuggestions.some(s => s.id === step.id)) {
            allSuggestions.push({
              ...step,
              workflow: wfType as WorkflowType,
              priority: 3 // Lower priority
            });
          }
        });
      }
    });
    
    // Sort by priority (descending) and limit
    const sortedSuggestions = allSuggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxSuggestions);
      
    setSuggestions(sortedSuggestions);
  }, [currentTool, workflowType, maxSuggestions]);
  
  const handleSuggestionClick = (suggestion: any) => {
    // Navigate to the suggested path
    navigate(suggestion.path);
  };
  
  if (suggestions.length === 0) return null;
  
  // Minimal variant for embedding in other components
  if (variant === 'minimal') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {suggestions.map(suggestion => (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            onClick={() => handleSuggestionClick(suggestion)}
            className="bg-background/80 flex items-center"
          >
            {suggestion.label[language as keyof typeof suggestion.label]}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        ))}
      </div>
    );
  }
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn("bg-muted/20", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center text-sm font-medium text-muted-foreground">
              {showAIRecommendations ? (
                <Sparkles className="h-3 w-3 mr-1 text-primary" />
              ) : (
                <BadgeInfo className="h-3 w-3 mr-1" />
              )}
              {language === 'de' ? 'Empfehlungen' : 'Recommendations'}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <Button
                key={suggestion.id}
                variant="secondary"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
              >
                {suggestion.label[language as keyof typeof suggestion.label]}
                {suggestion.estimatedTime && !isMobile && (
                  <span className="ml-1 opacity-70 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {suggestion.estimatedTime}m
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card className={cn("bg-muted/40", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          {showAIRecommendations ? (
            <>
              <Sparkles className="h-4 w-4 mr-1 text-primary" />
              {language === 'de' ? 'Personalisierte Empfehlungen' : 'Personalized Recommendations'}
            </>
          ) : (
            <>
              <BadgeInfo className="h-4 w-4 mr-1" />
              {language === 'de' ? 'Empfohlene nächste Schritte' : 'Recommended Next Steps'}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2">
          {suggestions.map(suggestion => (
            <Button 
              key={suggestion.id}
              variant="ghost"
              className="justify-start h-auto py-3 px-4 bg-background/80 hover:bg-background"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium mb-0.5 flex items-center">
                    {suggestion.priority > 8 && <CheckCheck className="h-3 w-3 mr-1 text-green-500" />}
                    {suggestion.label[language as keyof typeof suggestion.label]}
                  </span>
                  {suggestion.description && (
                    <span className="text-xs text-muted-foreground">
                      {suggestion.description[language as keyof typeof suggestion.description]}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {suggestion.estimatedTime && (
                    <span className="text-xs text-muted-foreground mr-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {suggestion.estimatedTime}m
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedWorkflowSuggestions;
