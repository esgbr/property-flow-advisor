
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, Calculator, ChartBar, BarChart, FileText, 
  Euro, CheckCircle, Map, Home, Receipt 
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export interface WorkflowStep {
  id: string;
  path: string;
  label: {
    de: string;
    en: string;
  };
  icon?: React.ReactNode; // Icon for visual representation
  description?: {
    de: string;
    en: string;
  };
  isComplete?: boolean;
}

export type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

const workflowDefinitions: Record<WorkflowType, WorkflowStep[]> = {
  steuer: [
    { 
      id: 'overview', 
      path: '/tax-overview',
      label: { de: 'Steuerübersicht', en: 'Tax Overview' },
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Übersicht über steuerrelevante Aspekte Ihrer Immobilien', 
        en: 'Overview of tax-relevant aspects of your properties' 
      }
    },
    { 
      id: 'grunderwerbsteuer', 
      path: '/calculators/grunderwerbsteuer',
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' },
      icon: <Euro className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Berechnen Sie die Grunderwerbsteuer für alle Bundesländer', 
        en: 'Calculate the real estate transfer tax for all German states' 
      }
    },
    { 
      id: 'afa', 
      path: '/calculators/afa',
      label: { de: 'AfA-Rechner', en: 'Depreciation' },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Berechnen Sie die optimale Abschreibung für Ihre Immobilie', 
        en: 'Calculate the optimal depreciation for your property' 
      }
    },
    { 
      id: 'planning', 
      path: '/tax-planning',
      label: { de: 'Steuerplanung', en: 'Tax Planning' },
      icon: <ChartBar className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Optimieren Sie Ihre Steuerlast durch vorausschauende Planung', 
        en: 'Optimize your tax burden through forward-looking planning' 
      }
    },
    { 
      id: 'summary', 
      path: '/tax-summary',
      label: { de: 'Steuerzusammenfassung', en: 'Tax Summary' },
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Zusammenfassung aller steuerrelevanten Berechnungen', 
        en: 'Summary of all tax-relevant calculations' 
      }
    }
  ],
  immobilien: [
    { 
      id: 'overview', 
      path: '/deutsche-immobilien',
      label: { de: 'Übersicht', en: 'Overview' },
      icon: <Home className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Allgemeine Übersicht zum deutschen Immobilienmarkt', 
        en: 'General overview of the German real estate market' 
      }
    },
    { 
      id: 'tools', 
      path: '/deutsche-immobilien-tools',
      label: { de: 'Tools', en: 'Tools' },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Verschiedene Tools für deutsche Immobilieninvestitionen', 
        en: 'Various tools for German real estate investments' 
      }
    },
    { 
      id: 'market', 
      path: '/market-explorer',
      label: { de: 'Marktanalyse', en: 'Market Analysis' },
      icon: <Map className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Analyse der aktuellen Markttrends und -chancen', 
        en: 'Analysis of current market trends and opportunities' 
      }
    },
    { 
      id: 'analysis', 
      path: '/portfolio-analytics',
      label: { de: 'Portfolioanalyse', en: 'Portfolio Analysis' },
      icon: <BarChart className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Analysieren Sie Ihr Immobilienportfolio', 
        en: 'Analyze your real estate portfolio' 
      }
    },
    { 
      id: 'documents', 
      path: '/document-management',
      label: { de: 'Dokumente', en: 'Documents' },
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Verwaltung Ihrer Immobiliendokumente', 
        en: 'Management of your real estate documents' 
      }
    }
  ],
  finanzierung: [
    { 
      id: 'overview', 
      path: '/financing-overview',
      label: { de: 'Übersicht', en: 'Overview' },
      icon: <Euro className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Übersicht über Finanzierungsmöglichkeiten', 
        en: 'Overview of financing options' 
      }
    },
    { 
      id: 'calculator', 
      path: '/financing-calculator',
      label: { de: 'Finanzierungsrechner', en: 'Financing Calculator' },
      icon: <Calculator className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Berechnen Sie Ihre Finanzierungsoptionen', 
        en: 'Calculate your financing options' 
      }
    },
    { 
      id: 'comparison', 
      path: '/financing-comparison',
      label: { de: 'Angebotsvergleich', en: 'Offer Comparison' },
      icon: <BarChart className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Vergleichen Sie verschiedene Finanzierungsangebote', 
        en: 'Compare different financing offers' 
      }
    },
    { 
      id: 'planning', 
      path: '/financing-planning',
      label: { de: 'Finanzplanung', en: 'Financial Planning' },
      icon: <ChartBar className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Langfristige Finanzierungsplanung für Ihre Investitionen', 
        en: 'Long-term financing planning for your investments' 
      }
    },
    { 
      id: 'documents', 
      path: '/financing-documents',
      label: { de: 'Dokumente', en: 'Documents' },
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Ihre Finanzierungsdokumente verwalten', 
        en: 'Manage your financing documents' 
      }
    }
  ],
  analyse: [
    { 
      id: 'market', 
      path: '/market-explorer',
      label: { de: 'Marktanalyse', en: 'Market Analysis' },
      icon: <Map className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Aktuelle Markttrends und Daten', 
        en: 'Current market trends and data' 
      }
    },
    { 
      id: 'comparison', 
      path: '/property-comparison',
      label: { de: 'Objektvergleich', en: 'Property Comparison' },
      icon: <BarChart className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Immobilienobjekte direkt vergleichen', 
        en: 'Directly compare property objects' 
      }
    },
    { 
      id: 'portfolio', 
      path: '/portfolio-analytics',
      label: { de: 'Portfolio', en: 'Portfolio' },
      icon: <Building className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Analysieren Sie Ihr bestehendes Portfolio', 
        en: 'Analyze your existing portfolio' 
      }
    },
    { 
      id: 'reports', 
      path: '/analytics-reports',
      label: { de: 'Berichte', en: 'Reports' },
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Detaillierte Berichte und Auswertungen', 
        en: 'Detailed reports and evaluations' 
      }
    },
    { 
      id: 'export', 
      path: '/analytics-export',
      label: { de: 'Export', en: 'Export' },
      icon: <FileText className="h-5 w-5 text-primary" />,
      description: { 
        de: 'Exportieren Sie Ihre Analysen und Berichte', 
        en: 'Export your analyses and reports' 
      }
    }
  ]
};

// Store completed steps in local storage
const getCompletedSteps = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem('workflowCompletedSteps');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Error loading completed workflow steps:', e);
    return {};
  }
};

const saveCompletedSteps = (completedSteps: Record<string, string[]>) => {
  try {
    localStorage.setItem('workflowCompletedSteps', JSON.stringify(completedSteps));
  } catch (e) {
    console.error('Error saving completed workflow steps:', e);
  }
};

/**
 * Enhanced hook for managing workflow navigation and transitions
 * Provides intelligent guidance through related features with progress tracking
 */
export function useWorkflow(workflowType: WorkflowType) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, string[]>>(getCompletedSteps());
  
  // Get steps with completion status
  const steps = React.useMemo(() => {
    const workflowSteps = workflowDefinitions[workflowType] || [];
    const completed = completedSteps[workflowType] || [];
    
    return workflowSteps.map(step => ({
      ...step,
      isComplete: completed.includes(step.id)
    }));
  }, [workflowType, completedSteps]);
  
  // Mark a step as completed
  const markStepComplete = (stepId: string) => {
    const newCompletedSteps = { 
      ...completedSteps,
      [workflowType]: [...(completedSteps[workflowType] || []), stepId]
    };
    
    setCompletedSteps(newCompletedSteps);
    saveCompletedSteps(newCompletedSteps);
    
    // Show success message
    toast.success(
      language === 'de' 
        ? `Schritt "${getStepLabel(stepId)}" abgeschlossen` 
        : `Step "${getStepLabel(stepId)}" completed`
    );
  };
  
  // Navigate to a specific step by ID with animation feedback
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
      const nextStep = steps[currentIndex + 1];
      navigate(nextStep.path);
      
      toast.info(
        language === 'de' 
          ? `Nächster Schritt: ${nextStep.label.de}` 
          : `Next step: ${nextStep.label.en}`
      );
      
      return nextStep;
    }
    
    // If we're at the end of the workflow, show completion message
    if (currentIndex === steps.length - 1) {
      toast.success(
        language === 'de'
          ? `Workflow "${t(workflowType)}" abgeschlossen!`
          : `Workflow "${t(workflowType)}" completed!`
      );
    }
    
    return null;
  };
  
  // Navigate to the previous step in the workflow
  const goToPreviousStep = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      navigate(prevStep.path);
      return prevStep;
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
        .flatMap(([_, flows]) => flows.slice(0, 1)); // First step of each other workflow
      
      return relatedWorkflows.slice(0, limit);
    }
  };
  
  // Start a new workflow from the beginning
  const startWorkflow = () => {
    if (steps.length > 0) {
      navigate(steps[0].path);
      toast.info(
        language === 'de'
          ? `Workflow "${t(workflowType)}" gestartet`
          : `Started workflow "${t(workflowType)}"`
      );
    }
  };
  
  // Reset workflow progress
  const resetWorkflow = () => {
    const newCompletedSteps = { ...completedSteps };
    delete newCompletedSteps[workflowType];
    
    setCompletedSteps(newCompletedSteps);
    saveCompletedSteps(newCompletedSteps);
    
    toast.info(
      language === 'de'
        ? `Workflow "${t(workflowType)}" zurückgesetzt`
        : `Reset workflow "${t(workflowType)}"`
    );
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
    workflowType,
    markStepComplete,
    startWorkflow,
    resetWorkflow
  };
}
