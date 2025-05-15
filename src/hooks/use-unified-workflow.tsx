
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Calculator, FileText, Map, Database, 
  Euro, PiggyBank, CheckCircle, TrendingUp 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';
import { useToast } from '@/hooks/use-toast';

export type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

export interface WorkflowStep {
  id: string;
  path: string;
  label: { de: string; en: string };
  description?: { de: string; en: string };
  icon?: React.ReactNode;
  isComplete?: boolean;
  requiredSteps?: string[]; // HOTFIX: ergänzt
  progress?: number;
  estimatedTime?: number; // in minutes
}

export interface WorkflowStepWithStatus extends WorkflowStep {
  isComplete: boolean;
  isActive?: boolean;
}

export interface WorkflowDefinition {
  id: WorkflowType;
  title: { de: string; en: string };
  description: { de: string; en: string };
  steps: WorkflowStep[];
}

// Central workflow definitions repository
export const workflowDefinitions: Record<WorkflowType, WorkflowDefinition> = {
  steuer: {
    id: 'steuer',
    title: { en: 'Tax Optimization', de: 'Steueroptimierung' },
    description: { 
      en: 'Optimize your taxes for real estate investments', 
      de: 'Optimieren Sie Ihre Steuern für Immobilieninvestitionen' 
    },
    steps: [
      {
        id: 'grunderwerbsteuer',
        path: '/grunderwerbsteuer',
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
    ]
  },
  immobilien: {
    id: 'immobilien',
    title: { en: 'Property Management', de: 'Immobilienverwaltung' },
    description: {
      en: 'Efficiently manage your real estate portfolio',
      de: 'Verwalten Sie Ihr Immobilienportfolio effizient'
    },
    steps: [
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
    ]
  },
  finanzierung: {
    id: 'finanzierung',
    title: { en: 'Financing', de: 'Finanzierung' },
    description: {
      en: 'Plan and optimize your property financing',
      de: 'Planen und optimieren Sie Ihre Immobilienfinanzierung'
    },
    steps: [
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
    ]
  },
  analyse: {
    id: 'analyse',
    title: { en: 'Investment Analysis', de: 'Investitionsanalyse' },
    description: {
      en: 'Analyze and optimize your real estate investments',
      de: 'Analysieren und optimieren Sie Ihre Immobilieninvestitionen'
    },
    steps: [
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
  }
};

/**
 * Unified workflow hook that combines functionality from both previous workflow hooks
 */
export function useUnifiedWorkflow(type: WorkflowType) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
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
  const steps = workflowDefinitions[type].steps;
  
  // Local state for current step
  const [localCurrentStepId, setLocalCurrentStepId] = useState<string | null>(null);
  
  // Load current step from workflow state
  useEffect(() => {
    const currentStep = getCurrentWorkflowStep(workflowId);
    if (currentStep) {
      setLocalCurrentStepId(currentStep);
    } else if (steps.length > 0) {
      setLocalCurrentStepId(steps[0].id);
    }
  }, [getCurrentWorkflowStep, workflowId, steps]);
  
  // Get steps with completion status
  const getStepsWithStatus = useCallback((): WorkflowStepWithStatus[] => {
    const completedSteps = getCompletedSteps(workflowId);
    const currentStepId = getCurrentWorkflowStep(workflowId);
    
    return steps.map(step => ({
      ...step,
      isComplete: completedSteps.includes(step.id),
      isActive: currentStepId === step.id
    }));
  }, [steps, getCompletedSteps, getCurrentWorkflowStep, workflowId]);
  
  // Get the current step in the workflow
  const getCurrentStep = useCallback((): WorkflowStepWithStatus | undefined => {
    const currentStepId = getCurrentWorkflowStep(workflowId) || localCurrentStepId;
    if (!currentStepId) return undefined;
    
    return getStepsWithStatus().find(step => step.id === currentStepId);
  }, [getStepsWithStatus, getCurrentWorkflowStep, workflowId, localCurrentStepId]);
  
  // Get all completed steps
  const getCompleteSteps = useCallback((): WorkflowStepWithStatus[] => {
    return getStepsWithStatus().filter(step => step.isComplete);
  }, [getStepsWithStatus]);
  
  // Get the next steps in the workflow
  const getNextSteps = useCallback((currentStepId: string, limit = 3): WorkflowStepWithStatus[] => {
    const stepsWithStatus = getStepsWithStatus();
    const currentStepIndex = stepsWithStatus.findIndex(step => step.id === currentStepId);
    
    if (currentStepIndex === -1) {
      return stepsWithStatus.slice(0, limit);
    }
    
    return stepsWithStatus.slice(currentStepIndex + 1, currentStepIndex + 1 + limit);
  }, [getStepsWithStatus]);
  
  // Check if a step is blocked by dependencies
  const isStepBlocked = useCallback(
    (stepId: string): boolean => {
      const step = steps.find(s => s.id === stepId);
      
      if (!step || !step.requiredSteps || step.requiredSteps.length === 0) {
        return false;
      }
      
      const completedSteps = getCompletedSteps(workflowId);
      return step.requiredSteps.some(
        dependencyId => !completedSteps.includes(dependencyId)
      );
    },
    [steps, getCompletedSteps, workflowId]
  );
  
  // Navigate to a step
  const goToStep = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    
    if (step) {
      if (isStepBlocked(stepId)) {
        toast({
          title: language === 'de' 
            ? 'Schritt ist blockiert' 
            : 'Step is blocked',
          description: language === 'de'
            ? 'Bitte schließen Sie zuerst die erforderlichen Schritte ab.'
            : 'Please complete the required steps first.',
          variant: 'warning'
        });
        return false;
      }
      
      setLocalCurrentStepId(stepId);
      setCurrentStep(workflowId, stepId);
      navigate(step.path);
      return true;
    }
    return false;
  }, [steps, setCurrentStep, workflowId, navigate, isStepBlocked, toast, language]);
  
  // Mark a step as complete
  const completeStep = useCallback((stepId: string) => {
    markStepComplete(workflowId, stepId);
    
    toast({
      title: language === 'de' ? 'Schritt abgeschlossen' : 'Step completed',
      description: language === 'de' 
        ? 'Der Workflow-Schritt wurde als abgeschlossen markiert.' 
        : 'The workflow step has been marked as complete.',
      variant: 'default'
    });
    
    // Find and navigate to the next step if available
    const stepsWithStatus = getStepsWithStatus();
    const currentStepIndex = stepsWithStatus.findIndex(s => s.id === stepId);
    
    if (currentStepIndex < stepsWithStatus.length - 1) {
      const nextStep = stepsWithStatus[currentStepIndex + 1];
      if (!isStepBlocked(nextStep.id)) {
        goToStep(nextStep.id);
      }
    }
  }, [markStepComplete, workflowId, toast, language, getStepsWithStatus, isStepBlocked, goToStep]);
  
  // Calculate workflow progress
  const getWorkflowProgress = useCallback((currentStepId?: string): number => {
    const stepsWithStatus = getStepsWithStatus();
    const completedSteps = stepsWithStatus.filter(step => step.isComplete).length;
    
    // Include partial progress for current step
    if (currentStepId) {
      const currentStep = stepsWithStatus.find(step => step.id === currentStepId);
      if (currentStep && !currentStep.isComplete) {
        return Math.round(((completedSteps + 0.5) / stepsWithStatus.length) * 100);
      }
    }
    
    return Math.round((completedSteps / stepsWithStatus.length) * 100);
  }, [getStepsWithStatus]);
  
  // Reset workflow progress
  const resetWorkflowProgress = useCallback(() => {
    resetWorkflow(workflowId);
    
    if (steps.length > 0) {
      setLocalCurrentStepId(steps[0].id);
    }
    
    toast({
      title: language === 'de' ? 'Workflow zurückgesetzt' : 'Workflow reset',
      description: language === 'de'
        ? 'Alle Fortschritte wurden zurückgesetzt.'
        : 'All progress has been reset.',
      variant: 'default'
    });
  }, [resetWorkflow, workflowId, steps, toast, language]);
  
  return {
    // Workflow data
    steps,
    workflowDefinition: workflowDefinitions[type],
    
    // Step retrieval
    getStepsWithStatus,
    getCurrentStep,
    getCompleteSteps,
    getNextSteps,
    
    // Step navigation and management
    goToStep,
    completeStep,
    isStepBlocked,
    
    // Progress tracking
    getWorkflowProgress,
    
    // Workflow data management
    saveData: <T,>(key: string, data: T) => saveWorkflowData<T>(workflowId, key, data),
    getData: <T,>(key: string) => getWorkflowData<T>(workflowId, key),
    
    // Reset workflow
    resetWorkflow: resetWorkflowProgress
  };
}

// Helper function to get the related workflows for a tool
export function getRelatedWorkflowsForTool(toolId: string): WorkflowType[] {
  const relationships: Record<string, WorkflowType[]> = {
    // Tax-related tools
    'grunderwerbsteuer': ['steuer', 'finanzierung'],
    'planning': ['steuer', 'analyse'],
    'afa': ['steuer', 'immobilien'],
    
    // Property-related tools
    'marktanalyse': ['immobilien', 'analyse'],
    'rendite': ['immobilien', 'finanzierung'],
    'portfolio': ['immobilien', 'analyse'],
    
    // Financing-related tools
    'calculator': ['finanzierung', 'immobilien'],
    'offers': ['finanzierung', 'analyse'],
    'tilgung': ['finanzierung', 'steuer'],
    
    // Analysis-related tools
    'market': ['analyse', 'immobilien'],
    'duediligence': ['analyse', 'steuer']
  };
  
  return relationships[toolId] || [];
}

export default useUnifiedWorkflow;
