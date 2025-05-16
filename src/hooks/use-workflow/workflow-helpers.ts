
import { WorkflowType, WorkflowStepWithStatus } from './types';
import { workflowDefinitions } from '@/data/workflow-definitions';

/**
 * Check if a step is blocked by dependencies
 */
export const isStepBlocked = (
  stepId: string,
  workflowType: WorkflowType,
  completedSteps: string[]
): boolean => {
  const { steps } = workflowDefinitions[workflowType];
  const step = steps.find(s => s.id === stepId);
  
  if (!step || !step.dependencies || step.dependencies.length === 0) {
    return false;
  }
  
  return step.dependencies.some(
    dependencyId => !completedSteps.includes(dependencyId)
  );
};

/**
 * Get workflow progress as percentage
 */
export const getWorkflowProgress = (
  workflowType: WorkflowType,
  completedSteps: string[],
  currentStepId?: string
): number => {
  const { steps } = workflowDefinitions[workflowType];
  
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
};

/**
 * Get steps with status information
 */
export const getStepsWithStatus = (
  workflowType: WorkflowType,
  completedSteps: string[],
  activeStep: string | null
): WorkflowStepWithStatus[] => {
  const { steps } = workflowDefinitions[workflowType];
  
  return steps.map(step => ({
    ...step,
    isComplete: completedSteps.includes(step.id),
    isActive: activeStep === step.id
  }));
};

/**
 * Get next steps in the workflow
 */
export const getNextSteps = (
  currentStepId: string,
  workflowType: WorkflowType,
  completedSteps: string[],
  activeStep: string | null,
  limit = 3
): WorkflowStepWithStatus[] => {
  const steps = getStepsWithStatus(workflowType, completedSteps, activeStep);
  const currentIndex = steps.findIndex(s => s.id === currentStepId);
  
  if (currentIndex === -1 || currentIndex >= steps.length - 1) {
    return [];
  }
  
  return steps.slice(currentIndex + 1, currentIndex + 1 + limit);
};

/**
 * Get step label based on language
 */
export const getStepLabel = (
  stepId: string,
  workflowType: WorkflowType,
  language = 'en'
): string => {
  const { steps } = workflowDefinitions[workflowType];
  const step = steps.find(s => s.id === stepId);
  
  if (!step || !step.label) {
    return stepId;
  }
  
  return step.label[language as keyof typeof step.label] || stepId;
};
