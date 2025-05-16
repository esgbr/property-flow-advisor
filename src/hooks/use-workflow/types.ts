
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

// Define workflow state interface
export interface WorkflowState {
  completedSteps: string[];
  activeStep: string | null;
  data: WorkflowData;
}

// Define workflow definition interface
export interface WorkflowDefinition {
  title: Record<string, string>;
  description: Record<string, string>;
  steps: {
    id: string;
    label: Record<string, string>;
    path: string;
    description?: Record<string, string>;
    estimatedTime?: number;
    dependencies?: string[];
  }[];
}

// Define the full workflow definitions interface
export type WorkflowDefinitions = {
  [key in WorkflowType]: WorkflowDefinition;
}
