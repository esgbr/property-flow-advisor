
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Button } from '@/components/ui/button';
import { Building, Calculator, FileText, ArrowRight, Map, Euro, PiggyBank, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface WorkflowDisplay {
  type: WorkflowType;
  icon: React.ReactNode;
  completedSteps?: number;
  totalSteps?: number;
}

const UnifiedWorkflowDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<WorkflowType>('steuer');

  // Initialize all workflow hooks
  const steuerWorkflow = useWorkflow('steuer');
  const immobilienWorkflow = useWorkflow('immobilien');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  const analyseWorkflow = useWorkflow('analyse');

  // Get steps with completion status for each workflow
  const steuerSteps = steuerWorkflow.getStepsWithStatus?.() || [];
  const immobilienSteps = immobilienWorkflow.getStepsWithStatus?.() || [];
  const finanzierungSteps = finanzierungWorkflow.getStepsWithStatus?.() || [];
  const analyseSteps = analyseWorkflow.getStepsWithStatus?.() || [];

  // Calculate completion percentages
  const calculateCompletion = (steps: any[]) => {
    if (!steps || steps.length === 0) return 0;
    const completed = steps.filter(step => step.isComplete).length;
    return Math.round((completed / steps.length) * 100);
  };

  const workflows: Record<WorkflowType, WorkflowDisplay> = {
    'steuer': {
      type: 'steuer',
      icon: <Euro className="h-5 w-5" />,
      completedSteps: steuerSteps.filter(step => step.isComplete).length,
      totalSteps: steuerSteps.length
    },
    'immobilien': {
      type: 'immobilien',
      icon: <Building className="h-5 w-5" />,
      completedSteps: immobilienSteps.filter(step => step.isComplete).length,
      totalSteps: immobilienSteps.length
    },
    'finanzierung': {
      type: 'finanzierung',
      icon: <Calculator className="h-5 w-5" />,
      completedSteps: finanzierungSteps.filter(step => step.isComplete).length,
      totalSteps: finanzierungSteps.length
    },
    'analyse': {
      type: 'analyse',
      icon: <CheckCircle className="h-5 w-5" />,
      completedSteps: analyseSteps.filter(step => step.isComplete).length,
      totalSteps: analyseSteps.length
    }
  };

  // Get the current workflow's steps
  const getCurrentWorkflowSteps = () => {
    switch (activeTab) {
      case 'steuer':
        return steuerSteps;
      case 'immobilien':
        return immobilienSteps;
      case 'finanzierung':
        return finanzierungSteps;
      case 'analyse':
        return analyseSteps;
      default:
        return [];
    }
  };

  // Navigate to a workflow step
  const goToWorkflowStep = (workflowType: WorkflowType, stepId: string) => {
    switch (workflowType) {
      case 'steuer':
        steuerWorkflow.goToStep(stepId);
        break;
      case 'immobilien':
        immobilienWorkflow.goToStep(stepId);
        break;
      case 'finanzierung':
        finanzierungWorkflow.goToStep(stepId);
        break;
      case 'analyse':
        analyseWorkflow.goToStep(stepId);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {language === 'de' ? 'Workflow Dashboard' : 'Workflow Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Verwalten und überwachen Sie alle Ihre Workflows an einem Ort'
            : 'Manage and monitor all your workflows in one place'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(workflows).map((workflow) => (
          <Card 
            key={workflow.type}
            className={`cursor-pointer hover:shadow-md transition-all ${activeTab === workflow.type ? 'border-primary' : ''}`}
            onClick={() => setActiveTab(workflow.type)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <span className="bg-primary/10 p-1.5 rounded-lg mr-2">{workflow.icon}</span>
                  {language === 'de' ? (
                    workflow.type === 'steuer' ? 'Steueroptimierung' :
                    workflow.type === 'immobilien' ? 'Immobilienverwaltung' :
                    workflow.type === 'finanzierung' ? 'Finanzierungsanalyse' : 'Investitionsanalyse'
                  ) : (
                    workflow.type === 'steuer' ? 'Tax Optimization' :
                    workflow.type === 'immobilien' ? 'Property Management' :
                    workflow.type === 'finanzierung' ? 'Financing Analysis' : 'Investment Analysis'
                  )}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between mb-1 text-sm">
                <span>{language === 'de' ? 'Fortschritt' : 'Progress'}</span>
                <span>{workflow.completedSteps} / {workflow.totalSteps}</span>
              </div>
              <Progress 
                value={calculateCompletion(
                  workflow.type === 'steuer' ? steuerSteps :
                  workflow.type === 'immobilien' ? immobilienSteps :
                  workflow.type === 'finanzierung' ? finanzierungSteps : analyseSteps
                )} 
                max={100} 
                className="h-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WorkflowType)}>
        <TabsList className="mb-4">
          <TabsTrigger value="steuer">
            <Euro className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Steueroptimierung' : 'Tax Optimization'}
          </TabsTrigger>
          <TabsTrigger value="immobilien">
            <Building className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Immobilienverwaltung' : 'Property Management'}
          </TabsTrigger>
          <TabsTrigger value="finanzierung">
            <Calculator className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Finanzierungsanalyse' : 'Financing Analysis'}
          </TabsTrigger>
          <TabsTrigger value="analyse">
            <CheckCircle className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Investitionsanalyse' : 'Investment Analysis'}
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'de' ? `${activeTab === 'steuer' ? 'Steueroptimierung' : 
                activeTab === 'immobilien' ? 'Immobilienverwaltung' : 
                activeTab === 'finanzierung' ? 'Finanzierungsanalyse' : 'Investitionsanalyse'} Workflow`
                : 
                `${activeTab === 'steuer' ? 'Tax Optimization' : 
                activeTab === 'immobilien' ? 'Property Management' : 
                activeTab === 'finanzierung' ? 'Financing Analysis' : 'Investment Analysis'} Workflow`}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Verfolgen Sie Ihren Fortschritt und führen Sie die nächsten Schritte durch' 
                : 'Track your progress and perform next steps'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {getCurrentWorkflowSteps().map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
                    step.isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {step.isComplete ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    {index < getCurrentWorkflowSteps().length - 1 && (
                      <div className="absolute top-10 left-1/2 h-full w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {language === 'de' ? step.label.de : step.label.en}
                      </p>
                      {step.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          {step.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description ? (language === 'de' ? step.description.de : step.description.en) : ''}
                    </p>
                    <div className="pt-2">
                      <Button 
                        variant={step.isComplete ? "outline" : "default"} 
                        size="sm" 
                        className="mt-1"
                        onClick={() => goToWorkflowStep(activeTab, step.id)}
                      >
                        {step.isComplete ? 
                          (language === 'de' ? 'Überprüfen' : 'Review') : 
                          (language === 'de' ? 'Starten' : 'Start')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {getCurrentWorkflowSteps().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {language === 'de' ? 'Keine Workflow-Schritte gefunden.' : 'No workflow steps found.'}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/dashboard')}
                  >
                    {language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default UnifiedWorkflowDashboard;
