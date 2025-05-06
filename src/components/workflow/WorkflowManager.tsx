
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import WorkflowTabs from './WorkflowTabs';
import WorkflowResetDialog from './WorkflowResetDialog';

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
          ? `Der ${activeWorkflow.workflow.title.de}-Workflow wurde zurückgesetzt.`
          : `The ${activeWorkflow.workflow.title.en} workflow has been reset.`,
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
    <Card className={className}>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <WorkflowTabs 
              activeTab={activeTab}
              onTabChange={(value) => setActiveTab(value as WorkflowType)}
            />
          </div>
          
          <WorkflowResetDialog
            open={isResetDialogOpen}
            onOpenChange={setIsResetDialogOpen}
            onConfirm={handleResetWorkflow}
            isResetting={isResetting}
            workflowType={activeTab}
          />
          
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsResetDialogOpen(true)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {language === 'de' ? 'Zurücksetzen' : 'Reset'}
            </Button>
          </DialogTrigger>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowManager;
