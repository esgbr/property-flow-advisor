
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
  description?: Record<string, string>;
  estimatedTime?: number;
  dependencies?: string[];
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
  const getWorkflowProgress = useCallback(() => {
    const { steps } = workflowDefinitions[workflowType];
    const { completedSteps } = workflowState;
    
    if (steps.length === 0) return 0;
    
    return Math.round((completedSteps.length / steps.length) * 100);
  }, [workflowType, workflowState]);
  
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
    completedSteps: workflowState.completedSteps
  };
};
