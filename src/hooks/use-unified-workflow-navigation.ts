
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { WorkflowType } from '@/hooks/use-workflow';

export type WorkflowRoute = {
  id: string;
  title: Record<string, string>;
  path: string;
  requiredFeatures?: string[];
  workflowType?: WorkflowType;
  icon?: React.ReactNode;
};

export type FeatureConnection = {
  source: string;
  target: string;
  description: Record<string, string>;
};

export function useUnifiedWorkflowNavigation() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [history, setHistory] = useState<string[]>([]);
  
  // Common workflow routes
  const workflowRoutes: WorkflowRoute[] = [
    {
      id: 'portfolio',
      title: { en: 'Portfolio Dashboard', de: 'Portfolio-Dashboard' },
      path: '/investor-dashboard',
      workflowType: 'analyse'
    },
    {
      id: 'market',
      title: { en: 'Market Explorer', de: 'Marktexplorer' },
      path: '/market-explorer',
      workflowType: 'analyse'
    },
    {
      id: 'properties',
      title: { en: 'Property Management', de: 'Immobilienverwaltung' },
      path: '/properties',
      workflowType: 'immobilien'
    },
    {
      id: 'calculators',
      title: { en: 'Financial Tools', de: 'Finanzierungstools' },
      path: '/calculators',
      workflowType: 'finanzierung'
    },
    {
      id: 'workflows',
      title: { en: 'Workflows', de: 'Workflows' },
      path: '/workflows',
      workflowType: 'analyse'
    },
  ];
  
  // Feature connections for better navigation
  const featureConnections: FeatureConnection[] = [
    {
      source: 'portfolio',
      target: 'market',
      description: { 
        en: 'View market data for your portfolio', 
        de: 'Marktdaten für Ihr Portfolio anzeigen' 
      }
    },
    {
      source: 'portfolio',
      target: 'calculators',
      description: { 
        en: 'Calculate financial metrics for your portfolio', 
        de: 'Finanzielle Kennzahlen für Ihr Portfolio berechnen' 
      }
    },
    {
      source: 'market',
      target: 'properties',
      description: { 
        en: 'Explore properties in this market', 
        de: 'Immobilien in diesem Markt erkunden' 
      }
    },
    {
      source: 'calculators',
      target: 'portfolio',
      description: { 
        en: 'Apply calculations to your portfolio', 
        de: 'Berechnungen auf Ihr Portfolio anwenden' 
      }
    }
  ];
  
  // Navigate to a workflow route with history tracking
  const navigateToWorkflow = useCallback((routeId: string) => {
    const route = workflowRoutes.find(r => r.id === routeId);
    if (route) {
      // Track history
      setHistory(prev => [...prev, routeId].slice(-10));
      
      // Navigate to the route
      navigate(route.path);
      
      // Show toast notification
      toast({
        title: route.title[language as keyof typeof route.title] || route.title.en,
        description: language === 'de' 
          ? 'Navigation zum Workflow' 
          : 'Navigating to workflow',
      });
      
      return true;
    }
    return false;
  }, [workflowRoutes, navigate, toast, language]);
  
  // Get suggested workflows based on current route
  const getSuggestedWorkflows = useCallback((currentId: string) => {
    return featureConnections
      .filter(conn => conn.source === currentId)
      .map(conn => ({
        ...conn,
        route: workflowRoutes.find(r => r.id === conn.target)
      }))
      .filter(item => item.route) as (FeatureConnection & { route: WorkflowRoute })[];
  }, [featureConnections, workflowRoutes]);
  
  // Get previous workflows based on history
  const getPreviousWorkflows = useCallback(() => {
    const uniqueIds = [...new Set(history)].slice(-3);
    return uniqueIds
      .map(id => workflowRoutes.find(r => r.id === id))
      .filter(Boolean) as WorkflowRoute[];
  }, [history, workflowRoutes]);
  
  // Get a route by ID
  const getRouteById = useCallback((routeId: string) => {
    return workflowRoutes.find(r => r.id === routeId);
  }, [workflowRoutes]);
  
  return {
    workflowRoutes,
    featureConnections,
    navigateToWorkflow,
    getSuggestedWorkflows,
    getPreviousWorkflows,
    getRouteById,
    history
  };
}
