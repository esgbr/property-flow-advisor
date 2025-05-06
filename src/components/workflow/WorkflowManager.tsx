
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Building, Calculator, CheckCircle, Clock, Euro } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface WorkflowManagerProps {
  className?: string;
  defaultWorkflow?: WorkflowType;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  className,
  defaultWorkflow = 'steuer'
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>(defaultWorkflow);
  
  // Get workflow hooks for all workflow types
  const steuerWorkflow = useWorkflow('steuer');
  const immobilienWorkflow = useWorkflow('immobilien');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  const analyseWorkflow = useWorkflow('analyse');
  
  // Get the active workflow based on the current selection
  const getActiveWorkflow = () => {
    switch(activeWorkflow) {
      case 'steuer':
        return steuerWorkflow;
      case 'immobilien':
        return immobilienWorkflow;
      case 'finanzierung':
        return finanzierungWorkflow;
      case 'analyse':
        return analyseWorkflow;
      default:
        return steuerWorkflow;
    }
  };
  
  // Get all steps for the active workflow with completion status
  const steps = getActiveWorkflow().getStepsWithStatus?.() || [];
  
  // Calculate how many steps are complete
  const completedSteps = steps.filter(step => step.isComplete).length;
  
  // Calculate workflow progress
  const workflowProgress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;
  
  // Function to get the next incomplete step
  const getNextStep = () => {
    return steps.find(step => !step.isComplete);
  };
  
  // Function to navigate to the next step
  const goToNextStep = () => {
    const nextStep = getNextStep();
    if (nextStep) {
      getActiveWorkflow().goToStep(nextStep.id);
    }
  };
  
  // Function to navigate to a specific step
  const goToStep = (stepId: string) => {
    getActiveWorkflow().goToStep(stepId);
  };
  
  // Function to reset the current workflow
  const resetWorkflow = () => {
    toast({
      title: language === 'de' ? 'Workflow zurückgesetzt' : 'Workflow Reset',
      description: language === 'de' 
        ? 'Der Workflow wurde zurückgesetzt. Sie können nun von vorne beginnen.' 
        : 'The workflow has been reset. You can now start fresh.'
    });
    
    getActiveWorkflow().resetWorkflow();
  };
  
  // Function to get workflow title based on the current language
  const getWorkflowTitle = (type: WorkflowType) => {
    switch(type) {
      case 'steuer':
        return language === 'de' ? 'Steueroptimierung' : 'Tax Optimization';
      case 'immobilien':
        return language === 'de' ? 'Immobilienverwaltung' : 'Property Management';
      case 'finanzierung':
        return language === 'de' ? 'Finanzierungsanalyse' : 'Financing Analysis';
      case 'analyse':
        return language === 'de' ? 'Investitionsanalyse' : 'Investment Analysis';
      default:
        return '';
    }
  };
  
  // Function to get workflow icon
  const getWorkflowIcon = (type: WorkflowType) => {
    switch(type) {
      case 'steuer':
        return <Euro className="h-5 w-5" />;
      case 'immobilien':
        return <Building className="h-5 w-5" />;
      case 'finanzierung':
        return <Calculator className="h-5 w-5" />;
      case 'analyse':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  // Calculate estimated time remaining
  const calculateRemainingTime = () => {
    const remainingSteps = steps.filter(step => !step.isComplete);
    const totalMinutes = remainingSteps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0);
    
    if (totalMinutes === 0) return language === 'de' ? 'Fertig!' : 'Completed!';
    
    if (totalMinutes < 60) {
      return language === 'de' 
        ? `Ca. ${totalMinutes} Minuten verbleibend` 
        : `Approx. ${totalMinutes} minutes remaining`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return language === 'de'
      ? `Ca. ${hours} Std. ${minutes > 0 ? `${minutes} Min.` : ''} verbleibend`
      : `Approx. ${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min.` : ''} remaining`;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getWorkflowIcon(activeWorkflow)}
            <CardTitle>{getWorkflowTitle(activeWorkflow)}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{calculateRemainingTime()}</span>
          </div>
        </div>
        <CardDescription>
          {language === 'de'
            ? 'Verfolgen Sie Ihren Fortschritt und führen Sie Schritt für Schritt Ihren Workflow durch'
            : 'Track your progress and complete your workflow step by step'}
        </CardDescription>
        
        <div className="mt-2">
          <div className="flex justify-between mb-1 text-sm">
            <span>
              {language === 'de' ? 'Fortschritt' : 'Progress'}: {completedSteps}/{steps.length} {language === 'de' ? 'Schritte' : 'steps'}
            </span>
            <span>{workflowProgress}%</span>
          </div>
          <Progress value={workflowProgress} max={100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeWorkflow} onValueChange={(value) => setActiveWorkflow(value as WorkflowType)}>
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
          
          <TabsContent value={activeWorkflow} className="mt-0">
            <div className="space-y-4">
              {steps.length > 0 ? steps.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    step.isComplete ? 'bg-primary text-primary-foreground' : 'bg-background'
                  }`}>
                    {step.isComplete ? <CheckCircle className="h-4 w-4" /> : (index + 1)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{language === 'de' ? step.label.de : step.label.en}</h3>
                      {step.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          {step.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'de' ? step.description.de : step.description.en}
                      </p>
                    )}
                    <Button 
                      variant={step.isComplete ? "outline" : "default"}
                      size="sm"
                      className="mt-2"
                      onClick={() => goToStep(step.id)}
                    >
                      {step.isComplete 
                        ? (language === 'de' ? 'Überprüfen' : 'Review') 
                        : (language === 'de' ? 'Starten' : 'Start')}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    {language === 'de' 
                      ? 'Keine Workflow-Schritte gefunden.' 
                      : 'No workflow steps found.'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={resetWorkflow}>
          {language === 'de' ? 'Workflow zurücksetzen' : 'Reset Workflow'}
        </Button>
        {getNextStep() ? (
          <Button size="sm" onClick={goToNextStep}>
            {language === 'de' ? 'Nächster Schritt' : 'Next Step'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" disabled={steps.length === 0}>
            {language === 'de' ? 'Abgeschlossen' : 'Completed'}
            <CheckCircle className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkflowManager;
