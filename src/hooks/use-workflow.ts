
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { workflowDefinitions } from '@/data/workflow-definitions';

// Export WorkflowType from the workflow definitions
export type { WorkflowType } from '@/data/workflow-definitions';

export const useWorkflow = (workflowType: import('@/data/workflow-definitions').WorkflowType) => {
  const { getCurrentWorkflowStep, getCompletedSteps, markStepComplete, setCurrentStep } = useWorkflowState();
  const navigate = useNavigate();
  
  const workflow = useMemo(() => workflowDefinitions[workflowType], [workflowType]);
  
  // Get current step object
  const getCurrentStep = useCallback((stepId: string) => {
    return workflow.steps.find(step => step.id === stepId);
  }, [workflow.steps]);
  
  // Get steps with completion status
  const getWorkflowSteps = useCallback(() => {
    const completedStepIds = getCompletedSteps(workflowType);
    
    return workflow.steps.map(step => ({
      ...step,
      isComplete: completedStepIds.includes(step.id)
    }));
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Get completed steps
  const getCompleteSteps = useCallback(() => {
    const completedStepIds = getCompletedSteps(workflowType);
    return workflow.steps.filter(step => completedStepIds.includes(step.id));
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Navigate to a step
  const goToStep = useCallback((stepId: string) => {
    const step = workflow.steps.find(s => s.id === stepId);
    if (step) {
      setCurrentStep(workflowType, stepId);
      navigate(step.path);
    }
  }, [workflow.steps, setCurrentStep, workflowType, navigate]);
  
  // Mark current step as complete and optionally move to next
  const completeCurrentStep = useCallback((stepId: string, moveToNext = true) => {
    markStepComplete(workflowType, stepId);
    
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
      const completedStepIds = getCompletedSteps(workflowType);
      
      return workflow.steps.slice(0, targetIndex + 1).map(step => ({
        ...step,
        isComplete: completedStepIds.includes(step.id)
      }));
    }
    return [];
  }, [workflow.steps, getCompletedSteps, workflowType]);
  
  // Calculate overall workflow progress
  const getWorkflowProgress = useCallback((currentStepId: string) => {
    const currentIndex = workflow.steps.findIndex(step => step.id === currentStepId);
    if (currentIndex >= 0) {
      return Math.round((currentIndex / (workflow.steps.length - 1)) * 100);
    }
    return 0;
  }, [workflow.steps]);
  
  return {
    workflow,
    getCurrentStep,
    getWorkflowSteps,
    getCompleteSteps,
    goToStep,
    completeCurrentStep,
    getPreviousStep,
    getNextSteps,
    getPathToStep,
    getWorkflowProgress,
    markStepComplete
  };
};

export default useWorkflow;
