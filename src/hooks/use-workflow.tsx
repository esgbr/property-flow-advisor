
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export interface WorkflowStep {
  id: string;
  path: string;
  label: {
    de: string;
    en: string;
  };
  icon?: React.ReactNode; // Optional icon for visual representation
  description?: {
    de: string;
    en: string;
  };
}

export type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

const workflowDefinitions: Record<WorkflowType, WorkflowStep[]> = {
  steuer: [
    { 
      id: 'overview', 
      path: '/tax-overview',
      label: { de: 'Steuerübersicht', en: 'Tax Overview' },
      description: { 
        de: 'Übersicht über steuerrelevante Aspekte Ihrer Immobilien', 
        en: 'Overview of tax-relevant aspects of your properties' 
      }
    },
    { 
      id: 'grunderwerbsteuer', 
      path: '/calculators/grunderwerbsteuer',
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' },
      description: { 
        de: 'Berechnen Sie die Grunderwerbsteuer für alle Bundesländer', 
        en: 'Calculate the real estate transfer tax for all German states' 
      }
    },
    { 
      id: 'afa', 
      path: '/calculators/afa',
      label: { de: 'AfA-Rechner', en: 'Depreciation' },
      description: { 
        de: 'Berechnen Sie die optimale Abschreibung für Ihre Immobilie', 
        en: 'Calculate the optimal depreciation for your property' 
      }
    },
    { 
      id: 'planning', 
      path: '/tax-planning',
      label: { de: 'Steuerplanung', en: 'Tax Planning' },
      description: { 
        de: 'Optimieren Sie Ihre Steuerlast durch vorausschauende Planung', 
        en: 'Optimize your tax burden through forward-looking planning' 
      }
    }
  ],
  immobilien: [
    { 
      id: 'overview', 
      path: '/deutsche-immobilien',
      label: { de: 'Übersicht', en: 'Overview' },
      description: { 
        de: 'Allgemeine Übersicht zum deutschen Immobilienmarkt', 
        en: 'General overview of the German real estate market' 
      }
    },
    { 
      id: 'tools', 
      path: '/deutsche-immobilien-tools',
      label: { de: 'Tools', en: 'Tools' },
      description: { 
        de: 'Verschiedene Tools für deutsche Immobilieninvestitionen', 
        en: 'Various tools for German real estate investments' 
      }
    },
    { 
      id: 'analysis', 
      path: '/portfolio-analytics',
      label: { de: 'Analyse', en: 'Analysis' },
      description: { 
        de: 'Analysieren Sie Ihr Immobilienportfolio', 
        en: 'Analyze your real estate portfolio' 
      }
    }
  ],
  finanzierung: [
    { 
      id: 'overview', 
      path: '/financing-overview',
      label: { de: 'Übersicht', en: 'Overview' },
      description: { 
        de: 'Übersicht über Finanzierungsmöglichkeiten', 
        en: 'Overview of financing options' 
      }
    },
    { 
      id: 'calculator', 
      path: '/financing-calculator',
      label: { de: 'Rechner', en: 'Calculator' },
      description: { 
        de: 'Berechnen Sie Ihre Finanzierungsoptionen', 
        en: 'Calculate your financing options' 
      }
    },
    { 
      id: 'planning', 
      path: '/financing-planning',
      label: { de: 'Planung', en: 'Planning' },
      description: { 
        de: 'Langfristige Finanzierungsplanung für Ihre Investitionen', 
        en: 'Long-term financing planning for your investments' 
      }
    }
  ],
  analyse: [
    { 
      id: 'market', 
      path: '/market-explorer',
      label: { de: 'Marktanalyse', en: 'Market Analysis' },
      description: { 
        de: 'Aktuelle Markttrends und Daten', 
        en: 'Current market trends and data' 
      }
    },
    { 
      id: 'portfolio', 
      path: '/portfolio-analytics',
      label: { de: 'Portfolio', en: 'Portfolio' },
      description: { 
        de: 'Analysieren Sie Ihr bestehendes Portfolio', 
        en: 'Analyze your existing portfolio' 
      }
    },
    { 
      id: 'reports', 
      path: '/analytics-reports',
      label: { de: 'Berichte', en: 'Reports' },
      description: { 
        de: 'Detaillierte Berichte und Auswertungen', 
        en: 'Detailed reports and evaluations' 
      }
    }
  ]
};

/**
 * Hook for managing workflow navigation and transitions
 * Enhances user experience by providing intuitive navigation between related features
 */
export function useWorkflow(workflowType: WorkflowType) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const steps = workflowDefinitions[workflowType] || [];
  
  // Navigate to a specific step by ID
  const goToStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };
  
  // Navigate to the next step in the workflow
  const goToNextStep = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex < steps.length - 1) {
      navigate(steps[currentIndex + 1].path);
      return steps[currentIndex + 1];
    }
    return null;
  };
  
  // Navigate to the previous step in the workflow
  const goToPreviousStep = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) {
      navigate(steps[currentIndex - 1].path);
      return steps[currentIndex - 1];
    }
    return null;
  };
  
  // Get the current progress in the workflow (as percentage)
  const getWorkflowProgress = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / steps.length) * 100;
  };
  
  // Get a step's label in the current language
  const getStepLabel = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step ? step.label[language as keyof typeof step.label] : '';
  };
  
  // Get a step's description in the current language
  const getStepDescription = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step?.description ? step.description[language as keyof typeof step.description] : '';
  };
  
  // Get the next steps after the current one (for suggestions)
  const getNextSteps = (currentStepId: string, limit = 3) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex === -1) return [];
    
    // Get steps after the current one, or if we're at the end, suggest different workflows
    if (currentIndex < steps.length - 1) {
      return steps.slice(currentIndex + 1, currentIndex + 1 + limit);
    } else {
      // When at the end of a workflow, suggest starting other related workflows
      const relatedWorkflows = Object.entries(workflowDefinitions)
        .filter(([type]) => type !== workflowType)
        .flatMap(([_, steps]) => steps.slice(0, 1)); // First step of each other workflow
      
      return relatedWorkflows.slice(0, limit);
    }
  };
  
  // Check if a step exists in this workflow
  const hasStep = (stepId: string) => {
    return steps.some(s => s.id === stepId);
  };
  
  // Get current step object
  const getCurrentStep = (currentStepId: string) => {
    return steps.find(s => s.id === currentStepId) || null;
  };
  
  return {
    steps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    getWorkflowProgress,
    getStepLabel,
    getStepDescription,
    getNextSteps,
    hasStep,
    getCurrentStep,
    workflowType
  };
}
