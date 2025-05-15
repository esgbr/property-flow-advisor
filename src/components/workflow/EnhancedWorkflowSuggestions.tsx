import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
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
    // KEEP the suggestions array EMPTY to avoid errors from removed functions
    setSuggestions([]);
  }, [currentTool, language, maxSuggestions, preferences.investmentMarket, workflows]);

  // Helper function to validate workflow types
  const isValidWorkflowType = (workflow: string): workflow is WorkflowType => {
    return ['steuer', 'immobilien', 'finanzierung', 'analyse'].includes(workflow);
  };

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
