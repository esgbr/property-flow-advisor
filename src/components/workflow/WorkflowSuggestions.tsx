
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnifiedWorkflowNavigation } from '@/hooks/use-unified-workflow-navigation';
import { ArrowRight } from 'lucide-react';
import { WorkflowType } from '@/hooks/use-workflow';

interface WorkflowSuggestionsProps {
  currentTool: string;
  workflowType?: WorkflowType;
  maxSuggestions?: number;
  className?: string;
}

const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  currentTool,
  workflowType,
  maxSuggestions = 3,
  className = '',
}) => {
  const { language } = useLanguage();
  const { getSuggestedWorkflows, navigateToWorkflow } = useUnifiedWorkflowNavigation();
  
  const suggestions = getSuggestedWorkflows(currentTool)
    // Filter by workflow type if provided
    .filter(suggestion => !workflowType || suggestion.route.workflowType === workflowType)
    .slice(0, maxSuggestions);

  if (suggestions.length === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {language === 'de' ? 'Empfohlene nächste Schritte' : 'Recommended Next Steps'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-col gap-2">
          {suggestions.map(suggestion => (
            <Button
              key={suggestion.target}
              variant="outline"
              className="justify-between text-left hover:bg-muted/50"
              onClick={() => navigateToWorkflow(suggestion.target)}
            >
              <div>
                <span className="font-medium">
                  {suggestion.route.title[language as keyof typeof suggestion.route.title] || 
                   suggestion.route.title.en}
                </span>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description[language as keyof typeof suggestion.description] || 
                   suggestion.description.en}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowSuggestions;
