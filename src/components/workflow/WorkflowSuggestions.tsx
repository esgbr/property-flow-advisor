
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeInfo, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

interface WorkflowSuggestionsProps {
  currentTool: string;
  workflowType: WorkflowType;
  maxSuggestions?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

/**
 * WorkflowSuggestions component - Suggests the next steps or related tools
 * in a workflow to guide the user through logical processes
 */
const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  workflowType,
  maxSuggestions = 3,
  className,
  variant = 'default'
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { getNextSteps, markStepComplete } = useWorkflow(workflowType);
  const { preferences } = useUserPreferences();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Get next steps from the current tool
  const suggestedNextSteps = getNextSteps(currentTool, maxSuggestions);
  
  // Mark this step as viewed in the user's progress
  useEffect(() => {
    if (preferences.trackWorkflowProgress) {
      markStepComplete(currentTool);
    }
  }, [currentTool, markStepComplete, preferences.trackWorkflowProgress]);
  
  // Navigate to selected step
  const handleStepClick = (step: { id: string; path: string }) => {
    toast.success(
      language === 'de' 
        ? 'Navigiere zum nächsten Schritt' 
        : 'Navigating to next step'
    );
    navigate(step.path);
  };
  
  if (suggestedNextSteps.length === 0) {
    return null;
  }
  
  if (variant === 'inline') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)} ref={suggestionsRef}>
        {suggestedNextSteps.map(step => (
          <Button
            key={step.id}
            variant="outline"
            size="sm"
            className="bg-background/80 flex items-center"
            onClick={() => handleStepClick(step)}
          >
            {step.label[language as keyof typeof step.label]}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        ))}
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <Card className={cn("bg-muted/20", className)} ref={suggestionsRef}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center text-sm font-medium text-muted-foreground">
              <BadgeInfo className="h-3 w-3 mr-1" />
              {language === 'de' ? 'Nächste Schritte' : 'Next Steps'}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestedNextSteps.map(step => (
              <Button
                key={step.id}
                variant="secondary"
                size="sm"
                onClick={() => handleStepClick(step)}
                className="text-xs"
              >
                {step.label[language as keyof typeof step.label]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default variant
  return (
    <Card className={cn("bg-muted/40", className)} ref={suggestionsRef}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <BadgeInfo className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Nächste empfohlene Schritte' : 'Next recommended steps'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2">
          {suggestedNextSteps.map(step => (
            <Button 
              key={step.id}
              variant="ghost"
              className="justify-start h-auto py-3 px-4 bg-background/80 hover:bg-background"
              onClick={() => handleStepClick(step)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium mb-0.5">
                    {step.label[language as keyof typeof step.label]}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted-foreground">
                      {step.description[language as keyof typeof step.description]}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowSuggestions;
