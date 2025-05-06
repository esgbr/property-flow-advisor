
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Building, Calculator, Calendar, FileText, Map, PlusCircle, Settings, TrendingUp } from 'lucide-react';
import { workflowDefinitions, WorkflowType } from '@/data/workflow-definitions';
import { useWorkflow } from '@/hooks/use-workflow';
import WorkflowSuggestions from '@/components/workflow/WorkflowSuggestions';
import { useToast } from '@/components/ui/use-toast';
import { useMarketFilter } from '@/hooks/use-market-filter';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

/**
 * UnifiedWorkflowDashboard Component
 * 
 * A comprehensive dashboard that integrates all workflows and provides:
 * - Quick access to workflows and tools
 * - Personalized recommendations
 * - Progress tracking
 * - Market-aware information
 */
const UnifiedWorkflowDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCurrentMarket, getMarketDisplayName } = useMarketFilter();
  const { preferences } = useUserPreferences();
  const currentMarket = getCurrentMarket();
  const marketName = getMarketDisplayName();
  
  // Track active workflow
  const [activeWorkflowType, setActiveWorkflowType] = useState<WorkflowType>('investment');
  const workflow = useWorkflow(activeWorkflowType);
  
  // Get available workflows for the current market
  const availableWorkflows = Object.keys(workflowDefinitions).filter(key => {
    // Filter based on market, user experience or other criteria
    if (currentMarket === 'germany' && ['steuer', 'immobilien'].includes(key)) {
      return true;
    }
    if (currentMarket === 'usa' && ['investment', 'financing'].includes(key)) {
      return true;
    }
    // Global workflows available to all
    return true;
  }) as WorkflowType[];
  
  // Get recommended workflow step
  const getRecommendedStep = (workflowType: WorkflowType) => {
    const wf = useWorkflow(workflowType);
    const steps = wf.getWorkflowSteps();
    
    // Find first incomplete step
    const nextStep = steps.find(step => !step.isComplete);
    return nextStep ? nextStep.id : steps[0].id;
  };
  
  // Handle starting a workflow
  const handleStartWorkflow = (workflowType: WorkflowType) => {
    const workflowSteps = workflow.getWorkflowSteps();
    const firstIncompleteStep = workflowSteps.find(step => !step.isComplete);
    const targetStep = firstIncompleteStep || workflowSteps[0];
    
    if (targetStep) {
      navigate(targetStep.path);
      toast({
        title: language === 'de' ? 'Workflow gestartet' : 'Workflow started',
        description: language === 'de'
          ? `Sie haben den Workflow "${workflowDefinitions[workflowType].title.de}" gestartet`
          : `You started the "${workflowDefinitions[workflowType].title.en}" workflow`
      });
    }
  };
  
  // Calculate overall progress for all workflows
  const calculateOverallProgress = () => {
    const workflowTypes = Object.keys(workflowDefinitions) as WorkflowType[];
    let totalSteps = 0;
    let completedSteps = 0;
    
    workflowTypes.forEach(type => {
      const wf = useWorkflow(type);
      totalSteps += wf.steps.length;
      completedSteps += wf.getCompleteSteps().length;
    });
    
    return Math.round((completedSteps / totalSteps) * 100);
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Get recommended workflow based on user preferences and market
  const getRecommendedWorkflow = (): WorkflowType => {
    if (preferences.experienceLevel === 'beginner') {
      return currentMarket === 'germany' ? 'immobilien' : 'investment';
    }
    
    if (preferences.experienceLevel === 'advanced' || preferences.experienceLevel === 'expert') {
      return currentMarket === 'germany' ? 'steuer' : 'finanzierung';
    }
    
    return 'investment';
  };
  
  const recommendedWorkflow = getRecommendedWorkflow();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{language === 'de' ? 'Dashboard' : 'Dashboard'}</h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? `Willkommen zurück. Hier ist eine Übersicht Ihrer Immobilieninvestitionstools für ${marketName}.` 
            : `Welcome back. Here's an overview of your real estate investment tools for ${marketName}.`}
        </p>
      </div>
      
      {/* Market-specific recommendation card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            {language === 'de' ? 'Empfohlener Workflow' : 'Recommended Workflow'}
          </CardTitle>
          <CardDescription>
            {language === 'de' 
              ? 'Basierend auf Ihren Einstellungen und dem aktuellen Markt' 
              : 'Based on your settings and current market'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {workflowDefinitions[recommendedWorkflow].title[language as keyof typeof workflowDefinitions[recommendedWorkflow].title]}
              </h3>
              <p className="text-sm text-muted-foreground">
                {workflowDefinitions[recommendedWorkflow].description[language as keyof typeof workflowDefinitions[recommendedWorkflow].description]}
              </p>
            </div>
            <Button onClick={() => handleStartWorkflow(recommendedWorkflow)}>
              {language === 'de' ? 'Starten' : 'Start'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Workflow tabs */}
      <Tabs defaultValue={activeWorkflowType} onValueChange={value => setActiveWorkflowType(value as WorkflowType)}>
        <TabsList className="mb-4">
          {workflowDefinitions.steuer && (
            <TabsTrigger value="steuer">
              <Calculator className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Steuer' : 'Tax'}
            </TabsTrigger>
          )}
          <TabsTrigger value="investment">
            <TrendingUp className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Investition' : 'Investment'}
          </TabsTrigger>
          <TabsTrigger value="finanzierung">
            <FileText className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Finanzierung' : 'Financing'}
          </TabsTrigger>
          <TabsTrigger value="immobilien">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Immobilien' : 'Properties'}
          </TabsTrigger>
        </TabsList>
        
        {Object.entries(workflowDefinitions).map(([key, definition]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{definition.title[language as keyof typeof definition.title]}</CardTitle>
                <CardDescription>{definition.description[language as keyof typeof definition.description]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {definition.steps.map(step => {
                      const wf = useWorkflow(key as WorkflowType);
                      const isComplete = wf.getCompleteSteps().some(s => s.id === step.id);
                      
                      return (
                        <Card 
                          key={step.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${isComplete ? 'border-green-500/40 bg-green-50/30 dark:bg-green-900/10' : ''}`}
                          onClick={() => navigate(step.path)}
                        >
                          <CardContent className="p-4 flex items-center">
                            <div className="mr-3 text-primary">
                              {step.icon}
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                {step.label[language as keyof typeof step.label]}
                                {isComplete && (
                                  <span className="ml-2 text-xs text-green-600">
                                    {language === 'de' ? '✓ Erledigt' : '✓ Completed'}
                                  </span>
                                )}
                              </h4>
                              {step.description && (
                                <p className="text-xs text-muted-foreground">
                                  {step.description[language as keyof typeof step.description]}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                    {/* Add custom step */}
                    <Card className="cursor-pointer transition-all hover:shadow-md border-dashed">
                      <CardContent className="p-4 flex items-center justify-center">
                        <PlusCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {language === 'de' ? 'Eigenen Schritt hinzufügen' : 'Add custom step'}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {language === 'de' 
                    ? `${useWorkflow(key as WorkflowType).getCompleteSteps().length} von ${definition.steps.length} Schritten abgeschlossen` 
                    : `${useWorkflow(key as WorkflowType).getCompleteSteps().length} of ${definition.steps.length} steps completed`}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleStartWorkflow(key as WorkflowType)}
                >
                  {language === 'de' ? 'Fortsetzen' : 'Continue'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Quick access tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {language === 'de' ? 'Schnellzugriff auf Tools' : 'Quick Access Tools'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/calculators')}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Calculator className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-medium text-center">
                {language === 'de' ? 'Rechner' : 'Calculators'}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/market-explorer')}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Map className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-medium text-center">
                {language === 'de' ? 'Marktanalyse' : 'Market Analysis'}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/portfolio-analytics')}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-medium text-center">
                {language === 'de' ? 'Portfolio Analyse' : 'Portfolio Analysis'}
              </h3>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/settings')}>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <h3 className="font-medium text-center">
                {language === 'de' ? 'Einstellungen' : 'Settings'}
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Calendar integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {language === 'de' ? 'Anstehende Termine' : 'Upcoming Tasks'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {language === 'de' 
                ? 'Keine anstehenden Termine in den nächsten 7 Tagen.' 
                : 'No upcoming tasks in the next 7 days.'}
            </p>
            <Button variant="link" className="mt-2">
              {language === 'de' ? 'Termin hinzufügen' : 'Add task'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Next steps suggestions */}
      <WorkflowSuggestions
        currentTool="dashboard"
        workflowType={activeWorkflowType}
        maxSuggestions={4}
        variant="default"
      />
    </div>
  );
};

export default UnifiedWorkflowDashboard;
