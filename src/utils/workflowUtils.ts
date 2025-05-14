
import { WorkflowType } from '@/hooks/use-workflow';
import { workflowDefinitions } from '@/data/workflow-definitions';

/**
 * Finds all workflows that are related to a specific market
 * @param market The market to find workflows for
 * @returns Array of workflow types
 */
export const getMarketRelevantWorkflows = (market: string): WorkflowType[] => {
  // Demo implementation - in real app, this would filter based on market-specific data
  switch (market.toLowerCase()) {
    case 'germany':
    case 'deutschland':
    case 'german':
      return ['steuer', 'immobilien'];
    case 'us':
    case 'usa':
    case 'united states':
      return ['finanzierung', 'analyse'];
    default:
      return ['immobilien', 'finanzierung'];
  }
};

/**
 * Finds related workflows for a specific tool
 * @param toolId The tool ID to find related workflows for
 * @returns Array of workflow types
 */
export const getRelatedWorkflowsForTool = (toolId: string): WorkflowType[] => {
  // Demo implementation - in real app, this would be data-driven
  const toolWorkflowMap: Record<string, WorkflowType[]> = {
    'grunderwerbsteuer': ['steuer'],
    'renditerechner': ['immobilien', 'analyse'],
    'afa': ['steuer', 'immobilien'],
    'mietkauf': ['finanzierung', 'immobilien']
  };
  
  return toolWorkflowMap[toolId] || [];
};

interface CommonNextStep {
  workflow: WorkflowType;
  step: {
    id: string;
    path: string;
    label: Record<string, string>;
    description?: Record<string, string>;
  }
}

/**
 * Finds common next steps across workflows
 * @param currentTool The current tool being used
 * @param completedSteps Array of completed step IDs
 * @returns Array of common next steps
 */
export const getCommonNextSteps = (currentTool: string, completedSteps: string[]): CommonNextStep[] => {
  // Demo implementation - in real app, this would be data-driven
  return [
    {
      workflow: 'immobilien',
      step: {
        id: 'property-analysis',
        path: '/tools/property-analysis',
        label: {
          en: 'Property Analysis',
          de: 'Immobilienanalyse'
        },
        description: {
          en: 'Analyze property details and potential',
          de: 'Immobiliendetails und Potenzial analysieren'
        }
      }
    },
    {
      workflow: 'finanzierung',
      step: {
        id: 'financing-options',
        path: '/tools/financing',
        label: {
          en: 'Financing Options',
          de: 'Finanzierungsmöglichkeiten'
        },
        description: {
          en: 'Explore financing options for properties',
          de: 'Finanzierungsmöglichkeiten für Immobilien erkunden'
        }
      }
    }
  ];
};

/**
 * Find incomplete workflows based on state
 * @param workflows Current workflow state
 * @returns Array of steps in incomplete workflows
 */
export const findIncompleteWorkflows = (workflows: any) => {
  // This would be implemented based on actual workflow state structure
  return [
    {
      workflow: 'steuer',
      step: {
        id: 'tax-calculation',
        path: '/tools/tax-calculator',
        label: {
          en: 'Tax Calculation',
          de: 'Steuerberechnung'
        },
        description: {
          en: 'Calculate property-related taxes',
          de: 'Immobilienbezogene Steuern berechnen'
        }
      }
    }
  ];
};
