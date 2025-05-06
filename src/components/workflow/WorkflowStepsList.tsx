
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface WorkflowStepsListProps {
  workflowType: WorkflowType;
  onStepSelect?: (stepId: string) => void;
  className?: string;
}

/**
 * Lists all steps in a workflow with their completion status
 */
const WorkflowStepsList: React.FC<WorkflowStepsListProps> = ({
  workflowType,
  onStepSelect,
  className
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflow = useWorkflow(workflowType);
  
  // Get steps with their completion status
  const steps = workflow.getStepsWithStatus();
  
  // Get workflow title based on type
  const getWorkflowTitle = () => {
    switch (workflowType) {
      case 'steuer':
        return language === 'de' ? 'Steueroptimierung' : 'Tax Optimization';
      case 'immobilien':
        return language === 'de' ? 'Immobilienverwaltung' : 'Property Management';
      case 'finanzierung':
        return language === 'de' ? 'Finanzierung' : 'Financing';
      case 'analyse':
        return language === 'de' ? 'Analyse' : 'Analysis';
      default:
        return workflowType;
    }
  };
  
  // Format the step label based on language
  const getStepLabel = (step: any) => {
    return language === 'de' ? (step.label.de || step.label.en) : step.label.en;
  };
  
  const handleStepSelect = (stepId: string) => {
    if (onStepSelect) {
      onStepSelect(stepId);
    } else {
      workflow.goToStep(stepId);
      navigate(`/${workflowType}/${stepId}`);
    }
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="font-medium mb-2">{getWorkflowTitle()}</h3>
      
      <div className="rounded-md border">
        {steps.map((step, index) => {
          const isBlocked = step.dependencies?.some(
            depId => !steps.find(s => s.id === depId)?.isComplete
          );
          
          return (
            <Button
              key={step.id}
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-none border-b text-sm relative h-auto py-3 px-4",
                index === steps.length - 1 && "border-b-0",
                step.isActive && "bg-muted",
                isBlocked && "opacity-60 cursor-not-allowed"
              )}
              onClick={() => !isBlocked && handleStepSelect(step.id)}
              disabled={isBlocked}
            >
              <div className="flex items-center w-full">
                <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border">
                  {step.isComplete ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div className="flex-grow text-left">
                  {getStepLabel(step)}
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepsList;
