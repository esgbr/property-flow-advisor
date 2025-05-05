
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface WorkflowStep {
  id: string;
  path: string;
  label: {
    de: string;
    en: string;
  };
}

type WorkflowType = 'steuer' | 'immobilien' | 'finanzierung' | 'analyse';

const workflowDefinitions: Record<WorkflowType, WorkflowStep[]> = {
  steuer: [
    { 
      id: 'overview', 
      path: '/tax-overview',
      label: { de: 'Steuerübersicht', en: 'Tax Overview' }
    },
    { 
      id: 'grunderwerbsteuer', 
      path: '/calculators/grunderwerbsteuer',
      label: { de: 'Grunderwerbsteuer', en: 'Transfer Tax' }
    },
    { 
      id: 'afa', 
      path: '/calculators/afa',
      label: { de: 'AfA-Rechner', en: 'Depreciation' }
    },
    { 
      id: 'planning', 
      path: '/tax-planning',
      label: { de: 'Steuerplanung', en: 'Tax Planning' }
    }
  ],
  immobilien: [
    { 
      id: 'overview', 
      path: '/deutsche-immobilien',
      label: { de: 'Übersicht', en: 'Overview' }
    },
    { 
      id: 'tools', 
      path: '/deutsche-immobilien-tools',
      label: { de: 'Tools', en: 'Tools' }
    },
    { 
      id: 'analysis', 
      path: '/portfolio-analytics',
      label: { de: 'Analyse', en: 'Analysis' }
    }
  ],
  finanzierung: [
    { 
      id: 'overview', 
      path: '/financing-overview',
      label: { de: 'Übersicht', en: 'Overview' }
    },
    { 
      id: 'calculator', 
      path: '/financing-calculator',
      label: { de: 'Rechner', en: 'Calculator' }
    },
    { 
      id: 'planning', 
      path: '/financing-planning',
      label: { de: 'Planung', en: 'Planning' }
    }
  ],
  analyse: [
    { 
      id: 'market', 
      path: '/market-explorer',
      label: { de: 'Marktanalyse', en: 'Market Analysis' }
    },
    { 
      id: 'portfolio', 
      path: '/portfolio-analytics',
      label: { de: 'Portfolio', en: 'Portfolio' }
    },
    { 
      id: 'reports', 
      path: '/analytics-reports',
      label: { de: 'Berichte', en: 'Reports' }
    }
  ]
};

export function useWorkflow(workflowType: WorkflowType) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const steps = workflowDefinitions[workflowType] || [];
  
  const goToStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };
  
  const goToNextStep = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex < steps.length - 1) {
      navigate(steps[currentIndex + 1].path);
    }
  };
  
  const goToPreviousStep = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex > 0) {
      navigate(steps[currentIndex - 1].path);
    }
  };
  
  const getWorkflowProgress = (currentStepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / steps.length) * 100;
  };
  
  const getStepLabel = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step ? step.label[language as keyof typeof step.label] : '';
  };
  
  return {
    steps,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    getWorkflowProgress,
    getStepLabel
  };
}
