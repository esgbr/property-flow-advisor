
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnifiedWorkflow } from '@/hooks/use-unified-workflow';
import { WorkflowType } from '@/data/workflow-definitions'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, ArrowRight, CheckCircle, FileText, 
  BarChart, GanttChart, RefreshCw, GitBranch, ChevronRight 
} from 'lucide-react';

const UnifiedWorkflowPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const workflowType = (searchParams.get('type') || 'immobilien') as WorkflowType;
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('steps');
  
  // Use the updated hook interface
  const {
    steps,
    currentStep,
    completedSteps,
    goToStep,
    completeStep,
    resetWorkflow,
    progress
  } = useUnifiedWorkflow(workflowType);
  
  // Helper to get label based on language
  const getLabel = (item: { label: Record<string, string> }) => {
    return item.label[language as keyof typeof item.label] || '';
  };

  // Helper to get description based on language
  const getDescription = (item: { description?: Record<string, string> }) => {
    return item.description ? item.description[language as keyof typeof item.description] || '' : '';
  };

  // Get workflow metadata from the first step
  const workflowTitle = steps.length > 0 && steps[0].title ? 
    steps[0].title[language as keyof typeof steps[0].title] : 
    workflowType;
  
  const workflowDescription = steps.length > 0 && steps[0].description ? 
    steps[0].description[language as keyof typeof steps[0].description] : 
    '';
  
  // Handle step selection
  const handleSelectStep = (stepId: string) => {
    goToStep(stepId);
  };
  
  // Handle step completion
  const handleCompleteStep = (stepId: string) => {
    completeStep(stepId);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <GanttChart className="mr-3 h-8 w-8" />
            {workflowTitle}
          </h1>
          <p className="text-muted-foreground">
            {workflowDescription}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'de' ? 'Zurück' : 'Back'}
        </Button>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <GanttChart className="h-5 w-5 mr-2" />
            {language === 'de' ? 'Workflow-Fortschritt' : 'Workflow Progress'}
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Verfolgen Sie Ihren Fortschritt und navigieren Sie durch die Workflow-Schritte' 
              : 'Track your progress and navigate through workflow steps'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {language === 'de' ? 'Abgeschlossen' : 'Completed'}: {Object.values(completedSteps).filter(Boolean).length}/{steps.length}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {currentStep && (
              <div className="border rounded-lg p-4 bg-muted/10">
                <h3 className="font-medium mb-1">
                  {language === 'de' ? 'Aktueller Schritt' : 'Current Step'}:
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-base">
                    {getLabel(currentStep)}
                    {currentStep.estimatedTime && (
                      <span className="text-xs ml-2 text-muted-foreground">
                        (~{currentStep.estimatedTime} {language === 'de' ? 'Min.' : 'mins'})
                      </span>
                    )}
                  </p>
                  <Badge variant={completedSteps[currentStep.id] ? "default" : "outline"}>
                    {completedSteps[currentStep.id]
                      ? (language === 'de' ? 'Abgeschlossen' : 'Completed')
                      : (language === 'de' ? 'Offen' : 'Pending')}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="steps">
            <GanttChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Schritte' : 'Steps'}
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <BarChart className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Visualisierung' : 'Visualization'}
          </TabsTrigger>
          <TabsTrigger value="tools">
            <GitBranch className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Verknüpfte Tools' : 'Connected Tools'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Workflow-Schritte' : 'Workflow Steps'}</CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Navigieren Sie durch die Schritte dieses Workflows'
                  : 'Navigate through the steps of this workflow'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`p-4 border rounded-lg ${
                      currentStep && currentStep.id === step.id 
                        ? 'border-primary bg-primary/10' 
                        : completedSteps[step.id]
                          ? 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10'
                          : 'border-muted bg-muted/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mr-3">
                          <span className="font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {getLabel(step)}
                          </h3>
                          {step.description && (
                            <p className="text-sm text-muted-foreground">
                              {getDescription(step)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {completedSteps[step.id] ? (
                          <Badge variant="default" className="mr-2">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {language === 'de' ? 'Erledigt' : 'Done'}
                          </Badge>
                        ) : currentStep && currentStep.id === step.id ? (
                          <Badge variant="outline" className="mr-2 bg-primary/10">
                            {language === 'de' ? 'Aktiv' : 'Active'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mr-2">
                            {language === 'de' ? 'Ausstehend' : 'Pending'}
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSelectStep(step.id)}
                        >
                          {language === 'de' ? 'Öffnen' : 'Open'}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetWorkflow}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {language === 'de' ? 'Zurücksetzen' : 'Reset'}
              </Button>
              
              {currentStep && !completedSteps[currentStep.id] && (
                <Button 
                  onClick={() => handleCompleteStep(currentStep.id)}
                  className="flex items-center"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {language === 'de' ? 'Als erledigt markieren' : 'Mark as Complete'}
                </Button>
              )}
              
              {currentStep && completedSteps[currentStep.id] && (
                <Button 
                  onClick={() => {
                    const nextSteps = steps.filter(
                      s => !completedSteps[s.id] && (!currentStep || s.id !== currentStep.id)
                    );
                    
                    if (nextSteps.length > 0) {
                      handleSelectStep(nextSteps[0].id);
                    } else {
                      toast({
                        title: language === 'de' ? 'Glückwunsch!' : 'Congratulations!',
                        description: language === 'de'
                          ? 'Sie haben alle Schritte dieses Workflows abgeschlossen.'
                          : 'You have completed all steps for this workflow.',
                      });
                    }
                  }}
                  className="flex items-center"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  {language === 'de' ? 'Nächster Schritt' : 'Next Step'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Workflow-Visualisierung' : 'Workflow Visualization'}</CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Visuelle Darstellung des Workflow-Fortschritts'
                  : 'Visual representation of workflow progress'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/10 p-6">
                <div className="space-y-6 w-full">
                  <div className="w-full flex justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center text-center">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            completedSteps[step.id]
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                              : currentStep && currentStep.id === step.id
                                ? 'border-primary bg-primary/10'
                                : 'border-muted bg-muted/10'
                          }`}
                        >
                          {completedSteps[step.id] ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <span className="text-lg font-medium">{index + 1}</span>
                          )}
                        </div>
                        <span className="mt-2 text-sm font-medium block max-w-[100px] truncate">
                          {getLabel(step)}
                        </span>
                        {index < steps.length - 1 && (
                          <div className="absolute left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-muted top-6 -z-10" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full mt-10">
                    <div className="flex justify-between text-sm mb-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Verknüpfte Tools' : 'Connected Tools'}</CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Werkzeuge und Ressourcen für diesen Workflow'
                  : 'Tools and resources for this workflow'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step) => (
                  <Button
                    key={step.id}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left flex items-start"
                    onClick={() => goToStep(step.id)}
                  >
                    <div className="mr-3">
                      {step.icon || <FileText className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-left mb-1">
                        {getLabel(step)}
                      </h3>
                      {step.description && (
                        <p className="text-sm text-muted-foreground text-left">
                          {getDescription(step)}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedWorkflowPage;
