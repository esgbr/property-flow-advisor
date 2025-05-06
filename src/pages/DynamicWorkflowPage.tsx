
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useWorkflowAnalytics } from '@/hooks/use-workflow-analytics';
import { ArrowLeft, FileText, RefreshCw, Share } from 'lucide-react';
import DynamicWorkflowEditor from '@/components/workflow/DynamicWorkflowEditor';
import WorkflowExporter from '@/components/workflow/WorkflowExporter';
import { Badge } from '@/components/ui/badge';

const DynamicWorkflowPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const workflowAnalytics = useWorkflowAnalytics(['steuer', 'immobilien', 'finanzierung', 'analyse']);
  const stats = workflowAnalytics.getOverallStatistics();
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <RefreshCw className="mr-3 h-8 w-8" />
            {language === 'de' ? 'Erweiterte Workflow-Funktionen' : 'Advanced Workflow Features'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Dynamische Workflows, Datenexport und fortgeschrittene Workflow-Optimierung'
              : 'Dynamic workflows, data export, and advanced workflow optimization'}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'de' ? 'Workflow-Fortschritt' : 'Workflow Progress'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Gesamtfortschritt über alle Workflows' : 'Overall progress across all workflows'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.overallProgress}%
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {language === 'de' ? 'Abgeschlossen' : 'Completed'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'de' ? 'Aktive Workflows' : 'Active Workflows'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Workflows mit Fortschritt' : 'Workflows with progress'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.incompleteWorkflows}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {language === 'de' ? 'Aktiv' : 'Active'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'de' ? 'Abgeschlossene Workflows' : 'Completed Workflows'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Vollständig abgeschlossene Workflows' : 'Fully completed workflows'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.completedWorkflows}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {language === 'de' ? 'Abgeschlossen' : 'Completed'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dynamic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dynamic">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Dynamische Verzweigungen' : 'Dynamic Branching'}
          </TabsTrigger>
          <TabsTrigger value="export">
            <FileText className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Datenexport' : 'Data Export'}
          </TabsTrigger>
          <TabsTrigger value="collaboration">
            <Share className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Workflow-Kollaboration' : 'Workflow Collaboration'}
            <Badge variant="outline" className="ml-2">{language === 'de' ? 'Bald' : 'Soon'}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dynamic">
          <DynamicWorkflowEditor workflowType="immobilien" />
        </TabsContent>

        <TabsContent value="export">
          <WorkflowExporter workflowType="immobilien" />
        </TabsContent>

        <TabsContent value="collaboration">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Workflow-Kollaboration' : 'Workflow Collaboration'}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? 'Teilen von Workflows mit Teammitgliedern oder Beratern mit definierten Zugriffsrechten' 
                  : 'Share workflows with team members or advisors with defined access rights'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center flex-col p-12">
              <Share className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'de' ? 'Funktion in Entwicklung' : 'Feature in Development'}
              </h3>
              <p className="text-center text-muted-foreground mb-6 max-w-md">
                {language === 'de'
                  ? 'Die Workflow-Kollaborationsfunktion wird derzeit entwickelt und steht in Kürze zur Verfügung.'
                  : 'The workflow collaboration feature is currently under development and will be available soon.'}
              </p>
              <Button variant="outline">
                {language === 'de' ? 'Benachrichtigung bei Verfügbarkeit' : 'Notify Me When Available'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicWorkflowPage;
