
import { workflowDefinitions, WorkflowType } from '@/data/workflow-definitions';
import { WorkflowStep } from '@/hooks/use-unified-workflow';
import { WorkflowsState } from '@/contexts/WorkflowStateContext';

/**
 * Get related workflows for a specific tool
 * @param toolId - The ID of the current tool
 * @returns Array of related workflow types
 */
export function getRelatedWorkflowsForTool(toolId: string): WorkflowType[] {
  const relationships: Record<string, WorkflowType[]> = {
    // Tax-related tools
    'grunderwerbsteuer': ['steuer', 'finanzierung'],
    'afa': ['steuer', 'immobilien'],
    'spekulationssteuer': ['steuer', 'analyse'],
    
    // Property-related tools
    'objekterfassung': ['immobilien', 'analyse'],
    'mietverwaltung': ['immobilien', 'finanzierung'],
    'nebenkosten': ['immobilien', 'steuer'],
    
    // Financing-related tools
    'calculator': ['finanzierung', 'immobilien'],
    'offers': ['finanzierung', 'analyse'],
    'tilgung': ['finanzierung', 'steuer'],
    
    // Analysis-related tools
    'rendite': ['analyse', 'finanzierung'],
    'marktanalyse': ['analyse', 'immobilien'],
    'portfolio': ['analyse', 'immobilien'],
    'investment-report': ['analyse', 'steuer']
  };
  
  return relationships[toolId] || [];
}

/**
 * Find common next steps across workflows
 * @param currentToolId - The ID of the current tool
 * @param excludeWorkflows - Workflow types to exclude
 * @returns Array of common next steps
 */
export function getCommonNextSteps(
  currentToolId: string,
  excludeWorkflows: WorkflowType[] = []
): Array<{ workflow: string; step: WorkflowStep }> {
  const relatedWorkflows = getRelatedWorkflowsForTool(currentToolId)
    .filter(wf => !excludeWorkflows.includes(wf));
  
  const result: Array<{ workflow: string; step: WorkflowStep }> = [];
  
  relatedWorkflows.forEach(workflow => {
    const { steps } = workflowDefinitions[workflow];
    
    // Find the current tool in this workflow
    const currentStepIndex = steps.findIndex(step => step.id === currentToolId);
    
    if (currentStepIndex !== -1 && currentStepIndex < steps.length - 1) {
      // Get the next step in this workflow
      const nextStep = steps[currentStepIndex + 1];
      result.push({ workflow, step: nextStep });
    }
  });
  
  return result;
}

/**
 * Get market relevant workflows based on user's market
 * @param market - The user's selected market
 * @returns Array of relevant workflow types
 */
export function getMarketRelevantWorkflows(market: string): string[] {
  switch (market.toLowerCase()) {
    case 'germany':
      return ['steuer', 'immobilien', 'finanzierung'];
    case 'us':
      return ['analyse', 'finanzierung', 'immobilien'];
    case 'uk':
      return ['immobilien', 'analyse', 'finanzierung'];
    default:
      return ['analyse', 'immobilien'];
  }
}

/**
 * Find incomplete workflow steps to suggest to the user
 * @param workflows - The current state of all workflows
 * @returns Array of incomplete workflow steps
 */
export function findIncompleteWorkflows(
  workflows: WorkflowsState
): Array<{ workflow: string; step: WorkflowStep }> {
  const result: Array<{ workflow: string; step: WorkflowStep }> = [];
  
  // Loop through all workflow types
  Object.keys(workflowDefinitions).forEach(workflowType => {
    const workflowId = `workflow_${workflowType}`;
    const workflow = workflows[workflowId];
    
    // Skip if workflow doesn't exist in state or has no steps
    if (!workflow || !workflow.completedSteps) return;
    
    const { steps } = workflowDefinitions[workflowType as WorkflowType];
    
    // Find incomplete steps
    steps.forEach(step => {
      if (!workflow.completedSteps.includes(step.id)) {
        // Check if this is the first incomplete step or if its dependencies are met
        const isDependenciesMet = step.requiredSteps ? 
          step.requiredSteps.every(reqId => workflow.completedSteps.includes(reqId)) :
          true;
        
        if (isDependenciesMet) {
          result.push({ workflow: workflowType, step });
          return; // Only add the first incomplete step per workflow
        }
      }
    });
  });
  
  return result;
}

/**
 * Create a unified connector between tools and workflows
 * @param sourceToolId - The ID of the source tool
 * @param targetToolId - The ID of the target tool
 * @returns Connection information with suggested path
 */
export function createWorkflowConnection(
  sourceToolId: string,
  targetToolId: string
): { exists: boolean; path?: string; requiredSteps: string[] } {
  let exists = false;
  let path: string | undefined;
  const requiredSteps: string[] = [];
  
  // Search all workflows for a direct connection
  Object.values(workflowDefinitions).forEach(definition => {
    const sourceIndex = definition.steps.findIndex(step => step.id === sourceToolId);
    const targetIndex = definition.steps.findIndex(step => step.id === targetToolId);
    
    // If both tools exist in the same workflow
    if (sourceIndex !== -1 && targetIndex !== -1) {
      exists = true;
      
      // Get the target step path
      path = definition.steps[targetIndex].path;
      
      // Find required steps between source and target
      if (targetIndex > sourceIndex) {
        // Target is after source, collect all steps in between
        for (let i = sourceIndex + 1; i < targetIndex; i++) {
          requiredSteps.push(definition.steps[i].id);
        }
      }
    }
  });
  
  return { exists, path, requiredSteps };
}
