import { WorkflowType } from "@/hooks/use-unified-workflow";

/**
 * Utility functions for workflow management
 */

/**
 * Get the estimated completion time for a workflow in minutes
 * @param workflowType The type of workflow
 * @param completedSteps Array of completed step IDs
 * @returns Estimated time in minutes
 */
export function getEstimatedCompletionTime(
  workflowType: WorkflowType,
  completedSteps: string[]
): number {
  // This would normally fetch from workflow definitions
  // For now using placeholder values
  const estimatedTimes: Record<WorkflowType, number> = {
    steuer: 45,
    immobilien: 60,
    finanzierung: 30,
    analyse: 40
  };
  
  // Base time for the workflow
  const baseTime = estimatedTimes[workflowType] || 30;
  
  // Reduce time based on completed steps (assume each step is equal)
  // This is a simplified calculation
  const completionPercentage = completedSteps.length / getWorkflowStepCount(workflowType);
  const remainingTime = baseTime * (1 - completionPercentage);
  
  return Math.round(remainingTime);
}

/**
 * Get the total number of steps in a workflow
 * @param workflowType The type of workflow
 * @returns Number of steps
 */
export function getWorkflowStepCount(workflowType: WorkflowType): number {
  // This would normally fetch from workflow definitions
  // For now using placeholder values
  const stepCounts: Record<WorkflowType, number> = {
    steuer: 3,
    immobilien: 3,
    finanzierung: 3,
    analyse: 3
  };
  
  return stepCounts[workflowType] || 0;
}

/**
 * Format a time duration in minutes to a human-readable string
 * @param minutes Time in minutes
 * @returns Formatted time string
 */
export function formatTimeEstimate(minutes: number, language: 'en' | 'de' = 'en'): string {
  if (minutes < 1) {
    return language === 'de' ? 'Weniger als eine Minute' : 'Less than a minute';
  }
  
  if (minutes < 60) {
    return language === 'de' 
      ? `${minutes} Minute${minutes !== 1 ? 'n' : ''}` 
      : `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return language === 'de'
      ? `${hours} Stunde${hours !== 1 ? 'n' : ''}`
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return language === 'de'
    ? `${hours} Stunde${hours !== 1 ? 'n' : ''} ${remainingMinutes} Minute${remainingMinutes !== 1 ? 'n' : ''}`
    : `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Get a list of dependencies for a workflow step
 * @param workflowType The type of workflow
 * @param stepId The ID of the step
 * @returns Array of dependency step IDs
 */
export function getStepDependencies(workflowType: WorkflowType, stepId: string): string[] {
  // This would normally fetch from workflow definitions
  // For now using placeholder values
  const dependencies: Record<string, string[]> = {
    'steuer.planning': ['steuer.grunderwerbsteuer'],
    'steuer.afa': ['steuer.planning'],
    'immobilien.rendite': ['immobilien.marktanalyse'],
    'immobilien.portfolio': ['immobilien.rendite'],
    'finanzierung.offers': ['finanzierung.calculator'],
    'finanzierung.tilgung': ['finanzierung.offers'],
    'analyse.portfolio': ['analyse.market'],
    'analyse.duediligence': ['analyse.portfolio']
  };
  
  const key = `${workflowType}.${stepId}`;
  return dependencies[key] || [];
}

/**
 * Check if a workflow step is blocked by dependencies
 * @param workflowType The type of workflow
 * @param stepId The ID of the step
 * @param completedSteps Array of completed step IDs
 * @returns Boolean indicating if the step is blocked
 */
export function isStepBlocked(
  workflowType: WorkflowType,
  stepId: string,
  completedSteps: string[]
): boolean {
  const dependencies = getStepDependencies(workflowType, stepId);
  
  if (dependencies.length === 0) {
    return false;
  }
  
  return dependencies.some(depId => !completedSteps.includes(depId));
}

/**
 * Get the next available step in a workflow
 * @param workflowType The type of workflow
 * @param completedSteps Array of completed step IDs
 * @returns ID of the next available step, or null if workflow is complete
 */
export function getNextAvailableStep(
  workflowType: WorkflowType,
  completedSteps: string[]
): string | null {
  // This would normally fetch from workflow definitions
  // For now using placeholder values
  const workflowSteps: Record<WorkflowType, string[]> = {
    steuer: ['grunderwerbsteuer', 'planning', 'afa'],
    immobilien: ['marktanalyse', 'rendite', 'portfolio'],
    finanzierung: ['calculator', 'offers', 'tilgung'],
    analyse: ['market', 'portfolio', 'duediligence']
  };
  
  const steps = workflowSteps[workflowType] || [];
  
  // Find the first step that is not completed and not blocked
  for (const stepId of steps) {
    if (!completedSteps.includes(stepId) && !isStepBlocked(workflowType, stepId, completedSteps)) {
      return stepId;
    }
  }
  
  return null;
}
