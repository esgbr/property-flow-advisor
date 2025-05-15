
import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toastService } from '@/lib/toast-service';
import { useNavigate } from 'react-router-dom';

export interface WorkflowStep {
  id: string;
  path?: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  completed: boolean;
  disabled?: boolean;
  requiredSteps?: string[];
}

export interface WorkflowOptions {
  initialStep?: string;
  onComplete?: () => void;
  persistKey?: string;
}

export function useUnifiedWorkflow(
  steps: WorkflowStep[],
  options?: WorkflowOptions
) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentStepId, setCurrentStepId] = useState<string | null>(
    options?.initialStep || (steps.length > 0 ? steps[0].id : null)
  );
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Load persisted workflow state if persistKey is provided
  useEffect(() => {
    if (options?.persistKey) {
      const savedWorkflow = localStorage.getItem(`workflow-${options.persistKey}`);
      if (savedWorkflow) {
        try {
          const { currentId, completed } = JSON.parse(savedWorkflow);
          setCurrentStepId(currentId);
          setCompletedSteps(completed);
        } catch (err) {
          console.error('Failed to load workflow state:', err);
        }
      }
    }
  }, [options?.persistKey]);

  // Save workflow state when it changes
  useEffect(() => {
    if (options?.persistKey) {
      localStorage.setItem(
        `workflow-${options.persistKey}`,
        JSON.stringify({
          currentId: currentStepId,
          completed: completedSteps,
        })
      );
    }
  }, [currentStepId, completedSteps, options?.persistKey]);

  const currentStep = steps.find(step => step.id === currentStepId) || null;
  
  const canMoveToStep = useCallback(
    (stepId: string) => {
      const step = steps.find(s => s.id === stepId);
      if (!step) return false;
      if (step.disabled) return false;
      
      // Check if required steps are completed
      if (step.requiredSteps?.length) {
        return step.requiredSteps.every(reqId => completedSteps[reqId]);
      }
      
      return true;
    },
    [steps, completedSteps]
  );

  const goToStep = useCallback(
    (stepId: string) => {
      if (!canMoveToStep(stepId)) {
        const step = steps.find(s => s.id === stepId);
        toastService.warning(
          language === 'de' ? 'Nicht verfügbar' : 'Not available',
          language === 'de' 
            ? 'Bitte schließen Sie die vorherigen Schritte ab'
            : 'Please complete previous steps first'
        );
        return false;
      }

      setCurrentStepId(stepId);
      const step = steps.find(s => s.id === stepId);
      if (step?.path) {
        navigate(step.path);
      }
      return true;
    },
    [steps, canMoveToStep, navigate, language]
  );

  const completeStep = useCallback(
    (stepId: string) => {
      setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
      
      // Check if all steps are completed
      const allCompleted = steps.every(
        step => completedSteps[step.id] || step.id === stepId
      );
      
      if (allCompleted && options?.onComplete) {
        options.onComplete();
      }

      // Find and navigate to the next incomplete step
      const currentIndex = steps.findIndex(step => step.id === stepId);
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        goToStep(nextStep.id);
      }
    },
    [steps, completedSteps, goToStep, options]
  );

  const resetWorkflow = useCallback(() => {
    setCompletedSteps({});
    const firstStep = steps.length > 0 ? steps[0].id : null;
    setCurrentStepId(firstStep);
    if (firstStep) {
      const step = steps.find(s => s.id === firstStep);
      if (step?.path) {
        navigate(step.path);
      }
    }
  }, [steps, navigate]);

  const getProgress = useCallback(() => {
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    return Math.round((completedCount / steps.length) * 100);
  }, [completedSteps, steps.length]);

  return {
    steps,
    currentStep,
    currentStepId,
    completedSteps,
    goToStep,
    completeStep,
    canMoveToStep,
    resetWorkflow,
    progress: getProgress(),
  };
}
