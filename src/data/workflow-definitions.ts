
import React from 'react';
import { Building, Calculator, FileText, Map, Database, Euro, PiggyBank, CheckCircle } from 'lucide-react';

export type WorkflowType = 'steuer' | 'investment' | 'finanzierung' | 'immobilien';

// Enhanced workflow step with progress tracking and time estimates
export interface WorkflowStep {
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

export interface WorkflowDefinition {
  id: WorkflowType;
  title: { de: string; en: string };
  description: { de: string; en: string };
  steps: WorkflowStep[];
}

// Workflow definitions
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
        icon: React.createElement(Euro, { className: "h-5 w-5 text-primary" }),
        estimatedTime: 5
      },
      {
        id: 'afa',
        path: '/afa-rechner',
        label: { de: 'AfA-Berechnung', en: 'Depreciation' },
        description: { 
          de: 'Berechnung der steuerlichen Abschreibung', 
          en: 'Calculate tax depreciation for properties' 
        },
        icon: React.createElement(Calculator, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['grunderwerbsteuer'],
        estimatedTime: 10
      },
      {
        id: 'spekulationssteuer',
        path: '/spekulationssteuer',
        label: { de: 'Spekulationssteuer', en: 'Speculation Tax' },
        description: {
          de: 'Berechnen der potentiellen Spekulationssteuer beim Verkauf',
          en: 'Calculate potential speculation tax when selling property'
        },
        icon: React.createElement(Euro, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['afa'],
        estimatedTime: 8
      },
      {
        id: 'summary',
        path: '/steuer-zusammenfassung',
        label: { de: 'Steuerübersicht', en: 'Tax Summary' },
        description: {
          de: 'Überblick über alle steuerlichen Auswirkungen',
          en: 'Overview of all tax implications'
        },
        icon: React.createElement(FileText, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['spekulationssteuer'],
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
        path: '/renditerechner',
        label: { de: 'Renditerechner', en: 'Yield Calculator' },
        description: {
          de: 'Berechnen Sie die potenzielle Rendite Ihrer Investition',
          en: 'Calculate the potential yield of your investment'
        },
        icon: React.createElement(Calculator, { className: "h-5 w-5 text-primary" }),
        estimatedTime: 8
      },
      {
        id: 'marktanalyse',
        path: '/market-explorer',
        label: { de: 'Marktanalyse', en: 'Market Analysis' },
        description: { 
          de: 'Analyse des Immobilienmarkts', 
          en: 'Analyze the real estate market' 
        },
        icon: React.createElement(Map, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['rendite'],
        estimatedTime: 10
      },
      {
        id: 'portfolio',
        path: '/portfolio-optimization',
        label: { de: 'Portfolio-Optimierung', en: 'Portfolio Optimization' },
        description: {
          de: 'Optimieren Sie Ihr Immobilienportfolio',
          en: 'Optimize your real estate portfolio'
        },
        icon: React.createElement(Building, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['marktanalyse'],
        estimatedTime: 12
      },
      {
        id: 'investment-report',
        path: '/investment-report',
        label: { de: 'Investitionsbericht', en: 'Investment Report' },
        description: {
          de: 'Erstellen Sie einen umfassenden Investitionsbericht',
          en: 'Generate a comprehensive investment report'
        },
        icon: React.createElement(FileText, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['portfolio'],
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
        id: 'calculator',
        path: '/darlehensrechner',
        label: { de: 'Finanzierungsrechner', en: 'Financing Calculator' },
        description: { 
          de: 'Berechnung der Finanzierungsoptionen', 
          en: 'Calculate financing options' 
        },
        icon: React.createElement(Calculator, { className: "h-5 w-5 text-primary" }),
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
        icon: React.createElement(Database, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['calculator'],
        estimatedTime: 15
      },
      {
        id: 'tilgung',
        path: '/tilgungsplan',
        label: { de: 'Tilgungsplan', en: 'Repayment Plan' },
        description: {
          de: 'Erstellen Sie einen detaillierten Tilgungsplan',
          en: 'Create a detailed repayment plan'
        },
        icon: React.createElement(PiggyBank, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['offers'],
        estimatedTime: 12
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
        path: '/objekterfassung',
        label: { de: 'Objekterfassung', en: 'Property Registration' },
        description: {
          de: 'Erfassen und dokumentieren Sie Ihre Immobilien',
          en: 'Register and document your properties'
        },
        icon: React.createElement(Building, { className: "h-5 w-5 text-primary" }),
        estimatedTime: 15
      },
      {
        id: 'mietverwaltung',
        path: '/mietverwaltung',
        label: { de: 'Mietverwaltung', en: 'Rental Management' },
        description: {
          de: 'Verwalten Sie Ihre Mietobjekte und Mieter',
          en: 'Manage your rental properties and tenants'
        },
        icon: React.createElement(Database, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['objekterfassung'],
        estimatedTime: 12
      },
      {
        id: 'nebenkosten',
        path: '/nebenkosten',
        label: { de: 'Nebenkosten', en: 'Additional Costs' },
        description: {
          de: 'Berechnen und verwalten Sie Nebenkosten',
          en: 'Calculate and manage additional costs'
        },
        icon: React.createElement(Calculator, { className: "h-5 w-5 text-primary" }),
        requiredSteps: ['mietverwaltung'],
        estimatedTime: 10
      }
    ]
  }
};

export default workflowDefinitions;
