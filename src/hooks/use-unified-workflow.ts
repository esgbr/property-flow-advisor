import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { workflowDefinitions, WorkflowType } from '@/data/workflow-definitions';

export interface WorkflowStep {
  id: string;
  path?: string;
  label: Record<string, string>;
  title?: Record<string, string>;
  description?: Record<string, string>;
  icon?: React.ReactNode;
  estimatedTime?: number;
  requiredSteps?: string[]; // HOTFIX: fehlendes Property ergänzt
}

export function useUnifiedWorkflow(workflowType: WorkflowType) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Get steps from workflow definitions
  const steps = workflowDefinitions[workflowType].steps;

  // Load persisted workflow state
  useEffect(() => {
    const persistKey = `workflow-${workflowType}`;
    const savedWorkflow = localStorage.getItem(persistKey);
    
    if (savedWorkflow) {
      try {
        const { currentId, completed } = JSON.parse(savedWorkflow);
        setCurrentStepId(currentId);
        setCompletedSteps(completed);
      } catch (err) {
        console.error('Failed to load workflow state:', err);
      }
    } else if (steps.length > 0) {
      setCurrentStepId(steps[0].id);
    }
  }, [workflowType, steps]);

  // Save workflow state when it changes
  useEffect(() => {
    const persistKey = `workflow-${workflowType}`;
    if (currentStepId) {
      localStorage.setItem(
        persistKey,
        JSON.stringify({
          currentId: currentStepId,
          completed: completedSteps,
        })
      );
    }
  }, [currentStepId, completedSteps, workflowType]);

  // Get current step
  const currentStep = steps.find(step => step.id === currentStepId) || steps[0];
  
  // Check if a step is blocked by dependencies
  const canMoveToStep = useCallback(
    (stepId: string) => {
      const step = steps.find(s => s.id === stepId);
      if (!step) return false;
      
      // Check if required steps are completed
      if (step.requiredSteps?.length) {
        return step.requiredSteps.every(reqId => completedSteps[reqId]);
      }
      
      return true;
    },
    [steps, completedSteps]
  );

  // Navigate to a step
  const goToStep = useCallback(
    (stepId: string) => {
      if (!canMoveToStep(stepId)) {
        toast({
          title: language === 'de' ? 'Nicht verfügbar' : 'Not available',
          description: language === 'de' 
            ? 'Bitte schließen Sie die vorherigen Schritte ab'
            : 'Please complete previous steps first'
        });
        return false;
      }

      setCurrentStepId(stepId);
      const step = steps.find(s => s.id === stepId);
      if (step?.path) {
        navigate(step.path);
      }
      return true;
    },
    [steps, canMoveToStep, navigate, language, toast]
  );

  // Mark a step as complete
  const completeStep = useCallback(
    (stepId: string) => {
      setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
      
      toast({
        title: language === 'de' ? 'Schritt abgeschlossen' : 'Step completed',
        description: language === 'de' 
          ? 'Der Workflow-Schritt wurde als abgeschlossen markiert.' 
          : 'The workflow step has been marked as complete.'
      });
      
      // Find and navigate to the next incomplete step
      const currentIndex = steps.findIndex(step => step.id === stepId);
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        if (canMoveToStep(nextStep.id)) {
          goToStep(nextStep.id);
        }
      }
    },
    [steps, canMoveToStep, goToStep, language, toast]
  );

  // Reset workflow progress
  const resetWorkflow = useCallback(() => {
    setCompletedSteps({});
    const firstStep = steps.length > 0 ? steps[0].id : null;
    setCurrentStepId(firstStep);
    
    toast({
      title: language === 'de' ? 'Workflow zurückgesetzt' : 'Workflow reset',
      description: language === 'de'
        ? 'Alle Fortschritte wurden zurückgesetzt.'
        : 'All progress has been reset.'
    });
    
    if (firstStep) {
      const step = steps.find(s => s.id === firstStep);
      if (step?.path) {
        navigate(step.path);
      }
    }
  }, [steps, navigate, language, toast]);

  // Calculate progress
  const progress = Math.round(
    (Object.values(completedSteps).filter(Boolean).length / Math.max(1, steps.length)) * 100
  );

  return {
    steps,
    currentStep,
    currentStepId,
    completedSteps,
    goToStep,
    completeStep,
    canMoveToStep,
    resetWorkflow,
    progress,
  };
}

export default useUnifiedWorkflow;
