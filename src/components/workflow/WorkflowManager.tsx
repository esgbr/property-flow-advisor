
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { CircleCheck, Clock, ArrowRight, Play, RotateCcw, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { useAccessibility } from '@/hooks/use-accessibility';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useAnnouncement from '@/utils/announcer';

interface WorkflowManagerProps {
  className?: string;
  defaultWorkflow?: WorkflowType;
}

/**
 * A complete workflow management interface that allows users to view, start,
 * continue, reset, and track progress across all workflows.
 */
const WorkflowManager: React.FC<WorkflowManagerProps> = ({ 
  className,
  defaultWorkflow = 'steuer'
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<WorkflowType>(defaultWorkflow);
  const { workflows } = useWorkflowState();
  const { announce } = useAccessibility();
  const { announce: announceToScreenReader } = useAnnouncement();
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // Get workflow for the active tab
  const workflow = useWorkflow(activeTab);
  const workflowSteps = workflow.getStepsWithStatus();
  const completedSteps = workflowSteps.filter(step => step.isComplete);
  const currentStep = workflow.getCurrentStep() || workflowSteps[0]?.id;
  const progress = workflow.getWorkflowProgress();
  
  // Format the last interaction date
  const getLastInteractionDate = () => {
    const lastInteractionAt = workflows[`workflow_${activeTab}`]?.lastInteractionAt;
    if (!lastInteractionAt) return null;
    
    return new Date(lastInteractionAt).toLocaleDateString(
      language === 'de' ? 'de-DE' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };
  
  // Reset the current workflow
  const handleResetWorkflow = () => {
    workflow.resetWorkflow();
    setShowResetDialog(false);

    // Announce reset
    announce(
      language === 'de'
        ? `Workflow ${workflowDefinitions[activeTab].title.de} wurde zurückgesetzt`
        : `${workflowDefinitions[activeTab].title.en} workflow has been reset`,
      'polite'
    );

    announceToScreenReader(
      language === 'de'
        ? `Workflow wurde zurückgesetzt. Alle Fortschritte wurden gelöscht.`
        : `Workflow has been reset. All progress has been cleared.`
    );
  };
  
  // Navigate to a step
  const navigateToStep = (step: { id: string; path: string; label: any }) => {
    workflow.setCurrentStep(step.id);
    navigate(step.path);

    // Announce step navigation
    const stepName = step.label[language as keyof typeof step.label];
    announceToScreenReader(
      language === 'de'
        ? `Navigation zu ${stepName}`
        : `Navigating to ${stepName}`
    );
  };
  
  // Continue the workflow from where the user left off
  const continueWorkflow = () => {
    const stepToNavigate = workflow.getCurrentStep() 
      ? workflowSteps.find(step => step.id === workflow.getCurrentStep())
      : workflowSteps[0];
      
    if (stepToNavigate) {
      navigateToStep(stepToNavigate);
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as WorkflowType);
    announceToScreenReader(
      language === 'de'
        ? `Workflow gewechselt zu ${workflowDefinitions[value as WorkflowType].title.de}`
        : `Switched workflow to ${workflowDefinitions[value as WorkflowType].title.en}`
    );
  };

  // Keyboard navigation through workflow steps
  const handleKeyNavigation = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigateToStep(workflowSteps[index]);
    }
  };
  
  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="text-xl">
            {language === 'de' ? 'Workflow-Manager' : 'Workflow Manager'}
          </CardTitle>
          <CardDescription>
            {language === 'de'
              ? 'Verwalten Sie Ihre Workflows und verfolgen Sie Ihren Fortschritt'
              : 'Manage your workflows and track your progress'
            }
          </CardDescription>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 w-full">
              {Object.keys(workflowDefinitions).map((wfType) => (
                <TabsTrigger key={wfType} value={wfType}>
                  {workflowDefinitions[wfType as WorkflowType].title[language as keyof typeof workflowDefinitions[keyof typeof workflowDefinitions]['title']]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {workflowDefinitions[activeTab].title[language as keyof typeof workflowDefinitions[keyof typeof workflowDefinitions]['title']]}
              </h3>
              <p className="text-sm text-muted-foreground">
                {workflowDefinitions[activeTab].description[language as keyof typeof workflowDefinitions[keyof typeof workflowDefinitions]['description']]}
              </p>
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {completedSteps.length}/{workflowSteps.length}
              </span>
              <p className="text-xs text-muted-foreground">
                {language === 'de' ? 'Schritte abgeschlossen' : 'Steps completed'}
              </p>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>
                {language === 'de' ? 'Fortschritt' : 'Progress'}: {progress}%
              </span>
              {getLastInteractionDate() && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                  {language === 'de' ? 'Zuletzt bearbeitet' : 'Last updated'}: {getLastInteractionDate()}
                </span>
              )}
            </div>
            
            <ScrollArea className="max-h-60 pr-3">
              <div className="space-y-1">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <Button 
                      variant={step.id === currentStep ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center justify-between w-full",
                        step.isComplete && "text-green-600 dark:text-green-400",
                      )}
                      onClick={() => navigateToStep(step)}
                      onKeyDown={(e) => handleKeyNavigation(e, index)}
                      aria-current={step.id === currentStep ? "step" : undefined}
                    >
                      <div className="flex items-center">
                        {step.isComplete ? (
                          <CircleCheck className="h-4 w-4 mr-2" aria-hidden="true" />
                        ) : (
                          <span className="flex items-center justify-center h-4 w-4 rounded-full border mr-2 text-xs">
                            {index + 1}
                          </span>
                        )}
                        <span>
                          {step.label[language as keyof typeof step.label]}
                        </span>
                      </div>
                      {step.estimatedTime && (
                        <span className="text-xs text-muted-foreground">
                          {step.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </span>
                      )}
                    </Button>
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-4 top-[28px] h-4 w-px bg-border" aria-hidden="true"></div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" aria-hidden="true" />
                {language === 'de' ? 'Zurücksetzen' : 'Reset'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === 'de' 
                    ? 'Workflow zurücksetzen?' 
                    : 'Reset workflow?'
                  }
                </DialogTitle>
                <DialogDescription>
                  {language === 'de'
                    ? 'Möchten Sie diesen Workflow wirklich zurücksetzen? Alle Fortschritte gehen verloren.'
                    : 'Are you sure you want to reset this workflow? All progress will be lost.'
                  }
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                  {language === 'de' ? 'Abbrechen' : 'Cancel'}
                </Button>
                <Button variant="destructive" onClick={handleResetWorkflow}>
                  {language === 'de' ? 'Zurücksetzen' : 'Reset'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {progress > 0 && progress < 100 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={continueWorkflow}
              className="text-xs"
            >
              <Play className="h-3 w-3 mr-1" aria-hidden="true" />
              {language === 'de' ? 'Fortsetzen' : 'Continue'}
            </Button>
          )}
          
          {progress === 0 && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={continueWorkflow}
              className="text-xs"
            >
              <Play className="h-3 w-3 mr-1" aria-hidden="true" />
              {language === 'de' ? 'Starten' : 'Start'}
            </Button>
          )}
          
          {progress === 100 && (
            <Button 
              variant="default" 
              size="sm"
              className="text-xs bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/investor-dashboard?tab=analytics')}
            >
              <BarChart className="h-3 w-3 mr-1" aria-hidden="true" />
              {language === 'de' ? 'Ergebnisse anzeigen' : 'View Results'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default WorkflowManager;
