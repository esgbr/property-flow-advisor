
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useWorkflowState } from '@/contexts/WorkflowStateContext';

// Define workflow types
export type WorkflowType = 'steuer' | 'investment' | 'finanzierung' | 'immobilien';

interface WorkflowStep {
  id: string;
  label: { en: string; de: string };
  description?: { en: string; de: string };
  path: string;
  estimatedTime?: number; // in minutes
  isComplete?: boolean;
  optional?: boolean;
  requiredSteps?: string[];
}

interface WorkflowData {
  id: WorkflowType;
  title: { en: string; de: string };
  description: { en: string; de: string };
  steps: WorkflowStep[];
}

// Define workflow data
const workflows: Record<WorkflowType, WorkflowData> = {
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
        label: { en: 'Real Estate Transfer Tax', de: 'Grunderwerbsteuer' },
        description: { 
          en: 'Calculate real estate transfer tax based on property value and location',
          de: 'Berechnen Sie die Grunderwerbsteuer basierend auf Immobilienwert und Standort'
        },
        path: '/grunderwerbsteuer',
        estimatedTime: 5
      },
      {
        id: 'afa',
        label: { en: 'Depreciation', de: 'Abschreibung' },
        description: {
          en: 'Calculate depreciation for your real estate investment',
          de: 'Berechnen Sie die Abschreibung für Ihre Immobilieninvestition'
        },
        path: '/afa-rechner',
        estimatedTime: 10
      },
      {
        id: 'spekulationssteuer',
        label: { en: 'Speculation Tax', de: 'Spekulationssteuer' },
        description: {
          en: 'Calculate potential speculation tax when selling real estate',
          de: 'Berechnen Sie die potenzielle Spekulationssteuer beim Verkauf von Immobilien'
        },
        path: '/spekulationssteuer',
        estimatedTime: 8
      },
      {
        id: 'summary',
        label: { en: 'Tax Summary', de: 'Steuerübersicht' },
        description: {
          en: 'Overview of all tax implications for your property',
          de: 'Überblick über alle steuerlichen Auswirkungen für Ihre Immobilie'
        },
        path: '/steuer-zusammenfassung',
        estimatedTime: 3
      }
    ]
  },
  investment: {
    id: 'investment',
    title: { en: 'Investment Analysis', de: 'Investitionsanalyse' },
    description: {
      en: 'Analyze and optimize your real estate investments',
      de: 'Analysieren und optimieren Sie Ihre Immobilieninvestitionen'
    },
    steps: [
      {
        id: 'rendite',
        label: { en: 'Yield Calculator', de: 'Renditerechner' },
        description: {
          en: 'Calculate the potential yield of your investment',
          de: 'Berechnen Sie die potenzielle Rendite Ihrer Investition'
        },
        path: '/renditerechner',
        estimatedTime: 8
      },
      {
        id: 'kapitalanlage',
        label: { en: 'Capital Investment', de: 'Kapitalanlage' },
        description: {
          en: 'Optimize your capital investment strategy',
          de: 'Optimieren Sie Ihre Kapitalanlagestrategie'
        },
        path: '/kapitalanlage',
        estimatedTime: 12
      },
      {
        id: 'investment-report',
        label: { en: 'Investment Report', de: 'Investitionsbericht' },
        description: {
          en: 'Generate a comprehensive investment report',
          de: 'Erstellen Sie einen umfassenden Investitionsbericht'
        },
        path: '/investment-report',
        estimatedTime: 5
      }
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
        id: 'darlehen',
        label: { en: 'Loan Calculator', de: 'Darlehensrechner' },
        description: {
          en: 'Calculate loan options and monthly payments',
          de: 'Berechnen Sie Kreditoptionen und monatliche Zahlungen'
        },
        path: '/darlehensrechner',
        estimatedTime: 7
      },
      {
        id: 'tilgungsplan',
        label: { en: 'Repayment Plan', de: 'Tilgungsplan' },
        description: {
          en: 'Create a detailed repayment plan',
          de: 'Erstellen Sie einen detaillierten Tilgungsplan'
        },
        path: '/tilgungsplan',
        estimatedTime: 10
      }
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
        id: 'objekterfassung',
        label: { en: 'Property Registration', de: 'Objekterfassung' },
        description: {
          en: 'Register and document your properties',
          de: 'Erfassen und dokumentieren Sie Ihre Immobilien'
        },
        path: '/objekterfassung',
        estimatedTime: 15
      },
      {
        id: 'mietverwaltung',
        label: { en: 'Rental Management', de: 'Mietverwaltung' },
        description: {
          en: 'Manage your rental properties and tenants',
          de: 'Verwalten Sie Ihre Mietobjekte und Mieter'
        },
        path: '/mietverwaltung',
        estimatedTime: 12
      },
      {
        id: 'nebenkosten',
        label: { en: 'Additional Costs', de: 'Nebenkosten' },
        description: {
          en: 'Calculate and manage additional costs',
          de: 'Berechnen und verwalten Sie Nebenkosten'
        },
        path: '/nebenkosten',
        estimatedTime: 10
      }
    ]
  }
};

export const useWorkflow = (workflowType: WorkflowType) => {
  const { getCurrentWorkflowStep, getCompletedSteps, markStepComplete, setCurrentStep } = useWorkflowState();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  
  const workflow = useMemo(() => workflows[workflowType], [workflowType]);
  
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
    getWorkflowProgress
  };
};

export default useWorkflow;
