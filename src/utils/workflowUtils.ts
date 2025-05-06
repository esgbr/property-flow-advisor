import { WorkflowType } from '@/data/workflow-definitions';
import { workflowDefinitions } from '@/data/workflow-definitions';
import { InvestmentMarket } from '@/contexts/UserPreferencesContext';

/**
 * Returns workflows that are relevant to the specified market
 * This enables market-specific workflow suggestions
 */
export const getMarketRelevantWorkflows = (market: InvestmentMarket): WorkflowType[] => {
  switch (market) {
    case 'germany':
      return ['steuer', 'immobilien', 'finanzierung'];
    case 'austria':
    case 'switzerland':
      return ['immobilien', 'finanzierung'];
    case 'usa':
    case 'canada':
      return ['immobilien', 'analyse'];
    case 'global':
    default:
      return ['immobilien', 'analyse', 'finanzierung', 'steuer'];
  }
};

/**
 * Maps tools/steps to related workflows to provide cross-workflow suggestions
 * @param toolId The current tool/step ID
 * @returns An array of related workflow types
 */
export const getRelatedWorkflowsForTool = (toolId: string): WorkflowType[] => {
  const toolToWorkflowMap: Record<string, WorkflowType[]> = {
    // Tax related tools
    'grunderwerbsteuer': ['steuer', 'finanzierung'],
    'planning': ['steuer', 'immobilien'],
    'afa': ['steuer', 'immobilien'],
    
    // Property related tools
    'marktanalyse': ['immobilien', 'analyse'],
    'rendite': ['immobilien', 'finanzierung'],
    'portfolio': ['immobilien', 'analyse', 'steuer'],
    
    // Financing related tools
    'calculator': ['finanzierung', 'steuer'],
    'offers': ['finanzierung', 'immobilien'],
    'tilgung': ['finanzierung', 'steuer'],
    
    // Analysis related tools
    'market': ['analyse', 'immobilien'],
    'duediligence': ['analyse', 'immobilien', 'finanzierung'],
  };
  
  return toolToWorkflowMap[toolId] || ['immobilien']; // Default to property workflow if no match
};

/**
 * Gets steps that commonly follow after the specified tool/step across workflows
 * This enables intelligent suggestions based on user behavior patterns
 */
export const getCommonNextSteps = (
  currentTool: string,
  excludeWorkflows: WorkflowType[] = []
): { step: any; workflow: WorkflowType }[] => {
  const results: { step: any; workflow: WorkflowType }[] = [];
  
  // Define common paths users take across different workflows
  const commonPaths: Record<string, { workflow: WorkflowType; step: string }[]> = {
    'grunderwerbsteuer': [
      { workflow: 'finanzierung', step: 'calculator' },
      { workflow: 'immobilien', step: 'rendite' }
    ],
    'rendite': [
      { workflow: 'steuer', step: 'grunderwerbsteuer' },
      { workflow: 'immobilien', step: 'portfolio' }
    ],
    'calculator': [
      { workflow: 'finanzierung', step: 'offers' },
      { workflow: 'steuer', step: 'grunderwerbsteuer' }
    ]
    // Add more common paths as needed
  };
  
  const paths = commonPaths[currentTool] || [];
  
  paths.forEach(path => {
    // Skip excluded workflows
    if (excludeWorkflows.includes(path.workflow)) return;
    
    // Find the step in the workflow
    const workflow = workflowDefinitions[path.workflow];
    const step = workflow.steps.find(s => s.id === path.step);
    
    if (step) {
      results.push({ step, workflow: path.workflow });
    }
  });
  
  return results;
};

/**
 * Finds workflows that need attention based on user progress
 * This helps users complete workflows they've started but not finished
 */
export const findIncompleteWorkflows = (
  workflowProgress: Record<string, { completedSteps: string[]; currentStep: string }>,
  excludeWorkflows: WorkflowType[] = []
): { workflow: WorkflowType; step: any }[] => {
  const results: { workflow: WorkflowType; step: any }[] = [];
  
  Object.keys(workflowDefinitions).forEach(wfType => {
    const workflowType = wfType as WorkflowType;
    
    // Skip excluded workflows
    if (excludeWorkflows.includes(workflowType)) return;
    
    const workflowKey = `workflow_${workflowType}`;
    const progress = workflowProgress[workflowKey];
    
    if (progress) {
      const completedCount = progress.completedSteps.length;
      const totalSteps = workflowDefinitions[workflowType].steps.length;
      
      // If workflow is started but not completed (at least one step but not all)
      if (completedCount > 0 && completedCount < totalSteps) {
        // Find the next uncompleted step
        const nextStep = workflowDefinitions[workflowType].steps.find(
          step => !progress.completedSteps.includes(step.id)
        );
        
        if (nextStep) {
          results.push({ workflow: workflowType, step: nextStep });
        }
      }
    }
  });
  
  return results;
};

export default {
  getRelatedWorkflowsForTool,
  createRecommendedWorkflowPath,
  calculateWorkflowEstimatedTime
};
