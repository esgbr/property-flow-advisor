
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { FileText, Download, FileCode, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface WorkflowExporterProps {
  workflowType: WorkflowType;
}

const WorkflowExporter: React.FC<WorkflowExporterProps> = ({ workflowType }) => {
  const { getStepsWithStatus, getData } = useWorkflow(workflowType);
  const [filename, setFilename] = useState(`workflow-${workflowType}-export`);
  const [format, setFormat] = useState('json');
  const [includeOptions, setIncludeOptions] = useState({
    metadata: true,
    decisions: true,
    comments: true,
    timestamps: false
  });

  const stepsWithStatus = getStepsWithStatus();
  const completedSteps = stepsWithStatus.filter(step => step.isComplete);

  const handleExport = () => {
    // Gather data
    const exportData = {
      workflowType,
      exportDate: new Date().toISOString(),
      completedSteps: completedSteps.length,
      totalSteps: stepsWithStatus.length,
      progress: Math.round((completedSteps.length / stepsWithStatus.length) * 100),
      steps: stepsWithStatus.map(step => ({
        id: step.id,
        label: step.label,
        isComplete: step.isComplete,
        data: includeOptions.decisions ? getData(step.id) : undefined
      })),
      metadata: includeOptions.metadata ? {
        created: new Date().toISOString(),
        version: '1.0',
        exportFormat: format
      } : undefined,
      comments: includeOptions.comments ? getData('comments') : undefined,
      timestamps: includeOptions.timestamps ? {
        started: getData('startedAt'),
        lastModified: getData('lastModifiedAt')
      } : undefined
    };

    // Create exportable content
    let exportContent;
    let mimeType;
    let fileExtension;

    switch (format) {
      case 'json':
        exportContent = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
        break;
      case 'csv':
        // Simple CSV conversion for steps
        const headers = ['Step ID', 'Step Label', 'Completed', 'Data'];
        const rows = stepsWithStatus.map(step => [
          step.id,
          step.label.en, // Using English labels for CSV
          step.isComplete ? 'Yes' : 'No',
          JSON.stringify(getData(step.id))
        ]);
        exportContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'html':
        exportContent = `
        <html>
          <head>
            <title>Workflow Export: ${workflowType}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .step { margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              .complete { color: green; }
              .incomplete { color: orange; }
              .metadata { color: #666; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <h1>Workflow Export: ${workflowType}</h1>
            <div class="metadata">
              <p>Export Date: ${new Date().toLocaleString()}</p>
              <p>Progress: ${Math.round((completedSteps.length / stepsWithStatus.length) * 100)}%</p>
            </div>
            <h2>Steps</h2>
            ${stepsWithStatus.map(step => `
              <div class="step">
                <h3 class="${step.isComplete ? 'complete' : 'incomplete'}">${step.label.en}</h3>
                <p>Status: ${step.isComplete ? 'Completed' : 'Incomplete'}</p>
                ${includeOptions.decisions && getData(step.id) ? `
                  <p>Data: ${JSON.stringify(getData(step.id))}</p>
                ` : ''}
              </div>
            `).join('')}
          </body>
        </html>
        `;
        mimeType = 'text/html';
        fileExtension = 'html';
        break;
      default:
        exportContent = JSON.stringify(exportData);
        mimeType = 'application/json';
        fileExtension = 'json';
    }

    // Create and download the file
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Workflow data exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow-Datenexport</CardTitle>
        <CardDescription>
          Exportieren Sie Workflow-Daten und Entscheidungen in verschiedenen Formaten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="filename">Dateiname</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Export filename"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center">
                    <FileCode className="mr-2 h-4 w-4" />
                    <span>JSON</span>
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>CSV</span>
                  </div>
                </SelectItem>
                <SelectItem value="html">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>HTML</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Exportoptionen</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-metadata" 
                checked={includeOptions.metadata}
                onCheckedChange={(checked) => 
                  setIncludeOptions(prev => ({ ...prev, metadata: checked === true }))
                }
              />
              <label
                htmlFor="include-metadata"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Metadaten einschließen
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-decisions" 
                checked={includeOptions.decisions}
                onCheckedChange={(checked) => 
                  setIncludeOptions(prev => ({ ...prev, decisions: checked === true }))
                }
              />
              <label
                htmlFor="include-decisions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Entscheidungsdaten einschließen
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-comments" 
                checked={includeOptions.comments}
                onCheckedChange={(checked) => 
                  setIncludeOptions(prev => ({ ...prev, comments: checked === true }))
                }
              />
              <label
                htmlFor="include-comments"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kommentare einschließen
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="include-timestamps" 
                checked={includeOptions.timestamps}
                onCheckedChange={(checked) => 
                  setIncludeOptions(prev => ({ ...prev, timestamps: checked === true }))
                }
              />
              <label
                htmlFor="include-timestamps"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Zeitstempel einschließen
              </label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Workflow-Fortschritt</p>
              <p className="text-xs text-muted-foreground">
                {completedSteps.length} von {stepsWithStatus.length} Schritten abgeschlossen
              </p>
            </div>
            <Badge variant="outline">
              {Math.round((completedSteps.length / stepsWithStatus.length) * 100)}%
            </Badge>
          </div>
        </div>

        <Button onClick={handleExport} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Workflow-Daten exportieren
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkflowExporter;
