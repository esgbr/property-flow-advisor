
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { WorkflowType } from '@/hooks/use-workflow';
import { cn } from '@/lib/utils';
import { getMarketRelevantWorkflows } from '@/utils/workflowUtils';
import { useAccessibility } from '@/hooks/use-accessibility';

interface WorkflowSuggestionsProps {
  className?: string;
  currentWorkflow?: WorkflowType;
  limit?: number;
}

/**
 * Component that displays workflow suggestions based on the user's current market
 */
export const WorkflowSuggestions: React.FC<WorkflowSuggestionsProps> = ({
  className,
  currentWorkflow,
  limit = 3
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { getCurrentMarket } = useMarketFilter();
  const { announce } = useAccessibility();
  const currentMarket = getCurrentMarket();

  // Get workflows that are relevant to the current market
  const relevantWorkflows = getMarketRelevantWorkflows(currentMarket);
  
  // Filter out the current workflow if provided
  const filteredWorkflows = relevantWorkflows
    .filter(workflow => workflow !== currentWorkflow)
    .slice(0, limit);
  
  // If there are no suggestions after filtering, don't render anything
  if (filteredWorkflows.length === 0) {
    return null;
  }

  // Handle navigation to a workflow
  const handleNavigation = (workflow: WorkflowType) => {
    const firstStepPath = workflowDefinitions[workflow].steps[0].path;
    
    const workflowName = 
      language === 'de' 
        ? workflowDefinitions[workflow].title.de 
        : workflowDefinitions[workflow].title.en;
        
    announce(
      language === 'de'
        ? `Navigation zu ${workflowName}`
        : `Navigating to ${workflowName}`,
      'polite'
    );
    
    navigate(firstStepPath);
  };
  
  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{t('relatedWorkflows')}</CardTitle>
        <CardDescription>{t('otherUsefulTools')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredWorkflows.map(workflow => {
          const workflowDef = workflowDefinitions[workflow];
          
          return (
            <div key={workflow} className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-medium">
                  {workflowDef.title[language as keyof typeof workflowDef.title]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {workflowDef.description[language as keyof typeof workflowDef.description]}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-2"
                onClick={() => handleNavigation(workflow)}
              >
                {t('start')}
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default WorkflowSuggestions;
