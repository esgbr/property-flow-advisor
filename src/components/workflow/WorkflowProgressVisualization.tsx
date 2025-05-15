
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWorkflow, WorkflowType } from '@/hooks/use-workflow';
import useWorkflowAnalytics from '@/hooks/use-workflow-analytics';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Extracted small visual components for clarity ---
function OverviewCard({ stats, workflowStats, language }) {
  if (!stats) return <div className="py-8 text-center text-muted-foreground text-sm">Loading…</div>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">
            {language === 'de' ? 'Abgeschlossene Schritte' : 'Completed Steps'}
          </h3>
          <div className="text-2xl font-bold">
            {stats.completedSteps}/{stats.totalSteps}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">
            {language === 'de' ? 'Abgeschlossene Workflows' : 'Completed Workflows'}
          </h3>
          <div className="text-2xl font-bold">
            {Array.isArray(workflowStats) ? stats.completedWorkflows : 0}/{Array.isArray(workflowStats) ? workflowStats.length : 0}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">
          {language === 'de' ? 'Gesamtfortschritt' : 'Overall Progress'}
        </h3>
        <Progress value={stats.overallProgress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {stats.overallProgress}% {language === 'de' ? 'abgeschlossen' : 'complete'}
        </p>
      </div>
    </div>
  );
}
function DailyChart({ progressData, language, formatDate }) {
  if (!progressData?.length) return <div className="py-4 text-sm text-muted-foreground">No data</div>;
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium">
        {language === 'de' ? 'Täglicher Fortschritt' : 'Daily Progress'}
      </h3>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={progressData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="dailyProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="completedSteps"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#dailyProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center">
        {progressData.map((entry, index) => (
          <div key={index} className="overflow-hidden">
            {formatDate(entry.date)}
          </div>
        ))}
      </div>
    </div>
  );
}
function WorkflowBars({ workflowStats, getWorkflowName, language }) {
  if (!workflowStats?.length) return <div className="py-4 text-sm text-muted-foreground">No workflows</div>;
  return (
    <div className="space-y-4">
      {workflowStats.map((workflow) => (
        <div key={workflow.type || workflow.workflowType} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{getWorkflowName(workflow.type || workflow.workflowType)}</span>
            <span>{workflow.completedSteps}/{workflow.totalSteps} {language === 'de' ? 'Schritte' : 'steps'}</span>
          </div>
          <Progress value={workflow.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {workflow.isComplete 
              ? (language === 'de' ? 'Abgeschlossen' : 'Complete') 
              : `${workflow.progress}% ${language === 'de' ? 'abgeschlossen' : 'complete'}`}
          </p>
        </div>
      ))}
    </div>
  );
}
// ---- End custom small components ---

// Main visualization component
interface WorkflowProgressVisualizationProps {
  workflowTypes: WorkflowType[];
  className?: string;
}

const WorkflowProgressVisualization: React.FC<WorkflowProgressVisualizationProps> = ({
  workflowTypes,
  className
}) => {
  const { language } = useLanguage();
  // Use the hook with the array of workflowTypes (so all calculations are for these types)
  const analytics = useWorkflowAnalytics(workflowTypes);

  // Set initial state
  const [stats, setStats] = useState<any>(undefined); // State can be undefined initially
  const [progressData, setProgressData] = useState<any>([]);
  const [workflowStats, setWorkflowStats] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'daily' | 'workflows'>('overview');

  useEffect(() => {
    setStats(analytics.getOverallStatistics());
    setProgressData(analytics.getDailyProgress());
    setWorkflowStats(
      // getWorkflowStatistics returns an array of all workflows in the workflowTypes array
      workflowTypes.map((type) => analytics.getWorkflowStatistics(type))
    );
    const interval = setInterval(() => {
      setStats(analytics.getOverallStatistics());
      setProgressData(analytics.getDailyProgress());
      setWorkflowStats(
        workflowTypes.map((type) => analytics.getWorkflowStatistics(type))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [analytics, workflowTypes]);

  function getWorkflowName(type: WorkflowType): string {
    const workflowNames: Record<string, Record<string, string>> = {
      'de': {
        'steuer': 'Steuerplanung',
        'immobilien': 'Immobilienanalyse',
        'finanzierung': 'Finanzierungsplanung',
        'analyse': 'Marktanalyse'
      },
      'en': {
        'steuer': 'Tax Planning',
        'immobilien': 'Property Analysis',
        'finanzierung': 'Financing',
        'analyse': 'Market Analysis'
      }
    };
    const langKey = language in workflowNames ? language : 'en';
    return workflowNames[langKey][type] || type;
  }
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  const exportWorkflowData = () => {
    const data = {
      date: new Date().toISOString(),
      overallStatistics: stats,
      dailyProgress: progressData,
      workflowStatistics: workflowStats
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'workflow-progress-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {language === 'de' ? 'Workflow-Fortschritt' : 'Workflow Progress'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Visualisierung Ihres Fortschritts in verschiedenen Workflows'
                : 'Visualization of your progress across different workflows'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportWorkflowData}>
            <FileText className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Exportieren' : 'Export'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="daily">
              <Clock className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Täglich' : 'Daily'}
            </TabsTrigger>
            <TabsTrigger value="workflows">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Workflows' : 'Workflows'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewCard stats={stats} workflowStats={workflowStats} language={language} />
          </TabsContent>
          
          <TabsContent value="daily">
            <DailyChart progressData={progressData} language={language} formatDate={formatDate} />
          </TabsContent>
          
          <TabsContent value="workflows">
            <WorkflowBars workflowStats={workflowStats} getWorkflowName={getWorkflowName} language={language} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
export default WorkflowProgressVisualization;

// NOTE: This file is now getting long and should be further refactored into its own folder of subcomponents & hooks!

