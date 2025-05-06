
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { workflowDefinitions } from '@/data/workflow-definitions';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import WorkflowHistory from '@/components/workflow/WorkflowHistory';
import { MoreHorizontal, Trello, Calendar, RotateCcw, CheckCircle, Settings, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface WorkflowManagerProps {
  className?: string;
}

/**
 * Comprehensive workflow management component
 * Allows users to view, manage, and reset their workflows
 */
const WorkflowManager: React.FC<WorkflowManagerProps> = ({ className }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { resetWorkflow } = useWorkflowState();
  const [activeTab, setActiveTab] = useState<WorkflowType>('steuer');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  
  // Initialize workflow hooks for each workflow type
  const steuerWorkflow = useWorkflow('steuer');
  const immobilienWorkflow = useWorkflow('immobilien');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  const analyseWorkflow = useWorkflow('analyse');
  
  // Get the active workflow based on the selected tab
  const getActiveWorkflow = () => {
    switch (activeTab) {
      case 'steuer':
        return steuerWorkflow;
      case 'immobilien':
        return immobilienWorkflow;
      case 'finanzierung':
        return finanzierungWorkflow;
      case 'analyse':
      default:
        return analyseWorkflow;
    }
  };
  
  // Get workflow progress information
  const getWorkflowProgress = (workflowType: WorkflowType) => {
    const workflow = (() => {
      switch (workflowType) {
        case 'steuer': return steuerWorkflow;
        case 'immobilien': return immobilienWorkflow;
        case 'finanzierung': return finanzierungWorkflow;
        case 'analyse': return analyseWorkflow;
      }
    })();
    
    const steps = workflow.getStepsWithStatus();
    const completedSteps = steps.filter(step => step.isComplete).length;
    const progress = workflow.getWorkflowProgress();
    
    return {
      total: steps.length,
      completed: completedSteps,
      progress: progress
    };
  };
  
  // Handle workflow reset
  const handleResetWorkflow = () => {
    setIsResetting(true);
    
    setTimeout(() => {
      const activeWorkflow = getActiveWorkflow();
      activeWorkflow.resetWorkflow();
      
      toast({
        title: language === 'de' ? 'Workflow zurückgesetzt' : 'Workflow reset',
        description: language === 'de'
          ? `Der ${workflowDefinitions[activeTab].title.de}-Workflow wurde zurückgesetzt.`
          : `The ${workflowDefinitions[activeTab].title.en} workflow has been reset.`,
        variant: 'default'
      });
      
      setIsResetting(false);
      setIsResetDialogOpen(false);
    }, 1000);
  };
  
  // Get workflow summary
  const getWorkflowSummary = () => {
    const steuerProgress = getWorkflowProgress('steuer');
    const immobilienProgress = getWorkflowProgress('immobilien');
    const finanzierungProgress = getWorkflowProgress('finanzierung');
    const analyseProgress = getWorkflowProgress('analyse');
    
    const totalSteps = steuerProgress.total + immobilienProgress.total + finanzierungProgress.total + analyseProgress.total;
    const totalCompleted = steuerProgress.completed + immobilienProgress.completed + finanzierungProgress.completed + analyseProgress.completed;
    
    return {
      totalSteps,
      totalCompleted,
      overallProgress: totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0
    };
  };
  
  const summary = getWorkflowSummary();
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {language === 'de' ? 'Workflow-Manager' : 'Workflow Manager'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Verwalten Sie alle Ihre Workflows' : 'Manage all your workflows'}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {summary.totalCompleted}/{summary.totalSteps} {language === 'de' ? 'Schritte' : 'steps'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as WorkflowType)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="steuer">
                {language === 'de' ? 'Steuer' : 'Tax'}
              </TabsTrigger>
              <TabsTrigger value="immobilien">
                {language === 'de' ? 'Immobilien' : 'Property'}
              </TabsTrigger>
              <TabsTrigger value="finanzierung">
                {language === 'de' ? 'Finanzierung' : 'Financing'}
              </TabsTrigger>
              <TabsTrigger value="analyse">
                {language === 'de' ? 'Analyse' : 'Analysis'}
              </TabsTrigger>
            </TabsList>
            
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {language === 'de' ? 'Zurücksetzen' : 'Reset'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {language === 'de'
                      ? `Workflow "${workflowDefinitions[activeTab].title.de}" zurücksetzen?`
                      : `Reset "${workflowDefinitions[activeTab].title.en}" workflow?`
                    }
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'de'
                      ? 'Dies wird den Fortschritt und alle gespeicherten Daten für diesen Workflow löschen. Diese Aktion kann nicht rückgängig gemacht werden.'
                      : 'This will delete all progress and saved data for this workflow. This action cannot be undone.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsResetDialogOpen(false)}
                    disabled={isResetting}
                  >
                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleResetWorkflow}
                    disabled={isResetting}
                  >
                    {isResetting
                      ? (language === 'de' ? 'Wird zurückgesetzt...' : 'Resetting...')
                      : (language === 'de' ? 'Ja, zurücksetzen' : 'Yes, reset')
                    }
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="steuer" className="mt-0">
            <ScrollArea className="max-h-[500px]">
              <WorkflowSteps workflowType="steuer" />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="immobilien" className="mt-0">
            <ScrollArea className="max-h-[500px]">
              <WorkflowSteps workflowType="immobilien" />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="finanzierung" className="mt-0">
            <ScrollArea className="max-h-[500px]">
              <WorkflowSteps workflowType="finanzierung" />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="analyse" className="mt-0">
            <ScrollArea className="max-h-[500px]">
              <WorkflowSteps workflowType="analyse" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <WorkflowHistory />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowManager;
