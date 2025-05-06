
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/utils/formatters';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { WorkflowType } from '@/hooks/use-workflow';
import { CheckCircle, Clock, ArrowRight, Calendar, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface WorkflowHistoryProps {
  className?: string;
  maxItems?: number;
  showClearButton?: boolean;
}

/**
 * Component that displays the user's workflow history
 */
const WorkflowHistory: React.FC<WorkflowHistoryProps> = ({
  className,
  maxItems = 5,
  showClearButton = true
}) => {
  const { getAllWorkflowsProgress, clearWorkflowHistory } = useWorkflowState();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);
  
  const allProgress = getAllWorkflowsProgress();
  
  // Generate history items from workflow progress
  const historyItems = React.useMemo(() => {
    const items: Array<{
      workflow: WorkflowType;
      stepId: string;
      date: Date;
      path: string;
      title: string;
      isComplete: boolean;
    }> = [];
    
    // Process all workflow progress data
    Object.keys(allProgress).forEach(key => {
      if (!key.startsWith('workflow_')) return;
      
      const workflowType = key.replace('workflow_', '') as WorkflowType;
      const progress = allProgress[key];
      const workflowDef = workflowDefinitions[workflowType];
      
      if (!progress || !workflowDef) return;
      
      // Extract completion data with timestamps
      const stepHistory = progress.stepHistory || [];
      
      stepHistory.forEach(history => {
        const step = workflowDef.steps.find(s => s.id === history.stepId);
        
        if (step) {
          items.push({
            workflow: workflowType,
            stepId: history.stepId,
            date: new Date(history.timestamp),
            path: step.path,
            title: `${workflowDef.title[language as keyof typeof workflowDef.title]}: ${
              step.label[language as keyof typeof step.label]
            }`,
            isComplete: history.action === 'complete'
          });
        }
      });
    });
    
    // Sort by date (newest first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, maxItems);
  }, [allProgress, language, maxItems]);
  
  // Handle navigation to a workflow step
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  // Handle clearing workflow history
  const handleClearHistory = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearWorkflowHistory();
      setIsClearing(false);
    }, 1000);
  };
  
  // If there is no history, show a placeholder
  if (historyItems.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Workflow-Verlauf' : 'Workflow History'}
          </CardTitle>
          <CardDescription>
            {language === 'de' ? 'Ihre kürzlich abgeschlossenen Schritte' : 'Your recently completed steps'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
          <p className="mt-4 text-muted-foreground">
            {language === 'de' ? 'Noch keine Workflow-Aktivität.' : 'No workflow activity yet.'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/german-real-estate-investor')}
          >
            {language === 'de' ? 'Workflows erkunden' : 'Explore workflows'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>
            {language === 'de' ? 'Workflow-Verlauf' : 'Workflow History'}
          </CardTitle>
          <CardDescription>
            {language === 'de' ? 'Ihre kürzlich abgeschlossenen Schritte' : 'Your recently completed steps'}
          </CardDescription>
        </div>
        {showClearButton && historyItems.length > 0 && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            disabled={isClearing}
          >
            {isClearing ? (
              language === 'de' ? 'Löschen...' : 'Clearing...'
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                {language === 'de' ? 'Leeren' : 'Clear'}
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-4">
            {historyItems.map((item, index) => (
              <div 
                key={`${item.workflow}-${item.stepId}-${index}`}
                className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors"
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  item.isComplete ? "bg-green-500/10" : "bg-blue-500/10"
                )}>
                  {item.isComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{item.title}</p>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {item.isComplete ? (
                        language === 'de' ? 'Abgeschlossen' : 'Completed'
                      ) : (
                        language === 'de' ? 'Besucht' : 'Visited'
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(item.date, language, { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-xs h-7 px-2"
                    onClick={() => handleNavigate(item.path)}
                  >
                    {language === 'de' ? 'Wiederholen' : 'Revisit'}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WorkflowHistory;
