
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeInfo, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WorkflowSuggestionsProps {
  currentTool: string;
  workflowType: WorkflowType;
  maxSuggestions?: number;
  className?: string;
}

/**
 * WorkflowSuggestions component - Suggests the next steps or related tools
 * in a workflow to guide the user through logical processes
 */
const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  workflowType,
  maxSuggestions = 3,
  className
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { getNextSteps } = useWorkflow(workflowType);
  
  // Get next steps from the current tool
  const suggestedNextSteps = getNextSteps(currentTool, maxSuggestions);
  
  if (suggestedNextSteps.length === 0) {
    return null;
  }
  
  return (
    <Card className={cn("bg-muted/40", className)}>
      <CardContent className="p-4">
        <h3 className="flex items-center text-sm font-medium text-muted-foreground mb-3">
          <BadgeInfo className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Nächste empfohlene Schritte' : 'Next recommended steps'}
        </h3>
        
        <div className="grid gap-2">
          {suggestedNextSteps.map(step => (
            <Button 
              key={step.id}
              variant="ghost"
              className="justify-start h-auto py-3 px-4 bg-background/80 hover:bg-background"
              onClick={() => navigate(step.path)}
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
