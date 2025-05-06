
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { workflowDefinitions, WorkflowType } from '@/data/workflow-definitions';

export { WorkflowType } from '@/data/workflow-definitions';

export interface WorkflowStepWithStatus {
  id: string;
  path: string;
  label: { de: string; en: string };
  description?: { de: string; en: string };
  icon?: React.ReactNode;
  isComplete?: boolean;
  requiredSteps?: string[];
  progress?: number;
  estimatedTime?: number;
}

export const useWorkflow = (workflowType: WorkflowType) => {
  const { getCurrentWorkflowStep, getCompletedSteps, markStepComplete, setCurrentStep, saveWorkflowData, getWorkflowData, resetWorkflow } = useWorkflowState();
  const navigate = useNavigate();
  
  const workflow = useMemo(() => workflowDefinitions[workflowType], [workflowType]);
  
  // Get current step object
  const getCurrentStep = useCallback((stepId?: string) => {
    const id = stepId || getCurrentWorkflowStep(`workflow_${workflowType}`);
    if (!id) return undefined;
    return workflow.steps.find(step => step.id === id);
  }, [workflow.steps, getCurrentWorkflowStep, workflowType]);
  
  // Get steps with completion status
  const getStepsWithStatus = useCallback((): WorkflowStepWithStatus[] => {
    const completedStepIds = getCompletedSteps(`workflow_${workflowType}`);
    
    return workflow.steps.map(step => ({
      ...step,
      isComplete: completedStepIds.includes(step.id)
    }));
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Get workflow steps
  const getWorkflowSteps = useCallback(() => {
    const completedStepIds = getCompletedSteps(`workflow_${workflowType}`);
    
    return workflow.steps.map(step => ({
      ...step,
      isComplete: completedStepIds.includes(step.id)
    }));
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Get completed steps
  const getCompleteSteps = useCallback(() => {
    const completedStepIds = getCompletedSteps(`workflow_${workflowType}`);
    return workflow.steps.filter(step => completedStepIds.includes(step.id));
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Navigate to a step
  const goToStep = useCallback((stepId: string) => {
    const step = workflow.steps.find(s => s.id === stepId);
    if (step) {
      setCurrentStep(`workflow_${workflowType}`, stepId);
      navigate(step.path);
    }
  }, [workflow.steps, setCurrentStep, workflowType, navigate]);
  
  // Mark current step as complete and optionally move to next
  const completeCurrentStep = useCallback((stepId: string, moveToNext = true) => {
    markStepComplete(`workflow_${workflowType}`, stepId);
    
    if (moveToNext) {
      const nextSteps = getNextSteps(stepId);
      if (nextSteps.length > 0) {
        goToStep(nextSteps[0].id);
      }
    }
  }, [markStepComplete, workflowType, goToStep]);
  
  // Get previous step
  const getPreviousStep = useCallback((currentStepId: string) => {
    const currentIndex = workflow.steps.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
      return workflow.steps[currentIndex - 1];
    }
    return null;
  }, [workflow.steps]);
  
  // Get next steps (usually one, but could be multiple in branching workflows)
  const getNextSteps = useCallback((currentStepId: string, limit?: number) => {
    const currentIndex = workflow.steps.findIndex(step => step.id === currentStepId);
    if (currentIndex < workflow.steps.length - 1) {
      const nextSteps = workflow.steps.slice(currentIndex + 1);
      return limit ? nextSteps.slice(0, limit) : nextSteps;
    }
    return [];
  }, [workflow.steps]);
  
  // Get path from start to current step
  const getPathToStep = useCallback((targetStepId: string) => {
    const targetIndex = workflow.steps.findIndex(step => step.id === targetStepId);
    if (targetIndex >= 0) {
      const completedStepIds = getCompletedSteps(`workflow_${workflowType}`);
      
      return workflow.steps.slice(0, targetIndex + 1).map(step => ({
        ...step,
        isComplete: completedStepIds.includes(step.id)
      }));
    }
    return [];
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Calculate overall workflow progress
  const getWorkflowProgress = useCallback((currentStepId?: string) => {
    if (!currentStepId) {
      const completedSteps = getCompletedSteps(`workflow_${workflowType}`).length;
      return Math.round((completedSteps / workflow.steps.length) * 100);
    }
    
    const currentIndex = workflow.steps.findIndex(step => step.id === currentStepId);
    if (currentIndex >= 0) {
      return Math.round((currentIndex / (workflow.steps.length - 1)) * 100);
    }
    return 0;
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Save data for the workflow
  const saveData = useCallback(<T,>(key: string, data: T) => {
    saveWorkflowData(`workflow_${workflowType}`, key, data);
  }, [saveWorkflowData, workflowType]);
  
  // Get data from the workflow
  const getData = useCallback(<T,>(key: string) => {
    return getWorkflowData<T>(`workflow_${workflowType}`, key);
  }, [getWorkflowData, workflowType]);
  
  // Reset the workflow
  const resetWorkflowState = useCallback(() => {
    resetWorkflow(`workflow_${workflowType}`);
  }, [resetWorkflow, workflowType]);
  
  return {
    workflow,
    getCurrentStep,
    getStepsWithStatus,
    getWorkflowSteps,
    getCompleteSteps,
    goToStep,
    completeCurrentStep,
    getPreviousStep,
    getNextSteps,
    getPathToStep,
    getWorkflowProgress,
    markStepComplete,
    saveData,
    getData,
    resetWorkflow: resetWorkflowState
  };
};

export default useWorkflow;
