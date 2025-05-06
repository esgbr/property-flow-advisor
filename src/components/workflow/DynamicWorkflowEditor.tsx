
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useWorkflow, WorkflowStepWithStatus, WorkflowType } from '@/hooks/use-workflow';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Save, Trash, ArrowRight, ArrowLeft, Settings } from 'lucide-react';

const DynamicWorkflowEditor: React.FC<{ workflowType: WorkflowType }> = ({ workflowType }) => {
  const { language } = useLanguage();
  const { 
    getStepsWithStatus, 
    markStepComplete, 
    resetWorkflow,
    saveData,
    getData 
  } = useWorkflow(workflowType);
  
  const [steps, setSteps] = useState<WorkflowStepWithStatus[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [conditions, setConditions] = useState<Record<string, any>>({});

  useEffect(() => {
    const currentSteps = getStepsWithStatus();
    setSteps(currentSteps);
    
    if (currentSteps.length > 0 && !selectedStep) {
      setSelectedStep(currentSteps[0].id);
    }
    
    // Load saved conditions
    const savedConditions = getData('conditions');
    if (savedConditions) {
      setConditions(savedConditions);
    }
  }, [getStepsWithStatus, getData, selectedStep]);

  const handleStepCompletion = (stepId: string, isComplete: boolean) => {
    if (isComplete) {
      markStepComplete(stepId);
    }
    const updatedSteps = getStepsWithStatus();
    setSteps(updatedSteps);
  };

  const handleAddCondition = (stepId: string) => {
    setConditions(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        conditions: [...(prev[stepId]?.conditions || []), { 
          id: Date.now(),
          field: '',
          operator: 'equals',
          value: '',
          nextStep: ''
        }]
      }
    }));
  };

  const handleConditionChange = (stepId: string, conditionId: number, field: string, value: any) => {
    setConditions(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        conditions: (prev[stepId]?.conditions || []).map(c => 
          c.id === conditionId ? { ...c, [field]: value } : c
        )
      }
    }));
  };

  const handleDeleteCondition = (stepId: string, conditionId: number) => {
    setConditions(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        conditions: (prev[stepId]?.conditions || []).filter(c => c.id !== conditionId)
      }
    }));
  };

  const handleSave = () => {
    saveData('conditions', conditions);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {language === 'de' ? 'Dynamische Workflow-Verzweigungen' : 'Dynamic Workflow Branching'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Anpassung der Workflow-Schritte basierend auf vorherigen Entscheidungen' 
                : 'Customization of workflow steps based on previous decisions'}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEditing}
              onCheckedChange={setIsEditing}
              id="edit-mode"
            />
            <Label htmlFor="edit-mode" className="cursor-pointer">
              {language === 'de' ? 'Bearbeitungsmodus' : 'Edit Mode'}
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flow" className="space-y-4">
          <TabsList>
            <TabsTrigger value="flow">
              {language === 'de' ? 'Workflow-Fluss' : 'Workflow Flow'}
            </TabsTrigger>
            <TabsTrigger value="conditions">
              {language === 'de' ? 'Bedingungen' : 'Conditions'}
            </TabsTrigger>
            <TabsTrigger value="preview">
              {language === 'de' ? 'Vorschau' : 'Preview'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flow">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <div className="space-y-2">
                  {steps.map((step) => (
                    <div 
                      key={step.id} 
                      className={`flex items-center space-x-2 p-2 rounded-md ${selectedStep === step.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelectedStep(step.id)}
                    >
                      <div className={`h-4 w-4 rounded-full ${step.isComplete ? 'bg-primary' : 'border border-muted-foreground'}`} />
                      <div className="flex-1">
                        <div className="font-medium">
                          {step.label[language === 'de' ? 'de' : 'en']}
                          {conditions[step.id]?.conditions?.length > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {conditions[step.id]?.conditions?.length} {language === 'de' ? 'Bedingungen' : 'conditions'}
                            </Badge>
                          )}
                        </div>
                        {step.description && (
                          <div className="text-xs text-muted-foreground">
                            {step.description[language === 'de' ? 'de' : 'en']}
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddCondition(step.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {!isEditing && (
                        <Switch
                          checked={step.isComplete}
                          onCheckedChange={(checked) => handleStepCompletion(step.id, checked)}
                          disabled={
                            step.dependencies && 
                            step.dependencies.length > 0 && 
                            step.dependencies.some(dep => !steps.find(s => s.id === dep)?.isComplete)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedStep && !isEditing && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {steps.find(s => s.id === selectedStep)?.label[language === 'de' ? 'de' : 'en']}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        {steps.find(s => s.id === selectedStep)?.description?.[language === 'de' ? 'de' : 'en']}
                      </p>
                      
                      {conditions[selectedStep]?.conditions?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            {language === 'de' ? 'Verzweigungslogik:' : 'Branching Logic:'}
                          </h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {conditions[selectedStep].conditions.map((condition: any) => (
                              <li key={condition.id}>
                                {language === 'de' 
                                  ? `Wenn "${condition.field}" ${condition.operator} "${condition.value}", dann gehe zu "${steps.find(s => s.id === condition.nextStep)?.label.de || condition.nextStep}"`
                                  : `If "${condition.field}" ${condition.operator} "${condition.value}", then go to "${steps.find(s => s.id === condition.nextStep)?.label.en || condition.nextStep}"`
                                }
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="conditions">
            {selectedStep && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {language === 'de' 
                      ? `Bedingungen für "${steps.find(s => s.id === selectedStep)?.label.de}"` 
                      : `Conditions for "${steps.find(s => s.id === selectedStep)?.label.en}"`
                    }
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddCondition(selectedStep)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Bedingung hinzufügen' : 'Add Condition'}
                  </Button>
                </div>

                {conditions[selectedStep]?.conditions?.length > 0 ? (
                  <div className="space-y-4">
                    {conditions[selectedStep].conditions.map((condition: any) => (
                      <Card key={condition.id}>
                        <CardContent className="pt-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`field-${condition.id}`}>
                                {language === 'de' ? 'Feld' : 'Field'}
                              </Label>
                              <Input
                                id={`field-${condition.id}`}
                                value={condition.field}
                                onChange={(e) => handleConditionChange(selectedStep, condition.id, 'field', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`operator-${condition.id}`}>
                                {language === 'de' ? 'Operator' : 'Operator'}
                              </Label>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => handleConditionChange(selectedStep, condition.id, 'operator', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">{language === 'de' ? 'ist gleich' : 'equals'}</SelectItem>
                                  <SelectItem value="not-equals">{language === 'de' ? 'ist nicht gleich' : 'not equals'}</SelectItem>
                                  <SelectItem value="greater-than">{language === 'de' ? 'ist größer als' : 'greater than'}</SelectItem>
                                  <SelectItem value="less-than">{language === 'de' ? 'ist kleiner als' : 'less than'}</SelectItem>
                                  <SelectItem value="contains">{language === 'de' ? 'enthält' : 'contains'}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`value-${condition.id}`}>
                                {language === 'de' ? 'Wert' : 'Value'}
                              </Label>
                              <Input
                                id={`value-${condition.id}`}
                                value={condition.value}
                                onChange={(e) => handleConditionChange(selectedStep, condition.id, 'value', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`nextStep-${condition.id}`}>
                                {language === 'de' ? 'Nächster Schritt' : 'Next Step'}
                              </Label>
                              <Select
                                value={condition.nextStep}
                                onValueChange={(value) => handleConditionChange(selectedStep, condition.id, 'nextStep', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {steps.map((step) => (
                                    <SelectItem key={step.id} value={step.id}>
                                      {step.label[language === 'de' ? 'de' : 'en']}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCondition(selectedStep, condition.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              {language === 'de' ? 'Löschen' : 'Delete'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center border rounded-md">
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'de' ? 'Keine Bedingungen definiert' : 'No Conditions Defined'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'de' 
                        ? 'Fügen Sie Bedingungen hinzu, um den Workflow-Fluss basierend auf Entscheidungen zu steuern.'
                        : 'Add conditions to control workflow flow based on decisions.'}
                    </p>
                    <Button onClick={() => handleAddCondition(selectedStep)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'de' ? 'Erste Bedingung hinzufügen' : 'Add First Condition'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="border rounded-md p-6 flex flex-col items-center">
                <div className="flex flex-col items-center mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    {language === 'de' ? 'Workflow-Vorschau' : 'Workflow Preview'}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {language === 'de' 
                      ? 'Diese Vorschau zeigt, wie sich der Workflow basierend auf den definierten Bedingungen verzweigen kann.'
                      : 'This preview shows how the workflow can branch based on the defined conditions.'}
                  </p>
                </div>
                
                <div className="flex flex-col items-center space-y-6 w-full">
                  {steps.map((step, index) => {
                    const hasConditions = conditions[step.id]?.conditions?.length > 0;
                    
                    return (
                      <div key={step.id} className="w-full max-w-md">
                        <div className="bg-primary/10 p-4 rounded-md text-center mb-2">
                          <h4 className="font-medium">
                            {step.label[language === 'de' ? 'de' : 'en']}
                          </h4>
                        </div>
                        
                        {hasConditions && (
                          <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1 text-muted-foreground">
                              ↓
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                              {conditions[step.id].conditions.map((condition: any, condIndex: number) => {
                                const targetStep = steps.find(s => s.id === condition.nextStep);
                                
                                return (
                                  <div key={condition.id} className="flex flex-col items-center">
                                    <div className="bg-muted p-2 rounded text-xs text-center mb-2 w-full">
                                      {condition.field} {condition.operator} {condition.value}
                                    </div>
                                    <div className="text-muted-foreground text-center">↓</div>
                                    <div className="bg-muted/50 p-2 rounded text-xs text-center mt-2 w-full">
                                      {targetStep?.label[language === 'de' ? 'de' : 'en'] || 'N/A'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {!hasConditions && index < steps.length - 1 && (
                          <div className="flex justify-center my-4 text-muted-foreground">
                            ↓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetWorkflow}
        >
          {language === 'de' ? 'Workflow zurücksetzen' : 'Reset Workflow'}
        </Button>
        {isEditing && (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {language === 'de' ? 'Änderungen speichern' : 'Save Changes'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DynamicWorkflowEditor;
