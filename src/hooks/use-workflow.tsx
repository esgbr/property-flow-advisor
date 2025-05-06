
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Calculator, FileText, Map, Database, Euro, PiggyBank, CheckCircle } from 'lucide-react';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';

export type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

// Enhanced workflow step with progress tracking and time estimates
interface WorkflowStep {
  id: string;
  path: string;
  label: { de: string; en: string };
  description?: { de: string; en: string };
  icon?: React.ReactNode;
  isComplete?: boolean;
  requiredSteps?: string[];
  progress?: number;
  estimatedTime?: number; // in minutes
}

// Workflow definitions
const workflowDefinitions: Record<WorkflowType, WorkflowStep[]> = {
  steuer: [
    {
      id: 'grunderwerbsteuer',
      path: '/calculators/grunderwerbsteuer',
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' },
      description: { 
        de: 'Berechnung der Grunderwerbsteuer beim Immobilienkauf', 
        en: 'Calculate transfer tax for property purchases' 
      },
      icon: <Euro className="h-5 w-5 text-primary" />,
      estimatedTime: 5
    },
    {
      id: 'planning',
      path: '/investor-dashboard?tab=tax',
      label: { de: 'Steuerplanung', en: 'Tax Planning' },
      description: { 
        de: 'Optimieren Sie Ihre Steuerlast bei Immobilieninvestitionen', 
        en: 'Optimize your tax burden for real estate investments' 
      },
      icon: <FileText className="h-5 w-5 text-primary" />,
      requiredSteps: ['grunderwerbsteuer'],
      estimatedTime: 15
    },
    {
      id: 'afa',
      path: '/calculators/afa',
      label: { de: 'AfA-Berechnung', en: 'Depreciation' },
      description: { 
        de: 'Berechnung der steuerlichen Abschreibung', 
        en: 'Calculate tax depreciation for properties' 
      },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      requiredSteps: ['planning'],
      estimatedTime: 10
    },
  ],
  immobilien: [
    {
      id: 'marktanalyse',
      path: '/market-explorer',
      label: { de: 'Marktanalyse', en: 'Market Analysis' },
      description: { 
        de: 'Analyse des Immobilienmarkts', 
        en: 'Analyze the real estate market' 
      },
      icon: <Map className="h-5 w-5 text-primary" />,
      estimatedTime: 10
    },
    {
      id: 'rendite',
      path: '/calculators/rendite',
      label: { de: 'Renditeberechnung', en: 'Return Calculation' },
      description: { 
        de: 'Berechnung der Rendite von Immobilieninvestitionen', 
        en: 'Calculate returns on real estate investments' 
      },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      requiredSteps: ['marktanalyse'],
      estimatedTime: 8
    },
    {
      id: 'portfolio',
      path: '/investor-dashboard?tab=portfolio',
      label: { de: 'Portfolio-Optimierung', en: 'Portfolio Optimization' },
      description: { 
        de: 'Optimieren Sie Ihr Immobilienportfolio', 
        en: 'Optimize your real estate portfolio' 
      },
      icon: <Building className="h-5 w-5 text-primary" />,
      requiredSteps: ['rendite'],
      estimatedTime: 15
    },
  ],
  finanzierung: [
    {
      id: 'calculator',
      path: '/investor-dashboard?tab=financing',
      label: { de: 'Finanzierungsrechner', en: 'Financing Calculator' },
      description: { 
        de: 'Berechnung der Finanzierungsoptionen', 
        en: 'Calculate financing options' 
      },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      estimatedTime: 10
    },
    {
      id: 'offers',
      path: '/financing/compare-offers',
      label: { de: 'Angebote vergleichen', en: 'Compare Offers' },
      description: { 
        de: 'Vergleichen Sie verschiedene Finanzierungsangebote', 
        en: 'Compare different financing offers' 
      },
      icon: <Database className="h-5 w-5 text-primary" />,
      requiredSteps: ['calculator'],
      estimatedTime: 15
    },
    {
      id: 'tilgung',
      path: '/financing/repayment',
      label: { de: 'Tilgungsplan', en: 'Repayment Plan' },
      description: { 
        de: 'Erstellen Sie einen Tilgungsplan', 
        en: 'Create a repayment plan' 
      },
      icon: <PiggyBank className="h-5 w-5 text-primary" />,
      requiredSteps: ['offers'],
      estimatedTime: 12
    },
  ],
  analyse: [
    {
      id: 'market',
      path: '/investor-dashboard?tab=market',
      label: { de: 'Marktanalyse', en: 'Market Analysis' },
      description: { 
        de: 'Analyse des Immobilienmarkts', 
        en: 'Analyze the real estate market' 
      },
      icon: <Map className="h-5 w-5 text-primary" />,
      estimatedTime: 10
    },
    {
      id: 'portfolio',
      path: '/investor-dashboard?tab=portfolio',
      label: { de: 'Portfolio', en: 'Portfolio' },
      description: { 
        de: 'Übersicht über Ihr Immobilienportfolio', 
        en: 'Overview of your property portfolio' 
      },
      icon: <Building className="h-5 w-5 text-primary" />,
      requiredSteps: ['market'],
      estimatedTime: 8
    },
    {
      id: 'duediligence',
      path: '/investor-dashboard?tab=duediligence',
      label: { de: 'Due Diligence', en: 'Due Diligence' },
      description: { 
        de: 'Durchführung einer Due-Diligence-Prüfung', 
        en: 'Perform a due diligence check' 
      },
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      requiredSteps: ['portfolio'],
      estimatedTime: 20
    },
  ]
};

export function useWorkflow(type: WorkflowType) {
  const navigate = useNavigate();
  const { 
    getCurrentWorkflowStep, 
    getCompletedSteps, 
    markStepComplete,
    setCurrentStep,
    saveWorkflowData,
    getWorkflowData,
    resetWorkflow 
  } = useWorkflowState();
  
  const workflowId = `workflow_${type}`;
  const steps = workflowDefinitions[type];
  
  // Get steps with completion status
  const getStepsWithStatus = (): WorkflowStep[] => {
    const completedSteps = getCompletedSteps(workflowId);
    return steps.map(step => ({
      ...step,
      isComplete: completedSteps.includes(step.id)
    }));
  };
  
  // Get the current step in the workflow
  const getCurrentStep = (stepId?: string): WorkflowStep | undefined => {
    const id = stepId || getCurrentWorkflowStep(workflowId);
    if (!id) return undefined;
    return getStepsWithStatus().find(step => step.id === id);
  };
  
  // Get all completed steps
  const getCompleteSteps = (): WorkflowStep[] => {
    return getStepsWithStatus().filter(step => step.isComplete);
  };
  
  // Get the next steps in the workflow
  const getNextSteps = (currentStepId: string, limit = 3): WorkflowStep[] => {
    const stepsWithStatus = getStepsWithStatus();
    const currentStepIndex = stepsWithStatus.findIndex(step => step.id === currentStepId);
    
    if (currentStepIndex === -1) {
      // Current step not found, return the first 'limit' steps
      return stepsWithStatus.slice(0, limit);
    }
    
    // Get next steps
    return stepsWithStatus.slice(currentStepIndex + 1, currentStepIndex + 1 + limit);
  };
  
  // Get the previous step in the workflow
  const getPreviousStep = (currentStepId: string): WorkflowStep | undefined => {
    const stepsWithStatus = getStepsWithStatus();
    const currentStepIndex = stepsWithStatus.findIndex(step => step.id === currentStepId);
    
    if (currentStepIndex <= 0) {
      return undefined;
    }
    
    return stepsWithStatus[currentStepIndex - 1];
  };
  
  // Get the path to the current step (all steps needed to reach it)
  const getPathToStep = (stepId: string): WorkflowStep[] => {
    const stepsWithStatus = getStepsWithStatus();
    const targetStep = stepsWithStatus.find(step => step.id === stepId);
    
    if (!targetStep) return [];
    
    const path: WorkflowStep[] = [targetStep];
    
    // Build the path recursively
    const buildPath = (requiredSteps: string[] = []) => {
      if (!requiredSteps.length) return;
      
      requiredSteps.forEach(reqStepId => {
        const reqStep = stepsWithStatus.find(s => s.id === reqStepId);
        if (reqStep && !path.find(s => s.id === reqStepId)) {
          path.unshift(reqStep);
          if (reqStep.requiredSteps?.length) {
            buildPath(reqStep.requiredSteps);
          }
        }
      });
    };
    
    if (targetStep.requiredSteps?.length) {
      buildPath(targetStep.requiredSteps);
    }
    
    return path;
  };
  
  // Navigate to a step
  const goToStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    
    if (step) {
      setCurrentStep(workflowId, stepId);
      navigate(step.path);
    }
  };
  
  // Mark a step as complete
  const markComplete = (stepId: string) => {
    markStepComplete(workflowId, stepId);
  };
  
  // Get the label for a step
  const getStepLabel = (stepId: string): string => {
    const step = steps.find(s => s.id === stepId);
    return step?.label?.en || stepId;
  };
  
  // Calculate workflow progress
  const getWorkflowProgress = (currentStepId?: string): number => {
    const stepsWithStatus = getStepsWithStatus();
    const completedSteps = stepsWithStatus.filter(step => step.isComplete).length;
    
    // If a current step is provided, include it in the calculation
    if (currentStepId) {
      const currentStepIndex = stepsWithStatus.findIndex(step => step.id === currentStepId);
      if (currentStepIndex >= 0 && !stepsWithStatus[currentStepIndex].isComplete) {
        // For the current incomplete step, estimate 50% progress
        return Math.round(((completedSteps + 0.5) / stepsWithStatus.length) * 100);
      }
    }
    
    return Math.round((completedSteps / stepsWithStatus.length) * 100);
  };
  
  // Reset the workflow
  const resetWorkflowState = () => {
    resetWorkflow(workflowId);
  };
  
  return {
    steps,
    getCurrentStep,
    getCompleteSteps,
    getNextSteps,
    getPreviousStep,
    getPathToStep,
    goToStep,
    markStepComplete: markComplete,
    getStepLabel,
    getWorkflowProgress,
    resetWorkflow: resetWorkflowState,
    saveData: <T,>(key: string, data: T) => saveWorkflowData<T>(workflowId, key, data),
    getData: <T,>(key: string) => getWorkflowData<T>(workflowId, key)
  };
}
