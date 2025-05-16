
import { useCallback, useState } from 'react';
import { useLocalStorage } from '../use-local-storage';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { WorkflowType, WorkflowState } from './types';
import { 
  isStepBlocked,
  getWorkflowProgress,
  getStepsWithStatus,
  getNextSteps,
  getStepLabel
} from './workflow-helpers';

/**
 * Custom hook for managing workflow state and navigation
 */
export const useWorkflow = (workflowType: WorkflowType) => {
  // Store workflow state in local storage
  const storageKey = `workflow-${workflowType}-state`;
  const [workflowState, setWorkflowState] = useLocalStorage<WorkflowState>(storageKey, {
    completedSteps: [],
    activeStep: null,
    data: {}
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Navigate to a specific step
  const goToStep = useCallback(
    (stepId: string) => {
      const { steps } = workflowDefinitions[workflowType];
      const stepExists = steps.some(s => s.id === stepId);
      
      if (!stepExists) {
        console.error(`Step ${stepId} does not exist in workflow ${workflowType}`);
        return;
      }
      
      if (isStepBlocked(stepId, workflowType, workflowState.completedSteps)) {
        console.error(`Step ${stepId} is blocked by dependencies`);
        return;
      }
      
      setWorkflowState(prev => ({
        ...prev,
        activeStep: stepId
      }));
    },
    [workflowType, workflowState.completedSteps, setWorkflowState]
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

  return {
    getStepsWithStatus: useCallback(() => 
      getStepsWithStatus(workflowType, workflowState.completedSteps, workflowState.activeStep),
    [workflowType, workflowState]),
    goToStep,
    markStepComplete,
    markStepIncomplete,
    resetWorkflow,
    saveData,
    getData,
    getWorkflowProgress: useCallback((currentStepId?: string) => 
      getWorkflowProgress(workflowType, workflowState.completedSteps, currentStepId),
    [workflowType, workflowState.completedSteps]),
    isUpdating,
    activeStep: workflowState.activeStep,
    completedSteps: workflowState.completedSteps,
    getCurrentStep,
    getCompleteSteps,
    getNextSteps: useCallback((currentStepId: string, limit = 3) => 
      getNextSteps(currentStepId, workflowType, workflowState.completedSteps, workflowState.activeStep, limit),
    [workflowType, workflowState]),
    getStepLabel: useCallback((stepId: string, language = 'en') => 
      getStepLabel(stepId, workflowType, language),
    [workflowType]),
    steps: workflowDefinitions[workflowType]?.steps || [],
    title: workflowDefinitions[workflowType]?.title,
    description: workflowDefinitions[workflowType]?.description
  };
};

export * from './types';
export default useWorkflow;
