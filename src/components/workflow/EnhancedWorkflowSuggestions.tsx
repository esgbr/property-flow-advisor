
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { getRelatedWorkflowsForTool, getCommonNextSteps } from '@/utils/workflowUtils';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAccessibility } from '@/hooks/use-accessibility';
import { cn } from '@/lib/utils';

interface EnhancedWorkflowSuggestionsProps {
  currentTool: string;
  excludeWorkflows?: WorkflowType[];
  maxSuggestions?: number;
  className?: string;
}

/**
 * Enhanced workflow suggestions component that provides intelligent
 * recommendations based on user behavior, workflow status, and context.
 */
const EnhancedWorkflowSuggestions: React.FC<EnhancedWorkflowSuggestionsProps> = ({
  currentTool,
  excludeWorkflows = [],
  maxSuggestions = 3,
  className
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { preferences } = useUserPreferences();
  const { announce } = useAccessibility();
  const { workflowProgress } = useWorkflowState();
  const [suggestions, setSuggestions] = useState<Array<{
    title: string;
    description: string;
    path: string;
    workflowType: WorkflowType;
    stepId: string;
    priority: number; // Higher = more relevant
    isCompleted?: boolean;
  }>>([]);

  // Generate suggestions based on various sources
  useEffect(() => {
    const allSuggestions: Array<{
      title: string;
      description: string;
      path: string;
      workflowType: WorkflowType;
      stepId: string;
      priority: number;
      isCompleted?: boolean;
    }> = [];

    // 1. Get suggestions from related workflows
    const relatedWorkflows = getRelatedWorkflowsForTool(currentTool)
      .filter(wf => !excludeWorkflows.includes(wf));

    // 2. Get common next steps based on typical user paths
    const commonNextSteps = getCommonNextSteps(currentTool, excludeWorkflows);

    // 3. Get suggestions from incomplete workflows
    const incompleteWorkflows = findIncompleteWorkflows(workflowProgress, excludeWorkflows);

    // Add related workflow suggestions
    relatedWorkflows.forEach(workflowType => {
      const workflow = useWorkflow(workflowType);
      const firstStep = workflow.getWorkflowSteps()[0];

      if (firstStep) {
        allSuggestions.push({
          title: firstStep.label[language as keyof typeof firstStep.label],
          description: firstStep.description?.[language as keyof typeof firstStep.description] || '',
          path: firstStep.path,
          workflowType,
          stepId: firstStep.id,
          priority: 5, // Base priority for related workflows
          isCompleted: firstStep.isComplete
        });
      }
    });

    // Add common next steps (higher priority)
    commonNextSteps.forEach(({ step, workflow: wfType }) => {
      allSuggestions.push({
        title: step.label[language as keyof typeof step.label],
        description: step.description?.[language as keyof typeof step.description] || '',
        path: step.path,
        workflowType: wfType,
        stepId: step.id,
        priority: 8, // Higher priority for common next steps
        isCompleted: false // Assume not completed since it's a next step
      });
    });

    // Add incomplete workflows (medium priority)
    incompleteWorkflows.forEach(({ workflow: wfType, step }) => {
      allSuggestions.push({
        title: step.label[language as keyof typeof step.label],
        description: step.description?.[language as keyof typeof step.description] || '',
        path: step.path,
        workflowType: wfType,
        stepId: step.id,
        priority: 7, // Medium priority for incomplete workflows
        isCompleted: false // These are incomplete by definition
      });
    });

    // Consider user preferences to adjust priorities
    if (preferences.investmentGoals?.includes('tax-optimization')) {
      // Boost tax-related suggestions
      allSuggestions.forEach(suggestion => {
        if (suggestion.workflowType === 'steuer') {
          suggestion.priority += 2;
        }
      });
    }

    if (preferences.experienceLevel === 'beginner') {
      // Simplify path for beginners
      allSuggestions.forEach(suggestion => {
        if (suggestion.description.includes('basic') || 
            suggestion.description.includes('simple') ||
            suggestion.description.toLowerCase().includes('anfänger')) {
          suggestion.priority += 2;
        }
      });
    }

    // Sort by priority (high to low) and limit
    const finalSuggestions = allSuggestions
      .sort((a, b) => b.priority - a.priority || (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1))
      .slice(0, maxSuggestions);

    setSuggestions(finalSuggestions);
  }, [currentTool, excludeWorkflows, language, preferences, workflowProgress, maxSuggestions]);

  // Navigate to a suggested step
  const navigateToSuggestion = (path: string, suggestionTitle: string) => {
    navigate(path);
    announce(
      language === 'de'
        ? `Navigation zu ${suggestionTitle}`
        : `Navigating to ${suggestionTitle}`,
      'polite'
    );
  };

  // No suggestions to show
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" aria-hidden="true" />
          {t('suggestedNextSteps')}
        </CardTitle>
        <CardDescription>
          {t('personalizedRecommendations')}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={`${suggestion.workflowType}-${suggestion.stepId}`}
            className="flex justify-between items-center"
          >
            <div>
              <h4 className="text-base font-medium flex items-center">
                {suggestion.isCompleted && (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" aria-hidden="true" />
                )}
                {!suggestion.isCompleted && suggestion.priority > 7 && (
                  <Badge variant="outline" className="mr-2 bg-amber-500/10 text-amber-500 border-amber-200">
                    {t('recommended')}
                  </Badge>
                )}
                {suggestion.title}
              </h4>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              {suggestion.priority > 7 && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                  {suggestion.workflowType === 'steuer' && t('fiveMins')}
                  {suggestion.workflowType === 'immobilien' && t('tenMins')}
                  {suggestion.workflowType === 'finanzierung' && t('sevenMins')}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 shrink-0"
              onClick={() => navigateToSuggestion(suggestion.path, suggestion.title)}
            >
              {suggestion.isCompleted ? t('view') : t('start')}
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Helper function to find workflows that need attention
function findIncompleteWorkflows(
  workflowProgress: Record<string, { completedSteps: string[]; currentStep: string }>,
  excludeWorkflows: WorkflowType[] = []
): Array<{ workflow: WorkflowType; step: { id: string; label: any; description?: any; path: string } }> {
  const results: Array<{ 
    workflow: WorkflowType; 
    step: { id: string; label: any; description?: any; path: string } 
  }> = [];
  
  // Look for workflows that have been started but not completed
  Object.entries(workflowProgress).forEach(([key, progress]) => {
    // Extract workflow type from key (e.g., "workflow_steuer" -> "steuer")
    const matches = key.match(/workflow_(.+)/);
    if (!matches || matches.length < 2) return;
    
    const workflowType = matches[1] as WorkflowType;
    
    // Skip excluded workflows
    if (excludeWorkflows.includes(workflowType)) return;
    
    if (progress) {
      const workflow = useWorkflow(workflowType);
      const steps = workflow.getStepsWithStatus();
      const completedCount = progress.completedSteps.length;
      const totalSteps = steps.length;
      
      // If workflow is started but not completed
      if (completedCount > 0 && completedCount < totalSteps) {
        // Find the next uncompleted step
        const nextStep = steps.find(
          step => !progress.completedSteps.includes(step.id)
        );
        
        if (nextStep) {
          results.push({ 
            workflow: workflowType, 
            step: {
              id: nextStep.id,
              label: nextStep.label,
              description: nextStep.description,
              path: nextStep.path
            }
          });
        }
      }
    }
  });
  
  return results;
}

export default EnhancedWorkflowSuggestions;
