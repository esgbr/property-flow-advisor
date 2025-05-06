
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, CheckCircle, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAccessibility } from '@/hooks/use-accessibility';

interface WorkflowNavigationProps {
  workflowType: WorkflowType;
  currentStep: string;
  onComplete?: () => void;
  variant?: 'default' | 'compact' | 'minimal';
  showAllSteps?: boolean;
  className?: string;
}

/**
 * Navigation component for moving between steps in a workflow
 */
const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  workflowType,
  currentStep,
  onComplete,
  variant = 'default',
  showAllSteps = false,
  className
}) => {
  const navigate = useNavigate();
  const workflow = useWorkflow(workflowType);
  const { language } = useLanguage();
  const { announce } = useAccessibility();
  
  const workflowSteps = workflow.getWorkflowSteps();
  const currentIndex = workflowSteps.findIndex(step => step.id === currentStep);
  const previousStep = currentIndex > 0 ? workflowSteps[currentIndex - 1] : null;
  const nextStep = currentIndex < workflowSteps.length - 1 ? workflowSteps[currentIndex + 1] : null;
  const progress = workflow.getWorkflowProgress(currentStep);
  
  // Handle navigation to previous step
  const handlePrevious = () => {
    if (previousStep) {
      navigate(previousStep.path);
      
      const stepName = previousStep.label[language as keyof typeof previousStep.label];
      announce(
        language === 'de'
          ? `Zurück zu ${stepName}`
          : `Back to ${stepName}`,
        'polite'
      );
    }
  };
  
  // Handle navigation to next step
  const handleNext = () => {
    if (nextStep) {
      // Mark current step as complete
      workflow.markStepComplete(currentStep);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
      
      // Navigate to next step
      navigate(nextStep.path);
      
      const stepName = nextStep.label[language as keyof typeof nextStep.label];
      announce(
        language === 'de'
          ? `Weiter zu ${stepName}`
          : `Continue to ${stepName}`,
        'polite'
      );
    } else {
      // This is the last step, just mark it as complete
      workflow.markStepComplete(currentStep);
      
      if (onComplete) {
        onComplete();
      }
      
      announce(
        language === 'de'
          ? 'Workflow abgeschlossen!'
          : 'Workflow completed!',
        'polite'
      );
    }
  };
  
  // Handle viewing all steps
  const handleViewAllSteps = () => {
    // Navigate to workflow overview
    navigate(`/workflows/${workflowType}`);
    
    announce(
      language === 'de'
        ? 'Alle Schritte anzeigen'
        : 'View all steps',
      'polite'
    );
  };
  
  // Determine component based on variant
  const renderNavigationContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!previousStep}
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              {language === 'de' ? 'Zurück' : 'Back'}
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {currentIndex + 1}/{workflowSteps.length}
              </span>
              <Progress 
                value={progress} 
                className="h-2 w-16"
              />
            </div>
            
            <Button
              variant={nextStep ? "default" : "success"}
              size="sm"
              onClick={handleNext}
            >
              {!nextStep ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                  {language === 'de' ? 'Abschließen' : 'Complete'}
                </>
              ) : (
                <>
                  {language === 'de' ? 'Weiter' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        );
      
      case 'minimal':
        return (
          <div className="flex justify-between">
            {previousStep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                {language === 'de' ? 'Zurück' : 'Back'}
              </Button>
            ) : (
              <div /> // Empty div for spacing
            )}
            
            {nextStep ? (
              <Button size="sm" onClick={handleNext}>
                {language === 'de' ? 'Weiter' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} variant="success">
                <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                {language === 'de' ? 'Abschließen' : 'Complete'}
              </Button>
            )}
          </div>
        );
      
      case 'default':
      default:
        return (
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {language === 'de' ? 'Fortschritt:' : 'Progress:'}
                  </span>
                  <Progress 
                    value={progress} 
                    className="h-2 w-16 sm:w-24"
                  />
                  <span className="ml-2 text-sm font-medium">{progress}%</span>
                </div>
                
                {showAllSteps && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleViewAllSteps}
                    className="ml-0 sm:ml-4 p-0"
                  >
                    <List className="h-4 w-4 mr-1" aria-hidden="true" />
                    {language === 'de' ? 'Alle Schritte anzeigen' : 'View all steps'}
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  {previousStep && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                          {language === 'de' ? 'Zurück' : 'Back'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {previousStep.label[language as keyof typeof previousStep.label]}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  {nextStep ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleNext}>
                          {language === 'de' ? 'Weiter' : 'Next'}
                          <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {nextStep.label[language as keyof typeof nextStep.label]}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                      {language === 'de' ? 'Abschließen' : 'Complete'}
                    </Button>
                  )}
                </TooltipProvider>
              </div>
            </div>
          </Card>
        );
    }
  };
  
  return <div className={className}>{renderNavigationContent()}</div>;
};

export default WorkflowNavigation;
