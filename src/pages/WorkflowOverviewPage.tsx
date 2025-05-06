
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import WorkflowSteps from '@/components/workflow/WorkflowSteps';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * WorkflowOverviewPage - A dedicated page to view and manage workflow progress
 * This enhances user experience by providing clear visualization and navigation of workflows
 */
const WorkflowOverviewPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<string>('');
  
  // Validate workflow type
  const workflowType = (type as WorkflowType) || 'steuer';
  const isValidWorkflow = ['steuer', 'immobilien', 'finanzierung', 'analyse'].includes(workflowType);
  
  const workflow = useWorkflow(workflowType);
  
  useEffect(() => {
    // Get the current step or default to the first step
    const currentWorkflowStep = workflow.getCurrentStep();
    if (currentWorkflowStep) {
      setCurrentStep(currentWorkflowStep.id);
    } else if (workflow.steps.length > 0) {
      setCurrentStep(workflow.steps[0].id);
    }
  }, [workflowType, workflow]);
  
  const handleStartWorkflow = () => {
    if (workflow.steps.length > 0) {
      workflow.goToStep(workflow.steps[0].id);
      toast.success(
        language === 'de' 
          ? 'Workflow gestartet' 
          : 'Workflow started'
      );
    }
  };
  
  const handleResetWorkflow = () => {
    workflow.resetWorkflow();
    if (workflow.steps.length > 0) {
      setCurrentStep(workflow.steps[0].id);
    }
    toast.success(
      language === 'de' 
        ? 'Workflow zurückgesetzt' 
        : 'Workflow reset'
    );
  };
  
  const getWorkflowTitle = (): string => {
    switch (workflowType) {
      case 'steuer':
        return language === 'de' ? 'Steueroptimierung' : 'Tax Optimization';
      case 'immobilien':
        return language === 'de' ? 'Immobilienbewertung' : 'Property Valuation';
      case 'finanzierung':
        return language === 'de' ? 'Immobilienfinanzierung' : 'Property Financing';
      case 'analyse':
        return language === 'de' ? 'Markt- und Portfolioanalyse' : 'Market & Portfolio Analysis';
      default:
        return language === 'de' ? 'Workflow' : 'Workflow';
    }
  };
  
  const getWorkflowDescription = (): string => {
    switch (workflowType) {
      case 'steuer':
        return language === 'de' 
          ? 'Optimieren Sie Ihre Steuerbelastung bei Immobilieninvestitionen' 
          : 'Optimize your tax burden for real estate investments';
      case 'immobilien':
        return language === 'de' 
          ? 'Bewerten Sie Immobilien und finden Sie die besten Investitionsmöglichkeiten' 
          : 'Evaluate properties and find the best investment opportunities';
      case 'finanzierung':
        return language === 'de' 
          ? 'Finden Sie die optimale Finanzierung für Ihre Immobilieninvestition' 
          : 'Find the optimal financing for your real estate investment';
      case 'analyse':
        return language === 'de' 
          ? 'Analysieren Sie den Markt und optimieren Sie Ihr Portfolio' 
          : 'Analyze the market and optimize your portfolio';
      default:
        return language === 'de' 
          ? 'Schritt-für-Schritt-Anleitung zur Optimierung Ihrer Immobilieninvestitionen' 
          : 'Step-by-step guide to optimize your real estate investments';
    }
  };
  
  // If workflow type is invalid, show error
  if (!isValidWorkflow) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'de' ? 'Ungültiger Workflow' : 'Invalid Workflow'}
          </AlertTitle>
          <AlertDescription>
            {language === 'de' 
              ? 'Der angegebene Workflow-Typ existiert nicht.' 
              : 'The specified workflow type does not exist.'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/dashboard')}>
            {language === 'de' ? 'Zurück zum Dashboard' : 'Back to Dashboard'}
          </Button>
        </div>
      </div>
    );
  }
  
  const completedSteps = workflow.getCompleteSteps();
  const progress = workflow.getWorkflowProgress(currentStep);
  const isComplete = progress === 100;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{getWorkflowTitle()}</h1>
          <p className="text-muted-foreground">{getWorkflowDescription()}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
          {completedSteps.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleResetWorkflow}
              className="flex items-center text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {language === 'de' ? 'Zurücksetzen' : 'Reset'}
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress overview */}
      <div className="mb-6">
        <Card className={cn(
          "border",
          isComplete ? "border-green-500 bg-green-50 dark:bg-green-950/10" : ""
        )}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="flex items-center">
                {isComplete && <CheckCircle className="h-5 w-5 mr-2 text-green-500" />}
                {language === 'de' ? 'Fortschritt' : 'Progress'}
              </CardTitle>
              <span className="text-2xl font-bold">
                {progress}%
              </span>
            </div>
            <CardDescription>
              {completedSteps.length} {language === 'de' ? 'von' : 'of'} {workflow.steps.length} {language === 'de' ? 'Schritten abgeschlossen' : 'steps completed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isComplete ? (
              <Alert className="bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800 dark:text-green-300">
                  {language === 'de' ? 'Workflow abgeschlossen!' : 'Workflow Completed!'}
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  {language === 'de' 
                    ? 'Sie haben alle Schritte dieses Workflows erfolgreich abgeschlossen.' 
                    : 'You have successfully completed all steps in this workflow.'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {completedSteps.length === 0 && (
                  <Button 
                    onClick={handleStartWorkflow}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Workflow starten' : 'Start Workflow'}
                  </Button>
                )}
                
                {completedSteps.length > 0 && !isComplete && (
                  <Button 
                    onClick={() => workflow.goToStep(currentStep)}
                    className="w-full"
                  >
                    {language === 'de' ? 'Fortfahren' : 'Continue'} 
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Workflow steps */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WorkflowSteps 
            workflowType={workflowType} 
            currentStep={currentStep}
            onStepClick={(stepId) => {
              workflow.goToStep(stepId);
            }}
          />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Über diesen Workflow' : 'About this Workflow'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Optimieren Sie Ihren Immobilien-Investment-Prozess'
                  : 'Optimize your real estate investment process'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                {language === 'de'
                  ? 'Dieser geführte Workflow hilft Ihnen, den komplexen Prozess zu vereinfachen und optimale Ergebnisse zu erzielen.'
                  : 'This guided workflow helps you simplify the complex process and achieve optimal results.'}
              </p>
              
              <div className="text-sm">
                <p className="font-medium mb-1">
                  {language === 'de' ? 'Vorteile:' : 'Benefits:'}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {language === 'de' 
                      ? 'Schritt-für-Schritt-Anleitung' 
                      : 'Step-by-step guidance'}
                  </li>
                  <li>
                    {language === 'de' 
                      ? 'Automatische Datensynchronisation' 
                      : 'Automatic data synchronization'}
                  </li>
                  <li>
                    {language === 'de' 
                      ? 'Personalisierte Empfehlungen' 
                      : 'Personalized recommendations'}
                  </li>
                  <li>
                    {language === 'de' 
                      ? 'Fortschrittsüberwachung' 
                      : 'Progress tracking'}
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                {language === 'de' ? 'Zum Dashboard' : 'Go to Dashboard'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowOverviewPage;
