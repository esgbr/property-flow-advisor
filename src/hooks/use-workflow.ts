
import { useCallback, useState } from 'react';
import { useLocalStorage } from './use-local-storage';
import { workflowDefinitions } from '@/data/workflow-definitions';

// Define the WorkflowType type
export type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

// Define types for workflow step status
export interface WorkflowStepWithStatus {
  id: string;
  label: Record<string, string>;
  isComplete: boolean;
  isActive: boolean;
  path: string;
  description?: Record<string, string>;
  estimatedTime?: number;
  dependencies?: string[];
  progress?: number;
}

// Define types for workflow data
export interface WorkflowData {
  [key: string]: any;
}

/**
 * Custom hook for managing workflow state and navigation
 */
export const useWorkflow = (workflowType: WorkflowType) => {
  // Store workflow state in local storage
  const storageKey = `workflow-${workflowType}-state`;
  const [workflowState, setWorkflowState] = useLocalStorage<{
    completedSteps: string[];
    activeStep: string | null;
    data: WorkflowData;
  }>(storageKey, {
    completedSteps: [],
    activeStep: null,
    data: {}
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Get steps with status information
  const getStepsWithStatus = useCallback(() => {
    const { steps } = workflowDefinitions[workflowType];
    const { completedSteps, activeStep } = workflowState;
    
    return steps.map(step => ({
      ...step,
      isComplete: completedSteps.includes(step.id),
      isActive: activeStep === step.id
    }));
  }, [workflowType, workflowState]);

  // Check if step is blocked by dependencies
  const isStepBlocked = useCallback(
    (stepId: string) => {
      const { steps } = workflowDefinitions[workflowType];
      const step = steps.find(s => s.id === stepId);
      
      if (!step || !step.dependencies || step.dependencies.length === 0) {
        return false;
      }
      
      return step.dependencies.some(
        dependencyId => !workflowState.completedSteps.includes(dependencyId)
      );
    },
    [workflowType, workflowState.completedSteps]
  );

  // Navigate to a specific step
  const goToStep = useCallback(
    (stepId: string) => {
      const { steps } = workflowDefinitions[workflowType];
      const stepExists = steps.some(s => s.id === stepId);
      
      if (!stepExists) {
        console.error(`Step ${stepId} does not exist in workflow ${workflowType}`);
        return;
      }
      
      if (isStepBlocked(stepId)) {
        console.error(`Step ${stepId} is blocked by dependencies`);
        return;
      }
      
      setWorkflowState(prev => ({
        ...prev,
        activeStep: stepId
      }));
    },
    [workflowType, isStepBlocked, setWorkflowState]
  );

  // Mark a step as complete
  const markStepComplete = useCallback(
    (stepId: string) => {
      setIsUpdating(true);
      
      setWorkflowState(prev => {
        if (prev.completedSteps.includes(stepId)) {
          setIsUpdating(false);
          return prev;
        }
        
        return {
          ...prev,
          completedSteps: [...prev.completedSteps, stepId]
        };
      });
      
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    },
    [setWorkflowState]
  );

  // Mark a step as incomplete
  const markStepIncomplete = useCallback(
    (stepId: string) => {
      setWorkflowState(prev => ({
        ...prev,
        completedSteps: prev.completedSteps.filter(id => id !== stepId)
      }));
    },
    [setWorkflowState]
  );

  // Reset workflow progress
  const resetWorkflow = useCallback(() => {
    setIsUpdating(true);
    
    setWorkflowState({
      completedSteps: [],
      activeStep: null,
      data: {}
    });
    
    setTimeout(() => {
      setIsUpdating(false);
    }, 500);
  }, [setWorkflowState]);

  // Save data for workflow
  const saveData = useCallback(
    (key: string, value: any) => {
      setWorkflowState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [key]: value
        }
      }));
    },
    [setWorkflowState]
  );

  // Get data from workflow
  const getData = useCallback(
    (key: string) => {
      return workflowState.data[key];
    },
    [workflowState.data]
  );

  // Get workflow progress as percentage
  const getWorkflowProgress = useCallback((currentStepId?: string) => {
    const { steps } = workflowDefinitions[workflowType];
    const { completedSteps } = workflowState;
    
    if (steps.length === 0) return 0;
    
    if (currentStepId) {
      const completedCount = completedSteps.length;
      const totalSteps = steps.length;
      const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
      
      // If the current step is found and not already completed
      if (currentStepIndex !== -1 && !completedSteps.includes(currentStepId)) {
        // Add partial progress for the current step
        return Math.round(((completedCount + 0.5) / totalSteps) * 100);
      }
    }
    
    return Math.round((completedSteps.length / steps.length) * 100);
  }, [workflowType, workflowState]);
  
  // Get current step
  const getCurrentStep = useCallback(() => {
    if (!workflowState.activeStep) return null;
    
    const { steps } = workflowDefinitions[workflowType];
    return steps.find(step => step.id === workflowState.activeStep) || null;
  }, [workflowType, workflowState.activeStep]);
  
  // Get all completed steps
  const getCompleteSteps = useCallback(() => {
    const { steps } = workflowDefinitions[workflowType];
    const { completedSteps } = workflowState;
    
    return steps.filter(step => completedSteps.includes(step.id));
  }, [workflowType, workflowState.completedSteps]);
  
  // Get next steps in the workflow
  const getNextSteps = useCallback((currentStepId: string, limit = 3) => {
    const steps = getStepsWithStatus();
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    
    if (currentIndex === -1 || currentIndex >= steps.length - 1) {
      return [];
    }
    
    return steps.slice(currentIndex + 1, currentIndex + 1 + limit);
  }, [getStepsWithStatus]);
  
  // Helper to get step label based on language
  const getStepLabel = useCallback((stepId: string, language = 'en') => {
    const { steps } = workflowDefinitions[workflowType];
    const step = steps.find(s => s.id === stepId);
    
    if (!step || !step.label) {
      return stepId;
    }
    
    return step.label[language as keyof typeof step.label] || stepId;
  }, [workflowType]);
  
  return {
    getStepsWithStatus,
    goToStep,
    markStepComplete,
    markStepIncomplete,
    resetWorkflow,
    saveData,
    getData,
    getWorkflowProgress,
    isUpdating,
    activeStep: workflowState.activeStep,
    completedSteps: workflowState.completedSteps,
    getCurrentStep,
    getCompleteSteps,
    getNextSteps,
    getStepLabel,
    steps: workflowDefinitions[workflowType]?.steps || [],
    title: workflowDefinitions[workflowType]?.title,
    description: workflowDefinitions[workflowType]?.description
  };
};

export default useWorkflow;
