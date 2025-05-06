
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, ArrowRight, Check, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [userChoices, setUserChoices] = useState<Record<string, any>>({});

  // Load initial data
  useEffect(() => {
    const currentWorkflowStep = getCurrentStep();
    if (currentWorkflowStep) {
      setCurrentStepId(currentWorkflowStep.id);
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

  const handleSetChoice = (stepId: string, key: string, value: any) => {
    setUserChoices(prev => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        [key]: value
      }
    }));
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
      </div>
    );
  };

  const renderStepChoices = () => {
    if (!currentStepId) return null;
    
    // Example choices for different workflow types
    const choiceOptions: Record<string, {key: string, label: {en: string, de: string}, options: {value: any, label: {en: string, de: string}}[]}[]> = {
      'steuer': [
        {
          key: 'taxStrategy',
          label: {en: 'Tax Strategy', de: 'Steuerstrategie'},
          options: [
            {value: 'conservative', label: {en: 'Conservative', de: 'Konservativ'}},
            {value: 'balanced', label: {en: 'Balanced', de: 'Ausgeglichen'}},
            {value: 'aggressive', label: {en: 'Aggressive', de: 'Aggressiv'}}
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
          <Badge variant={progress >= 75 ? "default" : progress >= 50 ? "outline" : "secondary"}>
            {progress}% {language === 'de' ? "Abgeschlossen" : "Complete"}
          </Badge>
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
            </TabsList>
            <TabsContent value="decisions" className="space-y-4 pt-4">
              {renderStepChoices()}
            </TabsContent>
            <TabsContent value="branches" className="space-y-4 pt-4">
              {renderAddBranchSection()}
              <Separator />
              {renderNextSteps()}
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <Button 
          className="w-full"
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
      </CardContent>
    </Card>
  );
};

export default DynamicWorkflowEditor;
