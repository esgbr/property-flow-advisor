
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { WorkflowType } from '@/hooks/use-workflow';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface WorkflowHistoryProps {
  maxItems?: number;
  className?: string;
}

/**
 * Displays a history of workflow interactions
 * Shows recently completed steps and workflows
 */
const WorkflowHistory: React.FC<WorkflowHistoryProps> = ({ 
  maxItems = 5,
  className 
}) => {
  const { language } = useLanguage();
  const { workflows } = useWorkflowState();
  
  // Process workflow history
  const historyItems = React.useMemo(() => {
    const items: Array<{
      date: Date;
      workflowType: WorkflowType;
      stepId: string;
      stepLabel: string;
    }> = [];
    
    // Process each workflow
    Object.entries(workflows).forEach(([key, value]) => {
      // Only process workflow entries
      if (!key.startsWith('workflow_')) return;
      
      const workflowType = key.replace('workflow_', '') as WorkflowType;
      
      // Skip if not a valid workflow type
      if (!workflowDefinitions[workflowType]) return;
      
      // Process completed steps
      value.completedSteps.forEach(stepId => {
        const step = workflowDefinitions[workflowType].steps.find(s => s.id === stepId);
        if (step) {
          const stepLabel = step.label[language as keyof typeof step.label];
          const item = {
            date: value.lastInteractionAt ? new Date(value.lastInteractionAt) : new Date(),
            workflowType,
            stepId,
            stepLabel
          };
          items.push(item);
        }
      });
    });
    
    // Sort by date (newest first) and limit
    return items
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, maxItems);
  }, [workflows, language, maxItems]);
  
  // If no history items, show a message
  if (historyItems.length === 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-muted-foreground text-sm">
          {language === 'de' 
            ? 'Keine Workflow-Aktivitäten gefunden.' 
            : 'No workflow activities found.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">
          {language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activities'}
        </h3>
      </div>
      
      <ScrollArea className="max-h-[200px]">
        <div className="space-y-2">
          {historyItems.map((item, index) => {
            const workflowTitle = workflowDefinitions[item.workflowType].title[
              language as keyof typeof workflowDefinitions[item.workflowType].title
            ];
            
            return (
              <div 
                key={`${item.workflowType}-${item.stepId}-${index}`}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.stepLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {workflowTitle}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(item.date, { 
                      addSuffix: true,
                      locale: language === 'de' ? de : undefined
                    })}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkflowHistory;
