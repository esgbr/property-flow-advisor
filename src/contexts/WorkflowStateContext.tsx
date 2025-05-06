import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserPreferences } from './UserPreferencesContext';

// Define types for workflow state
interface WorkflowProgress {
  currentStep: string;
  completedSteps: string[];
  startedAt?: string;
  lastInteractionAt?: string;
  data?: Record<string, any>;
}

interface WorkflowsState {
  [workflowId: string]: WorkflowProgress;
}

interface WorkflowStateContextType {
  workflows: WorkflowsState;
  getCurrentWorkflowStep: (workflowId: string) => string | null;
  getCompletedSteps: (workflowId: string) => string[];
  markStepComplete: (workflowId: string, stepId: string) => void;
  setCurrentStep: (workflowId: string, stepId: string) => void;
  saveWorkflowData: <T>(workflowId: string, key: string, data: T) => void;
  getWorkflowData: <T>(workflowId: string, key: string) => T | undefined;
  resetWorkflow: (workflowId: string) => void;
}

const WorkflowStateContext = createContext<WorkflowStateContextType | undefined>(undefined);

export const WorkflowStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences } = useUserPreferences();
  const [workflows, setWorkflows] = useState<WorkflowsState>({});
  
  // Load workflow state from localStorage on mount
  useEffect(() => {
    try {
      const savedWorkflows = localStorage.getItem('workflowState');
      if (savedWorkflows) {
        setWorkflows(JSON.parse(savedWorkflows));
      }
    } catch (error) {
      console.error('Error loading workflow state:', error);
    }
  }, []);
  
  // Save workflow state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(workflows).length > 0) {
      try {
        localStorage.setItem('workflowState', JSON.stringify(workflows));
      } catch (error) {
        console.error('Error saving workflow state:', error);
      }
    }
  }, [workflows]);
  
  // Get the current step for a workflow
  const getCurrentWorkflowStep = (workflowId: string): string | null => {
    return workflows[workflowId]?.currentStep || null;
  };
  
  // Get completed steps for a workflow
  const getCompletedSteps = (workflowId: string): string[] => {
    return workflows[workflowId]?.completedSteps || [];
  };
  
  // Mark a step as complete
  const markStepComplete = (workflowId: string, stepId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId] || { 
        currentStep: stepId, 
        completedSteps: [],
        startedAt: new Date().toISOString()
      };
      
      // Don't add duplicates
      if (!workflow.completedSteps.includes(stepId)) {
        workflow.completedSteps = [...workflow.completedSteps, stepId];
      }
      
      workflow.lastInteractionAt = new Date().toISOString();
      
      return { ...prev, [workflowId]: workflow };
    });
  };
  
  // Set the current step for a workflow
  const setCurrentStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId] || { 
        currentStep: '', 
        completedSteps: [],
        startedAt: new Date().toISOString()
      };
      
      workflow.currentStep = stepId;
      workflow.lastInteractionAt = new Date().toISOString();
      
      return { ...prev, [workflowId]: workflow };
    });
  };
  
  // Save data for a workflow
  const saveWorkflowData = <T,>(workflowId: string, key: string, data: T) => {
    setWorkflows(prev => {
      const workflow = prev[workflowId] || { 
        currentStep: '', 
        completedSteps: [],
        data: {},
        startedAt: new Date().toISOString()
      };
      
      workflow.data = {
        ...(workflow.data || {}),
        [key]: data
      };
      
      workflow.lastInteractionAt = new Date().toISOString();
      
      return { ...prev, [workflowId]: workflow };
    });
  };
  
  // Get data for a workflow
  const getWorkflowData = <T,>(workflowId: string, key: string): T | undefined => {
    return workflows[workflowId]?.data?.[key] as T | undefined;
  };
  
  // Reset a workflow
  const resetWorkflow = (workflowId: string) => {
    setWorkflows(prev => {
      const newWorkflows = { ...prev };
      delete newWorkflows[workflowId];
      return newWorkflows;
    });
  };
  
  return (
    <WorkflowStateContext.Provider
      value={{
        workflows,
        getCurrentWorkflowStep,
        getCompletedSteps,
        markStepComplete,
        setCurrentStep,
        saveWorkflowData,
        getWorkflowData,
        resetWorkflow
      }}
    >
      {children}
    </WorkflowStateContext.Provider>
  );
};

export const useWorkflowState = () => {
  const context = useContext(WorkflowStateContext);
  
  if (context === undefined) {
    throw new Error('useWorkflowState must be used within a WorkflowStateProvider');
  }
  
  return context;
};

export default WorkflowStateContext;
