
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, ArrowRight, Check, ChevronRight, ArrowLeftRight, GitBranch, FileText } from 'lucide-react';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRelatedWorkflowsForTool } from '@/utils/workflowUtils';

interface DynamicWorkflowEditorProps {
  workflowType: WorkflowType;
}

const DynamicWorkflowEditor: React.FC<DynamicWorkflowEditorProps> = ({ workflowType }) => {
  const { language } = useLanguage();
  const { 
    getStepsWithStatus, 
    markStepComplete, 
    goToStep, 
    getWorkflowProgress, 
    saveData,
    getData,
    getCurrentStep
  } = useWorkflow(workflowType);
  
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [customBranches, setCustomBranches] = useState<Record<string, string[]>>({});
  const [userChoices, setUserChoices] = useState<Record<string, Record<string, string>>>({});
  const [relatedWorkflows, setRelatedWorkflows] = useState<WorkflowType[]>([]);

  // Load initial data
  useEffect(() => {
    const currentWorkflowStep = getCurrentStep();
    if (currentWorkflowStep) {
      setCurrentStepId(currentWorkflowStep.id);
      // Set related workflows based on the current step
      setRelatedWorkflows(getRelatedWorkflowsForTool(currentWorkflowStep.id));
    } else if (getStepsWithStatus().length > 0) {
      setCurrentStepId(getStepsWithStatus()[0].id);
    }
    
    // Load saved branches and choices
    const savedBranches = getData('customBranches');
    const savedChoices = getData('userChoices');
    
    if (savedBranches) setCustomBranches(savedBranches);
    if (savedChoices) setUserChoices(savedChoices);
  }, [workflowType, getCurrentStep, getStepsWithStatus, getData]);

  // Save changes when branches or choices change
  useEffect(() => {
    if (Object.keys(customBranches).length > 0) {
      saveData('customBranches', customBranches);
    }
    if (Object.keys(userChoices).length > 0) {
      saveData('userChoices', userChoices);
    }
  }, [customBranches, userChoices, saveData]);

  const stepsWithStatus = getStepsWithStatus();
  const currentStep = stepsWithStatus.find(step => step.id === currentStepId);
  const progress = getWorkflowProgress(currentStepId || undefined);

  const handleMarkComplete = (stepId: string) => {
    markStepComplete(stepId);
    toast({
      title: language === 'de' ? "Schritt abgeschlossen" : "Step completed", 
      description: language === 'de' 
        ? "Der Workflow-Schritt wurde als abgeschlossen markiert" 
        : "The workflow step has been marked as complete"
    });
  };

  const handleSetChoice = (stepId: string, key: string, value: string) => {
    setUserChoices(prev => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [key]: value
      }
    }));
    
    // Determine next steps based on choices
    determineNextStepsBasedOnChoices(stepId, key, value);
  };

  const determineNextStepsBasedOnChoices = (stepId: string, key: string, value: string) => {
    // Logic to determine which branch to take based on user choices
    const choiceBasedBranching: Record<string, Record<string, Record<string, string[]>>> = {
      'steuer': {
        // For tax strategy choice
        'taxStrategy': {
          'conservative': ['planning', 'afa'],
          'balanced': ['planning', 'spekulationssteuer'],
          'aggressive': ['planning', 'spekulationssteuer', 'summary']
        }
      },
      'immobilien': {
        // For property type choice
        'propertyType': {
          'residential': ['objekterfassung', 'mietverwaltung'],
          'commercial': ['objekterfassung', 'nebenkosten'],
          'mixed': ['objekterfassung', 'mietverwaltung', 'nebenkosten']
        }
      },
      // Add similar rules for other workflow types
    };

    // Get the branching rules for this workflow type
    const workflowRules = choiceBasedBranching[workflowType];
    if (!workflowRules) return;

    // Get the rules for this specific key
    const keyRules = workflowRules[key];
    if (!keyRules) return;

    // Get the next steps based on the value chosen
    const nextStepsIds = keyRules[value];
    if (nextStepsIds) {
      // Update custom branches to include the determined path
      setCustomBranches(prev => ({
        ...prev,
        [stepId]: nextStepsIds
      }));
      
      toast({
        title: language === 'de' ? "Workflow angepasst" : "Workflow adjusted",
        description: language === 'de'
          ? `Basierend auf Ihrer Auswahl wurde der Workflow angepasst`
          : `The workflow has been adjusted based on your selection`
      });
    }
  };

  const handleAddBranch = (fromStepId: string, toStepId: string) => {
    setCustomBranches(prev => ({
      ...prev,
      [fromStepId]: [...(prev[fromStepId] || []), toStepId]
    }));
    
    toast({
      title: language === 'de' ? "Verzweigung hinzugefügt" : "Branch added",
      description: language === 'de'
        ? `Eine neue Verzweigung wurde zum Workflow hinzugefügt`
        : `A new branch has been added to the workflow`
    });
  };

  const getNextSteps = (stepId: string) => {
    const customNextSteps = customBranches[stepId] || [];
    if (customNextSteps.length > 0) {
      return customNextSteps.map(id => stepsWithStatus.find(s => s.id === id)).filter(Boolean);
    }
    
    const currentIndex = stepsWithStatus.findIndex(s => s.id === stepId);
    if (currentIndex >= 0 && currentIndex < stepsWithStatus.length - 1) {
      return [stepsWithStatus[currentIndex + 1]];
    }
    
    return [];
  };

  const renderNextSteps = () => {
    if (!currentStepId) return null;
    
    const nextSteps = getNextSteps(currentStepId);
    
    if (nextSteps.length === 0) {
      return (
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            {language === 'de' 
              ? "Keine weiteren Schritte verfügbar" 
              : "No further steps available"}
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <Label>
          {language === 'de' ? "Nächste Schritte" : "Next Steps"}
        </Label>
        <div className="space-y-2">
          {nextSteps.map(step => (
            <Button
              key={step?.id}
              variant="outline"
              className="w-full justify-between"
              onClick={() => step && goToStep(step.id)}
            >
              {step?.label[language as keyof typeof step.label] || step?.id}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderAddBranchSection = () => {
    const otherSteps = stepsWithStatus.filter(step => step.id !== currentStepId);
    
    return (
      <div className="space-y-2">
        <Label>
          {language === 'de' ? "Benutzerdefinierte Verzweigung hinzufügen" : "Add Custom Branch"}
        </Label>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {otherSteps.map(step => (
              <div key={step.id} className="flex items-center justify-between">
                <span className="text-sm">{step.label[language as keyof typeof step.label]}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => currentStepId && handleAddBranch(currentStepId, step.id)}
                >
                  <ArrowLeftRight className="h-3 w-3 mr-1" />
                  {language === 'de' ? "Verknüpfen" : "Link"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderStepChoices = () => {
    if (!currentStepId) return null;
    
    // Example choices for different workflow types
    const choiceOptions: Record<string, {key: string, label: {en: string, de: string}, options: {value: string, label: {en: string, de: string}}[]}[]> = {
      'steuer': [
        {
          key: 'taxStrategy',
          label: {en: 'Tax Strategy', de: 'Steuerstrategie'},
          options: [
            {value: 'conservative', label: {en: 'Conservative', de: 'Konservativ'}},
            {value: 'balanced', label: {en: 'Balanced', de: 'Ausgeglichen'}},
            {value: 'aggressive', label: {en: 'Aggressive', de: 'Aggressiv'}}
          ]
        },
        {
          key: 'propertyAge',
          label: {en: 'Property Age', de: 'Immobilienalter'},
          options: [
            {value: 'new', label: {en: 'New Construction', de: 'Neubau'}},
            {value: 'existing', label: {en: 'Existing Property', de: 'Bestandsimmobilie'}},
            {value: 'historic', label: {en: 'Historic Building', de: 'Denkmalgeschützte Immobilie'}}
          ]
        }
      ],
      'immobilien': [
        {
          key: 'propertyType',
          label: {en: 'Property Type', de: 'Immobilientyp'},
          options: [
            {value: 'residential', label: {en: 'Residential', de: 'Wohnimmobilie'}},
            {value: 'commercial', label: {en: 'Commercial', de: 'Gewerbeimmobilie'}},
            {value: 'mixed', label: {en: 'Mixed Use', de: 'Gemischt genutzte Immobilie'}}
          ]
        },
        {
          key: 'location',
          label: {en: 'Location', de: 'Lage'},
          options: [
            {value: 'urban', label: {en: 'Urban', de: 'Städtisch'}},
            {value: 'suburban', label: {en: 'Suburban', de: 'Vorstädtisch'}},
            {value: 'rural', label: {en: 'Rural', de: 'Ländlich'}}
          ]
        }
      ],
      'finanzierung': [
        {
          key: 'financingType',
          label: {en: 'Financing Type', de: 'Finanzierungsart'},
          options: [
            {value: 'mortgage', label: {en: 'Mortgage', de: 'Hypothek'}},
            {value: 'cash', label: {en: 'Cash Purchase', de: 'Barkauf'}},
            {value: 'mixed', label: {en: 'Mixed Financing', de: 'Gemischte Finanzierung'}}
          ]
        },
        {
          key: 'loanTerm',
          label: {en: 'Loan Term', de: 'Kreditlaufzeit'},
          options: [
            {value: 'short', label: {en: '5-10 Years', de: '5-10 Jahre'}},
            {value: 'medium', label: {en: '10-20 Years', de: '10-20 Jahre'}},
            {value: 'long', label: {en: '20+ Years', de: '20+ Jahre'}}
          ]
        }
      ],
      'analyse': [
        {
          key: 'analysisDepth',
          label: {en: 'Analysis Depth', de: 'Analysetiefe'},
          options: [
            {value: 'basic', label: {en: 'Basic', de: 'Grundlegend'}},
            {value: 'detailed', label: {en: 'Detailed', de: 'Detailliert'}},
            {value: 'expert', label: {en: 'Expert', de: 'Experte'}}
          ]
        },
        {
          key: 'investmentGoal',
          label: {en: 'Investment Goal', de: 'Anlageziel'},
          options: [
            {value: 'income', label: {en: 'Regular Income', de: 'Regelmäßiges Einkommen'}},
            {value: 'appreciation', label: {en: 'Capital Appreciation', de: 'Wertsteigerung'}},
            {value: 'balanced', label: {en: 'Balanced Approach', de: 'Ausgewogener Ansatz'}}
          ]
        }
      ]
    };
    
    const workflowChoices = choiceOptions[workflowType] || [];
    
    return (
      <div className="space-y-4">
        <Label>
          {language === 'de' ? "Schrittoptionen" : "Step Options"}
        </Label>
        {workflowChoices.map(choiceGroup => (
          <div key={choiceGroup.key} className="space-y-2">
            <Label className="text-sm">{choiceGroup.label[language as keyof typeof choiceGroup.label]}</Label>
            <div className="space-y-2">
              {choiceGroup.options.map(option => (
                <div key={`${option.value}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${choiceGroup.key}-${option.value}`}
                    checked={userChoices[currentStepId]?.[choiceGroup.key] === option.value}
                    onCheckedChange={() => handleSetChoice(currentStepId, choiceGroup.key, option.value)}
                  />
                  <Label htmlFor={`${choiceGroup.key}-${option.value}`} className="text-sm font-normal">
                    {option.label[language as keyof typeof option.label]}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
        {workflowChoices.length === 0 && (
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground text-sm">
              {language === 'de' 
                ? "Keine Optionen für diesen Schritt verfügbar" 
                : "No options available for this step"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render related workflows section
  const renderRelatedWorkflows = () => {
    if (!currentStepId || relatedWorkflows.length === 0) return null;
    
    return (
      <div className="space-y-2 mt-4">
        <Label>
          {language === 'de' ? "Verbundene Workflows" : "Related Workflows"}
        </Label>
        <div className="space-y-2">
          {relatedWorkflows.map(relatedType => (
            <Button
              key={relatedType}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                toast({
                  title: language === 'de' ? "Workflow verknüpft" : "Workflow linked",
                  description: language === 'de' 
                    ? "Verbindung zum verwandten Workflow hergestellt" 
                    : "Connection to related workflow established"
                });
              }}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              {language === 'de' 
                ? workflowTitles[relatedType].de
                : workflowTitles[relatedType].en}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const workflowTitles: Record<WorkflowType, {en: string, de: string}> = {
    steuer: {en: 'Tax Optimization', de: 'Steueroptimierung'},
    immobilien: {en: 'Property Management', de: 'Immobilienverwaltung'},
    finanzierung: {en: 'Financing', de: 'Finanzierung'},
    analyse: {en: 'Investment Analysis', de: 'Investitionsanalyse'}
  };

  if (!currentStep) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {language === 'de' 
              ? "Kein aktiver Workflow-Schritt ausgewählt" 
              : "No active workflow step selected"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {language === 'de' ? "Dynamische Workflow-Verzweigungen" : "Dynamic Workflow Branching"}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={progress >= 75 ? "default" : progress >= 50 ? "outline" : "secondary"}>
                  {progress}% {language === 'de' ? "Abgeschlossen" : "Complete"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {language === 'de' 
                  ? "Fortschritt dieses Workflows" 
                  : "Progress of this workflow"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          {language === 'de'
            ? "Passen Sie Ihren Workflow mit benutzerdefinierten Verzweigungen und Entscheidungen an"
            : "Customize your workflow with custom branches and decision points"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {currentStep.label[language as keyof typeof currentStep.label] || currentStep.id}
            </h3>
            {currentStep.description && (
              <p className="text-sm text-muted-foreground">
                {currentStep.description[language as keyof typeof currentStep.description]}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={currentStep.isComplete ? "default" : "outline"}>
              {currentStep.isComplete 
                ? (language === 'de' ? "Abgeschlossen" : "Completed") 
                : (language === 'de' ? "Offen" : "Pending")}
            </Badge>
            {!currentStep.isComplete && (
              <Button size="sm" onClick={() => handleMarkComplete(currentStep.id)}>
                <Check className="mr-1 h-4 w-4" />
                {language === 'de' ? "Als erledigt markieren" : "Mark as Complete"}
              </Button>
            )}
          </div>
          
          <Separator />
          
          <Tabs defaultValue="decisions">
            <TabsList>
              <TabsTrigger value="decisions">
                {language === 'de' ? "Entscheidungen" : "Decisions"}
              </TabsTrigger>
              <TabsTrigger value="branches">
                {language === 'de' ? "Verzweigungen" : "Branches"}
              </TabsTrigger>
              <TabsTrigger value="related">
                {language === 'de' ? "Verknüpfte Workflows" : "Related Workflows"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="decisions" className="space-y-4 pt-4">
              {renderStepChoices()}
            </TabsContent>
            <TabsContent value="branches" className="space-y-4 pt-4">
              {renderAddBranchSection()}
              <Separator />
              {renderNextSteps()}
            </TabsContent>
            <TabsContent value="related" className="space-y-4 pt-4">
              {renderRelatedWorkflows()}
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              // Export workflow data
              const workflowData = {
                type: workflowType,
                currentStep: currentStepId,
                choices: userChoices,
                branches: customBranches,
                progress: progress
              };
              
              // We would normally trigger a download here
              saveData('exportedWorkflow', workflowData);
              
              toast({
                title: language === 'de' ? "Workflow exportiert" : "Workflow exported",
                description: language === 'de'
                  ? "Workflow-Daten wurden gespeichert"
                  : "Workflow data has been saved"
              });
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            {language === 'de' ? "Workflow exportieren" : "Export Workflow"}
          </Button>
          
          <Button 
            onClick={() => {
              if (currentStep.isComplete) {
                const nextSteps = getNextSteps(currentStep.id);
                if (nextSteps.length > 0 && nextSteps[0]) {
                  goToStep(nextSteps[0].id);
                  setCurrentStepId(nextSteps[0].id);
                }
              } else {
                handleMarkComplete(currentStep.id);
                const nextSteps = getNextSteps(currentStep.id);
                if (nextSteps.length > 0 && nextSteps[0]) {
                  goToStep(nextSteps[0].id);
                  setCurrentStepId(nextSteps[0].id);
                }
              }
            }}
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {language === 'de' ? "Zum nächsten Schritt" : "Proceed to Next Step"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicWorkflowEditor;
