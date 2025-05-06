
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import WorkflowNavigation from '@/components/workflow/WorkflowNavigation';
import { Share, Download, Check, Calendar, ChevronRight, Timer } from 'lucide-react';

interface WorkflowManagerProps {
  workflowType: WorkflowType;
  currentStep: string;
  className?: string;
  onStepChange?: (stepId: string) => void;
  showSummary?: boolean;
}

/**
 * WorkflowManager Component
 * 
 * A comprehensive component to manage all aspects of a workflow including:
 * - Current step tracking
 * - Progress visualization
 * - Step navigation
 * - Workflow completion tracking
 * - Time estimation
 */
const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  workflowType,
  currentStep,
  className = '',
  onStepChange,
  showSummary = true
}) => {
  const { language, t } = useLanguage();
  const workflow = useWorkflow(workflowType);
  const { toast } = useToast();
  
  // Track workflow time
  const [startTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Calculate total estimated time for all steps
  const totalEstimatedTime = workflow.steps.reduce(
    (total, step) => total + (step.estimatedTime || 0), 
    0
  );
  
  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 60000); // in minutes
      setElapsedTime(elapsed);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Get completed steps
  const completedSteps = workflow.getCompleteSteps();
  const completedCount = completedSteps.length;
  const totalSteps = workflow.steps.length;
  
  // Calculate progress percentage
  const progressPercentage = workflow.getWorkflowProgress(currentStep);
  
  // Calculate remaining time based on completed steps and estimated times
  const completedEstimatedTime = completedSteps.reduce(
    (total, step) => total + (step.estimatedTime || 0),
    0
  );
  
  const remainingEstimatedTime = totalEstimatedTime - completedEstimatedTime;
  
  // Handle workflow completion
  const handleCompleteWorkflow = () => {
    // Mark current step complete
    workflow.markStepComplete(currentStep);
    
    // Store workflow completion data
    workflow.saveData('completion', {
      completedAt: new Date().toISOString(),
      timeSpent: elapsedTime,
      stepsCompleted: workflow.getCompleteSteps().map(step => step.id)
    });
    
    toast({
      title: language === 'de' ? 'Workflow abgeschlossen' : 'Workflow completed',
      description: language === 'de'
        ? `Sie haben alle ${totalSteps} Schritte abgeschlossen`
        : `You have completed all ${totalSteps} steps`
    });
  };
  
  // Handle exporting workflow data
  const handleExport = () => {
    const workflowData = {
      type: workflowType,
      completed: workflow.getCompleteSteps().map(step => step.id),
      current: currentStep,
      progress: progressPercentage,
      timeSpent: elapsedTime,
      data: workflow.getData('all')
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `workflow-${workflowType}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: language === 'de' ? 'Workflow exportiert' : 'Workflow exported',
      description: language === 'de'
        ? 'Die Workflow-Daten wurden exportiert'
        : 'The workflow data has been exported'
    });
  };
  
  // Handle workflow sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'de' ? `Workflow: ${workflow.steps[0].label.de}` : `Workflow: ${workflow.steps[0].label.en}`,
        text: language === 'de'
          ? `Schau dir diesen Workflow an: ${workflow.steps[0].label.de}`
          : `Check out this workflow: ${workflow.steps[0].label.en}`,
        url: window.location.href
      })
      .then(() => {
        toast({
          title: language === 'de' ? 'Workflow geteilt' : 'Workflow shared'
        });
      })
      .catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: language === 'de' ? 'Link kopiert' : 'Link copied',
        description: language === 'de'
          ? 'Der Workflow-Link wurde in die Zwischenablage kopiert'
          : 'The workflow link has been copied to clipboard'
      });
    }
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>
              {workflow.title[language as keyof typeof workflow.title]}
            </span>
            <span className="text-sm font-normal">
              {progressPercentage}%
            </span>
          </CardTitle>
          <CardDescription>
            {workflow.description[language as keyof typeof workflow.description]}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1" />
              <span>
                {language === 'de' 
                  ? `${completedCount} von ${totalSteps} Schritten abgeschlossen` 
                  : `${completedCount} of ${totalSteps} steps completed`}
              </span>
            </div>
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-1" />
              <span>
                {language === 'de' 
                  ? `${remainingEstimatedTime} Minuten verbleibend` 
                  : `${remainingEstimatedTime} minutes remaining`}
              </span>
            </div>
          </div>
          
          {/* Workflow Steps Component */}
          <WorkflowSteps 
            workflowType={workflowType} 
            currentStep={currentStep}
            onStepClick={onStepChange}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Teilen' : 'Share'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Exportieren' : 'Export'}
            </Button>
          </div>
          
          <Button size="sm" onClick={handleCompleteWorkflow}>
            <Check className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Abschließen' : 'Complete'}
          </Button>
        </CardFooter>
      </Card>
      
      {showSummary && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'de' ? 'Workflow Zusammenfassung' : 'Workflow Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Begonnen am' : 'Started on'}
                </p>
                <p className="font-medium">
                  {startTime.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Verstrichene Zeit' : 'Time elapsed'}
                </p>
                <p className="font-medium">
                  {elapsedTime} {language === 'de' ? 'Minuten' : 'minutes'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Aktueller Schritt' : 'Current step'}
                </p>
                <p className="font-medium">
                  {workflow.getCurrentStep(currentStep)?.label[language as keyof typeof workflow.getCurrentStep(currentStep)?.label]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {language === 'de' ? 'Geschätzte Restzeit' : 'Estimated remaining'}
                </p>
                <p className="font-medium">
                  {remainingEstimatedTime} {language === 'de' ? 'Minuten' : 'minutes'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <WorkflowNavigation
        workflowType={workflowType}
        currentStep={currentStep}
        onStepChange={onStepChange}
      />
    </div>
  );
};

export default WorkflowManager;
