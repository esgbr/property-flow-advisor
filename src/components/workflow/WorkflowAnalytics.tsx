
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType } from '@/hooks/use-workflow';
import { CheckCircle, Clock, BarChart } from 'lucide-react';
import { useWorkflowAnalytics } from '@/hooks/use-workflow-analytics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkflowAnalyticsProps {
  workflowTypes: WorkflowType[];
  className?: string;
}

/**
 * Displays analytics and statistics for workflows
 */
const WorkflowAnalytics: React.FC<WorkflowAnalyticsProps> = ({
  workflowTypes,
  className
}) => {
  const { language } = useLanguage();
  const { getOverallStatistics, getDailyProgress, getWorkflowStatistics } = useWorkflowAnalytics(workflowTypes);
  
  const overallStats = getOverallStatistics();
  const dailyData = getDailyProgress(14); // Last 14 days
  const workflowStats = getWorkflowStatistics();
  
  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Gesamtfortschritt' : 'Overall Progress'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? `${overallStats.completedSteps} von ${overallStats.totalSteps} Schritten abgeschlossen`
                : `${overallStats.completedSteps} of ${overallStats.totalSteps} steps completed`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {overallStats.overallProgress}%
              </span>
            </div>
            <Progress value={overallStats.overallProgress} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Workflows Abgeschlossen' : 'Workflows Completed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {overallStats.completedWorkflows}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language === 'de' 
                    ? `${overallStats.incompleteWorkflows} noch in Bearbeitung`
                    : `${overallStats.incompleteWorkflows} still in progress`}
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'de' ? 'Durchschnittliche Zeit' : 'Average Time'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">12 {language === 'de' ? 'Min.' : 'min'}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'de' 
                    ? 'pro Schritt'
                    : 'per step'}
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>
              {language === 'de' ? 'Tagesaktivität' : 'Daily Activity'}
            </CardTitle>
            <CardDescription>
              {language === 'de' 
                ? 'Abgeschlossene Schritte in den letzten 14 Tagen'
                : 'Steps completed in the last 14 days'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="completedSteps"
                    name={language === 'de' ? 'Schritte' : 'Steps'}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Individual workflow stats */}
        {workflowStats.map((stat) => (
          <Card key={stat.type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'de' 
                  ? `${stat.type.charAt(0).toUpperCase()}${stat.type.slice(1)} Workflow`
                  : `${stat.type.charAt(0).toUpperCase()}${stat.type.slice(1)} Workflow`}
              </CardTitle>
              <CardDescription>
                {language === 'de' 
                  ? `${stat.completedSteps} von ${stat.totalSteps} Schritten abgeschlossen`
                  : `${stat.completedSteps} of ${stat.totalSteps} steps completed`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {stat.progress}%
                </span>
              </div>
              <Progress value={stat.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkflowAnalytics;
