
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import { FileText, Download, FileCode, FilePdf, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WorkflowExporter: React.FC<{ workflowType: WorkflowType }> = ({ workflowType }) => {
  const { language } = useLanguage();
  const { 
    getStepsWithStatus, 
    getCurrentStep,
    getCompleteSteps,
    getData
  } = useWorkflow(workflowType);
  
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includedSections, setIncludedSections] = useState({
    summary: true,
    steps: true,
    decisions: true,
    attachments: false,
    recommendations: true
  });
  const [reportName, setReportName] = useState(() => {
    return language === 'de' 
      ? `${workflowType}-Bericht-${new Date().toISOString().split('T')[0]}`
      : `${workflowType}-report-${new Date().toISOString().split('T')[0]}`;
  });
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  
  const steps = getStepsWithStatus();
  const completedSteps = getCompleteSteps();
  const currentStep = getCurrentStep();
  
  const handleExport = () => {
    setExportStatus('exporting');
    
    // Simulate export process
    setTimeout(() => {
      setExportStatus('success');
      
      // Reset after showing success message
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    }, 2000);
  };
  
  const toggleSection = (section: string) => {
    setIncludedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };
  
  const getExportButtonText = () => {
    switch (exportStatus) {
      case 'exporting':
        return language === 'de' ? 'Wird exportiert...' : 'Exporting...';
      case 'success':
        return language === 'de' ? 'Erfolgreich exportiert!' : 'Successfully exported!';
      case 'error':
        return language === 'de' ? 'Fehler beim Export' : 'Export failed';
      default:
        return language === 'de' ? 'Bericht exportieren' : 'Export Report';
    }
  };
  
  const renderIcon = () => {
    switch (exportStatus) {
      case 'exporting':
        return <div className="h-4 w-4 rounded-full border-2 border-r-transparent animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Workflow-Datenexport' : 'Workflow Data Export'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Export aller gesammelten Daten und Entscheidungen als strukturierter Bericht' 
            : 'Export all collected data and decisions as a structured report'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">
              {language === 'de' ? 'Inhalte' : 'Contents'}
            </TabsTrigger>
            <TabsTrigger value="format">
              {language === 'de' ? 'Format' : 'Format'}
            </TabsTrigger>
            <TabsTrigger value="preview">
              {language === 'de' ? 'Vorschau' : 'Preview'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="reportName">
                  {language === 'de' ? 'Berichtsname' : 'Report Name'}
                </Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder={language === 'de' ? 'Mein Workflow-Bericht' : 'My Workflow Report'}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">
                  {language === 'de' ? 'Einzuschließende Abschnitte:' : 'Sections to Include:'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="summary" 
                      checked={includedSections.summary}
                      onCheckedChange={() => toggleSection('summary')}
                    />
                    <Label htmlFor="summary" className="cursor-pointer">
                      {language === 'de' ? 'Zusammenfassung' : 'Summary'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="steps" 
                      checked={includedSections.steps}
                      onCheckedChange={() => toggleSection('steps')}
                    />
                    <Label htmlFor="steps" className="cursor-pointer">
                      {language === 'de' ? 'Workflow-Schritte' : 'Workflow Steps'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="decisions" 
                      checked={includedSections.decisions}
                      onCheckedChange={() => toggleSection('decisions')}
                    />
                    <Label htmlFor="decisions" className="cursor-pointer">
                      {language === 'de' ? 'Getroffene Entscheidungen' : 'Decisions Made'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="attachments" 
                      checked={includedSections.attachments}
                      onCheckedChange={() => toggleSection('attachments')}
                    />
                    <Label htmlFor="attachments" className="cursor-pointer">
                      {language === 'de' ? 'Anlagen & Dokumente' : 'Attachments & Documents'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recommendations" 
                      checked={includedSections.recommendations}
                      onCheckedChange={() => toggleSection('recommendations')}
                    />
                    <Label htmlFor="recommendations" className="cursor-pointer">
                      {language === 'de' ? 'Empfehlungen & nächste Schritte' : 'Recommendations & Next Steps'}
                    </Label>
                  </div>
                </div>
              </div>

              <Card className="bg-muted/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{language === 'de' ? 'Fortschritt' : 'Progress'}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{language === 'de' ? 'Abgeschlossene Schritte:' : 'Completed Steps:'}</span>
                    <span className="font-medium">{completedSteps.length} / {steps.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span>{language === 'de' ? 'Aktueller Schritt:' : 'Current Step:'}</span>
                    <span className="font-medium">
                      {currentStep 
                        ? currentStep.label[language === 'de' ? 'de' : 'en']
                        : language === 'de' ? 'Nicht festgelegt' : 'Not set'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="format">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>
                  {language === 'de' ? 'Exportformat auswählen' : 'Select Export Format'}
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${exportFormat === 'pdf' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => setExportFormat('pdf')}
                  >
                    <FilePdf className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">PDF</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {language === 'de' ? 'Vollständiger Bericht' : 'Complete report'}
                    </span>
                  </div>
                  
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${exportFormat === 'excel' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => setExportFormat('excel')}
                  >
                    <FileText className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">Excel</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {language === 'de' ? 'Tabellarisches Format' : 'Tabular format'}
                    </span>
                  </div>
                  
                  <div 
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${exportFormat === 'json' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => setExportFormat('json')}
                  >
                    <FileCode className="h-8 w-8 mb-2 text-primary" />
                    <span className="font-medium">JSON</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {language === 'de' ? 'Für Entwickler' : 'For developers'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>
                  {language === 'de' ? 'Weitere Optionen' : 'Additional Options'}
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-timestamps" defaultChecked />
                    <Label htmlFor="include-timestamps" className="cursor-pointer">
                      {language === 'de' ? 'Zeitstempel einschließen' : 'Include timestamps'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-metadata" defaultChecked />
                    <Label htmlFor="include-metadata" className="cursor-pointer">
                      {language === 'de' ? 'Metadaten einschließen' : 'Include metadata'}
                    </Label>
                  </div>
                  {exportFormat === 'pdf' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="password-protect" />
                      <Label htmlFor="password-protect" className="cursor-pointer">
                        {language === 'de' ? 'Mit Passwort schützen' : 'Password protect'}
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <Card className="bg-muted/30 overflow-hidden">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{reportName}</CardTitle>
                    <Badge variant="outline">
                      {exportFormat.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-medium mb-2">
                      {language === 'de' ? 'Zusammenfassung' : 'Summary'}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {language === 'de' 
                        ? `Dieser Bericht enthält Daten für den "${workflowType}"-Workflow mit ${completedSteps.length} abgeschlossenen Schritten.`
                        : `This report contains data for the "${workflowType}" workflow with ${completedSteps.length} completed steps.`
                      }
                    </div>
                  </div>
                  
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-medium mb-2">
                      {language === 'de' ? 'Workflow-Schritte' : 'Workflow Steps'}
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto text-sm">
                      {steps.map((step) => (
                        <div key={step.id} className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 ${step.isComplete ? 'bg-primary' : 'bg-muted'}`} />
                          <span className={step.isComplete ? 'font-medium' : 'text-muted-foreground'}>
                            {step.label[language === 'de' ? 'de' : 'en']}
                          </span>
                          {step.isComplete && (
                            <Check className="h-3 w-3 text-primary ml-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-4 py-12 text-center text-muted-foreground text-sm">
                    {language === 'de' 
                      ? 'Vollständige Vorschau im ausgewählten Format verfügbar nach dem Export.'
                      : 'Full preview available in selected format after export.'}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={language === 'de' ? 'Version wählen' : 'Select version'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      {language === 'de' ? 'Neueste Version' : 'Newest version'}
                    </SelectItem>
                    <SelectItem value="with-comments">
                      {language === 'de' ? 'Mit Kommentaren' : 'With comments'}
                    </SelectItem>
                    <SelectItem value="simplified">
                      {language === 'de' ? 'Vereinfacht' : 'Simplified'}
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button variant="outline">
                    {language === 'de' ? 'Vorschau' : 'Preview'}
                  </Button>
                  <Button 
                    onClick={handleExport}
                    disabled={exportStatus === 'exporting'}
                    className="min-w-[150px]"
                  >
                    {renderIcon()}
                    <span className="ml-2">{getExportButtonText()}</span>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          {language === 'de' 
            ? 'Exportierte Daten können für behördliche Zwecke oder zur Dokumentation verwendet werden.'
            : 'Exported data can be used for regulatory purposes or documentation.'}
        </div>
        <Button variant={exportStatus === 'idle' ? 'default' : 'outline'} onClick={handleExport}>
          {renderIcon()}
          <span className="ml-2">{getExportButtonText()}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkflowExporter;
