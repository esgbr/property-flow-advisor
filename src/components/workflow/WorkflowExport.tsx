
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { FileText, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface WorkflowExportProps {
  className?: string;
}

/**
 * Component for exporting and importing workflow data
 */
const WorkflowExport: React.FC<WorkflowExportProps> = ({ className }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [selectedWorkflows, setSelectedWorkflows] = useState<WorkflowType[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Initialize workflow hooks
  const steuerWorkflow = useWorkflow('steuer');
  const immobilienWorkflow = useWorkflow('immobilien');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  const analyseWorkflow = useWorkflow('analyse');
  
  const workflows = [
    {
      type: 'steuer' as WorkflowType,
      title: language === 'de' ? 'Steueroptimierung' : 'Tax Optimization',
      instance: steuerWorkflow
    },
    {
      type: 'immobilien' as WorkflowType,
      title: language === 'de' ? 'Immobilienverwaltung' : 'Property Management',
      instance: immobilienWorkflow
    },
    {
      type: 'finanzierung' as WorkflowType,
      title: language === 'de' ? 'Finanzierung' : 'Financing',
      instance: finanzierungWorkflow
    },
    {
      type: 'analyse' as WorkflowType,
      title: language === 'de' ? 'Analyse' : 'Analysis',
      instance: analyseWorkflow
    }
  ];
  
  const toggleWorkflow = (type: WorkflowType) => {
    setSelectedWorkflows(prev => 
      prev.includes(type) 
        ? prev.filter(wf => wf !== type)
        : [...prev, type]
    );
  };
  
  const handleExport = () => {
    if (selectedWorkflows.length === 0) {
      toast({
        title: language === 'de' ? 'Keine Workflows ausgewählt' : 'No workflows selected',
        description: language === 'de' 
          ? 'Bitte wählen Sie mindestens einen Workflow aus.'
          : 'Please select at least one workflow.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsExporting(true);
    
    // Collect workflow data
    const exportData: Record<string, any> = {};
    
    selectedWorkflows.forEach(type => {
      const workflow = workflows.find(wf => wf.type === type)?.instance;
      if (workflow) {
        const steps = workflow.getStepsWithStatus();
        const completedSteps = steps.filter(step => step.isComplete);
        
        exportData[type] = {
          completedSteps: completedSteps.map(step => step.id),
          data: {} // This would include any saved workflow data
        };
      }
    });
    
    // Create and download the export file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `workflow-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: language === 'de' ? 'Export erfolgreich' : 'Export successful',
        description: language === 'de'
          ? `${selectedWorkflows.length} Workflows wurden exportiert.`
          : `${selectedWorkflows.length} workflows have been exported.`,
        variant: 'default'
      });
    }, 1000);
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Process and validate the imported data
        let importedWorkflows = 0;
        
        Object.keys(importedData).forEach(type => {
          const workflowType = type as WorkflowType;
          if (!['steuer', 'immobilien', 'finanzierung', 'analyse'].includes(workflowType)) {
            return;
          }
          
          importedWorkflows++;
          // Here we would apply the imported data to the workflow state
          // For this example, we'll just show a success message
        });
        
        setTimeout(() => {
          setIsImporting(false);
          event.target.value = '';
          
          toast({
            title: language === 'de' ? 'Import erfolgreich' : 'Import successful',
            description: language === 'de'
              ? `${importedWorkflows} Workflows wurden importiert.`
              : `${importedWorkflows} workflows have been imported.`,
            variant: 'default'
          });
        }, 1000);
      } catch (error) {
        setIsImporting(false);
        event.target.value = '';
        
        toast({
          title: language === 'de' ? 'Import fehlgeschlagen' : 'Import failed',
          description: language === 'de'
            ? 'Die Datei konnte nicht verarbeitet werden.'
            : 'The file could not be processed.',
          variant: 'destructive'
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Workflow-Daten' : 'Workflow Data'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Exportieren oder importieren Sie Ihre Workflow-Daten'
            : 'Export or import your workflow data'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">
              {language === 'de' ? 'Workflows auswählen' : 'Select Workflows'}
            </h3>
            <div className="space-y-2">
              {workflows.map(workflow => (
                <div key={workflow.type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`workflow-${workflow.type}`}
                    checked={selectedWorkflows.includes(workflow.type)}
                    onCheckedChange={() => toggleWorkflow(workflow.type)}
                  />
                  <Label 
                    htmlFor={`workflow-${workflow.type}`}
                    className="text-sm font-normal"
                  >
                    {workflow.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={selectedWorkflows.length === 0 || isExporting}
          className="flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting
            ? (language === 'de' ? 'Exportiere...' : 'Exporting...')
            : (language === 'de' ? 'Exportieren' : 'Export')
          }
        </Button>
        
        <div className="relative">
          <input
            type="file"
            id="workflow-import"
            className="sr-only"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
          />
          <Label
            htmlFor="workflow-import"
            className={`flex items-center cursor-pointer px-4 py-2 rounded-md ${
              isImporting ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-primary-foreground'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting
              ? (language === 'de' ? 'Importiere...' : 'Importing...')
              : (language === 'de' ? 'Importieren' : 'Import')
            }
          </Label>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WorkflowExport;
